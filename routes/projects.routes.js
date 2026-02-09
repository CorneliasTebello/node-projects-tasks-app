import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();

import { getProjects, createTaskForProject, getProjectById, getProjectTasks, getProjectUsers, addUserToProject, createProject, updateProject, deleteProject, deleteUserFromProject, validateProjectData } from '../controllers/projects.controller.js';

// Route handler
router.get('/', getProjects);
router.get('/:project_id', getProjectById);
router.get('/:project_id/tasks', getProjectTasks);
router.get('/:project_id/users', getProjectUsers);

router.post('/', validateProjectData, createProject);
router.post('/:project_id/tasks', validateProjectData, createTaskForProject);
router.post('/:project_id/users/:user_id', addUserToProject);

router.put('/:project_id',validateProjectData, updateProject);

router.delete('/:project_id',validateProjectData, deleteProject);
router.delete('/:project_id/users/:user_id',validateProjectData, deleteUserFromProject);

export default router;