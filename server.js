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

app.use(cors());

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

app.use("/api/auth", authRoutes);

/*
========================================================
MONGODB CONNECTION
========================================================
*/

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully.");
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error
        );
    });

/*
========================================================
VERCEL
========================================================
*/

module.exports = app;
