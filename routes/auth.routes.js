import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();

import { register, login, logout, checkTokenStillValid } from '../controllers/auth.controller.js';

// Route handler
router.post('/login',login);
router.post('/register',register);
router.post('/logout',logout);
router.post('/check',checkTokenStillValid);

export default router;