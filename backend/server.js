
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let connectionPromise = null;

async function connectDB() {

    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is missing from Vercel environment variables.");
    }

    if (!connectionPromise) {

        connectionPromise = mongoose.connect(
            process.env.MONGO_URI,
            {
                serverSelectionTimeoutMS: 10000,
                connectTimeoutMS: 10000
            }
        );
    }

    try {

        await connectionPromise;

        console.log("=================================");
        console.log("MONGODB CONNECTED SUCCESSFULLY");
        console.log("=================================");

    } catch (error) {

        connectionPromise = null;

        console.error("=================================");
        console.error("MONGODB CONNECTION FAILED");
        console.error("ERROR NAME:", error.name);
        console.error("ERROR MESSAGE:", error.message);
        console.error("=================================");

        throw error;
    }
}


/*
========================================================
DATABASE TEST ROUTE
========================================================
*/

app.get("/api/test-db", async (req, res) => {

    try {

        await connectDB();

        return res.status(200).json({
            success: true,
            message: "MongoDB connection is working.",
            database: mongoose.connection.name
        });

    } catch (error) {

        console.error("DB TEST ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "MongoDB connection failed.",
            error: error.message
        });
    }
});


/*
========================================================
HOME
========================================================
*/

app.get("/", (req, res) => {

    res.status(200).json({
        success: true,
        message: "KCTTW backend is running."
    });

});


/*
========================================================
AUTH ROUTES
========================================================
*/

app.use(async (req, res, next) => {

    try {

        await connectDB();

        next();

    } catch (error) {

        console.error(
            "DATABASE MIDDLEWARE ERROR:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Database connection failed.",
            error: error.message
        });

    }

});

app.use("/api/auth", authRoutes);


/*
========================================================
404
========================================================
*/

app.use((req, res) => {

    res.status(404).json({
        success: false,
        message: "Route not found."
    });

});


/*
========================================================
ERROR HANDLER
========================================================
*/

app.use((error, req, res, next) => {

    console.error("SERVER ERROR:", error);

    res.status(500).json({
        success: false,
        message: "Internal server error.",
        error: error.message
    });

});


module.exports = app;
```
