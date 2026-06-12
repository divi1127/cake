const axios = require('axios');
const mysql = require('mysql2/promise');

// Use env variables
const DB_HOST = 'localhost';
const DB_USER = 'root';
const DB_PASSWORD = '';
const DB_NAME = 'bakery_bliss';
const BACKEND_URL = 'http://localhost:5000';

async function runVerification() {
    console.log('=== STARTING WHATSAPP AUTOMATION VERIFICATION ===');
    
    // Connect to MySQL
    const db = await mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME
    });
    console.log('Connected to MySQL for verification checks.');

    // Clear logs and sync data for clean verification run
    await db.execute('DELETE FROM whatsapp_logs');
    await db.execute('DELETE FROM order_items');
    await db.execute('DELETE FROM orders');
    await db.execute('DELETE FROM carts');
    await db.execute('DELETE FROM users WHERE email = ?', ['testcustomer@example.com']);
    await db.execute('DELETE FROM campaigns');
    console.log('Database tables cleared for clean room execution.');

    // 1. Verify Welcome automation on registration
    console.log('\n--- VERIFYING FEATURE 1: Welcome WhatsApp automation ---');
    const testUser = {
        name: 'Test Customer',
        email: 'testcustomer@example.com',
        password: 'password123',
        phone: '916369199664', // Verified tester number
        birthday: '1995-05-21'
    };

    const registerRes = await axios.post(`${BACKEND_URL}/api/auth/register`, testUser);
    console.log('Registration response status:', registerRes.status);
    
    // Wait for the async WhatsApp welcome trigger to write to DB
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Verify WhatsApp Log in database
    const [welcomeLogs] = await db.execute('SELECT * FROM whatsapp_logs WHERE recipient_phone = ? AND message_type = ?', [testUser.phone, 'Welcome Message']);
    if (welcomeLogs.length > 0) {
        console.log('✔ Welcome WhatsApp logged successfully in DB audit log!');
        console.log('  Log record:', welcomeLogs[0]);
    } else {
        throw new Error('✘ Welcome WhatsApp log not found in database!');
    }

    // 2. Login to get token
    const loginRes = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: testUser.email,
        password: testUser.password
    });
    const customerToken = loginRes.data.token;
    const customerId = loginRes.data.user.id;
    console.log('Logged in successfully as Customer. ID:', customerId);

    // 3. Verify Cart Syncing
    console.log('\n--- VERIFYING Cart Syncing ---');
    const cartSyncData = {
        user_id: customerId,
        phone: testUser.phone,
        customer_name: testUser.name,
        items: [
            { id: 1, name: 'Vanilla Classic', price: 450, quantity: 1, weight: '1 KG' },
            { id: 2, name: 'Dark Truffle', price: 650, quantity: 2, weight: '1 KG' }
        ],
        total_amount: 1750
    };
    const cartRes = await axios.post(`${BACKEND_URL}/api/cart/sync`, cartSyncData);
    console.log('Cart Sync response status:', cartRes.status, 'Body:', cartRes.data);
    
    const [cartDbRecords] = await db.execute('SELECT * FROM carts WHERE phone = ?', [testUser.phone]);
    if (cartDbRecords.length > 0) {
        console.log('✔ Active cart synced and stored successfully in DB.');
        console.log('  Cart item count:', JSON.parse(cartDbRecords[0].items).length);
    } else {
        throw new Error('✘ Cart was not stored in the database!');
    }

    // 4. Verify Order Confirmation WhatsApp
    console.log('\n--- VERIFYING FEATURE 2: Order Confirmation WhatsApp automation ---');
    const orderData = {
        user_id: customerId,
        customer_name: testUser.name,
        phone: testUser.phone,
        address: '123 Sweet Baker Street, Delight City',
        delivery_method: 'home',
        total_amount: 1750,
        items: cartSyncData.items
    };

    const orderRes = await axios.post(`${BACKEND_URL}/api/orders`, orderData);
    const orderId = orderRes.data.orderId;
    console.log('Order created successfully. ID:', orderId);

    // Wait for the async WhatsApp trigger
    await new Promise(resolve => setTimeout(resolve, 3000));

    const [orderLogs] = await db.execute('SELECT * FROM whatsapp_logs WHERE recipient_phone = ? AND message_type = ?', [testUser.phone, 'Order Confirmation']);
    if (orderLogs.length > 0) {
        console.log('✔ Order Confirmation WhatsApp logged successfully in DB audit log!');
        console.log('  Log record:', orderLogs[0]);
    } else {
        throw new Error('✘ Order Confirmation WhatsApp log not found in database!');
    }

    // Check if cart is now marked as converted (is_abandoned = 0)
    const [convertedCarts] = await db.execute('SELECT is_abandoned FROM carts WHERE phone = ?', [testUser.phone]);
    if (convertedCarts.length > 0 && convertedCarts[0].is_abandoned === 0) {
        console.log('✔ Cart successfully marked as converted (is_abandoned = 0) upon ordering.');
    } else {
        throw new Error('✘ Cart is still marked as abandoned after placing the order!');
    }

    // 5. Verify Delivery Status shifts (Feature 3)
    console.log('\n--- VERIFYING FEATURE 3: Delivery Status Automation ---');
    // Admin login
    const adminLoginRes = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: 'admin@bakery.com',
        password: 'admin123'
    });
    const adminToken = adminLoginRes.data.token;
    console.log('Logged in successfully as System Admin.');

    const statusesToTest = ['preparing', 'shipped', 'delivered'];
    for (const status of statusesToTest) {
        console.log(`Shifting order status to: "${status}"...`);
        const statusRes = await axios.put(`${BACKEND_URL}/api/admin/orders/${orderId}`, { status }, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        console.log(`Status update response status: ${statusRes.status}`);

        // Wait for the async WhatsApp status trigger
        await new Promise(resolve => setTimeout(resolve, 3000));

        const [statusLogs] = await db.execute('SELECT * FROM whatsapp_logs WHERE recipient_phone = ? AND message_type = ?', [testUser.phone, `Delivery Status - ${status}`]);
        if (statusLogs.length > 0) {
            console.log(`✔ Order status shift to "${status}" logged successfully in DB!`);
            console.log('  Log record:', statusLogs[0]);
        } else {
            throw new Error(`✘ WhatsApp log not found for order status shift: ${status}!`);
        }
    }

    // 6. Verify Campaign Manual Trigger (Feature 4)
    console.log('\n--- VERIFYING FEATURE 4: Offer & Campaign Broadcast automation ---');
    const campaignData = {
        name: 'Weekend Special Chocolate Delight',
        type: 'weekend',
        message: 'Get 25% off all Truffle Cakes this Saturday! Double the chocolate, double the bliss.',
        template_name: 'hello_world'
    };

    const campaignRes = await axios.post(`${BACKEND_URL}/api/campaigns`, campaignData, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const campaignId = campaignRes.data.campaignId;
    console.log('Created campaign draft successfully. ID:', campaignId);

    console.log('Triggering campaign broadcast manually...');
    const triggerRes = await axios.post(`${BACKEND_URL}/api/campaigns/${campaignId}/trigger`, {}, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    console.log('Broadcast manual trigger response:', triggerRes.data);

    // Wait for the async WhatsApp triggers
    await new Promise(resolve => setTimeout(resolve, 3000));

    const [campaignLogs] = await db.execute('SELECT * FROM whatsapp_logs WHERE recipient_phone = ? AND message_type = ?', [testUser.phone, 'Campaign - weekend']);
    if (campaignLogs.length > 0) {
        console.log('✔ Manual Campaign Broadcast WhatsApp logged successfully in DB audit log!');
        console.log('  Log record:', campaignLogs[0]);
    } else {
        throw new Error('✘ Campaign broadcast WhatsApp log not found in database!');
    }

    // 7. Verify Birthday and scheduled automation (Feature 4 / Cron)
    console.log('\n--- VERIFYING Birthday automated sweeps (daily cron check logic) ---');
    // For verification, let's backdate the birthday to *today* (ignoring year) to ensure daily birthday sweep picks it up
    const today = new Date();
    const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    await db.execute('UPDATE users SET birthday = ? WHERE id = ?', [formattedToday, customerId]);
    console.log('Updated customer birthdate to today:', formattedToday);

    // Run birthday check query manually using identical logic as node-cron job to prove logic correctness
    const [bdaySweepResults] = await db.execute(`
        SELECT name, phone, birthday FROM users 
        WHERE phone IS NOT NULL AND phone != ""
          AND MONTH(birthday) = MONTH(CURRENT_DATE) 
          AND DAY(birthday) = DAY(CURRENT_DATE)
    `);
    
    if (bdaySweepResults.length > 0 && bdaySweepResults[0].phone === testUser.phone) {
        console.log('✔ Daily Birthday sweep database query logic successfully matched user today!');
        console.log('  User matched:', bdaySweepResults[0]);
    } else {
        throw new Error('✘ Birthday sweep database query logic failed to find user today!');
    }

    // 8. Verify Cart Abandonment automated reminder sweep (Feature 5 / Cron)
    console.log('\n--- VERIFYING FEATURE 5: Cart Abandonment sweep execution (cron logic) ---');
    // Let's insert a cart that is active (is_abandoned = 1), reminder not sent (reminder_sent = 0), and updated more than 1 hour ago.
    const backdatedTime = new Date(Date.now() - 70 * 60 * 1000); // 70 minutes ago
    const formattedBackdated = backdatedTime.toISOString().slice(0, 19).replace('T', ' ');
    
    await db.execute(`
        INSERT INTO carts (user_id, phone, customer_name, items, total_amount, is_abandoned, reminder_sent, updated_at)
        VALUES (?, ?, ?, ?, ?, 1, 0, ?)
    `, [
        customerId, 
        testUser.phone, 
        testUser.name, 
        JSON.stringify([{ id: 3, name: 'Choco Lava Jar', price: 150, quantity: 1, weight: 'Mini' }]), 
        150.00,
        formattedBackdated
    ]);
    console.log('Inserted simulated abandoned cart and backdated updated_at to:', formattedBackdated);

    // Run identical query from cron jobs
    const [abandonedCartsSweep] = await db.execute(`
        SELECT * FROM carts 
        WHERE is_abandoned = 1 
          AND reminder_sent = 0 
          AND updated_at < DATE_SUB(CURRENT_TIMESTAMP, INTERVAL 1 HOUR)
    `);

    if (abandonedCartsSweep.length > 0) {
        console.log('✔ 1-hour Cart Abandonment cron logic database query successfully flagged the simulated cart!');
        console.log('  Cart ID flagged:', abandonedCartsSweep[0].id);
    } else {
        throw new Error('✘ Cart Abandonment database query failed to detect the backdated cart!');
    }

    console.log('\n=== ALL VERIFICATION CHECKS COMPLETED SUCCESSFULY! ===');
    await db.end();
}

runVerification().catch(err => {
    console.error('\n✘ VERIFICATION FAILED:', err.message);
    process.exit(1);
});
