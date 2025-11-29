import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Sparkles, Target, TrendingUp, BookOpen, Clock, Award, Zap, Lightbulb, BarChart3, Rocket, CheckCircle2 } from 'lucide-react'

const Analysis = () => {
    const location = useLocation()
    const navigate = useNavigate()

    // Sample data structure - in real app, this would come from location.state or API
    const analysisData = location.state?.analysisData
    // const { id } = useParams();

    // // Fixed condition logic
    if (!analysisData) {
        return <div className="p-8">No analysis found. Go back to Results.</div>;
    }



    const {
        strengths,
        areasForImprovement,
        studyTips,
        recommendedResources,
        nextSteps
    } = analysisData

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 
                     hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 
                     rounded-xl transition-all border border-gray-200 dark:border-gray-700
                     hover:border-gray-300 dark:hover:border-gray-600 shadow-sm"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>

                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-sm font-medium">AI-Powered Analysis</span>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Stats & Metrics */}
                    <div className="space-y-6">
                        {/* Performance Summary */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Performance Summary</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Strong Areas</span>
                                    <span className="font-bold text-blue-600 dark:text-blue-400">{strengths.length}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Areas to Improve</span>
                                    <span className="font-bold text-orange-600 dark:text-orange-400">{areasForImprovement.length}</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Study Tips</span>
                                    <span className="font-bold text-green-600 dark:text-green-400">{studyTips.length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Study Time Recommendation */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Study Plan</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">30-45 min</div>
                                    <div className="text-sm text-green-700 dark:text-green-300">Daily Practice</div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                    Focus on one improvement area at a time
                                </p>
                            </div>
                        </div>

                        {/* Progress Indicator */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                                    <Award className="w-4 h-4 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Progress</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Current Level</span>
                                    <span className="font-medium text-purple-600 dark:text-purple-400">Developing</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full w-3/4"></div>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">Next Level</span>
                                    <span className="font-medium text-purple-600 dark:text-purple-400">Proficient</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column - Analysis & Recommendations */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Strengths Card */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Zap className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Your Strengths
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Areas where you're performing exceptionally well
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                {strengths.map((strength, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-green-800 dark:text-green-300">{strength}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Areas for Improvement */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Target className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                        Areas for Improvement
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        Focus on these areas to boost your skills
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                {areasForImprovement.map((area, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
                                    >
                                        <div className="w-5 h-5 bg-blue-600 dark:bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-white text-xs font-bold">{index + 1}</span>
                                        </div>
                                        <span className="text-blue-800 dark:text-blue-300">{area}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Study Tips & Resources */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Study Tips */}
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                                        <Lightbulb className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Study Tips
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    {studyTips.map((tip, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                                        >
                                            <span className="text-sm text-purple-800 dark:text-purple-300">{tip}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recommended Resources */}
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                                        <BookOpen className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                        Resources
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    {recommendedResources.map((resource, index) => (
                                        <a
                                            key={index}
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors group"
                                        >
                                            <span className="text-sm text-orange-800 dark:text-orange-300 group-hover:text-orange-900 dark:group-hover:text-orange-200">
                                                {resource.title}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Steps & Action Section */}
                <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Rocket className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Your Learning Path
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Recommended next steps to continue your progress
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {nextSteps.map((step, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800"
                            >
                                <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center shadow-sm border border-indigo-200 dark:border-indigo-700">
                                    <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                                        {index + 1}
                                    </span>
                                </div>
                                <span className="text-indigo-900 dark:text-indigo-300 font-medium">
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                       font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 
                       transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                        >
                            <BookOpen className="w-4 h-4" />
                            Continue Learning
                        </button>
                    </div>
                </div>

                {/* Motivation Quote */}
                <div className="mt-8 text-center">
                    <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        <p className="text-lg font-semibold">
                            "The beautiful thing about learning is that no one can take it away from you."
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                            - B.B. King
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Analysis