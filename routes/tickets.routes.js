import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();

import { getTickets, getTicketById, getTicketUsersAssigned, createTicket, updateTicket, deleteTicket, validateTicketData, addUserToTicket, deleteUserFromTicket } from '../controllers/tickets.controller.js';

// Route handler
router.get('/', getTickets);
router.get('/:ticket_id', getTicketById);
router.get('/:ticket_id/users', getTicketUsersAssigned);

router.post('/', validateTicketData, createTicket);
router.post('/:ticket_id/users', addUserToTicket);

router.put('/:ticket_id',validateTicketData, updateTicket);

router.delete('/:ticket_id', validateTicketData, deleteTicket);
router.delete('/:ticket_id/users/:user_id', validateTicketData, deleteUserFromTicket);

export default router;