const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();

/*
========================================================
MIDDLEWARE
========================================================
*/

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/*
========================================================
MONGODB CONNECTION
========================================================
*/

let isConnecting = false;

async function connectDB() {

    // Already connected
    if (mongoose.connection.readyState === 1) {
        return;
    }

    // Connection is already being attempted
    if (isConnecting) {

        while (isConnecting) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (mongoose.connection.readyState === 1) {
            return;
        }
    }

    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
        throw new Error(
            "MONGO_URI is missing from Vercel Environment Variables."
        );
    }

    isConnecting = true;

    try {

        console.log("Connecting to MongoDB...");

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 20000
        });

        console.log("MongoDB connected successfully.");

    } catch (error) {

        console.error(
            "MongoDB connection error:",
            error.message
        );

        throw error;

    } finally {

        isConnecting = false;

    }
}


/*
========================================================
DATABASE TEST
========================================================
*/

app.get("/api/test-db", async (req, res) => {

    try {

        await connectDB();

        return res.status(200).json({

            success: true,

            message: "MongoDB connection is working.",

            database:
                mongoose.connection.name,

            host:
                mongoose.connection.host

        });

    } catch (error) {

        console.error(
            "MONGODB TEST ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "MongoDB connection failed.",

            error:
                error.message,

            name:
                error.name

        });

    }

});


/*
========================================================
ROOT TEST
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

app.use(
    "/api/auth",
    async (req, res, next) => {

        try {

            await connectDB();

            next();

        } catch (error) {

            console.error(
                "AUTH DATABASE ERROR:",
                error.message
            );

            return res.status(500).json({

                success: false,

                message:
                    "Database connection failed.",

                error:
                    error.message

            });

        }

    },
    authRoutes
);


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

    console.error(
        "SERVER ERROR:",
        error
    );

    res.status(500).json({

        success: false,

        message:
            "Internal server error."

    });

});


/*
========================================================
VERCEL EXPORT
========================================================
*/

module.exports = app;
