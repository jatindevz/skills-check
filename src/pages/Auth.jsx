import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function Auth() {
    const [mode, setMode] = useState("login");
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Clear messages when user starts typing
        if (message.text) setMessage({ type: "", text: "" });
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    };

    const handleLogin = async () => {
        if (!form.email || !form.password) {
            showMessage("error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/api/auth/login", form);


            console.log("Login successful:", res.data);
            toast.success("Login successful!");

            // Navigate after login
            setTimeout(() => navigate("/dashboard"), 1000);

        } catch (err) {
            const errorMessage = err?.response?.data?.message || "Login failed";
            console.error("Login failed:", errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async () => {
        if (!form.email || !form.password || !form.username) {
            showMessage("error", "Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            // 1) Create the account
            const res = await api.post("/api/auth/signup", form);


            console.log("Signup successful:", res.data);
            toast.success("Signup successful!");

            // Clear form
            setForm({ username: "", email: "", password: "" });

            // Switch to login mode after successful signup
            setTimeout(() => setMode("login"), 2000);

        } catch (err) {
            const errorMessage = err?.response?.data?.message || "Signup failed";
            console.error("Signup failed:", errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mode === "login" ? handleLogin() : handleSignup();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-700 to-blue-300 p-4">
            <div className="w-full max-w-sm bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-200/60">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                        <span className="text-white font-bold text-base">SC</span>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        SkillCheck
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                        {mode === "login" ? "Welcome back" : "Create your account"}
                    </p>
                </div>

                {/* Toggle */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        type="button"
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${mode === "login"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-blue-500"
                            }`}
                        onClick={() => setMode("login")}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-3 text-sm font-medium border-b-2 transition-all duration-200 ${mode === "signup"
                                ? "border-purple-600 text-purple-600"
                                : "border-transparent text-gray-500 hover:text-purple-500"
                            }`}
                        onClick={() => setMode("signup")}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {mode === "signup" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                name="username"
                                value={form.username}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                                           focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
                                           transition-all text-black"
                                placeholder="Choose a username"
                                disabled={loading}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                       transition-all text-black"
                            placeholder="email@example.com"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                                       transition-all text-black"
                            placeholder="••••••••"
                            disabled={loading}
                        />
                    </div>

                    {mode === "login" && (
                        <div className="flex justify-between items-center text-sm">
                            <a href="#" className="text-blue-600 hover:underline">
                                Forgot password?
                            </a>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                                   rounded-lg font-medium shadow-lg transition-all 
                                   ${loading
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:shadow-xl hover:-translate-y-0.5"
                            }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : (
                            mode === "login" ? "Sign in" : "Create account"
                        )}
                    </button>
                </form>

                {/* Toggle Text */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    {mode === "login" ? (
                        <>
                            Don't have an account?{" "}
                            <button
                                type="button"
                                className="text-blue-600 font-medium hover:underline"
                                onClick={() => setMode("signup")}
                                disabled={loading}
                            >
                                Sign up
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{" "}
                            <button
                                type="button"
                                className="text-purple-600 font-medium hover:underline"
                                onClick={() => setMode("login")}
                                disabled={loading}
                            >
                                Sign in
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}