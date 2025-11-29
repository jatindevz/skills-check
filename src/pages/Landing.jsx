import api from "../services/api"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Landing() {

    const navigate = useNavigate()


    useEffect(() => {
        document.title = "SkillFlow — Learn Smarter";

        const fetchUserData = async () => {
            try {
                const res = await api.get('/api/auth/me');
                if (res.data?.success && res.data.user) {
                    // If the user is authenticated, go to dashboard
                    navigate('/dashboard');
                } else {
                    // do nothing — stay on landing (or optionally show CTA)
                }
            } catch (err) {
                if (err?.name === 'CanceledError' || err?.message === 'canceled') {
                    // request was aborted — ignore
                    return;
                }
                console.error('Error fetching user:', err);
                // navigate to auth only if that's the desired UX:
                // navigate('/auth');
            }
        };

        fetchUserData();

        // return () => controller.abort();
    }, [navigate]);



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 text-gray-900">
            {/* Enhanced Navbar */}
            <nav className="w-full py-5 bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">SC</span>
                        </div>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SkillCheck</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="px-5 py-2.5 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                            Features
                        </button>
                        <button className="px-5 py-2.5 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                            How it Works
                        </button>
                        <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* Enhanced Hero Section */}
            <section className="max-w-7xl mx-auto px-6 py-24">
                <div className="text-center space-y-8">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                        AI-Powered Skill Assessment
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto">
                        Find Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Skill Gaps</span>.
                        Build Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Roadmap</span>.
                        Improve <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Smarter</span>.
                    </h1>

                    <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Take a 20-question AI-powered quiz and get a personalized analysis of where you stand — plus a step-by-step roadmap to grow your skills effectively.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-6">
                        <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center">
                            <span>Start Free Quiz</span>
                            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                            </svg>
                        </button>

                        <button className="px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl border border-gray-300 hover:border-gray-400 shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>Watch Demo</span>
                        </button>
                    </div>

                    <div className="pt-10">
                        <div className="inline-flex items-center space-x-2 text-gray-500 text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                            </svg>
                            <span>No credit card required • 30,000+ developers assessed</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced How It Works */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">How SkillCheck Works</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">A seamless process from assessment to personalized improvement plan</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Connecting line for desktop */}
                        <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-100 to-purple-100 z-0"></div>

                        {[
                            { step: "1", title: "Choose Skill", desc: "Select what you want to test: JS, React, DSA, etc.", icon: "🎯" },
                            { step: "2", title: "Take Quiz", desc: "Answer 20 AI-generated questions designed to test depth.", icon: "📝" },
                            { step: "3", title: "Get Analysis", desc: "See exactly where you're strong and where you're weak.", icon: "📊" },
                            { step: "4", title: "Follow Roadmap", desc: "Receive a personalized learning plan to level up fast.", icon: "🗺️" }
                        ].map((item, index) => (
                            <div key={index} className="relative z-10">
                                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mb-4 shadow-md">
                                            {item.step}
                                        </div>
                                        <div className="text-3xl mb-4">{item.icon}</div>
                                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                                        <p className="text-gray-600">{item.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Enhanced Features */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">Everything you need to assess and improve your skills effectively</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: "Adaptive Quiz", desc: "Questions adjust based on your answers to detect depth.", icon: "🔄" },
                            { title: "AI Feedback", desc: "Clear breakdown of concepts you're missing with actionable insights.", icon: "🤖" },
                            { title: "Roadmap Generator", desc: "Get a custom-built plan with specific topics and tasks.", icon: "📈" },
                            { title: "Progress Tracking", desc: "Monitor your improvement over time with detailed analytics.", icon: "📊" },
                            { title: "Skill Comparisons", desc: "See how you stack up against peers in your field.", icon: "⚖️" },
                            { title: "Expert Resources", desc: "Curated learning materials from industry experts.", icon: "📚" }
                        ].map((feature, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="flex items-start">
                                    <div className="text-3xl mr-4">{feature.icon}</div>
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-4xl font-bold mb-6">Ready to Uncover Your Skill Gaps?</h2>
                    <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">Join thousands of developers who have accelerated their careers with SkillCheck</p>
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            Start Your Free Assessment
                        </button>
                        <button className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300">
                            Talk to Sales
                        </button>
                    </div>
                </div>
            </section>

            {/* Enhanced Footer */}
            <footer className="border-t border-gray-200 py-12 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-6 md:mb-0">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">SC</span>
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SkillCheck</h1>
                        </div>
                        <div className="flex space-x-6 text-gray-600">
                            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Contact</a>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
                        © {new Date().getFullYear()} SkillCheck. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}