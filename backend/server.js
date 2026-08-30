const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const healthRoutes = require("./routes/healthRoutes");
const contactRoutes = require("./routes/contactRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const errorHandler = require("./middleware/error");
const ApiError = require("./utils/apiError");

const app = express();

/* =========================================================
   SECURITY & UTILITY MIDDLEWARE
========================================================= */
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false
    })
);

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* =========================================================
   DATABASE INITIALIZATION MIDDLEWARE
========================================================= */
app.use(async (req, res, next) => {
    try {
        await connectDB();
    } catch (error) {
        console.error("Database connection failure on request:", error.message);
    }
    next();
});

/* =========================================================
   API ROUTES
========================================================= */
app.use("/api", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payments", paymentRoutes);

/* =========================================================
   STATIC FRONTEND SERVING (PRODUCTION DIST)
========================================================= */
const distPath = path.join(__dirname, "../dist");

if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));

    // Catch-all route to serve index.html for React Router
    app.get("*", (req, res, next) => {
        if (req.path.startsWith("/api")) {
            return next();
        }
        res.sendFile(path.join(distPath, "index.html"));
    });
} else {
    // API-only greeting when dist is not built
    app.get("/", (req, res) => {
        res.status(200).json({
            success: true,
            service: "KCTTW Luxury Fashion API",
            status: "online",
            docs: "/api/health"
        });
    });
}

/* =========================================================
   API 404 HANDLER
========================================================= */
app.use((req, res, next) => {
    next(ApiError.notFound(`Endpoint not found: ${req.method} ${req.originalUrl}`));
});

/* =========================================================
   CENTRALIZED ERROR HANDLER
========================================================= */
app.use(errorHandler);

/* =========================================================
   SERVER START (PRODUCTION & LOCAL)
========================================================= */
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0"; // Required for Railway, Docker, Render, Fly.io

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
    app.listen(PORT, HOST, async () => {
        console.log(`\n✨ ========================================`);
        console.log(`🚀 KCTTW Server listening on http://${HOST}:${PORT}`);
        console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
        console.log(`✨ ========================================\n`);
        
        // Attempt initial DB connection in background without blocking server startup
        connectDB().catch((err) => {
            console.warn("Initial DB connection warning:", err.message);
        });
    });
}

module.exports = app;
