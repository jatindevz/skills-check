import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date }
});

export default mongoose.model("Session", sessionSchema);
