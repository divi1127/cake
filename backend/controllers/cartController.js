const db = require('../config/db');

/**
 * Synchronize the active cart from the React frontend client.
 * Upserts the cart record in the database.
 */
async function syncCart(req, res) {
    const { user_id, phone, customer_name, items, total_amount } = req.body;

    if (!phone) {
        return res.status(400).json({ error: 'Phone number is required to sync cart for WhatsApp automations' });
    }

    try {
        const itemsStr = JSON.stringify(items || []);
        
        // Check if there is already an active (unconverted) cart for this phone
        const [existing] = await db.execute(
            'SELECT id FROM carts WHERE phone = ? AND is_abandoned = 1 ORDER BY id DESC LIMIT 1',
            [phone]
        );

        if (existing.length > 0) {
            // Update current cart
            await db.execute(
                'UPDATE carts SET user_id = ?, customer_name = ?, items = ?, total_amount = ?, reminder_sent = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [user_id || null, customer_name || null, itemsStr, total_amount || 0.00, existing[0].id]
            );
            return res.json({ success: true, message: 'Cart updated', cartId: existing[0].id });
        } else {
            // Create a new cart record
            const [result] = await db.execute(
                'INSERT INTO carts (user_id, phone, customer_name, items, total_amount, is_abandoned, reminder_sent) VALUES (?, ?, ?, ?, ?, 1, 0)',
                [user_id || null, phone, customer_name || null, itemsStr, total_amount || 0.00]
            );
            return res.json({ success: true, message: 'Cart created', cartId: result.insertId });
        }
    } catch (err) {
        console.error('Error syncing cart:', err);
        res.status(500).json({ error: 'Database error syncing cart', details: err.message });
    }
}

/**
 * Fetch list of active/abandoned carts for display in the Admin Dashboard.
 */
async function getAbandonedCarts(req, res) {
    try {
        const [results] = await db.execute(
            'SELECT * FROM carts ORDER BY updated_at DESC'
        );
        
        // Parse items JSON for the client
        const parsed = results.map(c => ({
            ...c,
            items: JSON.parse(c.items || '[]')
        }));

        res.json(parsed);
    } catch (err) {
        console.error('Error fetching abandoned carts:', err);
        res.status(500).json({ error: 'Database error fetching carts', details: err.message });
    }
}

/**
 * Convert cart to ordered (occurs on checkout).
 */
async function convertCart(req, res) {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone required' });

    try {
        await db.execute(
            'UPDATE carts SET is_abandoned = 0 WHERE phone = ? AND is_abandoned = 1',
            [phone]
        );
        res.json({ success: true, message: 'Cart successfully converted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    syncCart,
    getAbandonedCarts,
    convertCart
};
