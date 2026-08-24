const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const router = express.Router();

/* =====================================================
   TEST AUTH ROUTE
   GET /api/auth/test
===================================================== */

router.get("/test", (req, res) => {

    res.status(200).json({
        success: true,
        message: "Auth router is working."
    });

});

/* =====================================================
   REGISTER
   POST /api/auth/register
===================================================== */

router.post("/register", async (req, res) => {

    try {

        console.log("REGISTER REQUEST RECEIVED");

        console.log("Request body:", req.body);

        const {
            fullName,
            email,
            phone,
            password
        } = req.body || {};

        /* =========================
           REQUIRED FIELDS
        ========================= */

        if (
            !fullName ||
            !email ||
            !phone ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });

        }

        /* =========================
           CLEAN DATA
        ========================= */

        const cleanFullName =
            String(fullName).trim();

        const cleanEmail =
            String(email).trim().toLowerCase();

        const cleanPhone =
            String(phone).trim();

        const cleanPassword =
            String(password);

        /* =========================
           VALIDATION
        ========================= */

        if (cleanFullName.length < 2) {

            return res.status(400).json({
                success: false,
                message: "Please enter your full name."
            });

        }

        if (
            !cleanEmail.includes("@") ||
            !cleanEmail.includes(".")
        ) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });

        }

        if (cleanPassword.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters."
            });

        }

        /* =========================
           CHECK EXISTING USER
        ========================= */

        const existingUser =
            await User.findOne({
                email: cleanEmail
            });

        if (existingUser) {

            return res.status(409).json({
                success: false,
                message:
                    "An account with this email already exists."
            });

        }

        /* =========================
           HASH PASSWORD
        ========================= */

        const hashedPassword =
            await bcrypt.hash(
                cleanPassword,
                10
            );

        /* =========================
           CREATE USER
        ========================= */

        const user =
            await User.create({

                fullName: cleanFullName,

                email: cleanEmail,

                phone: cleanPhone,

                password: hashedPassword,

                balance: 0,

                totalInvested: 0,

                totalProfit: 0

            });

        console.log(
            "USER CREATED:",
            user._id.toString()
        );

        /* =========================
           SUCCESS
        ========================= */

        return res.status(201).json({

            success: true,

            message:
                "Account created successfully.",

            user: {

                id: user._id,

                fullName:
                    user.fullName,

                email:
                    user.email,

                phone:
                    user.phone,

                balance:
                    user.balance,

                totalInvested:
                    user.totalInvested,

                totalProfit:
                    user.totalProfit

            }

        });

    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );

        /* =========================
           DUPLICATE EMAIL
        ========================= */

        if (error.code === 11000) {

            return res.status(409).json({

                success: false,

                message:
                    "An account with this email already exists."

            });

        }

        /* =========================
           MONGOOSE VALIDATION ERROR
        ========================= */

        if (error.name === "ValidationError") {

            return res.status(400).json({

                success: false,

                message:
                    "Please check the information you entered."

            });

        }

        /* =========================
           SERVER ERROR
        ========================= */

        return res.status(500).json({

            success: false,

            message:
                "Server error while creating account."

        });

    }

});

/* =====================================================
   LOGIN
   POST /api/auth/login
===================================================== */

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body || {};

        /* =========================
           REQUIRED
        ========================= */

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message:
                    "Email and password are required."

            });

        }

        /* =========================
           CLEAN EMAIL
        ========================= */

        const cleanEmail =
            String(email)
                .trim()
                .toLowerCase();

        /* =========================
           FIND USER
        ========================= */

        const user =
            await User.findOne({
                email: cleanEmail
            });

        if (!user) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }

        /* =========================
           CHECK PASSWORD
        ========================= */

        const passwordMatch =
            await bcrypt.compare(
                String(password),
                user.password
            );

        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid email or password."

            });

        }

        /* =========================
           SUCCESS
        ========================= */

        return res.status(200).json({

            success: true,

            message:
                "Login successful.",

            user: {

                id:
                    user._id,

                fullName:
                    user.fullName,

                email:
                    user.email,

                phone:
                    user.phone,

                balance:
                    user.balance,

                totalInvested:
                    user.totalInvested,

                totalProfit:
                    user.totalProfit

            }

        });

    } catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Server error while logging in."

        });

    }

});

module.exports = router;
