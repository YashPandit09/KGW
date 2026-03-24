const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a friendly and professional customer service representative for Kulswamini Grinding Works (KGW), a precision grinding company based in Thane, Maharashtra, India.

About KGW:
- Specialises in precision grinding wheels, abrasive tools, and related industrial equipment
- Located at Ground Floor Plot No.268, Near Thakur Engg Work, Pokhran Road No.01, Thane – 400606
- Contact: +91 8104999122 | kulswaminigw@gmail.com
- Business hours: Monday–Saturday, 9:00 AM – 6:00 PM

Your job:
- Help customers with product enquiries, pricing, availability, and order tracking
- Be warm, concise, and professional
- If you cannot answer something with certainty, offer to have a human team member follow up
- Keep replies short (2–4 sentences). Do NOT write essays.

You MUST evaluate the customer's emotional state and urgency with every reply.`;

// responseSchema forces Gemini to always return a valid JSON object
const responseSchema = {
    type: SchemaType.OBJECT,
    properties: {
        reply: {
            type: SchemaType.STRING,
            description: 'Your visible reply to the customer (2-4 sentences, plain text, no markdown)',
        },
        mood: {
            type: SchemaType.STRING,
            enum: ['neutral', 'curious', 'frustrated', 'urgent'],
            description: "Customer's current emotional tone",
        },
        urgency: {
            type: SchemaType.INTEGER,
            description: 'Urgency level from 1 (casual browsing) to 10 (business-critical emergency)',
        },
        resolved: {
            type: SchemaType.BOOLEAN,
            description: 'True if the customer issue appears fully resolved and conversation can close',
        },
        summary: {
            type: SchemaType.STRING,
            description: 'One-sentence summary of the enquiry for admin records (e.g. "Customer needs 5mm grinding wheels urgently, machine down")',
        },
    },
    required: ['reply', 'mood', 'urgency', 'resolved', 'summary'],
};

/**
 * POST /api/chat
 * Body: { messages: [{role, text}], name, email, phone }
 * Returns: { reply, mood, urgency, resolved, summary }
 */
router.post('/', async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: 'GEMINI_API_KEY not configured on server.' });
        }

        const { messages = [], name, email } = req.body;

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: SYSTEM_PROMPT,
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema,
                temperature: 0.7,
                maxOutputTokens: 1024,
            },
        });

        // Convert our simple {role, text} format to Gemini's parts format
        // Gemini uses 'user' and 'model' roles
        const history = messages.slice(0, -1).map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
        }));

        const latestMessage = messages[messages.length - 1];
        const userMessage = name
            ? `[Customer: ${name}${email ? ` | ${email}` : ''}]\n${latestMessage?.text || ''}`
            : latestMessage?.text || '';

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(userMessage);

        const parsed = JSON.parse(result.response.text());

        // Clamp urgency to 1–10 just in case
        parsed.urgency = Math.min(10, Math.max(1, parsed.urgency || 1));

        res.json(parsed);
    } catch (err) {
        console.error('[Chat] Gemini error:', err.message);
        res.status(500).json({ message: 'AI service error. Please try again.' });
    }
});

module.exports = router;
