/**
 * Audit Controller
 *
 * POST /api/audit  — creates a new audit
 * GET  /api/audit/:shareId — retrieves a public audit by share ID
 */

const { PrismaClient } = require('@prisma/client');
const { nanoid } = require('nanoid');
const { runAudit } = require('../services/auditEngine');
const { generateAiSummary } = require('../services/aiSummary');
const { generateOgImage } = require('../services/ogImage');

const prisma = new PrismaClient();

/**
 * POST /api/audit
 * Body: { tools, teamSize, primaryUseCase }
 */
async function createAudit(req, res, next) {
  try {
    const { tools, teamSize, primaryUseCase } = req.body;

    // Basic validation
    if (!tools || !Array.isArray(tools) || tools.length === 0) {
      return res.status(400).json({
        error: 'At least one AI tool must be provided.',
        code: 'VALIDATION_ERROR',
      });
    }

    if (tools.length > 20) {
      return res.status(400).json({
        error: 'Maximum 20 tools per audit.',
        code: 'VALIDATION_ERROR',
      });
    }

    // Run deterministic audit engine
    const { recommendations, totalMonthlySavings, totalAnnualSavings } = runAudit({
      tools,
      teamSize,
      primaryUseCase,
    });

    // Generate AI narrative summary (non-blocking for speed, with fallback)
    const { summary: aiSummary, source: summarySource } = await generateAiSummary({
      tools,
      recommendations,
      totalMonthlySavings,
      totalAnnualSavings,
      teamSize,
      primaryUseCase,
    });

    // Persist to database
    const shareId = nanoid(10);
    const audit = await prisma.audit.create({
      data: {
        shareId,
        tools,
        recommendations,
        totalMonthlySavings,
        totalAnnualSavings,
        aiSummary,
        teamSize: teamSize ? parseInt(teamSize) : null,
        primaryUseCase: primaryUseCase || null,
      },
    });

    console.log(
      `[audit] Created audit ${audit.id} (shareId: ${shareId}) — savings: $${totalMonthlySavings}/mo, summary source: ${summarySource}`
    );

    return res.status(201).json({
      auditId: audit.id,
      shareId: audit.shareId,
      recommendations,
      totalMonthlySavings,
      totalAnnualSavings,
      aiSummary,
      createdAt: audit.createdAt,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/audit/:shareId
 * Returns public-safe audit data (no emails or private info)
 */
async function getAuditByShareId(req, res, next) {
  try {
    const { shareId } = req.params;

    if (!shareId || shareId.length !== 10) {
      return res.status(400).json({ error: 'Invalid share ID.', code: 'VALIDATION_ERROR' });
    }

    const audit = await prisma.audit.findUnique({
      where: { shareId },
    });

    if (!audit) {
      return res.status(404).json({ error: 'Audit not found.', code: 'NOT_FOUND' });
    }

    // Return only public-safe fields — no email or company data
    return res.json({
      shareId: audit.shareId,
      tools: audit.tools,
      recommendations: audit.recommendations,
      totalMonthlySavings: audit.totalMonthlySavings,
      totalAnnualSavings: audit.totalAnnualSavings,
      aiSummary: audit.aiSummary,
      primaryUseCase: audit.primaryUseCase,
      teamSize: audit.teamSize,
      createdAt: audit.createdAt,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/audit/:shareId/og-image
 * Returns a 1200×630 PNG Open Graph image for social sharing.
 * Caches for 1 hour via Cache-Control so CDNs don't hammer the server.
 */
async function getAuditOgImage(req, res, next) {
  try {
    const { shareId } = req.params;

    if (!shareId || shareId.length !== 10) {
      return res.status(400).json({ error: 'Invalid share ID.', code: 'VALIDATION_ERROR' });
    }

    const audit = await prisma.audit.findUnique({
      where: { shareId },
      select: {
        totalMonthlySavings: true,
        totalAnnualSavings: true,
        tools: true,
        recommendations: true,
      },
    });

    if (!audit) {
      return res.status(404).json({ error: 'Audit not found.', code: 'NOT_FOUND' });
    }

    const png = await generateOgImage(audit);

    res.set({
      'Content-Type': 'image/png',
      'Content-Length': png.length,
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    });

    return res.send(png);
  } catch (error) {
    next(error);
  }
}

module.exports = { createAudit, getAuditByShareId, getAuditOgImage };
