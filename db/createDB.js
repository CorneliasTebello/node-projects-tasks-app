//Use this to create and initiate "start up" data for our REST API

import { createRequire } from "module";
const require = createRequire(import.meta.url);

import mysql from 'mysql2';
require('dotenv').config();

export const connection = await mysql.createConnection({
	host:		process.env.DB_HOST,
	user:		process.env.DB_USER,
	password:	process.env.DB_PASSWORD,
	port:		process.env.DB_PORT,
	multipleStatements: true
});

try{
	
	console.log("Connected to DB successfully");
	
	
	//Create our Database if it doesn't exist and use it
	let sql = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_DATABASE}; 
	USE ${process.env.DB_DATABASE};`;
	connection.query(sql,function(err, result){
		if(err) throw err;
		console.log("Database created successfully");
	});
	
	
	
	//Create required tables
	connection.query(`
	  CREATE TABLE users (
		user_id INT AUTO_INCREMENT PRIMARY KEY,
		username VARCHAR(50) NOT NULL UNIQUE,
		password VARCHAR(255) NOT NULL,
		first_name VARCHAR(50),
		last_name VARCHAR(50),
		email VARCHAR(100) UNIQUE,
		date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
		date_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	  );

	  CREATE TABLE teams (
		team_id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(100),
		description TEXT,
		date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
		date_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	  );

	  CREATE TABLE projects (
		project_id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(100),
		description TEXT,
		status VARCHAR(50),
		date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
		date_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	  );

	  CREATE TABLE tasks (
		task_id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(100),
		description TEXT,
		status VARCHAR(50),
		date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
		date_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	  );

	  CREATE TABLE tickets (
		ticket_id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(100),
		description TEXT,
		date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
		date_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
	  );

	  CREATE TABLE project_tasks (
		project_task_id INT AUTO_INCREMENT PRIMARY KEY,
		project_id INT,
		task_id INT,
		FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
		FOREIGN KEY (task_id) REFERENCES tasks(task_id) ON DELETE CASCADE
	  );

	  CREATE TABLE project_users (
		project_member_id INT AUTO_INCREMENT PRIMARY KEY,
		project_id INT,
		user_id INT,
		FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
		FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
	  );

	  CREATE TABLE team_users (
		team_user_id INT AUTO_INCREMENT PRIMARY KEY,
		team_id INT,
		user_id INT,
		FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
		FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
	  );

	  CREATE TABLE ticket_users_assigned (
		ticket_user_id INT AUTO_INCREMENT PRIMARY KEY,
		ticket_id INT,
		assigned_to_user_id INT,
		assigned_by_user_id INT,
		date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
		date_updated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		FOREIGN KEY (ticket_id) REFERENCES tickets(ticket_id) ON DELETE CASCADE,
		FOREIGN KEY (assigned_to_user_id) REFERENCES users(user_id),
		FOREIGN KEY (assigned_by_user_id) REFERENCES users(user_id)
	  );
	`);
	
	
	console.log("Tables were created successfully");
	
	//Add some starting data
	connection.query(`

	  INSERT INTO users (username, password, first_name, last_name, email)
	  VALUES 
		('john','$2b$10$AZlRBSJ2QHIxLMsmkvdj1uCh9XanFq0AR/SARelk9vaRYzRkMkJaq','John', 'Doe', 'john@example.com'),
		('janelane','$2b$10$AZlRBSJ2QHIxLMsmkvdj1uCh9XanFq0AR/SARelk9vaRYzRkMkJaq','Jane', 'Smith', 'jane@example.com'),
		('moneymike','$2b$10$AZlRBSJ2QHIxLMsmkvdj1uCh9XanFq0AR/SARelk9vaRYzRkMkJaq','Mike', 'Brown', 'mike@example.com');

	  INSERT INTO teams (name, description)
	  VALUES 
		('Backend Team', 'Handles APIs and DB'),
		('Frontend Team', 'Handles UI');

	  INSERT INTO projects (name, description, status)
	  VALUES 
		('Project Alpha', 'Main project', 'In Progress'),
		('Project Beta', 'Side project', 'On Hold');

	  INSERT INTO tasks (name, description, status)
	  VALUES 
		('Design DB', 'Create schema', 'Completed'),
		('Design Frontend', 'Adobe or Figma scheme', 'On Hold'),
		('Build API', 'Node.js API', 'In Progress');

	  INSERT INTO tickets (name, description)
	  VALUES 
		('Login Bug', 'Fix login issue'),
		('License issue', 'Unable to access designer tools'),
		('UI Bug', 'Button alignment issue');

	  INSERT INTO project_tasks (project_id, task_id)
	  VALUES (1, 1), (1, 2);

	  INSERT INTO project_users (project_id, user_id)
	  VALUES (1, 1), (1, 2), (2, 3);

	  INSERT INTO team_users (team_id, user_id)
	  VALUES (1, 1), (1, 3), (2, 2);

	  INSERT INTO ticket_users_assigned (ticket_id, assigned_to_user_id, assigned_by_user_id)
	  VALUES (1, 2, 1), (2, 3, 1);
	`);

	console.log("Data seeding completed");
	
}catch(e){
	
}finally{
	connection.end();
}
