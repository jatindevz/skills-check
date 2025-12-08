// backend/routes/app.js

import axios from "axios";
import express from "express";
import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";
import { getquizPrompt, extractFromAIResponse, getAnalysisPrompt } from "../config/prompts.js";
import Session from "../models/Session.js";
import User from "../models/User.js";
import Analysis from "../models/Analysis.js";
import Flow from "../models/Flow.js";

const router = express.Router();
const { Types } = mongoose;

// Helper: get user document (populated) from sessionId using aggregation
async function getUserFromSession(sessionId) {
    if (!sessionId) return null;

    const agg = await Session.aggregate([
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
            $replaceRoot: { newRoot: "$user" } // return the user document directly
        }
    ]);

    return agg[0] || null;
}

router.post("/getquiz", async (req, res) => {
    try {
        const { userRes } = req.body;
        console.log("In getquiz route");

        const prompt = getquizPrompt(userRes);
        console.log(prompt);

        const aiRes = await axios.post("http://localhost:5000/api/gemini/geminiai", {
            prompt
        });

        const quiz = extractFromAIResponse(aiRes.data.text);
        console.log("quiz type:", typeof quiz);

        const sessionId = req.cookies.sessionId;
        const user = await getUserFromSession(sessionId);

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid session" });
        }

        // create quiz
        const newQuiz = new Quiz({
            userId: user._id,
            questionsData: quiz
        });

        await newQuiz.save();

        // create flow
        const newFlow = new Flow({
            userId: user._id,
            quizId: newQuiz._id,
            analysisId: null
        });

        await newFlow.save();

        // push flow id into user's flow array using an atomic update
        await User.updateOne(
            { _id: user._id },
            { $push: { flow: newFlow._id } }
        );

        res.json({
            success: true,
            message: "Quiz fetched successfully",
            data: quiz,
            quizId: newQuiz._id
        });
    } catch (error) {
        console.error("ERROR in /getquiz:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/submitquiz", async (req, res) => {
    try {
        // keep the original incoming key name to avoid breaking clients
        const { currentQiuzData } = req.body;
        const prompt = getAnalysisPrompt(currentQiuzData);

        const aiRes = await axios.post("http://localhost:5000/api/gemini/geminiai", {
            prompt
        });

        const quizId = currentQiuzData.quizId;
        const questions = currentQiuzData.questions;

        // update quiz questionsData (atomic)
        await Quiz.findByIdAndUpdate(quizId, { questionsData: questions }, { new: true });

        const analysis = extractFromAIResponse(aiRes.data.text);

        const sessionId = req.cookies.sessionId;
        const user = await getUserFromSession(sessionId);

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid session" });
        }

        // store analysis
        const newAnal = new Analysis({
            userId: user._id,
            analysis: analysis
        });
        await newAnal.save();

        // update flow to point to the new analysis using an atomic update
        const flow = await Flow.findOneAndUpdate(
            { quizId: Types.ObjectId(quizId), userId: Types.ObjectId(user._id) },
            { $set: { analysisId: newAnal._id } },
            { new: true }
        );

        // If you want to return the flow or check existence, handle null flow
        if (!flow) {
            console.warn("Warning: flow not found for quizId:", quizId, "user:", user._id);
        }

        res.json({
            success: true,
            message: "Quiz submitted successfully",
            analysis,
            analysisId: newAnal._id
        });
    } catch (error) {
        console.error("ERROR in /submitquiz:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/getroadmap", async (req, res) => {
    try {
        const { userDataRes } = req.body;
        console.log("In getroadmap route");
        const prompt = getAnalysisPrompt(userDataRes);

        const aiRes = await axios.post("http://localhost:5000/api/gemini/geminiai", {
            prompt
        });

        const roadmap = extractFromAIResponse(aiRes.data.text);

        res.json({
            success: true,
            message: "Roadmap generated successfully",
            roadmap
        });
    } catch (error) {
        console.error("ERROR in /getroadmap:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

router.get("/getflow/:flowId", async (req, res) => {
    try {
        const sessionId = req.cookies.sessionId;
        const user = await getUserFromSession(sessionId);

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid session" });
        }

        // Use aggregation to fetch the flow and populate quizId and analysisId
        const flowId = req.params.flowId;
        const agg = await Flow.aggregate([
            {
                $match: {
                    _id: new Types.ObjectId(flowId),
                    userId: new Types.ObjectId(user._id)
                }
            },
            {
                $lookup: {
                    from: "quizzes",
                    localField: "quizId",
                    foreignField: "_id",
                    as: "quiz"
                }
            },
            { $unwind: { path: "$quiz", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "analyses",
                    localField: "analysisId",
                    foreignField: "_id",
                    as: "analysis"
                }
            },
            { $unwind: { path: "$analysis", preserveNullAndEmptyArrays: true } },
            // Optional: reshape the output to look like populated document
            {
                $project: {
                    userId: 1,
                    quizId: "$quiz",
                    analysisId: "$analysis",
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        const flow = agg[0];

        if (!flow) {
            return res.json({ success: false, message: "Flow not found" });
        }

        res.json({
            success: true,
            message: "Flow fetched successfully",
            flow
        });
    } catch (error) {
        console.error("ERROR in /getflow/:flowId:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
