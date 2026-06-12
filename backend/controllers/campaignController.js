const db = require('../config/db');
const whatsappService = require('../services/whatsappService');

/**
 * Get all offer campaigns.
 */
async function getCampaigns(req, res) {
    try {
        const [results] = await db.execute('SELECT * FROM campaigns ORDER BY created_at DESC');
        res.json(results);
    } catch (err) {
        console.error('Error fetching campaigns:', err);
        res.status(500).json({ error: 'Database error fetching campaigns', details: err.message });
    }
}

/**
 * Create a new offer campaign.
 */
async function createCampaign(req, res) {
    const { name, type, message, template_name, scheduled_time } = req.body;

    if (!name || !type || !message) {
        return res.status(400).json({ error: 'Name, type, and message content are required' });
    }

    try {
        const [result] = await db.execute(
            'INSERT INTO campaigns (name, type, message, template_name, scheduled_time, status) VALUES (?, ?, ?, ?, ?, ?)',
            [name, type, message, template_name || 'hello_world', scheduled_time || null, scheduled_time ? 'scheduled' : 'draft']
        );
        res.json({ success: true, message: 'Campaign created successfully', campaignId: result.insertId });
    } catch (err) {
        console.error('Error creating campaign:', err);
        res.status(500).json({ error: 'Database error creating campaign', details: err.message });
    }
}

/**
 * Manually trigger a draft campaign to send to all registered users.
 */
async function triggerCampaign(req, res) {
    const { id } = req.params;

    try {
        // 1. Fetch Campaign
        const [campaigns] = await db.execute('SELECT * FROM campaigns WHERE id = ?', [id]);
        if (campaigns.length === 0) {
            return res.status(404).json({ error: 'Campaign not found' });
        }

        const campaign = campaigns[0];

        // 2. Fetch all customers with phone numbers
        const [users] = await db.execute('SELECT name, phone FROM users WHERE phone IS NOT NULL AND phone != ""');
        if (users.length === 0) {
            return res.status(400).json({ error: 'No registered customers with active phone numbers found' });
        }

        console.log(`[CampaignController] Broadcasting campaign "${campaign.name}" to ${users.length} customers.`);

        let successCount = 0;

        // 3. Send WhatsApp in parallel or serial sequence
        for (const user of users) {
            try {
                // Call whatsapp service to dispatch campaign message
                const result = await whatsappService.sendCampaignMessage(
                    user.phone,
                    user.name,
                    campaign.type,
                    campaign.name,
                    campaign.message
                );
                if (result.success) successCount++;
            } catch (sendErr) {
                console.error(`[CampaignController] Failed to send campaign to user phone ${user.phone}:`, sendErr.message);
            }
        }

        // 4. Update campaign execution status
        await db.execute(
            'UPDATE campaigns SET status = "sent", sent_count = ?, scheduled_time = CURRENT_TIMESTAMP WHERE id = ?',
            [successCount, id]
        );

        res.json({ 
            success: true, 
            message: `Campaign broadcast completed successfully.`, 
            total_targeted: users.length, 
            sent_successfully: successCount 
        });
    } catch (err) {
        console.error('Error executing campaign:', err);
        res.status(500).json({ error: 'Campaign execution failed', details: err.message });
    }
}

module.exports = {
    getCampaigns,
    createCampaign,
    triggerCampaign
};
