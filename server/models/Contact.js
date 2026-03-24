const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'responded', 'closed'],
        default: 'pending'
    },
    // AI-enriched fields (populated by chatbot, empty for static form)
    mood: {
        type: String,
        enum: ['neutral', 'curious', 'frustrated', 'urgent'],
        default: 'neutral'
    },
    urgency: {
        type: Number,
        min: 1,
        max: 10,
        default: 1
    },
    summary: {
        type: String,
        default: ''
    },
    source: {
        type: String,
        enum: ['form', 'chat'],
        default: 'form'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Contact', contactSchema);
