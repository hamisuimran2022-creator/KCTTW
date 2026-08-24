
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

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


/*
========================================================
TEST ROUTE
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
MONGODB CONNECTION
========================================================
*/

let mongoPromise = null;

async function connectDatabase() {

    if (mongoose.connection.readyState === 1) {
        return;
    }

    if (!process.env.MONGO_URI) {
        throw new Error(
            "MONGO_URI environment variable is missing."
        );
    }

    if (!mongoPromise) {

        mongoPromise = mongoose.connect(
            process.env.MONGO_URI
        );

    }

    await mongoPromise;

}


/*
========================================================
AUTH ROUTES
========================================================
*/

app.use(
    "/api/auth",
    async (req, res, next) => {

        try {

            await connectDatabase();

            next();

        } catch (error) {

            console.error(
                "DATABASE ERROR:",
                error
            );

            return res.status(500).json({
                success: false,
                message: "Database connection failed.",
                error: error.message
            });

        }

    },
    authRoutes
);


/*
========================================================
VERCEL
========================================================
*/

module.exports = app;
```
