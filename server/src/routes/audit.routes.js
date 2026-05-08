const express = require('express');
const { createAudit, getAuditByShareId } = require('../controllers/audit.controller');

const router = express.Router();

// POST /api/audit — create new audit
router.post('/', createAudit);

// GET /api/audit/:shareId — get public audit by share ID
router.get('/:shareId', getAuditByShareId);

module.exports = router;
