// FULLY OPTIMIZED QUIZ COMPONENT
// All UI preserved / All logic improved / All re-renders minimized

import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Clock,
  HelpCircle,
  Flag,
  CheckCircle2,
  AlertCircle,
  Send,
  BarChart3
} from "lucide-react";
import axios from "axios";

// ============================================================================
// ⭐ Memoized QuestionCard Component (inline here, but isolated + optimized)
// ============================================================================
const QuestionCard = React.memo(function QuestionCard({
  question,
  index,
  answer,
  flagged,
  innerRef,
  onSelect,
  onToggleFlag,
  showExplanation,
  onToggleExplanation
}) {
  return (
    <div
      ref={innerRef}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 
      hover:border-gray-300 dark:hover:border-gray-600 transition-all p-6"
    >
      {/* Question Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4 flex-1">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 
          rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">{index + 1}</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              {question.question}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">
                {question.category || "General"}
              </span>
              <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                {question.difficulty || "Medium"}
              </span>
              <span>Points: 1</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onToggleFlag(index)}
          className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all
            ${flagged
              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800"
              : "bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 border border-gray-200 dark:border-gray-700"
            }`}
        >
          <Flag className="w-4 h-4" />
        </button>
      </div>

      {/* Options */}
      <div className="grid gap-3 mb-6">
        {Object.entries(question.options).map(([key, value]) => {
          const selected = answer === key;
          return (
            <div
              key={key}
              onClick={() => onSelect(index, key)}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all group
              ${selected
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all
                ${selected
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-300 dark:border-gray-600 group-hover:border-blue-400 text-gray-600 dark:text-gray-400 group-hover:text-blue-400"
                  }`}
              >
                <span className="font-medium text-sm">{key}</span>
              </div>
              <span
                className={`transition-colors
                ${selected
                    ? "text-blue-900 dark:text-blue-100 font-medium"
                    : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                  }`}
              >
                {value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {question.explanation && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <button
            onClick={() => onToggleExplanation(index)}
            className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <HelpCircle className="w-4 h-4" />
            {showExplanation ? "Hide Explanation" : "Show Explanation"}
          </button>

          {showExplanation && (
            <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-300 text-sm">
                {question.explanation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// ============================================================================
// ⭐ MAIN QUIZ COMPONENT (fully optimized)
// ============================================================================
const Quiz = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const raw = location.state?.quizData;

  // sample fallback
  const sampleQuestions = [
    {
      id: 1,
      question: "What is the main purpose of React hooks?",
      options: {
        A: "To handle CSS styling in components",
        B: "To manage state and side effects in functional components",
        C: "To create class components",
        D: "To handle routing in React applications"
      },
      correctAnswer: "B",
      explanation:
        "React hooks allow functional components to use state and lifecycle features.",
      category: "React Fundamentals",
      difficulty: "Medium"
    },
    {
      id: 2,
      question: "Which hook is used to perform side effects?",
      options: {
        A: "useState",
        B: "useEffect",
        C: "useContext",
        D: "useReducer"
      },
      correctAnswer: "B",
      explanation:
        "useEffect lets you perform side effects in functional components.",
      category: "React Hooks",
      difficulty: "Easy"
    }
  ];

  // normalize once
  const normalizedQuestions = useMemo(() => {
    if (Array.isArray(raw)) return raw;
    if (raw?.questionsData) return raw.questionsData;
    return sampleQuestions;
  }, [raw]);

  const [quizData] = useState(() => raw);
  const [questions] = useState(() => normalizedQuestions);
  const [answers, setAnswers] = useState({});
  const questionRefs = useRef([]);

  const [aiAnalysis, setAIAnalysis] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState(() => new Set());

  const TOTAL_TIME = 30 * 60;
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showExplanationMap, setShowExplanationMap] = useState({});

  // memoized values
  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);
  const progress = useMemo(
    () => (questions.length ? (answeredCount / questions.length) * 100 : 0),
    [answeredCount, questions.length]
  );

  // ============================================================================
  // Stable callbacks
  // ============================================================================
  const onSelect = useCallback((index, key) => {
    setAnswers((prev) => {
      if (prev[index] === key) return prev;
      return { ...prev, [index]: key };
    });
  }, []);

  const onToggleFlag = useCallback((index) => {
    setFlaggedQuestions((prev) => {
      const set = new Set(prev);
      set.has(index) ? set.delete(index) : set.add(index);
      return set;
    });
  }, []);

  const toggleExplanation = useCallback((index) => {
    setShowExplanationMap((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  }, []);

  const goToQuestion = useCallback((index) => {
    setCurrentQuestion(index);
    questionRefs.current[index]?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const goToNextQuestion = useCallback(() => {
    setCurrentQuestion((prev) =>
      Math.min(prev + 1, questions.length - 1)
    );
  }, [questions.length]);

  const goToPrevQuestion = useCallback(() => {
    setCurrentQuestion((prev) => Math.max(prev - 1, 0));
  }, []);

  // ============================================================================
  // Submit quiz
  // ============================================================================
  const submitRef = useRef();

  const handleSubmitQuiz = useCallback(async () => {
    if (quizSubmitted) return;
    setIsSubmitting(true);

    try {
      const correct = questions.reduce(
        (acc, q, i) => acc + (answers[i] === q.correctAnswer ? 1 : 0),
        0
      );

      const finalScore = {
        correct,
        total: questions.length,
        percentage: Math.round((correct / questions.length) * 100)
      };

      setScore(finalScore);
      setQuizSubmitted(true);

      const submission = {
        quizId: location.state?.quizId,
        questions,
        answers,
        score: finalScore,
        timeSpent: TOTAL_TIME - timeLeft
      };

      const res = await axios.post(
        "http://localhost:5000/api/app/submitquiz",
        { currentQiuzData: submission },
        { withCredentials: true }
      );

      setAIAnalysis(res.data.analysis);
      setAnalysisId(res.data.analysisId);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  }, [
    answers,
    questions,
    quizSubmitted,
    timeLeft,
    location.state?.quizId
  ]);

  // keep updated ref
  useEffect(() => {
    submitRef.current = handleSubmitQuiz;
  }, [handleSubmitQuiz]);

  // ============================================================================
  // Timer (optimized — one interval only)
  // ============================================================================
  useEffect(() => {
    if (quizSubmitted) return;

    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          submitRef.current?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [quizSubmitted]);

  // format time
  const formatTime = useCallback((s) => {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const x = String(s % 60).padStart(2, "0");
    return `${m}:${x}`;
  }, []);

  // ============================================================================
  // QUIZ SUBMITTED SCREEN (your full UI, unchanged)
  // ============================================================================
  if (quizSubmitted && score) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 
                hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 
                rounded-xl transition-all border border-gray-200 dark:border-gray-700
                hover:border-gray-300 dark:hover:border-gray-600 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Quiz Completed!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                You've completed the skill assessment quiz
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {score.correct}/{score.total}
                </div>
                <div className="text-blue-800 dark:text-blue-300 font-medium">
                  Correct Answers
                </div>
              </div>

              <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {score.percentage}%
                </div>
                <div className="text-purple-800 dark:text-purple-300 font-medium">
                  Score
                </div>
              </div>

              <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {formatTime(TOTAL_TIME - timeLeft)}
                </div>
                <div className="text-green-800 dark:text-green-300 font-medium">
                  Time Spent
                </div>
              </div>
            </div>

            {/* Performance Breakdown */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Performance Breakdown
              </h3>

              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div
                    key={question.id || index}
                    className={`p-4 rounded-xl border-2 ${answers[index] === question.correctAnswer
                        ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20"
                        : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20"
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            Q{index + 1}:
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {question.question}
                          </span>
                        </div>

                        <div className="text-sm">
                          <span className="font-medium">Your answer: </span>
                          <span
                            className={
                              answers[index] === question.correctAnswer
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }
                          >
                            {answers[index]
                              ? question.options[answers[index]]
                              : "Not answered"}
                          </span>
                        </div>

                        <div className="text-sm">
                          <span className="font-medium">Correct answer: </span>
                          <span className="text-green-600 dark:text-green-400">
                            {question.options[question.correctAnswer]}
                          </span>
                        </div>

                        {question.explanation && (
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <button
                              onClick={() => toggleExplanation(index)}
                              className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                            >
                              <HelpCircle className="w-4 h-4" />
                              {showExplanationMap[index]
                                ? "Hide Explanation"
                                : "Show Explanation"}
                            </button>

                            {showExplanationMap[index] && (
                              <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                <p className="text-blue-800 dark:text-blue-300 text-sm">
                                  {question.explanation}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {answers[index] === question.correctAnswer ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 ml-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                disabled={aiAnalysis === null}
                onClick={() =>
                  navigate(`../analysis/${analysisId}`, {
                    state: { analysisData: aiAnalysis }
                  })
                }
                className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                  hover:border-gray-400 dark:hover:border-gray-500 rounded-xl font-medium transition-all
                  flex items-center justify-center gap-2 cursor-pointer"
              >
                {aiAnalysis === null ? (
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Analyze Your Quiz"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // MAIN QUIZ UI
  // ============================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">

      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 
              hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 
              rounded-xl transition-all border border-gray-200 dark:border-gray-700
              hover:border-gray-300 dark:hover:border-gray-600 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 
                rounded-lg border border-yellow-200 dark:border-yellow-800 shadow-sm"
              >
                <Clock className="w-4 h-4" />
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 
                rounded-lg border border-blue-200 dark:border-blue-800 shadow-sm"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="font-medium">{questions.length} Questions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-24">

              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Questions</h3>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Progress</span>
                  <span>
                    {answeredCount}/{questions.length}
                  </span>
                </div>

                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Question Grid */}
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, index) => {
                  const status = answers[index]
                    ? "answered"
                    : flaggedQuestions.has(index)
                      ? "flagged"
                      : "unanswered";

                  return (
                    <button
                      key={index}
                      onClick={() => goToQuestion(index)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all relative
                      ${currentQuestion === index
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-110"
                          : status === "answered"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800"
                            : status === "flagged"
                              ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                        }`}
                    >
                      {index + 1}
                      {status === "flagged" && (
                        <Flag className="w-3 h-3 absolute -top-1 -right-1" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Flagged</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span>Unanswered</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white 
                font-medium rounded-xl hover:from-green-700 hover:to-emerald-700 
                transition-all shadow-lg hover:shadow-xl disabled:opacity-50
                flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Quiz
                  </>
                )}
              </button>
            </div>
          </div>

          {/* MAIN QUESTIONS */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
              <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  {quizData?.title || "Skill Assessment Quiz"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                  {quizData?.description ||
                    "Test your knowledge and track your learning progress."}
                </p>

                {/* Quick Stats */}
                <div className="flex justify-center gap-8 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {answeredCount}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      Answered
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {questions.length}
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      Total
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(progress)}%
                    </div>
                    <div className="text-gray-500 dark:text-gray-400 text-sm">
                      Progress
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions List */}
            {questions.map((q, i) => (
              <QuestionCard
                key={q.id ?? i}
                question={q}
                index={i}
                answer={answers[i]}
                flagged={flaggedQuestions.has(i)}
                onSelect={onSelect}
                onToggleFlag={onToggleFlag}
                innerRef={(el) => (questionRefs.current[i] = el)}
                showExplanation={!!showExplanationMap[i]}
                onToggleExplanation={toggleExplanation}
              />
            ))}

            {/* Navigation Footer */}
            <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Question {currentQuestion + 1} of {questions.length}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={goToPrevQuestion}
                    disabled={currentQuestion === 0}
                    className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                    hover:border-gray-400 dark:hover:border-gray-500 rounded-xl font-medium transition-all
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <button
                    onClick={goToNextQuestion}
                    disabled={currentQuestion === questions.length - 1}
                    className="px-6 py-3 fixed bottom-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
                    font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 
                    transition-all shadow-lg hover:shadow-xl
                    disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Question
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
