
import { pool } from '../db/dbConnection.js';
import { queryExecute, queryResponseOutput } from '../utils/helpers.js';

let connection;

export const getTeams = async (req, res) => {
	
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
		`t.name LIKE ?`,
		`t.description LIKE ?`,
		];
		subQueryWhere = subQueryWhere + " AND ( " + searchColumns.join(" OR ") + " )";
		
		const searchParam = `%${search}%`;
		queryParams.push(searchParam,searchParam);
	}
	
	let sql = `SELECT 
	t.team_id,
	t.name,
	t.description,
	t.date_created,
	t.date_updated
	FROM teams t
	${subQueryWhere}
	ORDER BY t.date_created DESC
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


export const getTeamById = async (req, res) => {
	
	let sql = `SELECT 
	t.team_id,
	t.name,
	t.description,
	t.date_created,
	t.date_updated
	FROM teams t
	WHERE t.team_id= ?
	ORDER BY t.date_created DESC
	;`;	
	
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.params.team_id]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
}


export const getTeamUsers = async (req, res) => {
	
	let sql = `SELECT 
	u.user_id,
	u.first_name,
	u.last_name,
	u.email,
	u.date_created,
	u.date_updated
	FROM team_users tu
	INNER JOIN users u ON u.user_id = tu.user_id
	WHERE tu.team_id= ?
	ORDER BY u.first_name DESC
	;`;
	
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.params.team_id]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
	
}


export const createTeam = async (req, res) => {
	
	let sql = "INSERT INTO teams (name,description) VALUES (?,?);";
	
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.body.name,req.body.description]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
	
}


export const updateTeam = async (req, res) => {
	
	let sql = "UPDATE teams SET name = ?, description = ? WHERE team_id = ?;";
	
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.body.name,req.body.description,req.params.team_id]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
}


export const deleteTeam = async (req, res) => {
	
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

export const validateTeamData = (req, res, next) => {

	
	if((req.method?.toUpperCase() == "PUT" || req.method?.toUpperCase() == "DELETE") &&  !req.params.team_id){
		res.status(400).json({
			code : 400,
			message: 'Team ID missing!'
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