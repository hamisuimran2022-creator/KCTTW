const mongoose = require("mongoose");

let isConnected = false;
let lastAttemptTime = 0;
let connectionPromise = null;
const RETRY_INTERVAL_MS = 20000; // 20 seconds between retry attempts on failure

/**
 * Connect to MongoDB with robust options, connection reuse, and throttle
 */
const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState === 1) {
        return;
    }

    // Return in-flight connection promise if already connecting
    if (connectionPromise) {
        return connectionPromise;
    }

    const now = Date.now();
    if (now - lastAttemptTime < RETRY_INTERVAL_MS) {
        return;
    }

    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
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
        if (process.env.NODE_ENV === "production") {
            throw error;
        }
    } finally {
        connectionPromise = null;
    }
};

mongoose.connection.on("disconnected", () => {
    isConnected = false;
});

mongoose.connection.on("error", (err) => {
    console.error(`❌ MongoDB runtime error: ${err.message}`);
});

module.exports = connectDB;
