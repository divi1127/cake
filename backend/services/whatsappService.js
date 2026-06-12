const axios = require('axios');
const db = require('../config/db');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Generic helper to send WhatsApp messages via Meta Graph API.
 * It automatically logs the results in the `whatsapp_logs` table.
 */
async function sendWhatsAppMessage({ to, type, templateName, components, debugText }) {
    let cleanPhone = to.replace(/[^0-9]/g, '');
    
    // Auto-prepend country code '91' (India) if the user provides a standard 10-digit number
    if (cleanPhone.length === 10) {
        cleanPhone = '91' + cleanPhone;
    }

    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.PHONE_NUMBER_ID;

    console.log(`[WhatsAppService] Attempting to send message to: ${cleanPhone}`);

    if (!token || !phoneId) {
        const errMsg = 'Meta API credentials missing in environment (.env)';
        console.error(`[WhatsAppService] Error: ${errMsg}`);
        await logToDatabase(cleanPhone, type, templateName || 'custom_text', 'failed', errMsg);
        return { success: false, error: errMsg, simulated: true, text: debugText };
    }

    const url = `https://graph.facebook.com/v25.0/${phoneId}/messages`;

    // Construct standard Meta payload
    // If the template is hello_world, we MUST NOT send components/parameters
    const payload = {
        messaging_product: 'whatsapp',
        to: cleanPhone,
        type: 'template',
        template: {
            name: templateName || 'hello_world',
            language: { code: 'en_US' }
        }
    };

    if (components && templateName !== 'hello_world') {
        payload.template.components = components;
    }

    try {
        const response = await axios.post(url, payload, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`[WhatsAppService] API Success:`, response.data);
        await logToDatabase(cleanPhone, type, templateName, 'sent', null);
        return { success: true, data: response.data };
    } catch (err) {
        const metaError = err.response?.data?.error?.message || err.message;
        console.error(`[WhatsAppService] Meta API Error:`, metaError);

        // Fallback check: If the developer is using a free test account,
        // Meta only allows the official 'hello_world' template.
        // If a customized template fails, we attempt to fall back to 'hello_world' 
        // to prove the integration works, while logging the error!
        if (templateName !== 'hello_world') {
            console.log(`[WhatsAppService] Retrying with hello_world fallback...`);
            try {
                const fallbackPayload = {
                    messaging_product: 'whatsapp',
                    to: cleanPhone,
                    type: 'template',
                    template: {
                        name: 'hello_world',
                        language: { code: 'en_US' }
                    }
                };
                const fallbackResponse = await axios.post(url, fallbackPayload, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                console.log(`[WhatsAppService] Fallback hello_world success!`);
                await logToDatabase(
                    cleanPhone, 
                    type, 
                    'hello_world_fallback', 
                    'sent', 
                    `Original template '${templateName}' failed: ${metaError}. Sent hello_world fallback.`
                );
                return { success: true, fallback: true, data: fallbackResponse.data };
            } catch (fallbackErr) {
                const fallbackMetaError = fallbackErr.response?.data?.error?.message || fallbackErr.message;
                console.error(`[WhatsAppService] Fallback failed:`, fallbackMetaError);
                await logToDatabase(cleanPhone, type, templateName, 'failed', `Primary error: ${metaError}. Fallback error: ${fallbackMetaError}`);
                return { success: false, error: metaError };
            }
        }

        await logToDatabase(cleanPhone, type, templateName, 'failed', metaError);
        return { success: false, error: metaError };
    }
}

/**
 * Log message attempts to the audit log table in MySQL.
 */
async function logToDatabase(phone, type, templateName, status, errorMessage) {
    try {
        const query = `
            INSERT INTO whatsapp_logs (recipient_phone, message_type, template_name, status, error_message)
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.execute(query, [phone, type, templateName, status, errorMessage]);
        console.log(`[WhatsAppService] Logged message state in DB (Status: ${status})`);
    } catch (dbErr) {
        console.error(`[WhatsAppService] Failed to write audit log to MySQL:`, dbErr.message);
    }
}

// ========================================================
// CORE REQUIRED AUTOMATION WRAPPERS
// ========================================================

/**
 * 1. Customer Welcome Message Automation
 */
async function sendWelcomeMessage(phone, name) {
    const text = `Welcome to BakeryBliss, ${name}! 🎉 Thank you for joining our family of cake lovers. Use coupon SWEET10 for 10% off your first order! 🍰`;
    return sendWhatsAppMessage({
        to: phone,
        type: 'Welcome Message',
        templateName: 'customer_welcome', // Will fall back to hello_world if not registered
        components: [
            {
                type: 'body',
                parameters: [
                    { type: 'text', text: name }
                ]
            }
        ],
        debugText: text
    });
}

/**
 * 2. Order Confirmation Automation
 */
async function sendOrderConfirmation(phone, orderId, itemsList, totalAmount, deliveryAddress) {
    const itemsSummary = itemsList.map(i => `${i.product_name || i.name} (Qty: ${i.quantity})`).join(', ');
    const text = `Order Confirmed! 🎂\n\nOrder ID: #ORD-${orderId}\nItems: ${itemsSummary}\nTotal Paid: ₹${totalAmount}\nDelivery Location: ${deliveryAddress}\n\nOur bakery team has received your order and is ready to bake! Thank you for choosing BakeryBliss! 🧁`;
    
    return sendWhatsAppMessage({
        to: phone,
        type: 'Order Confirmation',
        templateName: 'order_confirmation',
        components: [
            {
                type: 'body',
                parameters: [
                    { type: 'text', text: `#ORD-${orderId}` },
                    { type: 'text', text: itemsSummary.slice(0, 100) }, // Truncate if too long for template param limits
                    { type: 'text', text: `₹${totalAmount}` },
                    { type: 'text', text: deliveryAddress.slice(0, 100) }
                ]
            }
        ],
        debugText: text
    });
}

/**
 * 3. Delivery Status Automation
 */
async function sendDeliveryStatusUpdate(phone, orderId, status) {
    let statusText = '';
    let emoji = '🎂';

    if (status === 'preparing') {
        statusText = 'is being freshly baked and prepared! Our chefs are icing your cake now.';
        emoji = '🧑‍🍳';
    } else if (status === 'shipped') {
        statusText = 'is Out for Delivery! 🛵 Our rider is heading your way with your fresh delights.';
        emoji = '🛵';
    } else if (status === 'delivered') {
        statusText = 'has been Delivered successfully! 🎉 We hope you enjoy every sweet bite!';
        emoji = '🎁';
    } else if (status === 'pending') {
        statusText = 'is confirmed and pending preparation.';
        emoji = '📝';
    } else {
        statusText = `status is now: ${status}.`;
    }

    const text = `Update for Order #ORD-${orderId} ${emoji}\n\nYour order ${statusText}\n\nTrack updates on our website. Thank you for choosing BakeryBliss!`;

    return sendWhatsAppMessage({
        to: phone,
        type: `Delivery Status - ${status}`,
        templateName: 'delivery_status_update',
        components: [
            {
                type: 'body',
                parameters: [
                    { type: 'text', text: `#ORD-${orderId}` },
                    { type: 'text', text: status.toUpperCase() }
                ]
            }
        ],
        debugText: text
    });
}

/**
 * 4. Offer & Campaign Automation
 */
async function sendCampaignMessage(phone, customerName, campaignType, campaignName, customText) {
    const text = `Hi ${customerName}! ✨\n\n${customText}\n\nCheck out our latest delights at BakeryBliss. Click to shop now! 🍰`;
    return sendWhatsAppMessage({
        to: phone,
        type: `Campaign - ${campaignType}`,
        templateName: 'campaign_offer',
        components: [
            {
                type: 'body',
                parameters: [
                    { type: 'text', text: customerName },
                    { type: 'text', text: campaignName },
                    { type: 'text', text: customText.slice(0, 100) }
                ]
            }
        ],
        debugText: text
    });
}

/**
 * 5. Cart Abandonment Automation
 */
async function sendCartAbandonmentReminder(phone, customerName, totalAmount, items) {
    const itemsSummary = items.map(i => i.name).join(', ');
    const text = `Hi ${customerName}, did you forget something delicious? 🧁\n\nWe noticed you left some yummy items in your cart (including: ${itemsSummary}).\nTotal: ₹${totalAmount}\n\nFinish your checkout in the next 30 minutes and get a FREE jar cake! 🎁 Click here to complete your order now!`;

    return sendWhatsAppMessage({
        to: phone,
        type: 'Cart Abandonment Reminder',
        templateName: 'cart_abandonment',
        components: [
            {
                type: 'body',
                parameters: [
                    { type: 'text', text: customerName },
                    { type: 'text', text: itemsSummary.slice(0, 100) },
                    { type: 'text', text: `₹${totalAmount}` }
                ]
            }
        ],
        debugText: text
    });
}

module.exports = {
    sendWhatsAppMessage,
    sendWelcomeMessage,
    sendOrderConfirmation,
    sendDeliveryStatusUpdate,
    sendCampaignMessage,
    sendCartAbandonmentReminder
};
