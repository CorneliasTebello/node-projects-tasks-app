import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();

import { getTeams,getTeamById, getTeamUsers, createTeam, updateTeam, deleteTeam, validateTeamData } from '../controllers/teams.controller.js';

// Route handler
router.get('/', getTeams);
router.get('/:team_id', getTeamById);
router.get('/:team_id/users', getTeamUsers);

router.post('/',validateTeamData, createTeam);

router.put('/:team_id',validateTeamData, updateTeam);

router.delete('/:team_id',validateTeamData, deleteTeam);

export default router;