const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const router = express.Router();

/* =====================================================
   REGISTER
   POST /api/auth/register
===================================================== */

router.post("/register", async (req, res) => {

    try {

        console.log("REGISTER REQUEST RECEIVED");

        console.log("Request body:", {
            fullName: req.body.fullName,
            email: req.body.email,
            phone: req.body.phone,
            passwordProvided: !!req.body.password
        });

        const {
            fullName,
            email,
            phone,
            password
        } = req.body;

        /* ================================
           VALIDATION
        ================================= */

        if (
            typeof fullName !== "string" ||
            typeof email !== "string" ||
            typeof phone !== "string" ||
            typeof password !== "string"
        ) {

            return res.status(400).json({
                success: false,
                message: "Please provide valid registration details."
            });

        }

        const cleanFullName = fullName.trim();
        const cleanEmail = email.trim().toLowerCase();
        const cleanPhone = phone.trim();

        if (
            !cleanFullName ||
            !cleanEmail ||
            !cleanPhone ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message: "Please fill in all fields."
            });

        }

        /* ================================
           EMAIL VALIDATION
        ================================= */

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {

            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });

        }

        /* ================================
           PASSWORD VALIDATION
        ================================= */

        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters."
            });

        }

        /* ================================
           CHECK EMAIL
        ================================= */

        const existingUser =
            await User.findOne({
                email: cleanEmail
            });

        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });

        }

        /* ================================
           HASH PASSWORD
        ================================= */

        const hashedPassword =
            await bcrypt.hash(password, 10);

        /* ================================
           CREATE USER
        ================================= */

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

        /* ================================
           RESPONSE
        ================================= */

        return res.status(201).json({

            success: true,

            message: "Account created successfully.",

            user: {

                id: user._id,

                fullName: user.fullName,

                email: user.email,

                phone: user.phone,

                balance: user.balance,

                totalInvested: user.totalInvested,

                totalProfit: user.totalProfit

            }

        });

    } catch (error) {

        console.error(
            "REGISTER ERROR:",
            error
        );

        /* ================================
           DUPLICATE EMAIL
        ================================= */

        if (error.code === 11000) {

            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });

        }

        return res.status(500).json({

            success: false,

            message:
                "Server error while creating account.",

            error:
                error.message

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
        } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {

            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });

        }

        const cleanEmail =
            email.trim().toLowerCase();

        const user =
            await User.findOne({
                email: cleanEmail
            });

        if (!user) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }

        return res.status(200).json({

            success: true,

            message: "Login successful.",

            user: {

                id: user._id,

                fullName: user.fullName,

                email: user.email,

                phone: user.phone,

                balance: user.balance,

                totalInvested: user.totalInvested,

                totalProfit: user.totalProfit

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
                "Server error while logging in.",

            error:
                error.message

        });

    }

});

module.exports = router;
