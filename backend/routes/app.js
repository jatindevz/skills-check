//backend/routes/app.js

import axios from "axios";
import express from "express";
import Quiz from "../models/Quiz.js";
import { getquizPrompt, extractFromAIResponse, getAnalysisPrompt } from "../config/prompts.js";
import Session from "../models/Session.js";
import User from "../models/User.js";
import Analysis from "../models/Analysis.js";
import Flow from "../models/Flow.js";



const router = express.Router();


router.post("/getquiz", async (req, res) => {
    try {
        const { userRes } = req.body;
        console.log("In getquiz route, ");
        

        const prompt = getquizPrompt(userRes);
        console.log(prompt);
        

        const aiRes = await axios.post("http://localhost:5000/api/gemini/geminiai", {
            prompt
        })
        // console.log(aiRes.data);
        const quiz = extractFromAIResponse(aiRes.data.text);

        console.log(typeof(quiz));
        // console.log(quiz);

        const sessionId = req.cookies.sessionId;
        const session = await Session.findById(sessionId);
        const user = await User.findById(session.userId).select("-password");

        const newQuiz = new Quiz({
            userId: user._id,
            questionsData: quiz
        });

        const newFlow = new Flow({
            userId: user._id,
            quizId: newQuiz._id,
            analysisId: null
        });

        await newFlow.save();
        user.flow.push(newFlow._id);
        await user.save();

        await newQuiz.save();

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
        const { currentQiuzData } = req.body;
        const prompt = getAnalysisPrompt(currentQiuzData);

        const aiRes = await axios.post("http://localhost:5000/api/gemini/geminiai", {
            prompt
        })

        const quizId = currentQiuzData.quizId;
        const questions = currentQiuzData.questions;

        const quiz = await Quiz.findById(quizId);
        quiz.questionsData = questions;
        await quiz.save();
        

        const analysis = extractFromAIResponse(aiRes.data.text);

        const sessionId = req.cookies.sessionId;
        const session = await Session.findById(sessionId);
        const user = await User.findById(session.userId).select("-password");

        const newAnal = new Analysis({
            userId: user._id,
            analysis: analysis
        });

        const flow = await Flow.findOne({ quizId: currentQiuzData.quizId, userId: user._id });
        flow.analysisId = newAnal._id;
        await flow.save();

        await newAnal.save();

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
})



router.post("/getroadmap", async (req, res) => {
    try {
        const { userDataRes } = req.body;
        console.log("In getroadmap route, ");
        const prompt = getAnalysisPrompt(userDataRes);

        const aiRes = await axios.post("http://localhost:5000/api/gemini/geminiai", {
            prompt
        })

        const roadmap = extractFromAIResponse(aiRes.data.text);

        res.json({
            success: true,
            message: "Quiz submitted successfully",
            analysis
        });
    } catch (error) {
        console.error("ERROR in /getroadmap:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
})



router.get("/getflow/:flowId", async (req, res) => {
    try {
        const sessionId = req.cookies.sessionId;
        const session = await Session.findById(sessionId);
        const user = await User.findById(session.userId).select("-password");

        const flow = await Flow.findOne({
            userId: user._id,
            _id: req.params.flowId
        })
            .populate("quizId")
            .populate("analysisId");

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