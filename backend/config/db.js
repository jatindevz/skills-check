import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config(); // <-- absolutely required

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("MongoDB connected");
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
