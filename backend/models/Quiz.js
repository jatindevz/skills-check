import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema({
    id: { type: String, required: true },
    question: { type: String, required: true },
    options: {
        A: { type: String, required: true },
        B: { type: String, required: true },
        C: { type: String, required: true },
        D: { type: String, required: true },
    },
    correctAnswer: {
        type: String,
        required: true,
        enum: ["A", "B", "C", "D"],
    },
    // make OPTIONAL — user will answer later
    userAnswer: {
        type: String,
        enum: ["A", "B", "C", "D"],
        default: null
    },
    explanation: { type: String, required: true },
});

const quizSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    questionsData: [quizQuestionSchema],
});

export default mongoose.model("Quiz", quizSchema);
