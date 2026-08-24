```js
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
    methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "OPTIONS"
    ],
    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ]
}));

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));


/*
========================================================
MONGODB CONNECTION
========================================================
*/

let mongoConnected = false;

async function connectDatabase() {

    if (mongoConnected) {
        return;
    }

    if (!process.env.MONGO_URI) {

        throw new Error(
            "MONGO_URI environment variable is missing."
        );

    }

    await mongoose.connect(
        process.env.MONGO_URI
    );

    mongoConnected = true;

    console.log(
        "MongoDB connected successfully."
    );

}


/*
========================================================
DATABASE MIDDLEWARE
========================================================
*/

app.use(async (req, res, next) => {

    try {

        await connectDatabase();

        next();

    } catch (error) {

        console.error(
            "MongoDB connection failed:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Database connection failed."
        });

    }

});


/*
========================================================
TEST ROUTE
========================================================
*/

app.get("/", (req, res) => {

    res.json({
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
    authRoutes
);


/*
========================================================
VERCEL EXPORT
========================================================
*/

module.exports = app;
```
