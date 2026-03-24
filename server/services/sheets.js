const { google } = require('googleapis');
const path = require('path');

const CREDENTIALS_PATH = path.join(__dirname, '../gcp-credentials.json');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

/**
 * Appends a contact/chat row to the configured Google Sheet.
 * @param {object} data
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} data.phone
 * @param {string} data.summary
 * @param {number} data.urgency  (1–10)
 * @param {string} data.mood     ('neutral' | 'curious' | 'frustrated' | 'urgent')
 */
async function appendToSheet(data) {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    if (!sheetId) {
        console.warn('[Sheets] GOOGLE_SHEET_ID not set — skipping sheet append.');
        return;
    }

    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: CREDENTIALS_PATH,
            scopes: SCOPES,
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const date = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Sheet1!A:F',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[
                    date,
                    data.name || '',
                    data.email || '',
                    data.phone || '',
                    data.summary || data.message || '',
                    data.urgency || '',
                    data.mood || '',
                ]],
            },
        });

        console.log('[Sheets] Row appended successfully.');
    } catch (err) {
        // Non-fatal — log and continue so the main request still succeeds
        console.error('[Sheets] Failed to append row:', err.message);
    }
}

module.exports = { appendToSheet };
