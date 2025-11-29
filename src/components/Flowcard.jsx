import axios from "axios";
import React from "react";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

const Flowcard = ({ flow }) => {
    const navigate = useNavigate();

    const fetchFlow = useCallback(async () => {
        const res = await axios.get(
            `http://localhost:5000/api/app/getflow/${flow}`,
            { withCredentials: true }
        );
        return res.data.flow;
    }, [flow]);
    // depends on flow, because URL changes when flow changes

    const handleQuizButtonClick = useCallback(async () => {
        try {
            const fullFlow = await fetchFlow();
            navigate(`attemptedquiz/${flow._id}`, {
                state: { quizData: fullFlow.quizId }
            });
        } catch (err) {
            console.error("Error fetching quiz:", err);
        }
    }, [fetchFlow, navigate, flow]);
    // uses fetchFlow, navigate, flow so include them all

    const handleAnalysisButtonClick = useCallback(async () => {
        try {
            const fullFlow = await fetchFlow();
            navigate(`/dashboard/analysis/${flow}`, {
                state: {
                    analysisData: fullFlow.analysisId.analysis
                }
            });
        } catch (err) {
            console.error("Error fetching analysis:", err);
        }
    }, [fetchFlow, navigate, flow]);

    return (
        <div className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-3xl px-6 py-6 shadow-md flex justify-between gap-6">

            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {flow?.title || "Untitled Flow"}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {flow?.description || "This flow doesn't have a description yet."}
                </p>
            </div>

            <div className="flex w-1/3 gap-4">
                <button
                    onClick={handleQuizButtonClick}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                    Attempted Quiz
                </button>

                <button
                    onClick={handleAnalysisButtonClick}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
                >
                    View Analysis
                </button>
            </div>

        </div>
    );
};

export default React.memo(Flowcard);
