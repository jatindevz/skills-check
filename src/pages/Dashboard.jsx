import api from "../services/api";
import { BookOpen, LogOut, User } from 'lucide-react'
import React, { Suspense, lazy, useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import FullPageLoader from '../components/Loader'
const Dashsection = lazy(() => import('../components/Dashsection'));
const Quiz = lazy(() => import('../components/Quiz'));
const Analysis = lazy(() => import('../components/Analysis'));
const AttemptedQuiz = lazy(() => import('../components/AttemptedQuiz'));
const NotFound = lazy(() => import('../NotFound'));


const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [flow, setFlow] = useState(null)

  useEffect(() => {
    document.title = "Dashboard - SkillFlow";


    (async () => {
      try {
        const res = await api.get("/api/auth/me");

        if (res.data?.success && res.data.user) {
          setUser(res.data.user);
          setFlow(res.data.user.flow || null);
        } else {
          navigate("/auth");
        }
      } catch (err) {
        if (err.name === "CanceledError") return;
        console.error(err);
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    })();

  }, [navigate]);


  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, {
        withCredentials: true
      })
      navigate('/auth')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="border-b border-white/50 bg-white/70 backdrop-blur-xl sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Left Section */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-md">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SkillFlow
                </h1>
                <p className="text-xs text-gray-500">Learning Dashboard</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-700 bg-white/80 border border-gray-200 px-4 py-2 rounded-xl shadow-sm">
                <User className="w-4 h-4 text-blue-600" />
                <span>{user?.username || user?.email || 'User'}</span>
              </div>

              <button
                onClick={handleLogout}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-300
                         bg-white text-gray-700 hover:bg-gray-100 hover:border-gray-400 
                         transition-all shadow-sm hover:shadow-md"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Routes */}
      <Suspense fallback={<FullPageLoader />}>
      <Routes>
        <Route path="/" element={<Dashsection user={user} flow={flow} />} />
        <Route path="quiz/:id" element={<Quiz />} />
        <Route path="attemptedquiz/:id" element={<AttemptedQuiz />} />
          <Route path="analysis/:id" element={<Analysis />} />
          
          <Route path="*" element={<NotFound />} />

      </Routes>
      </Suspense>

    </div>
  )
}

export default Dashboard