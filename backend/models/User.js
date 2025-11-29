import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
    flow : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flow' }]

});


export default mongoose.model("User", userSchema);
