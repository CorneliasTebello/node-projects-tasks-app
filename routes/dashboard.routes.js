import { createRequire } from "module";
const require = createRequire(import.meta.url);

const express = require('express');
const router = express.Router();

import { getDashboardMetrics } from '../controllers/dashboard.controller.js';

router.get('/', getDashboardMetrics);

export default router;