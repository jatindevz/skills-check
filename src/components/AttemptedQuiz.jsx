// console.log(quizData.questionsData);

import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ChevronLeft, CheckCircle2, XCircle, BookOpen, BarChart3, ArrowLeft } from 'lucide-react'

const AttemptedQuiz = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const raw = location.state?.quizData;
    const quizData = Array.isArray(raw) ? raw : raw?.questionsData ?? null;


    // If no quiz data, show loading or error
    if (!quizData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-lg text-gray-600 mb-4">No quiz data found</div>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    // Calculate score
    const calculateScore = () => {
        return quizData.filter(question => question.userAnswer === question.correctAnswer).length
    }

    const score = calculateScore()
    const totalQuestions = quizData.length

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 
                                 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 
                                 rounded-xl transition-all border border-gray-200 dark:border-gray-700
                                 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Results
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl px-4 py-2 border border-gray-200 dark:border-gray-700">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Questions</div>
                            <div className="font-bold text-gray-900 dark:text-white">{totalQuestions}</div>
                        </div>
                    </div>
                </div>

                {/* Results Summary */}
                <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 mb-8">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <BarChart3 className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Quiz Review
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                            Review your answers and understand the concepts better
                        </p>

                        {/* Score Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                            <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                    {score}/{totalQuestions}
                                </div>
                                <div className="text-blue-800 dark:text-blue-300 font-medium">Correct Answers</div>
                            </div>
                            <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                                    {Math.round((score / totalQuestions) * 100)}%
                                </div>
                                <div className="text-purple-800 dark:text-purple-300 font-medium">Score</div>
                            </div>
                            <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                                    {quizData.filter(q => q.userAnswer).length}
                                </div>
                                <div className="text-green-800 dark:text-green-300 font-medium">Attempted</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Questions Review */}
                <div className="space-y-6">
                    {quizData.map((question, index) => {
                        const isCorrect = question.userAnswer === question.correctAnswer
                        const userAnswerText = question.userAnswer ? question.options[question.userAnswer] : "Not attempted"
                        const correctAnswerText = question.options[question.correctAnswer]

                        return (
                            <div key={question._id || index} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                                {/* Question Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-start gap-4 flex-1">
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 
                                                      rounded-xl flex items-center justify-center shadow-lg">
                                            <span className="text-white font-bold text-sm">
                                                {index + 1}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                                {question.question}
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${isCorrect
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                        : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                                    }`}>
                                                    {isCorrect ? (
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    ) : (
                                                        <XCircle className="w-4 h-4" />
                                                    )}
                                                    {isCorrect ? 'Correct' : 'Incorrect'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* User's Answer */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        Your Answer
                                    </h4>
                                    <div className={`p-4 rounded-xl border-2 ${isCorrect
                                            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                                            : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20'
                                        }`}>
                                        <div className="flex items-center gap-3">
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-medium ${isCorrect
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-red-500 text-white'
                                                }`}>
                                                {question.userAnswer || '—'}
                                            </span>
                                            <span className={`font-medium ${isCorrect
                                                    ? 'text-green-800 dark:text-green-200'
                                                    : 'text-red-800 dark:text-red-200'
                                                }`}>
                                                {userAnswerText}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Correct Answer (only show if user was wrong) */}
                                {!isCorrect && question.userAnswer && (
                                    <div className="mb-6">
                                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            Correct Answer
                                        </h4>
                                        <div className="p-4 rounded-xl border-2 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
                                            <div className="flex items-center gap-3">
                                                <span className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center font-medium">
                                                    {question.correctAnswer}
                                                </span>
                                                <span className="font-medium text-green-800 dark:text-green-200">
                                                    {correctAnswerText}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Explanation */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-4">
                                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                                        <BookOpen className="w-4 h-4" />
                                        Explanation
                                    </h4>
                                    <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
                                        {question.explanation}
                                    </p>
                                </div>

                                {/* Options Summary (for context) */}
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                                        All Options
                                    </h5>
                                    <div className="grid gap-2">
                                        {Object.entries(question.options).map(([key, value]) => (
                                            <div key={key} className="flex items-center gap-3 text-sm">
                                                <span className={`w-6 h-6 rounded text-xs flex items-center justify-center font-medium ${key === question.correctAnswer
                                                        ? 'bg-green-500 text-white'
                                                        : key === question.userAnswer && !isCorrect
                                                            ? 'bg-red-500 text-white'
                                                            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                                    }`}>
                                                    {key}
                                                </span>
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-8 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 
                                 transition-colors font-medium shadow-lg hover:shadow-xl"
                    >
                        Back to Results
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                                 hover:border-gray-400 dark:hover:border-gray-500 rounded-xl font-medium transition-all"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AttemptedQuiz