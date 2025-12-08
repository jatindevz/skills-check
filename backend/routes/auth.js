import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import mongoose from "mongoose";
import User from "../models/User.js";
import Session from "../models/Session.js";

const router = express.Router();
const { Types } = mongoose;

// Helper: load user through session using aggregation (fast & clean)
async function getUserFromSession(sessionId) {
    if (!sessionId) return null;

    const data = await Session.aggregate([
        { $match: { _id: new Types.ObjectId(sessionId) } },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        },
        { $unwind: "$user" },
        {
            $project: {
                password: 0,
                "user.password": 0
            }
        }
    ]);

    return data.length ? data[0].user : null;
}

// Signup
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check collisions using one aggregation instead of two separate queries
        const matches = await User.aggregate([
            {
                $match: {
                    $or: [{ email }, { username }]
                }
            }
        ]);

        const existingEmailUser = matches.find(u => u.email === email);
        const existingUsernameUser = matches.find(u => u.username === username);

        if (existingUsernameUser && existingUsernameUser.email !== email) {
            return res.status(400).json({
                success: false,
                message: "Username already taken"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification code
        const verifycode = crypto.randomInt(100000, 999999).toString();
        const expiry = new Date(Date.now() + 60 * 60 * 1000);

        let savedUser;

        if (existingEmailUser) {
            if (existingEmailUser.isVerified) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists and is verified"
                });
            }

            savedUser = await User.findOneAndUpdate(
                { email },
                {
                    $set: {
                        username,
                        password: hashedPassword,
                        isVerified: false,
                        verifycode,
                        verifycodeexpire: expiry
                    }
                },
                { new: true }
            );
        } else {
            savedUser = await User.create({
                username,
                email,
                password: hashedPassword,
                isVerified: false,
                verifycode,
                verifycodeexpire: expiry
            });
        }

        res.json({
            success: true,
            message: "User registered. Verification code sent.",
            userId: savedUser._id
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Load user using aggregation (only one DB operation)
        const result = await User.aggregate([
            { $match: { email } },
            { $limit: 1 }
        ]);

        const user = result[0];
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const session = await Session.create({
            userId: user._id,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2)
        });

        res.cookie("sessionId", session._id.toString(), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 2
        });

        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Logout
router.post("/logout", async (req, res) => {
    try {
        const sessionId = req.cookies.sessionId;

        if (sessionId) {
            await Session.findByIdAndDelete(sessionId);
        }

        res.clearCookie("sessionId");
        res.json({ success: true, message: "Logged out" });
    } catch (err) {
        console.error("Logout error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Me (session → user via aggregation)
router.get("/me", async (req, res) => {
    try {
        const sessionId = req.cookies.sessionId;
        if (!sessionId) {
            return res.json({ success: false, user: null });
        }

        const sessionDoc = await Session.findById(sessionId);

        if (!sessionDoc || sessionDoc.expiresAt < new Date()) {
            await Session.findByIdAndDelete(sessionId);
            res.clearCookie("sessionId");
            return res.json({ success: false, user: null });
        }

        const user = await getUserFromSession(sessionId);

        res.json({
            success: true,
            user
        });
    } catch (err) {
        console.error("Me error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Verify email
router.post("/verify-email", async (req, res) => {
    try {
        const { userId, code } = req.body;

        const user = await User.findOne({
            _id: userId,
            verifycode: code,
            verifycodeexpire: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code"
            });
        }

        user.isVerified = true;
        user.verifycode = undefined;
        user.verifycodeexpire = undefined;
        await user.save();

        res.json({
            success: true,
            message: "Email verified successfully"
        });
    } catch (err) {
        console.error("Verify error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

export default router;
