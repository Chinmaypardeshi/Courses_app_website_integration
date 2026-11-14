import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CourseCatalog from './pages/CourseCatalog';
import CourseDetail from './pages/CourseDetail';
import MockTests from './pages/MockTests';
import CurrentAffairs from './pages/CurrentAffairs';
import MainsPractice from './pages/MainsPractice';
import AIAssistant from './pages/AIAssistant';
import StudyMaterial from './pages/StudyMaterial';
import PYQs from './pages/PYQs';
import StudyPlanner from './pages/StudyPlanner';
import Performance from './pages/Performance';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Classroom from './pages/Classroom';
// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Router>
      {/* 
        FIX: w-full, text-left, min-h-screen layout applied to root wrapper 
        so global CSS center rules do not crush child page layouts
      */}
      <div className="min-h-screen bg-[#070b14] text-slate-100 w-full text-left flex flex-col">
        <Navbar />
        
        {/* Main Wrapper with full width and left alignment */}
        <main className="w-full flex-1 text-left bg-[#070b14]">
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><CourseCatalog /></ProtectedRoute>} />
            <Route path="/courses/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
            <Route path="/mock-tests" element={<ProtectedRoute><MockTests /></ProtectedRoute>} />
            <Route path="/current-affairs" element={<ProtectedRoute><CurrentAffairs /></ProtectedRoute>} />
            <Route path="/mains-practice" element={<ProtectedRoute><MainsPractice /></ProtectedRoute>} />
         <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
<Route path="/ai-mentor" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
            <Route path="/study-material" element={<ProtectedRoute><StudyMaterial /></ProtectedRoute>} />
            <Route path="/pyqs" element={<ProtectedRoute><PYQs /></ProtectedRoute>} />
            <Route path="/planner" element={<ProtectedRoute><StudyPlanner /></ProtectedRoute>} />
            <Route path="/performance" element={<ProtectedRoute><Performance /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
<Route path="/classroom" element={<Classroom />} />
<Route path="/classroom/:courseId" element={<Classroom />} />
            {/* Fallback Catch-all Route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}