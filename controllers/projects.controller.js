
import { pool } from '../db/dbConnection.js';
import { queryExecute, queryResponseOutput } from '../utils/helpers.js';

let connection;

export const getProjects = async (req, res) => {
	
	//Filtering and sorting parameters
	const page = Math.max(parseInt(req.query.page) || 1,1);
	const limit = parseInt(req.query.limit) || 10;
	let search = req.query.search?.trim() || "";
	let subQueryWhere = " WHERE 1 = 1 ";
	let searchColumns = [];
	let queryParams = [];
	let whereClauses = [];
	
	//Sorting (whitelist columns!)
	const allowedSortColumns = [
		"date_created",
		"date_updated",
		"name",
		"ticket_id",
	];
	
	const sortBy = allowedSortColumns.includes(req.query.sortBy)
		? req.query.sortBy
		: "date_created";

	const sortOrder = req.query.sortOrder?.toUpperCase() === "ASC"
		? "ASC"
		: "DESC";
		
	
	//Build sub-query "Where"
	if(search){
		
		searchColumns = [
		`name LIKE ?`,
		`description LIKE ?`,
		`status LIKE ?`,
		];
		subQueryWhere = subQueryWhere + " AND ( " + searchColumns.join(" OR ") + " )";
		
		const searchParam = `%${search}%`;
		queryParams.push(searchParam,searchParam,searchParam);
	}
	
		
	//Filters
	const { status, startDate, endDate } = req.query;
	
	// Status filter
	if (status) {
		whereClauses.push(` status = ? `);
		queryParams.push(status);
	}

	// Date range filter
	if (startDate) {
		whereClauses.push(` date_created >= ? `);
		queryParams.push(startDate);
	}

	if (endDate) {
		whereClauses.push(` date_created <= ? `);
		queryParams.push(endDate);
	}
	
	const whereSQL = subQueryWhere + (whereClauses.length > 0 ? 
		` AND ${whereClauses.join(" AND ")}` : ""
	);
	
	let sql = `SELECT 
	p.project_id, 
	p.name, 
	p.description, 
	p.status,
	p.date_created,
	p.date_updated
	FROM projects p
	${whereSQL}
	ORDER BY ${sortBy} ${sortOrder}
	LIMIT ?
	OFFSET ?`;
	
	queryParams.push(limit,((page-1)*limit));
	
	
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,queryParams);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
	
}


export const getProjectById = async (req, res) => {
	
	let sql = `SELECT 
	p.project_id, 
	p.name, 
	p.description, 
	p.status,
	p.date_created,
	p.date_updated 
	FROM projects p 
	WHERE p.project_id = ?
	ORDER BY date_created DESC
	;`;
	
	
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.params.project_id]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
}

export const getProjectTasks = async (req, res) => {
	
	//Filtering and sorting parameters
	const page = Math.max(parseInt(req.query.page) || 1,1);
	const limit = parseInt(req.query.limit) || 10;
	
	let sql = `SELECT 
	t.task_id, 
	t.name, 
	t.description, 
	t.status,
	t.date_created,
	t.date_updated
	FROM tasks t 
	INNER JOIN project_tasks pt ON pt.task_id = t.task_id
	WHERE pt.project_id = ?
	ORDER BY date_created DESC
	LIMIT ?
	OFFSET ?;`;
	
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.params.project_id,limit,((page-1)*limit)]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
}

export const getProjectUsers = async (req, res) => {
	
	//Filtering and sorting parameters
	const page = Math.max(parseInt(req.query.page) || 1,1);
	const limit = parseInt(req.query.limit) || 10;
	
	let sql = `SELECT 
	u.user_id,
	u.first_name,
	u.last_name,
	u.email,
	u.date_created,
	u.date_updated
	FROM project_users pu
	INNER JOIN users u ON u.user_id = pu.user_id
	WHERE pu.project_id = ?
	ORDER BY date_created DESC
	LIMIT ?
	OFFSET ?;`;
	
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.params.project_id,limit,((page-1)*limit)]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
}


export const addUserToProject = async (req, res) => {
	
	let results, err;
	connection = await pool.getConnection();
	
	//Check user has not already been assigned
	try{
		const checkSql = "SELECT 1 FROM project_users WHERE project_id = ? AND user_id = ?";
		const [results] = await queryExecute(connection, checkSql,[req.params.project_id,req.params.user_id]);
		
		if(results.length > 0){
			res.status(400).json({success:false,message:"User already assigned"});
			return;
		}
		
	}catch(e){
		res.status(500).json({success:false,message:"Internal server error"});
		//console.log(e);
		return;
	}
	
	
	//Insert user
	let sql = "INSERT INTO project_users (project_id,user_id) VALUES (?,?);";

	try{
		const [results2] = await queryExecute(connection, sql,[req.params.project_id,req.params.user_id]);
		res.status(200).json({success:true});
	}catch(e){
		err = e;
	}finally{
		connection.release();
	}
	
}


export const deleteUserFromProject = async (req, res) => {
	
	let results, err;
	connection = await pool.getConnection();


	//Delete user from ticket
	let sql = "DELETE FROM project_users WHERE project_id = ? AND user_id = ?;";

	try{
		const [results2] = await queryExecute(connection, sql,[req.params.project_id,req.params.user_id]);
		res.status(200).json({success:true});
	}catch(e){
		//console.log(e);
		res.status(500).json({success:false,message:"Internal server error"});
	}finally{
		connection.release();
	}
	
}

export const createProject = async (req, res) => {
	
	let sql = "INSERT INTO projects (name,description,status) VALUES (?,?,?);";
	
	let results, err;
	connection = await pool.getConnection();
	try{
		connection = await pool.getConnection();
		[results] = await queryExecute(connection, sql,[req.body.name,req.body.description??"",req.body.status??""]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
}

export const createTaskForProject = async (req, res) => {
	
	connection = await pool.getConnection();
	
	try{
		
		await connection.beginTransaction();
		
		//Insert task to table
		let sql = "INSERT INTO tasks (name,description,status) VALUES (?,?,?);";
		
		const [results] = await connection.query(sql,[req.body.name,req.body.description,req.body.status]);
		
		const taskId = results.insertId;
		
		//Link task with project
		sql = "INSERT INTO project_tasks (project_id,task_id) VALUES (?,?);";
		
		await connection.query(sql,[req.params.project_id,taskId]);
		
		
		await connection.commit();
		
		
		queryResponseOutput(req,res,results,null);
		
	}catch(e){
		
		await connection.rollback();
		expressRes.status(500).json({ error: e.message });
	}finally{
		
		connection.release(); 
	}
}

export const updateProject = async (req, res) => {
	
	let sql = "UPDATE projects SET name = ?, description = ?, status = ? WHERE project_id = ?;";
	
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.body.name,req.body.description??"",req.body.status??"",req.params.project_id]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
}


export const deleteProject = async (req, res) => {
	
	let sql = "DELETE FROM projects WHERE project_id = ?;";

	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.params.project_id]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
}

export const validateProjectData = (req, res, next) => {
	
	
	if((req.method?.toUpperCase() == "PUT" || req.method?.toUpperCase() == "DELETE") &&  !req.params.project_id){
		res.status(400).json({
			code : 400,
			message: 'Project ID missing!'
		});
		return;
	}
	
	if((req.method?.toUpperCase() == "PUT" || req.method?.toUpperCase() == "POST") &&  (!req.body?.name || req.body?.name?.trim() == "")){
		res.status(400).json({
			code : 400,
			message: 'Project name missing!'
		});
		return;
	}
	
	next();
	
}