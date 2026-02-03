import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
import { pool } from '../db/dbConnection.js';

let connection;


//router.post("/register", async (req, res) => {
export const register = async (req, res) => { 
	
	connection = await pool.getConnection();
	try {
		const { username, password, first_name, last_name, email } = req.body || {};
		

		// Basic validation
		if (!username || !password || !first_name) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Check if user exists
		const [results] = await connection.query("SELECT 1 FROM users WHERE username = ?",[username]);

		if (results.length > 0) {
		  return res.status(400).json({ message: "User already exists" });
		}

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create user
		const [results2] = await connection.query("INSERT INTO users (username,password,first_name,last_name,email) VALUES (?,?,?,?,?)",[username,hashedPassword,first_name,last_name,email]);

		// Generate JWT
		const token = jwt.sign(
		  { user_id: results2.insertId },
		  process.env.JWT_SECRET,
		  { expiresIn: "1h" }
		);

		return res.status(201).json({
		  token,
		  user: {
			user_id: results2.insertId ,
			username: username,
			first_name: first_name,
			last_name: last_name,
			email: email,
		  },
		});
	} catch (err) {
		//console.log(err);
		return res.status(500).json({ message: "Server error" });
	}finally{
		connection.release();
	}
}


//router.post("/login", async (req, res) => {
export const login = async (req, res) => {
	
	connection = await pool.getConnection();
	
	try {
		const { username, password } = req.body;

		if (!username || !password) {
		  return res.status(400).json({ message: "All fields are required" });
		}

		// Find user
		const [results] = await connection.query("SELECT user_id, username, password, email, first_name, last_name FROM users WHERE username = ?",[username]);
		if (results.length == 0) {
		  return res.status(401).json({ message: "Invalid credentials" });
		}
		
		const user = results[0];

		// Compare password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
		  return res.status(401).json({ message: "Invalid credentials" });
		}

		// Generate JWT
		const token = jwt.sign(
		  { user_id: user.user_id },
		  process.env.JWT_SECRET,
		  { expiresIn: "1h" }
		);
		
		// Set token in cookie
		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 1000,
		  });

		return res.json({
		  //token,
		  user: {
			user_id: user.user_id,
			username: user.username,
			first_name: user.first_name,
			last_name: user.last_name,
			email: user.email,
		  },
		});
	} catch (err) {
		return res.status(500).json({ message: "Server error" });
	}finally{
		connection.release();
	}
};


export const logout = (req, res) => {
	
	res.clearCookie("token");
	return res.json({ message: "Logged out" });
	
}

export const checkToken = (req, res) => {
	
	//Retrieve token from cookies
	const token = req.cookies.token;

	if (!token) {
		res.status(401).json({ message: "No token, authorization denied" });
		return false;
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		return true;
	} catch (err) {
		res.status(401).json({ message: "Token is not valid" });
		return false;
	}
}


export const checkTokenStillValid = (req, res) => {
	
	try{
		if(checkToken(req, res) == true){
			return res.json({success:true,message:"ok"});
		}
	}catch(e){
		
	}
}

export const checkAuthorization = (req, res, next) => {
	
	if(checkToken(req, res) != true){
		return;
	}
	next();
};

