import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();

import { getTasks, getTaskById, createTask, updateTask, deleteTask, validateTaskData } from '../controllers/tasks.controller.js';

// Route handler
router.get('/', getTasks);
router.get('/:task_id', getTaskById);

router.post('/',validateTaskData, createTask);

router.put('/:task_id',validateTaskData, updateTask);

router.delete('/:task_id',validateTaskData, deleteTask);

export default router;