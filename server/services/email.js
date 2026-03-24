const nodemailer = require('nodemailer');

function getTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
}

/**
 * Sends an alert email to the admin with full contact details + AI analysis.
 */
async function sendAdminAlert({ name, email, phone, message, summary, urgency, mood }) {
    if (!process.env.EMAIL_USER || !process.env.ADMIN_EMAIL) {
        console.warn('[Email] EMAIL_USER or ADMIN_EMAIL not set — skipping admin alert.');
        return;
    }

    const urgencyColor = urgency >= 8 ? '#dc2626' : urgency >= 5 ? '#f59e0b' : '#16a34a';
    const moodEmoji = { frustrated: '😤', urgent: '🚨', curious: '🤔', neutral: '😊' }[mood] || '💬';

    try {
        await getTransporter().sendMail({
            from: `"KGW Bot" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL,
            subject: `[KGW] New Enquiry — Urgency ${urgency}/10 ${moodEmoji}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f0f; color: #e5e5e5; border-radius: 12px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #d97706, #f59e0b); padding: 24px 32px;">
                        <h1 style="margin: 0; color: #fff; font-size: 22px;">New Customer Enquiry</h1>
                        <p style="margin: 6px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">Kulswamini Grinding Works</p>
                    </div>
                    <div style="padding: 28px 32px;">
                        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                            <tr><td style="padding: 8px 0; color: #a3a3a3; width: 120px;">Name</td><td style="padding: 8px 0; font-weight: bold;">${name}</td></tr>
                            <tr><td style="padding: 8px 0; color: #a3a3a3;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #f59e0b;">${email}</a></td></tr>
                            <tr><td style="padding: 8px 0; color: #a3a3a3;">Phone</td><td style="padding: 8px 0;"><a href="tel:${phone}" style="color: #f59e0b;">${phone}</a></td></tr>
                        </table>

                        <div style="background: #1a1a1a; border-radius: 10px; padding: 18px 22px; margin-bottom: 20px;">
                            <p style="margin: 0 0 8px; color: #a3a3a3; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Message</p>
                            <p style="margin: 0; line-height: 1.6;">${message || summary || 'Chat conversation'}</p>
                        </div>

                        <div style="display: flex; gap: 12px; margin-bottom: 20px;">
                            <div style="background: #1a1a1a; border-radius: 10px; padding: 14px 18px; flex: 1; text-align: center;">
                                <p style="margin: 0 0 4px; color: #a3a3a3; font-size: 11px; text-transform: uppercase;">Urgency</p>
                                <p style="margin: 0; font-size: 24px; font-weight: bold; color: ${urgencyColor};">${urgency}/10</p>
                            </div>
                            <div style="background: #1a1a1a; border-radius: 10px; padding: 14px 18px; flex: 1; text-align: center;">
                                <p style="margin: 0 0 4px; color: #a3a3a3; font-size: 11px; text-transform: uppercase;">Mood</p>
                                <p style="margin: 0; font-size: 24px;">${moodEmoji} <span style="font-size: 14px; vertical-align: middle; text-transform: capitalize;">${mood || 'neutral'}</span></p>
                            </div>
                        </div>

                        ${summary ? `
                        <div style="background: #1a1a1a; border-left: 3px solid #f59e0b; border-radius: 0 10px 10px 0; padding: 14px 18px;">
                            <p style="margin: 0 0 4px; color: #f59e0b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">AI Summary</p>
                            <p style="margin: 0; font-style: italic; color: #d4d4d4;">${summary}</p>
                        </div>` : ''}
                    </div>
                </div>
            `,
        });
        console.log('[Email] Admin alert sent.');
    } catch (err) {
        console.error('[Email] Admin alert failed:', err.message);
    }
}

/**
 * Sends a personalised thank-you + conversation summary to the user.
 */
async function sendUserConfirmation({ name, email, summary, mood }) {
    if (!process.env.EMAIL_USER) {
        console.warn('[Email] EMAIL_USER not set — skipping user confirmation.');
        return;
    }

    try {
        await getTransporter().sendMail({
            from: `"Kulswamini Grinding Works" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Thanks for reaching out, ${name.split(' ')[0]}! — KGW`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f0f; color: #e5e5e5; border-radius: 12px; overflow: hidden;">
                    <div style="background: linear-gradient(135deg, #d97706, #f59e0b); padding: 24px 32px;">
                        <h1 style="margin: 0; color: #fff; font-size: 22px;">Thank you, ${name.split(' ')[0]}!</h1>
                        <p style="margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">We received your enquiry and will be in touch shortly.</p>
                    </div>
                    <div style="padding: 28px 32px;">
                        <p style="color: #d4d4d4; line-height: 1.7;">
                            Hi ${name},<br/><br/>
                            Thank you for contacting <strong style="color: #f59e0b;">Kulswamini Grinding Works</strong>. Our team has received your message and will get back to you within 1 business day.
                        </p>

                        ${summary ? `
                        <div style="background: #1a1a1a; border-left: 3px solid #f59e0b; border-radius: 0 10px 10px 0; padding: 14px 18px; margin: 20px 0;">
                            <p style="margin: 0 0 6px; color: #f59e0b; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Summary of your enquiry</p>
                            <p style="margin: 0; font-style: italic; color: #d4d4d4;">${summary}</p>
                        </div>` : ''}

                        <p style="color: #a3a3a3; font-size: 13px; margin-top: 28px; border-top: 1px solid #262626; padding-top: 16px;">
                            📍 Ground Floor Plot No.268, Near Thakur Engg Work, Pokhran Road No.01, Thane – 400606<br/>
                            📞 <a href="tel:+918104999122" style="color: #f59e0b;">+91 8104999122</a> &nbsp;|&nbsp;
                            ✉️ <a href="mailto:kulswaminigw@gmail.com" style="color: #f59e0b;">kulswaminigw@gmail.com</a>
                        </p>
                    </div>
                </div>
            `,
        });
        console.log('[Email] User confirmation sent to', email);
    } catch (err) {
        console.error('[Email] User confirmation failed:', err.message);
    }
}

module.exports = { sendAdminAlert, sendUserConfirmation };
