import mongoose from "mongoose";


const stepSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    quizId: { type: mongoose.Schema.Types.ObjectId,  ref: 'Quiz' },
    analysisId: { type: mongoose.Schema.Types.ObjectId,  ref: 'Analysis' },
});

export default mongoose.model("Flow", stepSchema);