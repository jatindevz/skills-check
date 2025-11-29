import axios from 'axios'
import { Plus, Sparkles, X } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Flowcard from './Flowcard'

const SkillInputBox = ({ isOpen, onClose, onSkillSubmit }) => {
    const [skillInput, setSkillInput] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!skillInput.trim()) return

        setIsSubmitting(true)
        try {
            await onSkillSubmit(skillInput)
            setSkillInput('')
            onClose()
        } catch (error) {
            console.error('Error submitting skill:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl">
            <div className="fixed inset-0" onClick={onClose}></div>
            <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full mx-auto border border-white/20 dark:border-gray-700/50">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Add a New Skill
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Enter the skill you want to learn and get personalized flow suggestions.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-full transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Describe your learning goals
                            </label>
                            <textarea
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                placeholder="Example: I'm a beginner in JavaScript and I'm learning JavaScript. The basics are done, and I understand things like functions—around 70% of JS is clear to me. But I still feel like something is missing. I don't know much about closures, promises or other hidden functions and methods."
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                         transition-all resize-none
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         placeholder-gray-500 dark:placeholder-gray-400"
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                            <p className="text-sm text-blue-800 dark:text-blue-300">
                                💡 <strong>Pro tip:</strong> Be specific about your current level and what you want to learn next.
                                The more details you provide, the better personalized learning flow we can create for you.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="px-6 py-2.5 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 
                         hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl font-medium transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!skillInput.trim() || isSubmitting}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                         font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 
                         transition-all shadow-lg hover:shadow-xl
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating Flow...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4" />
                                        Create Learning Flow
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

const Dashsection = ({ user, flow }) => {
    const [isSkillBoxOpen, setIsSkillBoxOpen] = useState(false)
    const [quizData, setQuizData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleSkillSubmit = useCallback(async (skillDescription) => {
        setIsLoading(true)
        try {
            const response = await axios.post(
                'http://localhost:5000/api/app/getquiz',
                { userRes: skillDescription },
                { withCredentials: true }
            )

            setQuizData(response.data.data)

            navigate(`quiz/${response.data.quizId}`, {
                state: {
                    quizData: response.data.data,
                    quizId: response.data.quizId
                }
            })
        } catch (error) {
            console.error('Error creating quiz:', error)
            alert('Failed to create quiz. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }, [navigate]) 

    const handleOpenSkillBox = useCallback(() => {
        setIsSkillBoxOpen(true)
    }, [])

    const handleCloseSkillBox = useCallback(() => {
        setIsSkillBoxOpen(false)
    }, [])


    return (
        <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-gray-900 mb-3">
                                Welcome back, {user?.username || user?.email || 'Learner'}! 👋
                            </h1>
                            <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                                Continue your learning journey. You've made great progress with{" "}
                                <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    0
                                </span>{" "}
                                flows so far. Ready to learn something new?
                            </p>
                        </div>

                        <button
                            onClick={handleOpenSkillBox}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                       text-white font-semibold px-8 h-12 flex items-center gap-3 shadow-lg hover:shadow-xl 
                       transition-all rounded-xl hover:-translate-y-0.5 active:translate-y-0
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            <Plus className="w-5 h-5" />
                            {isLoading ? 'Creating...' : 'New Flow'}
                        </button>
                    </div>
                    <hr className="border-gray-300/50" />
                </div>

                {/* Learning Flows Section */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            Your Learning Flows
                        </h2>
                    </div>

                    {flow && flow.length > 0 ? (
                        // When flows exist
                        <div className="space-y-8">
                            {flow.map((flowItem, index) => (
                                <Flowcard key={flowItem} flow={flowItem} />
                            ))}
                        </div>
                    ) : (
                        // When no flows exist
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-300 p-12 text-center">
                            <div className="max-w-md mx-auto">
                                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Sparkles className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    No learning flows yet
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    Create your first learning flow to get personalized guidance and track your progress.
                                </p>
                                <button
                                        onClick={handleOpenSkillBox}
                                    disabled={isLoading}
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                    text-white font-semibold px-8 h-12 flex items-center gap-3 shadow-lg hover:shadow-xl 
                    transition-all rounded-xl hover:-translate-y-0.5 mx-auto
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    <Plus className="w-5 h-5" />
                                    {isLoading ? 'Creating...' : 'Create Your First Flow'}
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Skill Input Modal */}
            <SkillInputBox
                isOpen={isSkillBoxOpen}
                onClose={handleCloseSkillBox}
                onSkillSubmit={handleSkillSubmit}
            />

        </div>
    )
}

export default Dashsection