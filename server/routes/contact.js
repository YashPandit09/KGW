const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { protect, authorize } = require('../middleware/auth');
const { appendToSheet } = require('../services/sheets');
const { sendAdminAlert, sendUserConfirmation } = require('../services/email');

// ─── POST /api/contact ────────────────────────────────────────────────────────
// Used by both the static form and the chatbot (after conversation ends).
// Chatbot additionally sends: mood, urgency, summary, source='chat'
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('phone', 'Phone number is required').not().isEmpty(),
  check('message', 'Message is required').not().isEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, message, mood, urgency, summary, source } = req.body;

    // 1. Save to MongoDB
    const contact = new Contact({
      name, email, phone, message,
      mood: mood || 'neutral',
      urgency: urgency || 1,
      summary: summary || '',
      source: source || 'form',
    });
    await contact.save();

    // 2. Fire-and-forget: Google Sheets + Emails (non-blocking so API returns fast)
    Promise.all([
      appendToSheet({ name, email, phone, message, summary, urgency, mood }),
      sendAdminAlert({ name, email, phone, message, summary, urgency, mood }),
      sendUserConfirmation({ name, email, summary, mood }),
    ]).catch(err => console.error('[Post-save pipeline error]', err.message));

    res.status(201).json({ message: 'Contact form submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET /api/contact (admin only) ───────────────────────────────────────────
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── PUT /api/contact/:id (admin only) ───────────────────────────────────────
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact submission not found' });
    }
    contact.status = req.body.status;
    await contact.save();
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;