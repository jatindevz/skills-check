import Session from "../models/Session.js";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
        return res.status(401).json({ message: "Invalid session" });
    }

    if (session.expiresAt < new Date()) {
        await Session.findByIdAndDelete(sessionId);
        return res.status(401).json({ message: "Session expired" });
    }

    const user = await User.findById(session.userId).select("-password");
    req.user = user;

    next();
};
