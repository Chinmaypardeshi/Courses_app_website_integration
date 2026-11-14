import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Video, FileText, Bot, LogOut, CheckCircle, 
  CheckSquare, User, Flame, Clock, Award, ChevronRight, Sparkles 
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    }
    setUserName(localStorage.getItem('userName') || 'Aspirant');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      
      {/* 1. Premium Dark Sidebar */}
      <div style={{ width: '260px', background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)', color: '#fff', padding: '28px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '4px 0 20px rgba(0,0,0,0.08)' }}>
        <div>
          {/* App Logo & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px', paddingLeft: '8px' }}>
            <div style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
              <Sparkles size={22} color="#fff" />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, letterSpacing: '0.5px', color: '#fff' }}>UPSC PRO</h2>
              <span style={{ fontSize: '11px', color: '#818cf8', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Academy Web</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px', backdropFilter: 'blur(10px)' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#818cf8' }}></div> Dashboard
            </div>

            <div onClick={() => navigate('/courses')} style={{ color: '#94a3b8', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '500', fontSize: '14px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <BookOpen size={18} /> Course Catalog
            </div>

            <div onClick={() => navigate('/live-class')} style={{ color: '#94a3b8', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '500', fontSize: '14px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Video size={18} /> Live Classes
            </div>

            <div onClick={() => navigate('/mock-tests')} style={{ color: '#94a3b8', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '500', fontSize: '14px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckSquare size={18} /> Mock Tests
            </div>

            <div onClick={() => navigate('/mains-practice')} style={{ color: '#94a3b8', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '500', fontSize: '14px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FileText size={18} /> Mains Practice
            </div>

            <div onClick={() => navigate('/ai-assistant')} style={{ color: '#94a3b8', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '500', fontSize: '14px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bot size={18} color="#c084fc" /> AI Assistant
            </div>

            <div onClick={() => navigate('/profile')} style={{ color: '#94a3b8', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '500', fontSize: '14px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <User size={18} /> My Profile
            </div>
          </nav>
        </div>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', transition: 'all 0.2s' }}
        >
          <LogOut size={18} /> Logout Account
        </button>
      </div>

      {/* 2. Main Content Dashboard */}
      <div style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        
        {/* Top Header Card */}
        <div style={{ background: '#fff', padding: '24px 30px', borderRadius: '16px', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.05)', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f1f5f9' }}>
          <div>
            <h1 style={{ fontSize: '26px', margin: 0, fontWeight: '800', color: '#0f172a' }}>Welcome Back, {userName}! 👋</h1>
            <p style={{ color: '#64748b', margin: '6px 0 0 0', fontSize: '14px', fontWeight: '500' }}>Target Examination: <strong style={{ color: '#4338ca' }}>UPSC CSE 2027</strong></p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', color: '#ea580c', padding: '8px 16px', borderRadius: '30px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Flame size={18} color="#ea580c" /> 14 Days Streak
            </div>
            
            <button 
              onClick={() => navigate('/profile')}
              style={{ background: '#4338ca', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '30px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(67,56,202,0.3)' }}
            >
              <User size={16} /> My Account
            </button>
          </div>
        </div>

        {/* 3. Analytics & Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #f1f5f9', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: '#e0e7ff', padding: '12px', borderRadius: '12px', color: '#4338ca' }}>
              <Clock size={24} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Study Hours This Week</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', color: '#0f172a', fontWeight: '800' }}>38.5 Hrs</h3>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #f1f5f9', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '12px', color: '#16a34a' }}>
              <CheckSquare size={24} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Mock Tests Given</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', color: '#0f172a', fontWeight: '800' }}>12 Tests</h3>
            </div>
          </div>

          <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #f1f5f9', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '12px', color: '#d97706' }}>
              <Award size={24} />
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>Mains Answers Written</span>
              <h3 style={{ margin: '4px 0 0 0', fontSize: '22px', color: '#0f172a', fontWeight: '800' }}>24 Answers</h3>
            </div>
          </div>
        </div>

        {/* 4. Study Modules Grid Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#0f172a', fontSize: '20px', fontWeight: '800' }}>Core Study Modules</h2>
          <span style={{ fontSize: '13px', color: '#4338ca', fontWeight: '700', cursor: 'pointer' }}>View All Features</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '22px' }}>
          
          {/* Course Catalog */}
          <div 
            onClick={() => navigate('/courses')} 
            style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'transform 0.2s, boxShadow 0.2s' }}
          >
            <div style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 8px 16px rgba(59,130,246,0.25)' }}>
              <BookOpen color="#fff" size={26} />
            </div>
            <h3 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '17px', fontWeight: '700' }}>Course Catalog</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0', lineHeight: '1.5' }}>GS Paper 1, 2, 3, 4, CSAT & Optional Subjects</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '700', color: '#1d4ed8' }}>
              Explore Courses <ChevronRight size={16} />
            </div>
          </div>

          {/* Live Classes */}
          <div 
            onClick={() => navigate('/live-class')} 
            style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'transform 0.2s, boxShadow 0.2s' }}
          >
            <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 8px 16px rgba(239,68,68,0.25)' }}>
              <Video color="#fff" size={26} />
            </div>
            <h3 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '17px', fontWeight: '700' }}>Live Class Room</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0', lineHeight: '1.5' }}>Interactive Sessions & Doubt Clearing</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '700', color: '#b91c1c' }}>
              Join Classroom <ChevronRight size={16} />
            </div>
          </div>

          {/* Mock Tests */}
          <div 
            onClick={() => navigate('/mock-tests')} 
            style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'transform 0.2s, boxShadow 0.2s' }}
          >
            <div style={{ background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 8px 16px rgba(16,185,129,0.25)' }}>
              <CheckSquare color="#fff" size={26} />
            </div>
            <h3 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '17px', fontWeight: '700' }}>Prelims Mock Series</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0', lineHeight: '1.5' }}>Full Length & Sectional All India Tests</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '700', color: '#047857' }}>
              Attempt Test <ChevronRight size={16} />
            </div>
          </div>

          {/* Mains Practice */}
          <div 
            onClick={() => navigate('/mains-practice')} 
            style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'transform 0.2s, boxShadow 0.2s' }}
          >
            <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #b45309 100%)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 8px 16px rgba(245,158,11,0.25)' }}>
              <FileText color="#fff" size={26} />
            </div>
            <h3 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '17px', fontWeight: '700' }}>Mains Answer Practice</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0', lineHeight: '1.5' }}>Daily Writing Prompts & Faculty Reviews</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '700', color: '#b45309' }}>
              Start Writing <ChevronRight size={16} />
            </div>
          </div>

          {/* AI Assistant */}
          <div 
            onClick={() => navigate('/ai-assistant')} 
            style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', cursor: 'pointer', transition: 'transform 0.2s, boxShadow 0.2s' }}
          >
            <div style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 8px 16px rgba(139,92,246,0.25)' }}>
              <Bot color="#fff" size={26} />
            </div>
            <h3 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '17px', fontWeight: '700' }}>AI UPSC Mentor</h3>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0', lineHeight: '1.5' }}>Instant Doubts Clearing & Model Answers</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '700', color: '#6d28d9' }}>
              Ask AI Now <ChevronRight size={16} />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}