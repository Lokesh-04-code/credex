const express = require('express');
const { createLead } = require('../controllers/leads.controller');

const router = express.Router();

// POST /api/leads — capture a lead
router.post('/', createLead);

module.exports = router;
