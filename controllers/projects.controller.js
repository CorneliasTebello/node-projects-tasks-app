
import { pool } from '../db/dbConnection.js';
import { queryExecute, queryResponseOutput } from '../utils/helpers.js';

let connection;

export const getProjects = async (req, res) => {
	
	//Filtering and sorting parameters
	const page = Math.max(parseInt(req.query.page) || 1,1);
	const limit = parseInt(req.query.limit) || 10;
	let search = req.query.search?.trim() || "";
	let subQueryWhere = "";
	let searchColumns = [];
	let queryParams = [];
	
	//Build sub-query "Where"
	if(search){
		
		searchColumns = [
		`name LIKE ?`,
		`description LIKE ?`,
		`status LIKE ?`,
		];
		subQueryWhere = "WHERE " + searchColumns.join(" OR ");
		
		const searchParam = `%${search}%`;
		queryParams.push(searchParam,searchParam,searchParam);
	}
	
	let sql = `SELECT 
	p.project_id, 
	p.name, 
	p.description, 
	p.status,
	p.date_created,
	p.date_updated
	FROM projects p
	${subQueryWhere}
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
	FROM projects p WHERE p.project_id = ?;`;
	
	
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