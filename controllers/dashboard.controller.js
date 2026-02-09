
import { pool } from '../db/dbConnection.js';
import { queryExecute, queryResponseOutput } from '../utils/helpers.js';

let connection;

export const getDashboardMetrics = async (req, res) => {
	
	//Tasks status count query
	let sql = `SELECT 
		status,
		COUNT(t.status) AS count
	FROM tasks t
	GROUP BY STATUS;`;
	
	let err;
	connection = await pool.getConnection();
	try{
		const [tasksStatusResult] = await queryExecute(connection, sql);
		
		//Get currently signed in user ID as assignee
		const loggedUser = req.user;
		
		
		//Count number of tickets assigned to current user
		sql = `SELECT COUNT(t.ticket_id) AS assigned_tickets_count
				FROM tickets t
				INNER JOIN ticket_users_assigned tua ON t.ticket_id = tua.ticket_id
				WHERE tua.assigned_to_user_id = ${loggedUser.user_id}`;
		
		
		const [userTicketsCount] = await queryExecute(connection, sql);
		
		
		//Project status count query
		sql = `SELECT 
				status,
				COUNT(p.status) AS count
			FROM projects p
			GROUP BY STATUS;`;
		
		
		const [projectsStatusResult] = await queryExecute(connection, sql);
		
		const output = {
			tasks_status : tasksStatusResult,
			projects_status : projectsStatusResult,
			user_tickets_count : userTicketsCount,
		};
		
		
		queryResponseOutput(req,res,output,err);
		
	}catch(e){
		err = e;
		queryResponseOutput(req,res,[],err);
	}finally{
		connection.release();
	}
	
}