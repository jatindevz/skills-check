//backend/routes/gemini.js
import { GoogleGenAI } from "@google/genai";
import express from "express";
import dotenv from 'dotenv';

dotenv.config(); // <-- absolutely required

const router = express.Router();
// eslint-disable-next-line no-undef
const ai = new GoogleGenAI({ apiKey : process.env.GOOGLE_GENAI_API_KEY });


router.post("/geminiai", async (req, res) => {
    try {
        const { prompt } = req.body;

        console.log("in gemini route, ");

        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
        });

        // console.log(response.text);


        res.json({
            success: true,
            message: "Your request was successful",
            text: response.text
        });

    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while processing your request.",
            error: error.message
        });
    }
})

export default router;


//         const session = await Session.findById(sessionId);


