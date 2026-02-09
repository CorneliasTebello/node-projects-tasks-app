
import { pool } from '../db/dbConnection.js';
import { queryExecute, queryResponseOutput } from '../utils/helpers.js';

let connection;

export const getUsers = async (req, res) => {
	
	//Filtering and sorting parameters
	const page = Math.max(parseInt(req.query.page) || 1,1);
	const limit = parseInt(req.query.limit) || 10;
	let search = req.query.search?.trim() || "";
	let subQueryWhere = " WHERE 1 = 1 ";
	let searchColumns = [];
	let queryParams = [];
	
	//Build sub-query "Where"
	if(search){
		
		searchColumns = [
		`first_name LIKE ?`,
		`last_name LIKE ?`,
		`email LIKE ?`,
		];
		subQueryWhere = subQueryWhere + " AND ( " + searchColumns.join(" OR ") + " )";
		
		const searchParam = `%${search}%`;
		queryParams.push(searchParam,searchParam,searchParam);
	}
	
	let sql = `SELECT 
	u.user_id,
	u.first_name,
	u.last_name,
	u.email,
	u.username,
	u.date_created,
	u.date_updated
	FROM users u
	${subQueryWhere}
	ORDER BY first_name ASC
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


export const getUserById = async (req, res) => {
	
	let sql = `SELECT 
	u.user_id,
	u.first_name,
	u.last_name,
	u.email,
	u.username,
	u.date_created,
	u.date_updated
	FROM users u
	WHERE u.user_id	= ?
	ORDER BY first_name ASC;`;
	
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.params.user_id]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
	
	
}


export const createUser = async (req, res) => {
	
	let sql = "INSERT INTO users (first_name,last_name,email) VALUES (?,?,?);";
		
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.body.first_name,req.body.last_name,req.body.email]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
	
	
}


export const updateUser = async (req, res) => {
	
	let sql = "UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE user_id = ?;";
		
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.body.first_name,req.body.last_name,req.body.email,req.params.user_id]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
	
	
}


export const deleteUser = async (req, res) => {
	
	let sql = "DELETE FROM users WHERE user_id = ?;";
	
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.params.user_id]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
	
	
}

export const validateUserData = (req, res, next) => {
	
	
	if((req.method?.toUpperCase() == "PUT" || req.method?.toUpperCase() == "DELETE") &&  !req.params?.user_id){
		res.status(400).json({
			code : 400,
			message: 'User ID missing!',
		});
		return;
	}
	
	if(req.method?.toUpperCase() == "PUT" || req.method?.toUpperCase() == "POST"){
		
		if(!req.body?.first_name || req.body?.first_name?.trim() == ""){
			res.status(400).json({
				code : 400,
				message: 'User first name missing!'
			});
			return;
		}
		
		if(!req.body?.email || req.body?.email?.trim() == ""){
			res.status(400).json({
				code : 400,
				message: 'User email missing!'
			});
			return;
		}
	}
	
	next();
	
}