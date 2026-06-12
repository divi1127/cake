const db = require('../config/db');
const whatsappService = require('../services/whatsappService');

/**
 * Fetch WhatsApp delivery and audit logs for display in the Admin Dashboard.
 */
async function getLogs(req, res) {
    try {
        const [results] = await db.execute(
            'SELECT * FROM whatsapp_logs ORDER BY created_at DESC LIMIT 100'
        );
        res.json(results);
    } catch (err) {
        console.error('Error fetching WhatsApp logs:', err);
        res.status(500).json({ error: 'Database error fetching logs', details: err.message });
    }
}

/**
 * Trigger a quick manual hello_world test template to a specific phone number.
 */
async function sendTestMessage(req, res) {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ error: 'Recipient phone number is required' });
    }

    try {
        console.log(`[WhatsAppController] Manual test message request to: ${phone}`);
        const result = await whatsappService.sendWhatsAppMessage({
            to: phone,
            type: 'Manual Test Message',
            templateName: 'hello_world',
            debugText: 'This is a manual test of the Meta WhatsApp integration from the BakeryBliss Admin Dashboard. Hello World! 🍰'
        });

        if (result.success) {
            return res.json({ success: true, message: 'Test template sent successfully!', response: result.data });
        } else {
            return res.status(500).json({ error: 'WhatsApp delivery failed', details: result.error });
        }
    } catch (err) {
        console.error('Error sending test message:', err);
        res.status(500).json({ error: 'Internal server error while sending test', details: err.message });
    }
}

module.exports = {
    getLogs,
    sendTestMessage
};
