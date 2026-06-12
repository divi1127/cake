const cron = require('node-cron');
const db = require('../config/db');
const whatsappService = require('../services/whatsappService');

/**
 * Initialize all automation cron schedules.
 */
function initCronJobs() {
    console.log('[Cron] Initializing background automation schedulers...');

    // 1. Cart Abandonment Automated Reminder
    // Scan every 5 minutes for active carts older than 1 hour with no reminder sent
    cron.schedule('*/5 * * * *', async () => {
        console.log('[Cron] Scanning for abandoned carts (threshold > 1 hour)...');
        try {
            // Find carts updated more than 1 hour ago, which are active/abandoned, and haven't had a reminder
            const query = `
                SELECT * FROM carts 
                WHERE is_abandoned = 1 
                  AND reminder_sent = 0 
                  AND updated_at < DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 HOUR)
            `;
            const [abandonedCarts] = await db.execute(query);

            if (abandonedCarts.length === 0) {
                console.log('[Cron] No newly abandoned carts found in this scan.');
                return;
            }

            console.log(`[Cron] Found ${abandonedCarts.length} abandoned carts to remind.`);

            for (const cart of abandonedCarts) {
                try {
                    const parsedItems = JSON.parse(cart.items || '[]');
                    const customerName = cart.customer_name || 'Valued Customer';
                    
                    console.log(`[Cron] Dispatching cart reminder WhatsApp to: ${cart.phone} (${customerName})`);
                    
                    const result = await whatsappService.sendCartAbandonmentReminder(
                        cart.phone,
                        customerName,
                        cart.total_amount,
                        parsedItems
                    );

                    if (result.success) {
                        // Flag as sent so we don't repeat
                        await db.execute('UPDATE carts SET reminder_sent = 1 WHERE id = ?', [cart.id]);
                        console.log(`[Cron] Cart reminder logged successfully for cart ID: ${cart.id}`);
                    }
                } catch (cartErr) {
                    console.error(`[Cron] Error reminding cart ID ${cart.id}:`, cartErr.message);
                }
            }
        } catch (err) {
            console.error('[Cron] Cart Abandonment sweep execution failed:', err);
        }
    });

    // 2. Birthday Campaigns sweep
    // Runs daily at 9:00 AM to scan for customer birthdays and dispatch greeting templates
    cron.schedule('0 9 * * *', async () => {
        console.log('[Cron] Sweeping for customer birthdays today...');
        try {
            const query = `
                SELECT name, phone, birthday FROM users 
                WHERE phone IS NOT NULL AND phone != ""
                  AND MONTH(birthday) = MONTH(CURRENT_DATE) 
                  AND DAY(birthday) = DAY(CURRENT_DATE)
            `;
            const [birthdayUsers] = await db.execute(query);

            if (birthdayUsers.length === 0) {
                console.log('[Cron] No customer birthdays today.');
                return;
            }

            console.log(`[Cron] Found ${birthdayUsers.length} customer birthdays today! Broadcasting greetings...`);

            for (const user of birthdayUsers) {
                try {
                    const customGreeting = `Happy Birthday! 🎂✨ Wishing you a delightful day filled with happiness and sweet memories. To celebrate your special day, here is a special gift from BakeryBliss: Use coupon BDAYTREAT at checkout to get a FREE premium jar cake with any order! Enjoy your day! 🎁🍰`;
                    
                    await whatsappService.sendCampaignMessage(
                        user.phone,
                        user.name,
                        'birthday',
                        'Daily Birthday Wish Offer',
                        customGreeting
                    );
                } catch (bdayErr) {
                    console.error(`[Cron] Failed to send birthday wish to ${user.phone}:`, bdayErr.message);
                }
            }
        } catch (err) {
            console.error('[Cron] Birthday cron sweep failed:', err);
        }
    });

    // 3. Scheduled Campaign broadcasts
    // Runs every minute to sweep for scheduled campaigns that are ready to run
    cron.schedule('* * * * *', async () => {
        try {
            const query = `
                SELECT * FROM campaigns 
                WHERE status = 'scheduled' 
                  AND scheduled_time <= CURRENT_TIMESTAMP
            `;
            const [readyCampaigns] = await db.execute(query);

            if (readyCampaigns.length === 0) return;

            console.log(`[Cron] Found ${readyCampaigns.length} scheduled campaigns ready to fire!`);

            for (const campaign of readyCampaigns) {
                console.log(`[Cron] Processing campaign: "${campaign.name}" (ID: ${campaign.id})`);
                
                // Fetch customers
                const [users] = await db.execute('SELECT name, phone FROM users WHERE phone IS NOT NULL AND phone != ""');
                
                if (users.length === 0) {
                    await db.execute('UPDATE campaigns SET status = "failed" WHERE id = ?', [campaign.id]);
                    console.log(`[Cron] Campaign ID ${campaign.id} failed: No active customer phone list found.`);
                    continue;
                }

                let successCount = 0;
                for (const user of users) {
                    try {
                        const result = await whatsappService.sendCampaignMessage(
                            user.phone,
                            user.name,
                            campaign.type,
                            campaign.name,
                            campaign.message
                        );
                        if (result.success) successCount++;
                    } catch (sendErr) {
                        console.error(`[Cron] Failed to broadcast scheduled campaign to ${user.phone}:`, sendErr.message);
                    }
                }

                // Update campaign state to sent
                await db.execute(
                    'UPDATE campaigns SET status = "sent", sent_count = ? WHERE id = ?',
                    [successCount, campaign.id]
                );
                console.log(`[Cron] Scheduled Campaign broadcast finished. Sent: ${successCount}/${users.length}`);
            }
        } catch (err) {
            console.error('[Cron] Scheduled Campaign execution sweep failed:', err);
        }
    });
}

module.exports = {
    initCronJobs
};
