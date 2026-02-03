=== INTRO ===

This is a project and tickets management demo app built using node js + express for the REST API, MySQL/MariaDB as the database and React/Next.js as the frontend of the application.

Below details the steps to get the app running on your local machine.


========= VARIABLES SETUP =============

Ensure a file named .env exists in the root of the node js app with the following variables:

DB_HOST={Set DB Server IP}
DB_USER={Set DB username}
DB_PASSWORD={Set DB password}
DB_DATABASE=node_projects_app
DB_PORT=3307
JWT_SECRET={Generate your own JWT Secret. You can use a site like https://jwtsecrets.com/}
CLIENT_ORIGIN={Subdomain that will be accessing the API (including http/https)}


In the react_app folder, open the file next.config.ts and change or leave the variable NEXT_PUBLIC_API_URL. This will be the URL to the node js REST API that will be ran below



========= DEPENDENCY INSTALL =============

While in the app's directory, open a terminal pointing to this app's directory and run the following command

	npm install

This will install all the dependecies needed and used.



========= DB CREATION AND DATA SEEDING =============

Next, run the following command in the terminal pathed to the node js app's root directory:
	node ./db/createDB.js
	
This should connect to your MySQL/MariaDB server, create the DB, tables and startup data





========= RUNNING THE APPS/SERVERS =============

TO run the server for the REST API, run the following command
	node ./index.js
	
	
To run the server to serve next.js app, run the following command (separate terminal pointing to this directory)
	cd ./react_app
	npm run dev
	
	
Once the above commands are running, visit http://localhost:3000 (or whatever domain you use to run the app).
Login with any of the following credentials:
	UN: moneymike
	PW: 12345
	
	UN: janelane
	PW: 12345
	
	UN: john
	PW: 12345