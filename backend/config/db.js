const mongoose = require("mongoose");

let isConnected = false;
let lastAttemptTime = 0;
let connectionPromise = null;
const RETRY_INTERVAL_MS = 15000; // 15 seconds between retry attempts on failure

/**
 * Connect to MongoDB with robust options, connection reuse, and throttle
 */
const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState === 1) {
        return;
    }

    if (connectionPromise) {
        return connectionPromise;
    }

    const now = Date.now();
    if (now - lastAttemptTime < RETRY_INTERVAL_MS) {
        return;
    }

    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
        console.warn("⚠️ MONGO_URI is not set. Running in limited mode without database persistence.");
        return;
    }

    lastAttemptTime = now;

    try {
        console.log("Connecting to MongoDB database...");
        
        connectionPromise = mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 15000,
            family: 4
        });

        const conn = await connectionPromise;
        isConnected = true;
        console.log(`✅ MongoDB Connected: ${conn.connection.host} / DB: ${conn.connection.name}`);
    } catch (error) {
        isConnected = false;
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Do not crash server in production so HTTP health checks and static serving remain operational
    } finally {
        connectionPromise = null;
    }
};

mongoose.connection.on("disconnected", () => {
    isConnected = false;
    console.warn("⚠️ MongoDB disconnected.");
});

mongoose.connection.on("error", (err) => {
    console.error(`❌ MongoDB runtime error: ${err.message}`);
});

module.exports = connectDB;
