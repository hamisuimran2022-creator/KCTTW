const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "KCTTW backend is running."
    });
});


// ==========================================
// MONGODB CONNECTION
// ==========================================

let isConnected = false;

async function connectDatabase() {

    if (isConnected) {
        return;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not configured.");
    }

    await mongoose.connect(process.env.MONGO_URI);

    isConnected = true;

    console.log("MongoDB connected successfully.");
}


// ==========================================
// AUTH ROUTES
// ==========================================

app.use("/api/auth", async (req, res, next) => {

    try {

        await connectDatabase();

        next();

    } catch (error) {

        console.error("DATABASE CONNECTION ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Database connection failed."
        });

    }

}, authRoutes);


// ==========================================
// 404
// ==========================================

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found."
    });

});


// ==========================================
// ERROR HANDLER
// ==========================================

app.use((error, req, res, next) => {

    console.error("SERVER ERROR:", error);

    res.status(500).json({
        success: false,
        message: "Internal server error."
    });

});


// ==========================================
// VERCEL
// ==========================================

module.exports = app;
