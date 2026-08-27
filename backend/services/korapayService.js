const crypto = require("crypto");

const KORAPAY_SECRET_KEY = process.env.KORAPAY_SECRET_KEY;
const KORAPAY_PUBLIC_KEY = process.env.KORAPAY_PUBLIC_KEY;
const KORAPAY_BASE_URL = process.env.KORAPAY_BASE_URL || "https://api.korapay.com";

/**
 * Initialize Korapay Payment
 */
const initializePayment = async ({
    orderNumber,
    amount,
    customer,
    redirectUrl,
    notificationUrl,
    currency = "NGN"
}) => {
    // If secret key is not set, provide simulated sandbox checkout response
    if (!KORAPAY_SECRET_KEY || KORAPAY_SECRET_KEY.startsWith("your_")) {
        console.log(`\n💳 [KORAPAY SANDBOX INITIALIZE] Order #${orderNumber} for ₦${amount.toLocaleString()}`);
        console.log(`Customer: ${customer.name} (${customer.email})`);
        console.log(`(Set KORAPAY_SECRET_KEY in .env for live gateway transactions)\n`);

        const mockReference = `KORA_REF_${orderNumber}_${Date.now()}`;
        return {
            success: true,
            isMock: true,
            message: "Korapay payment initialized (Development Sandbox Mode)",
            data: {
                reference: mockReference,
                checkout_url: `${redirectUrl || "http://localhost:5173/payment/verify"}?reference=${mockReference}&order_id=${orderNumber}&status=success`,
                amount,
                currency
            }
        };
    }

    try {
        const payload = {
            reference: `KCTTW_${orderNumber}_${Date.now()}`,
            amount: Number(amount),
            currency: currency,
            customer: {
                name: customer.name,
                email: customer.email
            },
            notification_url: notificationUrl,
            redirect_url: redirectUrl,
            narration: `KCTTW Luxury Fashion Order #${orderNumber}`,
            channels: ["card", "bank_transfer", "mobile_money", "pay_with_bank"]
        };

        const response = await fetch(`${KORAPAY_BASE_URL}/merchant/api/v1/charges/initialize`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${KORAPAY_SECRET_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || !data || !data.status) {
            const errorMsg = (data && data.message) || "Failed to initialize Korapay payment session.";
            throw new Error(errorMsg);
        }

        return {
            success: true,
            isMock: false,
            message: data.message,
            data: {
                reference: data.data.reference,
                checkout_url: data.data.checkout_url,
                amount: data.data.amount,
                currency: data.data.currency
            }
        };
    } catch (error) {
        console.error("❌ [KORAPAY INITIALIZE ERROR]:", error.message);
        throw error;
    }
};

/**
 * Verify / Resolve Korapay Payment Transaction
 */
const verifyPayment = async (reference) => {
    // Sandbox / Mock simulation handling
    if (!KORAPAY_SECRET_KEY || KORAPAY_SECRET_KEY.startsWith("your_") || reference.startsWith("KORA_REF_")) {
        console.log(`\n✅ [KORAPAY SANDBOX VERIFY] Verified reference: ${reference}\n`);
        return {
            success: true,
            isMock: true,
            status: "success",
            data: {
                reference,
                status: "success",
                amount_paid: 0,
                paid_at: new Date().toISOString()
            }
        };
    }

    try {
        const response = await fetch(`${KORAPAY_BASE_URL}/merchant/api/v1/charges/resolve/${reference}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${KORAPAY_SECRET_KEY}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || !data || !data.status) {
            throw new Error((data && data.message) || "Payment verification failed with Korapay.");
        }

        const chargeData = data.data || {};
        const isSuccess = chargeData.status === "success";

        return {
            success: isSuccess,
            status: chargeData.status,
            data: chargeData
        };
    } catch (error) {
        console.error("❌ [KORAPAY VERIFY ERROR]:", error.message);
        throw error;
    }
};

/**
 * Verify Korapay Webhook Signature
 */
const verifyWebhookSignature = (signature, rawBody) => {
    if (!KORAPAY_SECRET_KEY) return true;
    try {
        const hash = crypto
            .createHmac("sha256", KORAPAY_SECRET_KEY)
            .update(rawBody)
            .digest("hex");
        return hash === signature;
    } catch (e) {
        return false;
    }
};

module.exports = {
    initializePayment,
    verifyPayment,
    verifyWebhookSignature,
    KORAPAY_PUBLIC_KEY
};
