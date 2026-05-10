const express = require('express');
const { createAudit, getAuditByShareId, getAuditOgImage } = require('../controllers/audit.controller');

const router = express.Router();

// POST /api/audit — create new audit
router.post('/', createAudit);

// GET /api/audit/:shareId/og-image — dynamic OG PNG for social sharing
// Must come BEFORE /:shareId to avoid being swallowed by the wildcard
router.get('/:shareId/og-image', getAuditOgImage);

// GET /api/audit/:shareId — get public audit by share ID
router.get('/:shareId', getAuditByShareId);

module.exports = router;
