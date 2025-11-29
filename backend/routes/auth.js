import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";
import Session from "../models/Session.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        console.log("Signup attempt:", email, username);

        const existingEmailUser = await User.findOne({ email });
        const existingUsernameUser = await User.findOne({ username });

        // ❌ Username is already taken by someone else
        if (existingUsernameUser && existingUsernameUser.email !== email) {
            return res.status(400).json({
                success: false,
                message: "Username already taken"
            });
        }

        // 🔐 Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 🔢 Generate verification code and expiry
        const verifycode = crypto.randomInt(100000, 999999).toString();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        let savedUser;

        // ✏️ If user already exists by email
        if (existingEmailUser) {
            if (existingEmailUser.isVerified) {
                return res.status(400).json({
                    success: false,
                    message: "User already exists and is verified"
                });
            }

            // 🔄 Update unverified user
            savedUser = await User.findOneAndUpdate(
                { email },
                {
                    $set: {
                        username,
                        password: hashedPassword,
                        isVerified: false,
                        verifycode,
                        verifycodeexpire: expiryDate,
                    },
                },
                { new: true }
            );
        } else {
            // 🆕 Create new user
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                isVerified: false,
                verifycode,
                verifycodeexpire: expiryDate,
            });

            savedUser = await newUser.save();
        }

        // TODO: Send verification email with verifycode here

        res.json({
            success: true,
            message: "User registered. Verification code sent.",
            userId: savedUser._id,
        });

    } catch (error) {
        console.error("Error in registration:", error);
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Login attempt:", email);

        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found for email:", email);
            
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Invalid password for email:", email);
            
            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        // Check if user is verified
        // if (!user.isVerified) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Please verify your email first"
        //     });
        // }

        // Create session
        const session = await Session.create({
            userId: user._id,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 5) // 2 hours
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

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
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
        res.json({
            success: true,
            message: "Logged out"
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

// Who am I
router.get("/me", async (req, res) => {
    try {
        const sessionId = req.cookies.sessionId;

        console.log("Me endpoint called");

        if (!sessionId) {
            console.log("No sessionId cookie found");
            
            return res.json({
                success: false,
                user: null
            });
        }

        const session = await Session.findById(sessionId);
        if (!session) {
            console.log("Session not found for sessionId:", sessionId);
            
            res.clearCookie("sessionId");
            return res.json({
                success: false,
                user: null
            });
        }

        // Check if session expired
        if (session.expiresAt < new Date()) {
            await Session.findByIdAndDelete(sessionId);
            res.clearCookie("sessionId");
            console.log("Session expired for sessionId:", sessionId);
            
            return res.json({
                success: false,
                user: null
            });
        }

        const user = await User.findById(session.userId).select("-password");
        console.log("Authenticated user:", user);
        
        res.json({
            success: true,
            user: user
        });
    } catch (error) {
        console.error("Me endpoint error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
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

    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

export default router;