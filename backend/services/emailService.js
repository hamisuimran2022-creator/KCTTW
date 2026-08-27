const nodemailer = require("nodemailer");

/**
 * Configure Nodemailer Transporter
 */
const createTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT) || 587;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
        return nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: { user, pass }
        });
    }

    // Return null if not configured to trigger mock preview
    return null;
};

const FROM_EMAIL = process.env.EMAIL_FROM || '"KCTTW — Kamba Collection" <no-reply@kcttw.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.SMTP_USER || "admin@kcttw.com";

/**
 * Universal Send Email Function with Safe Fallback / Dev Logger
 */
const sendEmail = async ({ to, subject, html, text }) => {
    try {
        const transporter = createTransporter();

        if (transporter) {
            const info = await transporter.sendMail({
                from: FROM_EMAIL,
                to,
                subject,
                text: text || "",
                html
            });
            console.log(`📧 [EMAIL SENT] MessageId: ${info.messageId} to <${to}> | Subject: "${subject}"`);
            return { success: true, messageId: info.messageId };
        } else {
            console.log(`\n======================================================`);
            console.log(`📨 [DEV EMAIL PREVIEW] (SMTP not configured in .env)`);
            console.log(`To: ${to}`);
            console.log(`From: ${FROM_EMAIL}`);
            console.log(`Subject: ${subject}`);
            console.log(`------------------------------------------------------`);
            console.log(text || "[HTML Email Content Provided]");
            console.log(`======================================================\n`);
            return { success: true, isMock: true };
        }
    } catch (error) {
        console.error(`❌ [EMAIL ERROR] Failed to send email to ${to}:`, error.message);
        return { success: false, error: error.message };
    }
};

/* =========================================================
   EMAIL TEMPLATES (LUXURY KCTTW DARK AESTHETIC)
========================================================= */

const emailWrapper = (title, content) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
        body { margin: 0; padding: 0; background-color: #080808; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #ffffff; }
        .container { max-width: 600px; margin: 0 auto; background-color: #111111; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; }
        .header { background: radial-gradient(circle at center, #1f1f1f, #0c0c0c); padding: 40px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .logo-text { font-size: 32px; font-weight: 900; letter-spacing: 4px; color: #ffffff; margin: 0; }
        .logo-sub { font-size: 9px; letter-spacing: 3px; color: #d4af37; text-transform: uppercase; margin-top: 6px; font-weight: 700; }
        .body-content { padding: 40px 30px; }
        .footer { padding: 30px 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #777777; background-color: #0c0c0c; }
        .gold { color: #d4af37; }
        .btn-gold { display: inline-block; background-color: #ffffff; color: #000000; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: 800; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; margin-top: 25px; }
        .order-table { width: 100%; border-collapse: collapse; margin: 25px 0; }
        .order-table th { text-align: left; padding: 12px 8px; border-bottom: 1px solid rgba(255,255,255,0.15); font-size: 11px; text-transform: uppercase; color: #888888; }
        .order-table td { padding: 14px 8px; border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 13px; color: #ffffff; }
        .highlight-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin: 20px 0; }
    </style>
</head>
<body>
    <div style="padding: 30px 10px;">
        <div class="container">
            <div class="header">
                <h1 class="logo-text">KCTTW</h1>
                <div class="logo-sub">KAMBA COLLECTION — TO THE WORLD</div>
            </div>
            <div class="body-content">
                ${content}
            </div>
            <div class="footer">
                <p style="margin-bottom: 8px;">KCTTW Luxury Apparel & Streetwear</p>
                <p style="margin: 0; color: #555555;">© ${new Date().getFullYear()} KCTTW. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
`;

/**
 * 1. Order Confirmation Email (To Customer)
 */
const sendOrderConfirmationEmail = async (order) => {
    const customer = order.customer || {};
    const items = order.items || [];
    const orderNumber = order.orderNumber || order.id || "KCTTW-ORDER";
    const total = Number(order.total || 0).toLocaleString("en-NG");

    const itemsHtml = items.map((item) => `
        <tr>
            <td>
                <strong>${item.name}</strong><br>
                <span style="font-size: 11px; color: #888888;">Color: ${item.color || "Default"} • Size: ${item.size || "Standard"}</span>
            </td>
            <td style="text-align: center;">${item.quantity}</td>
            <td style="text-align: right;">₦${Number(item.price || 0).toLocaleString("en-NG")}</td>
        </tr>
    `).join("");

    const address = typeof order.shippingAddress === "string" 
        ? order.shippingAddress 
        : `${order.shippingAddress?.street || ""}, ${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""}`;

    const content = `
        <h2 style="font-size: 22px; font-weight: 800; margin-top: 0; margin-bottom: 12px;">Order Confirmed 🔥</h2>
        <p style="color: #bbbbbb; font-size: 14px; line-height: 1.6;">
            Hello <strong>${customer.name || "Valued Customer"}</strong>,<br>
            Thank you for ordering with <strong>KCTTW</strong>. Your order is being prepared for fulfillment.
        </p>

        <div class="highlight-box">
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #888888; margin-bottom: 6px;">
                <span>ORDER NUMBER</span>
            </div>
            <div style="font-size: 18px; font-weight: 800; color: #ffffff; letter-spacing: 1px;">
                #${orderNumber}
            </div>
            <div style="margin-top: 10px; font-size: 12px; color: #aaaaaa;">
                <strong>Payment Method:</strong> ${order.paymentMethod ? order.paymentMethod.toUpperCase() : "PAYSTACK"}<br>
                <strong>Delivery Address:</strong> ${address || "Provided at checkout"}
            </div>
        </div>

        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 30px; margin-bottom: 10px; color: #d4af37;">
            Order Summary
        </h3>

        <table class="order-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th style="text-align: center;">Qty</th>
                    <th style="text-align: right;">Price</th>
                </tr>
            </thead>
            <tbody>
                ${itemsHtml}
                <tr>
                    <td colspan="2" style="font-weight: 800; font-size: 14px; padding-top: 18px;">Total Amount</td>
                    <td style="text-align: right; font-weight: 900; font-size: 16px; color: #d4af37; padding-top: 18px;">₦${total}</td>
                </tr>
            </tbody>
        </table>

        <div style="text-align: center; margin-top: 35px;">
            <p style="font-size: 12px; color: #888888; margin-bottom: 15px;">Need concierge assistance with your order?</p>
            <a href="https://wa.me/2349072585516?text=Hello%20KCTTW%2C%20I%20need%20assistance%20with%20Order%20${orderNumber}" class="btn-gold" target="_blank">
                Chat With VIP Support
            </a>
        </div>
    `;

    return await sendEmail({
        to: customer.email,
        subject: `Your KCTTW Order #${orderNumber} is Confirmed`,
        text: `Hello ${customer.name}, your KCTTW order #${orderNumber} for total ₦${total} has been confirmed.`,
        html: emailWrapper("Order Confirmed", content)
    });
};

/**
 * 2. New Order Notification (To Admin)
 */
const sendAdminOrderAlertEmail = async (order) => {
    const customer = order.customer || {};
    const orderNumber = order.orderNumber || order.id || "KCTTW-ORDER";
    const total = Number(order.total || 0).toLocaleString("en-NG");
    const itemsCount = (order.items && order.items.length) || 0;

    const content = `
        <h2 style="font-size: 20px; font-weight: 800; color: #2ed573; margin-top: 0;">🚀 New Order Received!</h2>
        <p style="color: #cccccc; font-size: 14px;">A new order has just been placed on the KCTTW store.</p>

        <div class="highlight-box">
            <p style="margin: 0 0 8px 0;"><strong>Order Number:</strong> #${orderNumber}</p>
            <p style="margin: 0 0 8px 0;"><strong>Total Value:</strong> ₦${total}</p>
            <p style="margin: 0 0 8px 0;"><strong>Customer Name:</strong> ${customer.name}</p>
            <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${customer.email}</p>
            <p style="margin: 0 0 8px 0;"><strong>Phone:</strong> ${customer.phone}</p>
            <p style="margin: 0 0 8px 0;"><strong>Payment:</strong> ${order.paymentMethod} (${order.paymentStatus || 'Pending'})</p>
            <p style="margin: 0;"><strong>Total Items:</strong> ${itemsCount}</p>
        </div>
    `;

    return await sendEmail({
        to: ADMIN_EMAIL,
        subject: `[NEW ORDER] #${orderNumber} — ₦${total} from ${customer.name}`,
        text: `New order #${orderNumber} received from ${customer.name} (${customer.email}) for total ₦${total}.`,
        html: emailWrapper("New Order Alert", content)
    });
};

/**
 * 3. Welcome Email (On User Registration)
 */
const sendWelcomeEmail = async (user) => {
    const fullName = user.fullName || "Friend";

    const content = `
        <h2 style="font-size: 22px; font-weight: 800; margin-top: 0;">Welcome to the Family, ${fullName} ✨</h2>
        <p style="color: #bbbbbb; font-size: 14px; line-height: 1.6;">
            Your official KCTTW account is now active. You now have exclusive access to our newest luxury apparel drops, order tracking, and priority customer service.
        </p>

        <div class="highlight-box">
            <h4 style="margin: 0 0 10px 0; color: #d4af37;">What's next?</h4>
            <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #cccccc; line-height: 1.7;">
                <li>Explore our latest caps and collared shirts collection.</li>
                <li>Track your past and active orders from your personal Dashboard.</li>
                <li>Enjoy rapid one-click checkout.</li>
            </ul>
        </div>

        <div style="text-align: center; margin-top: 30px;">
            <a href="https://kcttw.com/products.html" class="btn-gold">
                Explore The Collection
            </a>
        </div>
    `;

    return await sendEmail({
        to: user.email,
        subject: `Welcome to KCTTW — Kamba Collection To The World`,
        text: `Welcome to KCTTW, ${fullName}! Your account is now active.`,
        html: emailWrapper("Welcome to KCTTW", content)
    });
};

/**
 * 4. Contact Form Submission (To Admin)
 */
const sendContactEmail = async ({ name, email, phone, subject, message }) => {
    const content = `
        <h2 style="font-size: 20px; font-weight: 800; margin-top: 0; color: #ffffff;">📩 New Contact Inquiry</h2>
        <div class="highlight-box">
            <p style="margin: 0 0 8px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 0 0 8px 0;"><strong>Phone:</strong> ${phone || "N/A"}</p>
            <p style="margin: 0 0 8px 0;"><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
        </div>
        <div style="background: rgba(255,255,255,0.06); padding: 20px; border-radius: 10px; border-left: 3px solid #d4af37;">
            <strong style="font-size: 12px; color: #d4af37; text-transform: uppercase;">Message:</strong>
            <p style="margin: 10px 0 0 0; color: #ffffff; line-height: 1.6; font-size: 14px;">${message}</p>
        </div>
    `;

    return await sendEmail({
        to: ADMIN_EMAIL,
        subject: `[CONTACT INQUIRY] ${subject || 'New Message'} from ${name}`,
        text: `New contact form submission from ${name} (${email}): ${message}`,
        html: emailWrapper("Contact Inquiry", content)
    });
};

module.exports = {
    sendEmail,
    sendOrderConfirmationEmail,
    sendAdminOrderAlertEmail,
    sendWelcomeEmail,
    sendContactEmail
};
