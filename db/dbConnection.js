import { createRequire } from "module";
const require = createRequire(import.meta.url);

import mysql from 'mysql2/promise';
require('dotenv').config();

export const pool = await mysql.createPool({
	host:		process.env.DB_HOST,
	user:		process.env.DB_USER,
	password:	process.env.DB_PASSWORD,
	port:		process.env.DB_PORT,
	database:		process.env.DB_DATABASE,
	multipleStatements: true,
	waitForConnections: true,
	connectionLimit	: 10
});
