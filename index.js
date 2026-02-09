import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { routeLogger } from './middleware/routeLogger.js';
import { errorHandler } from './middleware/errorHandler.js';

import projectRouter from './routes/projects.routes.js';
import ticketRouter from './routes/tickets.routes.js';
import userRouter from './routes/users.routes.js';
import taskRouter from './routes/tasks.routes.js';
import teamRouter from './routes/teams.routes.js';
import authRouter from './routes/auth.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';

import { checkAuthorization } from './controllers/auth.controller.js';

const cookieParser = require("cookie-parser");
import express from 'express';
import cors from 'cors';
const app = express();

require('dotenv').config();


const corsOptions = {
  origin: 'http://localhost:3000', // Specify the allowed origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept','X-Requested-With'], // Specify allowed headers
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(routeLogger); 	// Logger middlware
app.use(errorHandler);	//Error handlers should always be the last middleware



// Route handler
app.use('/api/projects',checkAuthorization,projectRouter);
app.use('/api/tickets',checkAuthorization,ticketRouter);
app.use('/api/users',checkAuthorization,userRouter);
app.use('/api/tasks',checkAuthorization,taskRouter);
app.use('/api/teams',checkAuthorization,teamRouter);
app.use('/api/dashboard',checkAuthorization,dashboardRouter);
app.use('/api/',authRouter);

app.listen(8080, () => {
  console.log('Server running on port 8080');
});