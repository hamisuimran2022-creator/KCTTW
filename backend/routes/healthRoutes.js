const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/health", (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
    
    return res.status(200).json({
        success: true,
        service: "KCTTW Luxury Fashion API",
        status: "operational",
        environment: process.env.NODE_ENV || "development",
        database: {
            status: dbStatus,
            name: mongoose.connection.name || null
        },
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
