
import { pool } from '../db/dbConnection.js';
import { queryExecute, queryResponseOutput } from '../utils/helpers.js';

let connection;

export const getTickets = async (req, res) => {
	
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
		];
		subQueryWhere = "WHERE " + searchColumns.join(" OR ");
		
		const searchParam = `%${search}%`;
		queryParams.push(searchParam,searchParam);
	}
	
	let sql = `SELECT 
	t.ticket_id, 
	t.name, 
	t.description, 
	t.date_created,
	t.date_updated
	FROM tickets t
	${subQueryWhere}
	LIMIT ?
	OFFSET ?`;
	
	queryParams.push(limit,((page-1)*limit));
	
	
	
	let results, err;
	connection = await pool.getConnection();
	try{
		//[results] = await connection.query(sql,queryParams);
		[results] = await queryExecute(connection, sql,queryParams);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
	
}


export const getTicketById = async (req, res) => {
	
	let sql = `SELECT 
	t.ticket_id, 
	t.name, 
	t.description, 
	t.date_created,
	t.date_updated
	FROM tickets t WHERE t.ticket_id = ?;`;	
	
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.params.ticket_id]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
	
}


export const getTicketUsersAssigned = async (req, res) => {
	
	
	let sql = `SELECT 
	tua.ticket_id,
	ua.user_id AS assigned_user_id,
	ua.first_name AS assigned_first_name,
	ua.last_name AS assigned_last_name,
	ua.email AS assigned_email,
	
	
	uab.user_id AS assigned_by_user_id,
	uab.first_name AS assigned_by_first_name,
	uab.last_name AS assigned_by_last_name,
	uab.email AS assigned_by_email
	
	FROM ticket_users_assigned tua
	INNER JOIN users ua ON ua.user_id = tua.assigned_to_user_id
	INNER JOIN users uab ON uab.user_id = tua.assigned_by_user_id	
	WHERE tua.ticket_id = ?`;
			
/*
[
	{
		name: "Jack",
		id : "2",
		assigned_by : {
			name : "Pete",
			id : 4
		}
	},
	{
		name: "Mary",
		id : "41",
		assigned_by : {
			name : "Pete",
			id : 4
		}
	}
]
*/
	
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.params.ticket_id]);
		
		const groupedData = {};
		
		results.forEach(row => {
			
			
		});
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
}


export const createTicket = async (req, res) => {
	
	let sql = "INSERT INTO tickets (name,description) VALUES (?,?);";

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


export const updateTicket = async (req, res) => {
	
	let sql = "UPDATE tickets SET name = ?, description = ? WHERE ticket_id = ?;";

	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.body.name,req.body.description,req.body.ticket_id]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
	
}


export const addUserToTicket = async (req, res) => {
	
	let results, err;
	connection = await pool.getConnection();
	
	//Get currently signed in user ID as assignee
	const loggedUser = req.user;
	
	//Check user has not already been assigned
	try{
		const checkSql = "SELECT 1 FROM ticket_users_assigned WHERE ticket_id = ? AND assigned_to_user_id = ?";
		const [results] = await queryExecute(connection, checkSql,[req.params.ticket_id,req.body.user_id]);
		
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
	let sql = "INSERT INTO ticket_users_assigned (ticket_id,assigned_to_user_id,assigned_by_user_id) VALUES (?,?,?);";

	try{
		const [results2] = await queryExecute(connection, sql,[req.params.ticket_id,req.body.user_id, loggedUser.user_id]);
		res.status(200).json({success:true});
	}catch(e){
		err = e;
	}finally{
		connection.release();
	}
	
}



export const deleteUserFromTicket = async (req, res) => {
	
	let results, err;
	connection = await pool.getConnection();
	
	//Get currently signed in user ID as assignee
	const loggedUser = req.user;


	//Delete user from ticket
	let sql = "DELETE FROM ticket_users_assigned WHERE ticket_id = ? AND assigned_to_user_id = ?;";

	try{
		const [results2] = await queryExecute(connection, sql,[req.params.ticket_id,req.params.user_id]);
		res.status(200).json({success:true});
	}catch(e){
		//console.log(e);
		res.status(500).json({success:false,message:"Internal server error"});
	}finally{
		connection.release();
	}
	
}

export const deleteTicket = async (req, res) => {
	
	let sql = "DELETE FROM tickets WHERE ticket_id = ?;";
	
	let results, err;
	connection = await pool.getConnection();
	try{
		[results] = await queryExecute(connection, sql,[req.params.ticket_id]);
	}catch(e){
		err = e;
	}finally{
		queryResponseOutput(req,res,results,err);
		connection.release();
	}
	
}

export const validateTicketData = (req, res, next) => {
	
	if((req.method?.toUpperCase() == "PUT" || req.method?.toUpperCase() == "DELETE") &&  !req.params.ticket_id){
		res.status(400).json({
			code : 400,
			message: 'Ticket ID missing!'
		});
		return;
	}
	
	if((req.method?.toUpperCase() == "PUT" || req.method?.toUpperCase() == "POST") &&  (!req.body?.name || req.body?.name?.trim() == "")){
		res.status(400).json({
			code : 400,
			message: 'Ticket name missing!'
		});
		return;
	}
	
	next();
	
}