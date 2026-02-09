
import { pool } from '../db/dbConnection.js';
import { queryExecute, queryResponseOutput } from '../utils/helpers.js';

let connection;

export const getTasks = async (req, res) => {
	
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
		`t.name LIKE ?`,
		`t.description LIKE ?`,
		`t.status LIKE ?`,
		];
		subQueryWhere = subQueryWhere + " AND ( " + searchColumns.join(" OR ") + " )";
		
		const searchParam = `%${search}%`;
		queryParams.push(searchParam,searchParam,searchParam);
	}
	
		
	//Filters
	const { status, startDate, endDate } = req.query;
	
	// Status filter
	if (status) {
		whereClauses.push(`t.status = ?`);
		queryParams.push(status);
	}

	// Date range filter
	if (startDate) {
		whereClauses.push(`t.date_created >= ?`);
		queryParams.push(startDate);
	}

	if (endDate) {
		whereClauses.push(`t.date_created <= ?`);
		queryParams.push(endDate);
	}
	
	const whereSQL = subQueryWhere + (whereClauses.length > 0 ? 
		` AND ${whereClauses.join(" AND ")}` : ""
	);
	
	let sql = `SELECT 
	t.task_id, 
	t.name, 
	t.description, 
	t.status,
	t.date_created,
	t.date_updated
	FROM tasks t
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


export const getTaskById = async (req, res) => {
	
	let sql = `SELECT 
	t.task_id, 
	t.name, 
	t.description, 
	t.status, 
	t.date_created,
	t.date_updated
	FROM tasks t 
	WHERE t.task_id = ?
	ORDER BY date_created DESC
	;`;
	
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.params.task_id]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
	
	
}


export const createTask = async (req, res) => {
	
	let sql = "INSERT INTO tasks (name,description,status) VALUES (?,?,?);";
	
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.body.name,req.body.description,req.body.status]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
	
	
}


export const updateTask = async (req, res) => {
	
	let sql = "UPDATE tasks SET name = ?, description = ?, status = ? WHERE task_id = ?;";
	
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.body.name,req.body.description,req.body.status,req.params.task_id]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
	
	
}


export const deleteTask = async (req, res) => {
	
	let sql = "DELETE FROM tasks WHERE task_id = ?;";
	
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.params.task_id]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
	
}

export const validateTaskData = (req, res, next) => {
	
	
	if((req.method?.toUpperCase() == "PUT" || req.method?.toUpperCase() == "DELETE") &&  !req.params.task_id){
		res.status(400).json({
			code : 400,
			message: 'Task ID missing!'
		});
		return;
	}
	
	if((req.method?.toUpperCase() == "PUT" || req.method?.toUpperCase() == "POST") &&  (!req.body?.name || req.body?.name?.trim() == "")){
		res.status(400).json({
			code : 400,
			message: 'Task name missing!'
		});
		return;
	}
	
	next();
	
}