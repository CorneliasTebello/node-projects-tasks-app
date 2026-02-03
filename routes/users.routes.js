import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();

import { getUsers, getUserById, createUser, updateUser, deleteUser, validateUserData } from '../controllers/users.controller.js';

// Route handler
//router.use( validateUserData);

router.get('/', getUsers);
router.get('/:user_id', getUserById);

router.post('/',validateUserData, createUser);

router.put('/:user_id',validateUserData, updateUser);

router.delete('/:user_id',validateUserData, deleteUser);

export default router;