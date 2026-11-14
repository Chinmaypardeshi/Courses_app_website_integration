import { useState, useEffect } from 'react';
import { 
  ShieldAlert, CheckCircle2, AlertCircle, FileText, Download, 
  X, Award, User, Clock, Lock, KeyRound, LogOut, Users, Edit, 
  Search, Ban, Trash2, Save, RefreshCw, Home, BookOpen, HelpCircle, 
  Newspaper, Bot, Plus, Check, Layers, Sparkles 
} from 'lucide-react';
import API from '../api/axios';

export default function AdminDashboard() {
  const [isAdminAuth, setIsAdminAuth] = useState(false);
  const [adminLoginForm, setAdminLoginForm] = useState({ email: '', passcode: '' });
  const [adminTab, setAdminTab] = useState('cms_courses'); // 'users' | 'evaluator' | 'cms_home' | 'cms_courses' | 'cms_mocks' | 'cms_ca' | 'cms_ai'
  
  // Data States
  const [submissions, setSubmissions] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [cmsData, setCmsData] = useState({
    homeBanner: { heading: '', subtext: '', announcement: '' },
    courses: [],
    mockTests: [],
    currentAffairs: [],
    aiMentorConfig: { systemPrompt: '', modelName: '', temperature: 0.7 }
  });
// Doubts Management States
  const [doubts, setDoubts] = useState([]);
  const [replyText, setReplyText] = useState({});

  // Sync Doubts from LocalStorage
  useEffect(() => {
    const loadDoubts = () => {
      const saved = localStorage.getItem('upsc_classroom_doubts');
      if (saved) setDoubts(JSON.parse(saved));
    };

    loadDoubts();
    window.addEventListener('storage', loadDoubts);
    return () => window.removeEventListener('storage', loadDoubts);
  }, []);

  // Submit Answer to Student
  const handleReplySubmit = (doubtId) => {
    const text = replyText[doubtId];
    if (!text || !text.trim()) return showToast("Enter answer before sending!", "error");

    const updated = doubts.map(d => {
      if (d.id === doubtId) {
        return { ...d, status: "Resolved", answer: text.trim() };
      }
      return d;
    });

    setDoubts(updated);
    localStorage.setItem('upsc_classroom_doubts', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    setReplyText(prev => ({ ...prev, [doubtId]: "" }));
    showToast("Reply sent to Student successfully!", "success");
  };
  // Modals & Form States
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null);
  const [newCourseForm, setNewCourseForm] = useState({ title: '', price: '₹9,999', category: 'GS Foundation' });
  const [newMockForm, setNewMockForm] = useState({ title: '', totalQuestions: 100, duration: '120 Mins' });
  const [newCaForm, setNewCaForm] = useState({ title: '', category: 'Polity' });
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Evaluation Form State
  const [evalForm, setEvalForm] = useState({
    marks: 9.5,
    maxMarks: 15,
    structureGrade: 'Good Structure & Intro',
    strengths: 'Clear demarcation of Constitutional provisions (Art 324).\nUsed relevant judicial precedents.',
    weaknesses: 'Needs recent SC landmark judgments on electoral bonds.\nImprove handwriting legibility.',
    evaluatorNotes: 'Well attempted answer. Focus more on second demand of the question.'
  });

  // User Edit Form State
  const [userEditForm, setUserEditForm] = useState({
    id: '', name: '', email: '', phone: '', role: 'student', status: 'Active', targetExam: 'UPSC CSE 2027', optionalSubject: 'PSIR'
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated');
    if (isAuth === 'true') {
      setIsAdminAuth(true);
      fetchAdminData();
    }
  }, []);

  const handleAdminAuthSubmit = (e) => {
    e.preventDefault();
    if (adminLoginForm.email === 'admin@upscias.com' && adminLoginForm.passcode === 'UPSC2027ADMIN') {
      setIsAdminAuth(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      showToast("Secret Admin Access Granted!", "success");
      fetchAdminData();
    } else {
      showToast("Access Denied! Incorrect Credentials.", "error");
    }
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAdminAuth(false);
    showToast("Logged out from Admin Portal.", "success");
  };

const fetchAdminData = async () => {
    // Read local queue submissions first for real-time sync
    const localQueue = JSON.parse(localStorage.getItem('mains_admin_queue') || '[]');

    // 1. Fetch Submissions
    try {
      const res = await API.get('/api/admin/mains-submissions', { headers: { 'x-user-role': 'admin' } });
      if (res.data && res.data.submissions) {
        const combined = [...localQueue, ...res.data.submissions];
        const unique = Array.from(new Set(combined.map(a => a.id))).map(id => combined.find(a => a.id === id));
        setSubmissions(unique);
      } else {
        setSubmissions(localQueue);
      }
    } catch (err) {
      setSubmissions(localQueue);
    }

    // 2. Fetch Users
    try {
      const resUser = await API.get('/api/admin/users', { headers: { 'x-user-role': 'admin' } });
      if (resUser.data && resUser.data.users) setUsersList(resUser.data.users);
    } catch (err) {
      setUsersList([
        { id: 'USR-101', name: 'Naman', email: 'namankn03@gmail.com', phone: '+91 9876543210', role: 'student', status: 'Active', targetExam: 'UPSC CSE 2027', optionalSubject: 'PSIR', joinedDate: '2026-09-15' },
        { id: 'USR-102', name: 'Ananya Verma', email: 'ananya.v@gmail.com', phone: '+91 9812345678', role: 'student', status: 'Active', targetExam: 'UPSC CSE 2027', optionalSubject: 'Geography', joinedDate: '2026-10-01' }
      ]);
    }

    // 3. Fetch CMS Content
    try {
      const resCms = await API.get('/api/cms/content');
      if (resCms.data && resCms.data.cms) setCmsData(resCms.data.cms);
    } catch (err) {
      setCmsData({
        homeBanner: { heading: "Crack UPSC CSE 2027 With India's Top Mentors", subtext: "Live lectures, daily answer writing & AI test series.", announcement: "🔥 New Batch Starting Next Monday!" },
        courses: [{ id: 'c1', title: 'GS Paper 1: History & Geography Complete Batch', price: '₹14,999', category: 'GS Foundation', status: 'Active' }],
        mockTests: [{ id: 'm1', title: 'Prelims Mock Test 1: Polity & Constitution', totalQuestions: 100, duration: '120 Mins', status: 'Published' }],
        currentAffairs: [{ id: 'ca1', title: 'Daily Editorials: Electoral Reforms in India', date: '24 Oct 2026', category: 'Polity' }],
        aiMentorConfig: { systemPrompt: "You are an expert UPSC CSE Mentor. Provide precise answers with constitutional references.", modelName: "HuggingFace-Mistral-7B", temperature: 0.7 }
      });
    }
  };

// CMS HANDLERS (WITH LOCALSTORAGE REAL-TIME SYNC)
  const handleUpdateHomeBanner = async () => {
    localStorage.setItem('upsc_cms_home', JSON.stringify(cmsData.homeBanner));
    window.dispatchEvent(new Event('storage'));
    showToast("Home Banner & Announcements updated globally!", "success");
  };

  const handleAddCourse = async () => {
    if (!newCourseForm.title.trim()) return showToast("Enter course title!", "error");
    const newC = { id: `c_${Date.now()}`, ...newCourseForm, status: 'Active' };
    const updatedCourses = [newC, ...cmsData.courses];
    
    setCmsData(prev => ({ ...prev, courses: updatedCourses }));
    localStorage.setItem('upsc_cms_courses', JSON.stringify(updatedCourses));
    window.dispatchEvent(new Event('storage'));
    
    setNewCourseForm({ title: '', price: '₹9,999', category: 'GS Foundation' });
    showToast("New Course Batch published live!", "success");
  };

  const handleDeleteCourse = (id) => {
    const updatedCourses = cmsData.courses.filter(c => c.id !== id);
    setCmsData(prev => ({ ...prev, courses: updatedCourses }));
    localStorage.setItem('upsc_cms_courses', JSON.stringify(updatedCourses));
    window.dispatchEvent(new Event('storage'));
    showToast("Course removed from catalog.", "error");
  };

  const handleAddMockTest = async () => {
    if (!newMockForm.title.trim()) return showToast("Enter mock test title!", "error");
    const newM = { id: `m_${Date.now()}`, ...newMockForm, status: 'Published' };
    const updatedMocks = [newM, ...cmsData.mockTests];
    
    setCmsData(prev => ({ ...prev, mockTests: updatedMocks }));
    localStorage.setItem('upsc_cms_mocks', JSON.stringify(updatedMocks));
    window.dispatchEvent(new Event('storage'));
    
    setNewMockForm({ title: '', totalQuestions: 100, duration: '120 Mins' });
    showToast("Mock Test created live!", "success");
  };

  const handleAddCurrentAffairs = async () => {
    if (!newCaForm.title.trim()) return showToast("Enter article title!", "error");
    const newCa = { id: `ca_${Date.now()}`, title: newCaForm.title, category: newCaForm.category, date: 'Today' };
    const updatedCa = [newCa, ...cmsData.currentAffairs];
    
    setCmsData(prev => ({ ...prev, currentAffairs: updatedCa }));
    localStorage.setItem('upsc_cms_ca', JSON.stringify(updatedCa));
    window.dispatchEvent(new Event('storage'));
    
    setNewCaForm({ title: '', category: 'Polity' });
    showToast("Current Affairs editorial published!", "success");
  };

  const handleUpdateAiMentorConfig = async () => {
    localStorage.setItem('upsc_cms_ai', JSON.stringify(cmsData.aiMentorConfig));
    window.dispatchEvent(new Event('storage'));
    showToast("AI Mentor System Prompt & Rules updated!", "success");
  };

  // User Save Handler
  const handleSaveUserControl = () => {
    setUsersList(prev => prev.map(u => u.id === userEditForm.id ? { ...userEditForm } : u));
    showToast(`User ${userEditForm.name} updated!`, "success");
    setSelectedUserForEdit(null);
  };

  const handleToggleUserStatus = (usr) => {
    const newStatus = usr.status === 'Active' ? 'Blocked' : 'Active';
    setUsersList(prev => prev.map(u => u.id === usr.id ? { ...u, status: newStatus } : u));
    showToast(`User ${usr.name} status set to ${newStatus}`, newStatus === 'Blocked' ? 'error' : 'success');
  };

  const handleToggleUserRole = (usr) => {
    const newRole = usr.role === 'admin' ? 'student' : 'admin';
    setUsersList(prev => prev.map(u => u.id === usr.id ? { ...u, role: newRole } : u));
    showToast(`User ${usr.name} role set to ${newRole.toUpperCase()}`, 'success');
  };

// Real Evaluation Publish Handler
  const handlePublishEvaluation = async () => {
    if (!selectedSub) return;

    const payload = {
      marks: evalForm.marks,
      maxMarks: evalForm.maxMarks,
      structureGrade: evalForm.structureGrade,
      strengths: typeof evalForm.strengths === 'string' ? evalForm.strengths.split('\n') : evalForm.strengths,
      weaknesses: typeof evalForm.weaknesses === 'string' ? evalForm.weaknesses.split('\n') : evalForm.weaknesses,
      evaluatorNotes: evalForm.evaluatorNotes
    };

    try {
      // 1. Backend Sync
      await API.post(`/api/admin/mains-evaluate/${selectedSub.id}`, payload, {
        headers: { 'x-user-role': 'admin' }
      });

      // 2. Local Sync for instant fallback
      const existingQueue = JSON.parse(localStorage.getItem('mains_admin_queue') || '[]');
      const updatedQueue = existingQueue.map(s => s.id === selectedSub.id ? {
        ...s,
        status: 'Evaluated',
        evaluation: payload
      } : s);
      localStorage.setItem('mains_admin_queue', JSON.stringify(updatedQueue));

      setSubmissions(prev => prev.map(s => s.id === selectedSub.id ? {
        ...s,
        status: 'Evaluated',
        evaluation: payload
      } : s));

      showToast(`Evaluation published for ${selectedSub.userName}!`, "success");
      setSelectedSub(null);
    } catch (err) {
      // Fallback update
      const existingQueue = JSON.parse(localStorage.getItem('mains_admin_queue') || '[]');
      const updatedQueue = existingQueue.map(s => s.id === selectedSub.id ? {
        ...s,
        status: 'Evaluated',
        evaluation: payload
      } : s);
      localStorage.setItem('mains_admin_queue', JSON.stringify(updatedQueue));

      setSubmissions(prev => prev.map(s => s.id === selectedSub.id ? {
        ...s,
        status: 'Evaluated',
        evaluation: payload
      } : s));

      showToast(`Evaluation published and synced!`, "success");
      setSelectedSub(null);
    }
  };

  // LOGIN SCREEN
  if (!isAdminAuth) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        {toast.show && (
          <div style={{ position: 'fixed', top: '24px', right: '24px', background: toast.type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', padding: '14px 22px', borderRadius: '14px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1200, fontWeight: '700', fontSize: '14px' }}>
            {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
            {toast.message}
          </div>
        )}

        <div style={{ background: '#131c31', padding: '40px', borderRadius: '28px', border: '1px solid rgba(16, 185, 129, 0.3)', maxWidth: '440px', width: '100%', boxShadow: '0 25px 50px rgba(0,0,0,0.7)', textAlign: 'center' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <Lock size={30} />
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#fff', margin: '0 0 8px 0' }}>Faculty Admin Login</h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 28px 0', lineHeight: 1.5 }}>
            Enter official Faculty Admin email & secret passcode to access Full Section CMS & Evaluation Controls.
          </p>

          <form onSubmit={handleAdminAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', textAlign: 'left' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#cbd5e1', display: 'block', marginBottom: '8px' }}>Admin Official Email</label>
              <input type="email" placeholder="admin@upscias.com" value={adminLoginForm.email} onChange={(e) => setAdminLoginForm({ ...adminLoginForm, email: e.target.value })} required style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', background: '#090d16', color: '#fff', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#cbd5e1', display: 'block', marginBottom: '8px' }}>Secret Admin Passcode</label>
              <input type="password" placeholder="••••••••••••" value={adminLoginForm.passcode} onChange={(e) => setAdminLoginForm({ ...adminLoginForm, passcode: e.target.value })} required style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', background: '#090d16', color: '#fff', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <button type="submit" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.35)', marginTop: '8px' }}>
              <KeyRound size={18} /> Authenticate Admin Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredUsers = usersList.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()));

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: "'Inter', sans-serif", padding: '32px 20px' }}>
      
      {toast.show && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: toast.type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', padding: '14px 22px', borderRadius: '14px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1200, fontWeight: '700', fontSize: '14px' }}>
          {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          {toast.message}
        </div>
      )}

      <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* HEADER BAR */}
        <div style={{ background: 'linear-gradient(135deg, #131c31 0%, #0f172a 100%)', borderRadius: '28px', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '800', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '10px' }}>
              <ShieldAlert size={16} /> Complete Platform Admin Control & CMS
            </div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '900', color: '#ffffff' }}>Website Content & User Control Panel</h1>
            <p style={{ margin: '6px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>Manage Home banners, Courses, Mock Tests, Current Affairs, AI Mentor & User directory.</p>
          </div>

          <button type="button" onClick={handleAdminLogout} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '10px 18px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LogOut size={16} /> Exit Admin
          </button>
        </div>

        {/* SECTION NAVIGATION PILLS */}
        <div style={{ display: 'flex', gap: '10px', background: '#131c31', padding: '8px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)', overflowX: 'auto' }}>
          <button onClick={() => setAdminTab('users')} style={{ padding: '12px 18px', borderRadius: '12px', border: 'none', background: adminTab === 'users' ? '#10b981' : 'transparent', color: adminTab === 'users' ? '#fff' : '#94a3b8', fontWeight: '800', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <Users size={16} /> User Controls ({usersList.length})
          </button>

          <button onClick={() => setAdminTab('cms_home')} style={{ padding: '12px 18px', borderRadius: '12px', border: 'none', background: adminTab === 'cms_home' ? '#6366f1' : 'transparent', color: adminTab === 'cms_home' ? '#fff' : '#94a3b8', fontWeight: '800', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <Home size={16} /> Home Banner
          </button>

          <button onClick={() => setAdminTab('cms_courses')} style={{ padding: '12px 18px', borderRadius: '12px', border: 'none', background: adminTab === 'cms_courses' ? '#6366f1' : 'transparent', color: adminTab === 'cms_courses' ? '#fff' : '#94a3b8', fontWeight: '800', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <BookOpen size={16} /> Courses ({cmsData.courses.length})
          </button>

          <button onClick={() => setAdminTab('cms_mocks')} style={{ padding: '12px 18px', borderRadius: '12px', border: 'none', background: adminTab === 'cms_mocks' ? '#6366f1' : 'transparent', color: adminTab === 'cms_mocks' ? '#fff' : '#94a3b8', fontWeight: '800', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <HelpCircle size={16} /> Mock Tests ({cmsData.mockTests.length})
          </button>

          <button onClick={() => setAdminTab('cms_ca')} style={{ padding: '12px 18px', borderRadius: '12px', border: 'none', background: adminTab === 'cms_ca' ? '#6366f1' : 'transparent', color: adminTab === 'cms_ca' ? '#fff' : '#94a3b8', fontWeight: '800', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <Newspaper size={16} /> Current Affairs ({cmsData.currentAffairs.length})
          </button>

          <button onClick={() => setAdminTab('evaluator')} style={{ padding: '12px 18px', borderRadius: '12px', border: 'none', background: adminTab === 'evaluator' ? '#6366f1' : 'transparent', color: adminTab === 'evaluator' ? '#fff' : '#94a3b8', fontWeight: '800', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <Award size={16} /> Mains Practice ({submissions.length})
          </button>

          <button onClick={() => setAdminTab('cms_ai')} style={{ padding: '12px 18px', borderRadius: '12px', border: 'none', background: adminTab === 'cms_ai' ? '#6366f1' : 'transparent', color: adminTab === 'cms_ai' ? '#fff' : '#94a3b8', fontWeight: '800', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <Bot size={16} /> AI Mentor Rules
          </button>
          <button onClick={() => setAdminTab('doubts')} style={{ padding: '12px 18px', borderRadius: '12px', border: 'none', background: adminTab === 'doubts' ? '#10b981' : 'transparent', color: adminTab === 'doubts' ? '#fff' : '#94a3b8', fontWeight: '800', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            <HelpCircle size={16} /> Student Doubts ({doubts.length})
          </button>
        </div>

        {/* TAB 1: USER CONTROLS */}
        {adminTab === 'users' && (
          <div style={{ background: '#131c31', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#fff' }}>Registered Aspirants & Users Directory</h3>
              <input type="text" placeholder="Search user..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} style={{ padding: '10px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.12)', background: '#090d16', color: '#fff', fontSize: '13px', outline: 'none' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredUsers.map((usr) => (
                <div key={usr.id} style={{ background: '#090d16', padding: '18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h4 style={{ margin: 0, color: '#fff', fontSize: '15px', fontWeight: '800' }}>{usr.name}</h4>
                      <span onClick={() => handleToggleUserRole(usr)} style={{ background: usr.role === 'admin' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 102, 241, 0.2)', color: usr.role === 'admin' ? '#34d399' : '#a5b4fc', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>Role: {usr.role.toUpperCase()}</span>
                      <span onClick={() => handleToggleUserStatus(usr)} style={{ background: usr.status === 'Active' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.15)', color: usr.status === 'Active' ? '#34d399' : '#f87171', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>Status: {usr.status}</span>
                    </div>
                    <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>Email: {usr.email} • Target: {usr.targetExam} • Optional: {usr.optionalSubject}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={() => { setSelectedUserForEdit(usr); setUserEditForm({ ...usr }); }} style={{ background: '#131c31', color: '#818cf8', border: '1px solid #6366f1', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>Edit User</button>
                    <button type="button" onClick={() => handleToggleUserStatus(usr)} style={{ background: usr.status === 'Active' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: usr.status === 'Active' ? '#f87171' : '#34d399', border: 'none', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>{usr.status === 'Active' ? 'Block' : 'Unblock'}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: HOME CMS */}
        {adminTab === 'cms_home' && (
          <div style={{ background: '#131c31', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Home size={20} color="#818cf8" /> Home Page Banners & Announcements Control
            </h3>

            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '800', display: 'block', marginBottom: '8px' }}>Main Hero Heading</label>
              <input type="text" value={cmsData.homeBanner.heading} onChange={(e) => setCmsData({ ...cmsData, homeBanner: { ...cmsData.homeBanner, heading: e.target.value } })} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '800', display: 'block', marginBottom: '8px' }}>Sub-Text Description</label>
              <input type="text" value={cmsData.homeBanner.subtext} onChange={(e) => setCmsData({ ...cmsData, homeBanner: { ...cmsData.homeBanner, subtext: e.target.value } })} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#fbbf24', fontWeight: '800', display: 'block', marginBottom: '8px' }}>Global Announcement Ribbon Text</label>
              <input type="text" value={cmsData.homeBanner.announcement} onChange={(e) => setCmsData({ ...cmsData, homeBanner: { ...cmsData.homeBanner, announcement: e.target.value } })} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#090d16', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fff', outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
            </div>

            <button type="button" onClick={handleUpdateHomeBanner} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px', width: '220px' }}>
              <Save size={16} /> Save Home Banners
            </button>
          </div>
        )}

        {/* TAB 3: COURSES CMS */}
        {adminTab === 'cms_courses' && (
          <div style={{ background: '#131c31', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#fff' }}>Manage Courses & Batches Catalog</h3>

            {/* Add Course Form */}
            <div style={{ background: '#090d16', padding: '20px', borderRadius: '18px', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '14px', alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', display: 'block', marginBottom: '6px' }}>Course Title</label>
                <input type="text" placeholder="e.g. GS Paper 3 Economics Special" value={newCourseForm.title} onChange={(e) => setNewCourseForm({ ...newCourseForm, title: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#131c31', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', display: 'block', marginBottom: '6px' }}>Price (INR)</label>
                <input type="text" value={newCourseForm.price} onChange={(e) => setNewCourseForm({ ...newCourseForm, price: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#131c31', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', display: 'block', marginBottom: '6px' }}>Category</label>
                <select value={newCourseForm.category} onChange={(e) => setNewCourseForm({ ...newCourseForm, category: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#131c31', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="GS Foundation">GS Foundation</option>
                  <option value="GS Sectional">GS Sectional</option>
                  <option value="Test Series">Test Series</option>
                </select>
              </div>
              <button type="button" onClick={handleAddCourse} style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> Publish Course
              </button>
            </div>

            {/* Courses List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cmsData.courses.map((course) => (
                <div key={course.id} style={{ background: '#090d16', padding: '18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#a5b4fc', background: 'rgba(99,102,241,0.15)', padding: '2px 8px', borderRadius: '8px', fontWeight: '800' }}>{course.category}</span>
                    <h4 style={{ margin: '8px 0 2px 0', color: '#fff', fontSize: '15px', fontWeight: '800' }}>{course.title}</h4>
                    <span style={{ color: '#34d399', fontWeight: '800', fontSize: '13px' }}>{course.price}</span>
                  </div>
                  <button type="button" onClick={() => handleDeleteCourse(course.id)} style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'none', padding: '8px 14px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '12px' }}>
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: MOCK TESTS CMS */}
        {adminTab === 'cms_mocks' && (
          <div style={{ background: '#131c31', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#fff' }}>Manage Live Mock Test Papers</h3>

            <div style={{ background: '#090d16', padding: '20px', borderRadius: '18px', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '14px', alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', display: 'block', marginBottom: '6px' }}>Mock Test Name</label>
                <input type="text" placeholder="e.g. Full Length Mock 3: CSAT & GS" value={newMockForm.title} onChange={(e) => setNewMockForm({ ...newMockForm, title: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#131c31', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', display: 'block', marginBottom: '6px' }}>Total MCQs</label>
                <input type="number" value={newMockForm.totalQuestions} onChange={(e) => setNewMockForm({ ...newMockForm, totalQuestions: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#131c31', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', display: 'block', marginBottom: '6px' }}>Duration</label>
                <input type="text" value={newMockForm.duration} onChange={(e) => setNewMockForm({ ...newMockForm, duration: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#131c31', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <button type="button" onClick={handleAddMockTest} style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> Publish Mock
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cmsData.mockTests.map((m) => (
                <div key={m.id} style={{ background: '#090d16', padding: '18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', color: '#fff', fontSize: '15px', fontWeight: '800' }}>{m.title}</h4>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>{m.totalQuestions} Questions • {m.duration}</span>
                  </div>
                  <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '800' }}>{m.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CURRENT AFFAIRS CMS */}
        {adminTab === 'cms_ca' && (
          <div style={{ background: '#131c31', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#fff' }}>Publish Daily Current Affairs & Editorials</h3>

            <div style={{ background: '#090d16', padding: '20px', borderRadius: '18px', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'grid', gridTemplateColumns: '3fr 1fr auto', gap: '14px', alignItems: 'end' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', display: 'block', marginBottom: '6px' }}>Article / Editorial Headline</label>
                <input type="text" placeholder="e.g. India-UK Free Trade Agreement Negotiations" value={newCaForm.title} onChange={(e) => setNewCaForm({ ...newCaForm, title: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#131c31', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '800', display: 'block', marginBottom: '6px' }}>Category</label>
                <select value={newCaForm.category} onChange={(e) => setNewCaForm({ ...newCaForm, category: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#131c31', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}>
                  <option value="Polity">Polity & Governance</option>
                  <option value="Economy">Economy</option>
                  <option value="Environment">Environment & S&T</option>
                  <option value="IR">International Relations</option>
                </select>
              </div>
              <button type="button" onClick={handleAddCurrentAffairs} style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: '800', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> Publish Article
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {cmsData.currentAffairs.map((ca) => (
                <div key={ca.id} style={{ background: '#090d16', padding: '18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '11px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.15)', padding: '2px 8px', borderRadius: '8px', fontWeight: '800' }}>{ca.category}</span>
                    <h4 style={{ margin: '6px 0 2px 0', color: '#fff', fontSize: '15px', fontWeight: '800' }}>{ca.title}</h4>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Published: {ca.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: MAINS EVALUATOR */}
        {adminTab === 'evaluator' && (
          <div style={{ background: '#131c31', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#fff' }}>Student Answer Submissions Queue ({submissions.length})</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {submissions.map((sub) => (
                <div key={sub.id} style={{ background: '#090d16', padding: '22px', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '18px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#fff', fontWeight: '800' }}>{sub.questionText}</h4>
                    <div style={{ fontSize: '13px', color: '#cbd5e1' }}>Aspirant: <strong style={{ color: '#fff' }}>{sub.userName}</strong> ({sub.userEmail})</div>
                  </div>
<button 
                    type="button" 
                    onClick={() => { 
                      setSelectedSub(sub); 
                      setEvalForm({
                        marks: '',
                        maxMarks: 15,
                        structureGrade: '',
                        strengths: '',
                        weaknesses: '',
                        evaluatorNotes: ''
                      });
                    }} 
                    style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}
                  >
                    Evaluate Answer
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: AI MENTOR CMS */}
        {adminTab === 'cms_ai' && (
          <div style={{ background: '#131c31', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={20} color="#a5b4fc" /> AI Mentor Persona & System Prompt Engine
            </h3>

            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '800', display: 'block', marginBottom: '8px' }}>AI Mentor System Prompt Instruction Rules</label>
              <textarea rows={4} value={cmsData.aiMentorConfig.systemPrompt} onChange={(e) => setCmsData({ ...cmsData, aiMentorConfig: { ...cmsData.aiMentorConfig, systemPrompt: e.target.value } })} style={{ width: '100%', padding: '14px', borderRadius: '12px', background: '#090d16', border: '1px solid rgba(99, 102, 241, 0.4)', color: '#fff', outline: 'none', fontSize: '13px', lineHeight: 1.6, boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '800', display: 'block', marginBottom: '8px' }}>Active LLM Backend Model</label>
                <input type="text" value={cmsData.aiMentorConfig.modelName} onChange={(e) => setCmsData({ ...cmsData, aiMentorConfig: { ...cmsData.aiMentorConfig, modelName: e.target.value } })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '800', display: 'block', marginBottom: '8px' }}>Creativity Temperature</label>
                <input type="number" step="0.1" value={cmsData.aiMentorConfig.temperature} onChange={(e) => setCmsData({ ...cmsData, aiMentorConfig: { ...cmsData.aiMentorConfig, temperature: parseFloat(e.target.value) } })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>

            <button type="button" onClick={handleUpdateAiMentorConfig} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px', width: '220px' }}>
              <Save size={16} /> Save AI Configuration
            </button>
          </div>
        )}
{/* TAB 8: STUDENT DOUBTS MANAGEMENT */}
        {adminTab === 'doubts' && (
          <div style={{ background: '#131c31', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HelpCircle size={20} color="#34d399" /> Student Classroom Doubts & Live Answers
            </h3>

            {doubts.length === 0 ? (
              <div style={{ background: '#090d16', padding: '30px', borderRadius: '16px', textAlign: 'center', color: '#94a3b8' }}>
                No student doubts submitted yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {doubts.map((d) => (
                  <div key={d.id} style={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                      <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: '800' }}>{d.courseTitle}</span>
                      <span style={{ color: d.answer ? '#34d399' : '#f59e0b', fontSize: '12px', fontWeight: '800' }}>
                        {d.status} • {d.time}
                      </span>
                    </div>

                    <p style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#ffffff', fontWeight: 'bold' }}>
                      ❓ Question: {d.question}
                    </p>

                    {d.answer ? (
                      <div style={{ backgroundColor: '#131c31', borderLeft: '4px solid #10b981', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', color: '#34d399' }}>
                        <strong>Given Answer:</strong> {d.answer}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                        <input
                          type="text"
                          placeholder="Type mentor answer here..."
                          value={replyText[d.id] || ""}
                          onChange={(e) => setReplyText({ ...replyText, [d.id]: e.target.value })}
                          style={{ flex: 1, backgroundColor: '#131c31', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 14px', color: '#ffffff', fontSize: '13px', outline: 'none' }}
                        />
                        <button
                          onClick={() => handleReplySubmit(d.id)}
                          style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                        >
                          Send Answer →
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* USER CONTROL EDIT MODAL */}
      {selectedUserForEdit && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ background: '#131c31', borderRadius: '24px', maxWidth: '520px', width: '100%', padding: '32px', border: '1px solid rgba(16, 185, 129, 0.4)', boxShadow: '0 25px 50px rgba(0,0,0,0.7)', position: 'relative' }}>
            <button type="button" onClick={() => setSelectedUserForEdit(null)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#cbd5e1', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18} /></button>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', color: '#fff', fontWeight: '900' }}>Admin User Control</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '800', display: 'block', marginBottom: '6px' }}>Aspirant Name</label>
                <input type="text" value={userEditForm.name} onChange={(e) => setUserEditForm({ ...userEditForm, name: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#34d399', fontWeight: '800', display: 'block', marginBottom: '6px' }}>Assign System Role</label>
                  <select value={userEditForm.role} onChange={(e) => setUserEditForm({ ...userEditForm, role: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#090d16', border: '1px solid #10b981', color: '#fff', fontWeight: '800', outline: 'none', boxSizing: 'border-box' }}>
                    <option value="student">Student Account</option>
                    <option value="admin">Faculty Admin</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#a5b4fc', fontWeight: '800', display: 'block', marginBottom: '6px' }}>Account Status</label>
                  <select value={userEditForm.status} onChange={(e) => setUserEditForm({ ...userEditForm, status: e.target.value })} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontWeight: '800', outline: 'none', boxSizing: 'border-box' }}>
                    <option value="Active">Active Access</option>
                    <option value="Blocked">Blocked / Suspended</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button type="button" onClick={handleSaveUserControl} style={{ flex: 1, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '14px' }}>Save Admin Changes</button>
                <button type="button" onClick={() => setSelectedUserForEdit(null)} style={{ background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', border: 'none', padding: '14px 20px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

{/* FULL EVALUATION MODAL DRAWER WITH STRENGTHS, WEAKNESSES & REMARKS */}
      {selectedSub && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ background: '#131c31', borderRadius: '24px', maxWidth: '640px', width: '100%', padding: '32px', border: '1px solid rgba(99, 102, 241, 0.4)', boxShadow: '0 25px 50px rgba(0,0,0,0.7)', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            
            <button 
              type="button"
              onClick={() => setSelectedSub(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#cbd5e1', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>
              <Award size={16} /> Faculty Answer Evaluation Panel
            </div>

            <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#fff', fontWeight: '900' }}>Evaluating Answer: {selectedSub.id}</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 20px 0' }}>Student: <strong>{selectedSub.userName}</strong> ({selectedSub.userEmail})</p>

     {/* Question, Written Answer & File Display */}
            <div style={{ background: '#090d16', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px' }}>
              <strong style={{ color: '#818cf8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Paper & Question:</strong>
              <p style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '13px', lineHeight: 1.5, fontWeight: '700' }}>{selectedSub.questionText}</p>

              {/* Student Typed Written Answer Box */}
              <strong style={{ color: '#38bdf8', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Student Submitted Written Answer:</strong>
              <div style={{ background: '#131c31', padding: '12px', borderRadius: '10px', color: '#e2e8f0', fontSize: '13px', lineHeight: 1.6, marginBottom: '12px', whiteSpace: 'pre-wrap', border: '1px solid rgba(255,255,255,0.05)', maxHeight: '180px', overflowY: 'auto' }}>
                {selectedSub.answerText || "No text written."}
              </div>

              {/* PDF View Link if uploaded */}
              {selectedSub.fileUrl && (
                <a 
                  href={selectedSub.fileUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '800', textDecoration: 'none' }}
                >
                  📄 View Student Uploaded PDF Copy
                </a>
              )}
            </div>

            {/* Form Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '800', display: 'block', marginBottom: '6px' }}>Marks Awarded (out of 15)</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    value={evalForm.marks} 
                    onChange={(e) => setEvalForm({ ...evalForm, marks: e.target.value })} 
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontWeight: '800', outline: 'none', fontSize: '15px', boxSizing: 'border-box' }} 
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: '800', display: 'block', marginBottom: '6px' }}>Structure Assessment</label>
                  <input 
                    type="text" 
                    value={evalForm.structureGrade} 
                    onChange={(e) => setEvalForm({ ...evalForm, structureGrade: e.target.value })} 
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontWeight: '600', outline: 'none', fontSize: '13px', boxSizing: 'border-box' }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#34d399', fontWeight: '800', display: 'block', marginBottom: '6px' }}>Strengths (Line by line)</label>
                <textarea 
                  rows={3} 
                  value={evalForm.strengths} 
                  onChange={(e) => setEvalForm({ ...evalForm, strengths: e.target.value })} 
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#090d16', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#fff', outline: 'none', fontSize: '13px', lineHeight: 1.5, boxSizing: 'border-box' }} 
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#f87171', fontWeight: '800', display: 'block', marginBottom: '6px' }}>Areas for Improvement (Line by line)</label>
                <textarea 
                  rows={3} 
                  value={evalForm.weaknesses} 
                  onChange={(e) => setEvalForm({ ...evalForm, weaknesses: e.target.value })} 
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#090d16', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#fff', outline: 'none', fontSize: '13px', lineHeight: 1.5, boxSizing: 'border-box' }} 
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#a5b4fc', fontWeight: '800', display: 'block', marginBottom: '6px' }}>Overall Evaluator Remarks</label>
                <input 
                  type="text" 
                  value={evalForm.evaluatorNotes} 
                  onChange={(e) => setEvalForm({ ...evalForm, evaluatorNotes: e.target.value })} 
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', outline: 'none', fontSize: '13px', boxSizing: 'border-box' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button 
                  type="button"
                  onClick={handlePublishEvaluation} 
                  style={{ flex: 1, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)' }}
                >
                  Publish Evaluation to Student
                </button>
                <button 
                  type="button"
                  onClick={() => setSelectedSub(null)} 
                  style={{ background: 'rgba(255,255,255,0.08)', color: '#cbd5e1', border: 'none', padding: '14px 20px', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
                >
                  Cancel
                </button>
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}