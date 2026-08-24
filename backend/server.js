const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");

const app = express();

app.use(cors({
    origin: "*"
}));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "KCTTW backend is running."
    });
});

app.use("/api/auth", authRoutes);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully.");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });

module.exports = app;
