const express = require('express');
const path = require('path');
const app = express();

// Middleware to parse incoming JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, client-side JS, images) from the root directory or public folder
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// API ROUTES
// ==========================================

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        service: "KCTTW Luxury Fashion API",
        status: "online",
        timestamp: new Date().toISOString()
    });
});

// Checkout API Endpoint (Handles multi-method payment & address validation)
app.post('/api/checkout', (req, res) => {
    const { paymentMethod, address, items } = req.body;

    // Basic server-side validation example
    if (!address) {
        return res.status(400).json({ 
            success: false, 
            message: "Address validation failed: Shipping address is required." 
        });
    }

    if (!paymentMethod) {
        return res.status(400).json({ 
            success: false, 
            message: "Payment method is required." 
        });
    }

    // Process successful checkout response
    res.json({
        success: true,
        message: "Order placed successfully!",
        orderId: "KCTTW-" + Math.floor(100000 + Math.random() * 900000),
        paymentMethod: paymentMethod,
        timestamp: new Date()
    });
});

// ==========================================
// FRONTEND PAGE ROUTES
// ==========================================

// Explicit route for the Checkout page
app.get('/checkout', (req, res) => {
    // Looks for 'checkout.html' in the root folder or public folder
    const rootCheckout = path.join(__dirname, 'checkout.html');
    const publicCheckout = path.join(__dirname, 'public', 'checkout.html');

    res.sendFile(rootCheckout, (err) => {
        if (err) {
            res.sendFile(publicCheckout, (err2) => {
                if (err2) {
                    res.status(404).send("Checkout page template not found on server.");
                }
            });
        }
    });
});

// Fallback for root URL if you want it to serve an index.html instead of just API JSON
app.get('/', (req, res, next) => {
    const indexPath = path.join(__dirname, 'index.html');
    // If an index.html exists, serve it. Otherwise, fall back to the API status JSON.
    res.sendFile(indexPath, (err) => {
        if (err) {
            next(); // Passes down to the JSON response below if index.html doesn't exist
        }
    });
});

// Default API root response if no index.html is present
app.get('/', (req, res) => {
    res.json({
        success: true,
        service: "KCTTW Luxury Fashion API",
        status: "online",
        docs: "/api/health"
    });
});

// Export app for Vercel serverless deployment
module.exports = app;

// Local development listener (ignored when running on Vercel)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running locally on port ${PORT}`);
    });
}
