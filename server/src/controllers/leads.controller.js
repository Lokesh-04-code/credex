/**
 * Leads Controller
 *
 * POST /api/leads — captures a lead with honeypot protection
 */

const { PrismaClient } = require('@prisma/client');
const { sendAuditConfirmation } = require('../services/emailService');

const prisma = new PrismaClient();

// Simple email regex for server-side validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/leads
 * Body: { email, company?, role?, teamSize?, auditId?, website? }
 *
 * Honeypot: `website` field must be empty.
 * Bots fill all fields; humans leave the hidden `website` field blank.
 */
async function createLead(req, res, next) {
  try {
    const { email, company, role, teamSize, auditId, website } = req.body;

    // ── Honeypot check ────────────────────────────────────────────────────
    // `website` is a hidden field that real users never see or fill
    if (website) {
      // Silently reject bots — don't reveal the detection mechanism
      console.warn(`[leads] Honeypot triggered for IP: ${req.ip}`);
      return res.status(200).json({ success: true }); // Fake success
    }

    // ── Validation ────────────────────────────────────────────────────────
    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        error: 'A valid email address is required.',
        code: 'VALIDATION_ERROR',
      });
    }

    if (email.length > 254) {
      return res.status(400).json({ error: 'Email too long.', code: 'VALIDATION_ERROR' });
    }

    // ── Fetch audit context for email ─────────────────────────────────────
    let audit = null;
    if (auditId) {
      audit = await prisma.audit.findUnique({
        where: { id: auditId },
        select: { shareId: true, totalMonthlySavings: true, totalAnnualSavings: true },
      });
    }

    // ── Prevent duplicate leads per audit ─────────────────────────────────
    if (auditId) {
      const existing = await prisma.lead.findFirst({
        where: { email: email.toLowerCase(), auditId },
      });
      if (existing) {
        return res.status(200).json({ success: true, duplicate: true });
      }
    }

    // ── Persist lead ──────────────────────────────────────────────────────
    const lead = await prisma.lead.create({
      data: {
        email: email.toLowerCase().trim(),
        company: company?.trim() || null,
        role: role?.trim() || null,
        teamSize: teamSize?.toString() || null,
        auditId: auditId || null,
      },
    });

    console.log(`[leads] Captured lead ${lead.id} for ${email} (audit: ${auditId || 'none'})`);

    // ── Send confirmation email (non-blocking) ────────────────────────────
    if (audit) {
      sendAuditConfirmation({
        email,
        company,
        totalMonthlySavings: audit.totalMonthlySavings,
        totalAnnualSavings: audit.totalAnnualSavings,
        shareId: audit.shareId,
      }).catch((err) => console.error('[leads] Email failed:', err.message));
    }

    return res.status(201).json({ success: true, leadId: lead.id });
  } catch (error) {
    next(error);
  }
}

module.exports = { createLead };
