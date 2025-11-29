import mongoose from "mongoose";




const analysisSchema = new mongoose.Schema({
   
    strengths: {
        type: [String],
        required: true
    },

    areasForImprovement: {
        type: [String],
        required: true
    },

    studyTips: {
        type: [String],
        required: true
    },

    recommendedResources: [
        {
            title: { type: String, required: true },
            url: { type: String, required: true }
        }
    ],

    nextSteps: {
        type: [String],
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});


const mainAnalysisSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    analysis: { type: analysisSchema, required: true },
    createdAt: { type: Date, default: Date.now },
});


export default mongoose.model("Analysis", mainAnalysisSchema);

