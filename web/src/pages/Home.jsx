import { API_BASE_URL } from '../api/config';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, Tv, Award, HelpCircle, Newspaper, Bot, 
  ArrowRight, Flame, Sparkles, 
  PlayCircle, Zap, Search, Bell, Target, Lightbulb, CheckCircle2, ShieldCheck, Users, Star, X, Check,
  Clock, Plus, Trash2
} from 'lucide-react';

// ============================================================================
// 📌 SEARCH ENGINE DATABASE (FOR LIVE SEARCH SUGGESTIONS)
// ============================================================================
const SEARCH_INDEX = [
  { type: 'Course', title: 'GS Paper 2: Indian Polity, Governance & IR', link: '/courses', category: 'courses', tag: 'UPSC CSE' },
  { type: 'Course', title: 'GS Paper 1: History, Art & Geography Masterclass', link: '/courses', category: 'courses', tag: 'UPSC CSE' },
  { type: 'Course', title: 'UPSC CSE 2027 Complete Foundation Batch', link: '/courses', category: 'courses', tag: 'UPSC CSE' },
  { type: 'Course', title: 'SSC CGL Quant Aptitude & Reasoning Mastery', link: '/courses', category: 'courses', tag: 'SSC CGL' },
  { type: 'Test', title: 'UPSC CSE Prelims GS Paper 1 Full Mock 2027', link: '/mock-tests', category: 'tests', tag: 'Mock Test' },
  { type: 'Test', title: 'SSC CGL Tier 1 Speed Practice Test', link: '/mock-tests', category: 'tests', tag: 'Mock Test' },
  { type: 'Test', title: 'Indian Polity & Constitution Sectional Test', link: '/mock-tests', category: 'tests', tag: 'Sectional' },
  { type: 'News', title: 'India-Middle East-Europe Economic Corridor (IMEC)', link: '/current-affairs', category: 'news', tag: 'Current Affairs' },
  { type: 'News', title: 'Electoral Reforms & Simultaneous Elections Analysis', link: '/current-affairs', category: 'news', tag: 'Editorial' }
];
// ============================================================================
// 📌 REAL-TIME SMART STUDY REMINDER WIDGET (INSTANT SCREEN SYNC FIX)
// ============================================================================
function StudyReminderWidget() {
  const [reminders, setReminders] = useState([]);
  const [topic, setTopic] = useState('');
  const [paper, setPaper] = useState('GS Paper 2: Polity/IR');
  const [reminderTime, setReminderTime] = useState('');
  const [activeAlert, setActiveAlert] = useState(null);

  // 1. Initial Mount: Backend + Local Cache Fetch
  useEffect(() => {
    fetchReminders();
    requestNotificationPermission();

    const interval = setInterval(() => {
      checkTimeAndNotify();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const requestNotificationPermission = () => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  };

  const fetchReminders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/reminders`);
      const data = await res.json();
      if (data.success && Array.isArray(data.reminders)) {
        setReminders(data.reminders);
        localStorage.setItem('upsc_reminders', JSON.stringify(data.reminders));
      }
    } catch (err) {
      console.warn("Backend fetch fallback to cache:", err);
      const cached = localStorage.getItem('upsc_reminders');
      if (cached) setReminders(JSON.parse(cached));
    }
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    if (!topic || !reminderTime) return;

    const newObj = {
      id: `rem_${Date.now()}`,
      topic,
      paper,
      time: reminderTime,
      status: 'Pending'
    };

    // ⚡ Instant Screen Update
    const updatedList = [newObj, ...reminders];
    setReminders(updatedList);
    localStorage.setItem('upsc_reminders', JSON.stringify(updatedList));

    setTopic('');
    setReminderTime('');

    // Sync with Backend API
    try {
      await fetch(`${API_BASE_URL}/api/v1/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, paper, time: reminderTime })
      });
    } catch (err) {
      console.error("Backend save error:", err);
    }
  };

  const handleDelete = async (id) => {
    const updatedList = reminders.filter(r => r.id !== id);
    setReminders(updatedList);
    localStorage.setItem('upsc_reminders', JSON.stringify(updatedList));

    try {
      await fetch(`${API_BASE_URL}/api/v1/reminders/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error("Delete reminder error:", err);
    }
  };

  const checkTimeAndNotify = () => {
    const now = new Date();
    const currentHHMM = now.toTimeString().substring(0, 5);

    setReminders(prevReminders => {
      let triggerAlert = null;
      const updated = prevReminders.map(item => {
        if (item.time === currentHHMM && item.status !== 'Notified') {
          triggerAlert = item;
          return { ...item, status: 'Notified' };
        }
        return item;
      });

      if (triggerAlert) {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("📚 Study Time Reminder!", {
            body: `It's time to study: ${triggerAlert.topic} (${triggerAlert.paper})`,
            icon: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          });
        }
        setActiveAlert(triggerAlert);
      }

      return updated;
    });
  };

  return (
    <div style={{
      backgroundColor: '#0f172a',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      borderRadius: '20px',
      padding: '28px',
      marginBottom: '32px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
      fontFamily: "'Inter', sans-serif",
      textAlign: 'left'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #1e293b', paddingBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#ffffff', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell color="#818cf8" size={24} /> Real-Time Study Reminder & Schedule
          </h2>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8' }}>
            Set your target study topics and get real-time alerts when it's time to study.
          </p>
        </div>

        <button 
          onClick={requestNotificationPermission}
          style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          🔔 Enable Browser Notifications
        </button>
      </div>

      <form onSubmit={handleAddReminder} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        <input 
          type="text" 
          placeholder="What do you need to study? (e.g. Laxmikanth Chapter 3, SSC Math PYQ)..." 
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          style={{ backgroundColor: '#070b14', border: '1px solid #334155', color: '#fff', borderRadius: '12px', padding: '12px 16px', outline: 'none', fontSize: '13px' }}
        />

        <select 
          value={paper} 
          onChange={(e) => setPaper(e.target.value)}
          style={{ backgroundColor: '#070b14', border: '1px solid #334155', color: '#fff', borderRadius: '12px', padding: '12px 16px', outline: 'none', fontSize: '13px' }}
        >
          <option value="GS Paper 1: History/Geo">GS Paper 1: History & Geo</option>
          <option value="GS Paper 2: Polity/IR">GS Paper 2: Polity & IR</option>
          <option value="GS Paper 3: Economy/Env">GS Paper 3: Economy & Env</option>
          <option value="SSC CGL: Quant & Reasoning">SSC CGL: Quant & Reasoning</option>
          <option value="Current Affairs & PIB">Current Affairs & PIB</option>
        </select>

        <input 
          type="time" 
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          required
          style={{ backgroundColor: '#070b14', border: '1px solid #334155', color: '#fff', borderRadius: '12px', padding: '12px 16px', outline: 'none', fontSize: '13px' }}
        />

        <button 
          type="submit"
          style={{ backgroundColor: '#4f46e5', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 20px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' }}
        >
          <Plus size={16} /> Set Reminder
        </button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {reminders.length === 0 ? (
          <div style={{ color: '#64748b', fontSize: '13px', padding: '20px', textAlign: 'center', gridColumn: '1/-1' }}>
            No study reminders active. Add a topic above to set your study schedule!
          </div>
        ) : (
          reminders.map((item) => (
            <div key={item.id} style={{ backgroundColor: '#070b14', border: '1px solid #1e293b', borderRadius: '14px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#fbbf24', backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>
                  {item.paper}
                </span>
                <h4 style={{ color: '#ffffff', margin: '8px 0 4px 0', fontSize: '14px', fontWeight: 'bold' }}>
                  {item.topic}
                </h4>
                <div style={{ fontSize: '12px', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600' }}>
                  <Clock size={13} /> {item.time}
                </div>
              </div>

              <button 
                onClick={() => handleDelete(item.id)}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '8px' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {activeAlert && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#0f172a', border: '2px solid #6366f1', borderRadius: '24px', padding: '32px', maxWidth: '450px', width: '100%', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.9)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.2)', border: '1px solid #6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#818cf8' }}>
              <Bell size={30} />
            </div>
            
            <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
              ⏰ TIME TO STUDY NOW!
            </span>
            <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 'bold', margin: '8px 0 12px 0' }}>
              {activeAlert.topic}
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '0 0 24px 0' }}>
              Subject: <strong>{activeAlert.paper}</strong>
            </p>

            <button 
              onClick={() => setActiveAlert(null)}
              style={{ width: '100%', backgroundColor: '#4f46e5', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}
            >
              Start Study Session Now 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
// ============================================================================
// 📌 EXHAUSTIVE REAL-TIME SEARCH DATABASE (UPSC CSE 2027 & SSC CGL)
// ============================================================================
export default function Home() {
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  // 📌 Smart Real-Time Profile Avatar Sync (Checks both user_avatar & user object)
  const getSavedAvatar = () => {
    const directAvatar = localStorage.getItem('user_avatar');
    if (directAvatar) return directAvatar;

    try {
      const userObj = JSON.parse(localStorage.getItem('user'));
      if (userObj && userObj.photoURL) return userObj.photoURL;
    } catch (e) {}

    // Fallback Default Avatar
    return "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";
  };

  const [userAvatar, setUserAvatar] = useState(getSavedAvatar);

  useEffect(() => {
    const syncAvatar = () => {
      setUserAvatar(getSavedAvatar());
    };

    syncAvatar(); // Initial Sync on Mount
    window.addEventListener('storage', syncAvatar);
    return () => window.removeEventListener('storage', syncAvatar);
  }, []);

  // 📌 Live Dynamic Batches Ads Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroAds = [
    {
      id: 1,
      badge: "🔥 UPSC CSE 2027 BATCH LIVE",
      heading: "India's #1 AI-Powered Foundation Batch 2027",
      subtext: "Personalized AI mentorship, daily live lectures, answer evaluation, and real-time mocks.",
      tag: "UPSC CSE 2027",
      rating: "4.9/5 Rating (50k+ Aspirants)",
      bgImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&auto=format&fit=crop&q=80",
      ctaText: "Enroll In GS Batch",
      ctaLink: "/courses"
    },
    {
      id: 2,
      badge: "⚡ SSC CGL TIER 1 + TIER 2 SPECIAL",
      heading: "SSC CGL 2027 Quant & Reasoning Super Mastery",
      subtext: "Complete 2020-2026 PYQ Solutions, speed calculation tricks & Testbook pattern mocks.",
      tag: "SSC CGL 2027",
      rating: "4.8/5 Rating (35k+ Aspirants)",
      bgImage: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1600&auto=format&fit=crop&q=80",
      ctaText: "Start CGL Mocks",
      ctaLink: "/mock-tests"
    },
    {
      id: 3,
      badge: "✍️ MAINS ANSWER EVALUATION HUB",
      heading: "Daily GS Mains Practice & AI-Powered Copy Marking",
      subtext: "Submit handwritten PDF answers daily and receive detailed structural feedback & marks.",
      tag: "UPSC Mains",
      rating: "5.0/5 Star Evaluation",
      bgImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1600&auto=format&fit=crop&q=80",
      ctaText: "Submit Mains Copy",
      ctaLink: "/mains-practice"
    }
  ];

  // 🔄 Automatic Slide Interval (5 Seconds Auto-Play)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroAds.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroAds.length]);
  // Search Engine & Live Suggestions State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all'); // 'all' | 'courses' | 'tests' | 'news'
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Persistent Alerts State (Syncs with LocalStorage)
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('upsc_alerts_db');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: "🔴 GS Paper 2 Live Stream Started",
        desc: "Dr. Vikas has initiated the lecture on Article 21 Judiciary Interpretation.",
        time: "2 mins ago",
        image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=300&auto=format&fit=crop&q=80",
        link: "/classroom/course_gs2",
        unread: true
      },
      {
        id: 2,
        title: "🎯 SSC CGL Tier 1 Full Mock Released",
        desc: "New Testbook pattern mock test for Quant & Reasoning is now active.",
        time: "15 mins ago",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&auto=format&fit=crop&q=80",
        link: "/mock-tests",
        unread: true
      },
      {
        id: 3,
        title: "✍️ Mains Answer Copy Evaluated",
        desc: "Your GS Paper 3 Economics copy has been graded (11.5 / 15 Marks).",
        time: "1 hour ago",
        image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&auto=format&fit=crop&q=80",
        link: "/mains-practice",
        unread: true
      },
      {
        id: 4,
        title: "📰 PIB Daily Editorial Briefing Added",
        desc: "New statutory scheme analysis updated in Current Affairs tab.",
        time: "3 hours ago",
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=300&auto=format&fit=crop&q=80",
        link: "/current-affairs?source=pib",
        unread: false
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('upsc_alerts_db', JSON.stringify(notifications));
  }, [notifications]);

  const [cmsHome, setCmsHome] = useState({
    heading: "India's #1 AI-Powered Platform for UPSC CSE 2027 & SSC CGL",
    subtext: "Personalized AI mentorship, live daily lectures, instant answer evaluation, and real-time exam mocks.",
    announcement: "🔥 New UPSC CSE 2027 & SSC CGL Foundation Batch Live | Admissions Closing Soon!"
  });

  useEffect(() => {
    const savedCms = localStorage.getItem('upsc_cms_home');
    if (savedCms) {
      try { setCmsHome(JSON.parse(savedCms)); } catch (e) {}
    }

    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = SEARCH_INDEX.filter((item) => {
    const matchesFilter = searchFilter === 'all' || item.category === searchFilter;
    const matchesQuery = !searchQuery.trim() || 
                         item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         item.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSearchDropdown(false);
    const q = encodeURIComponent(searchQuery.trim());
    if (searchFilter === 'courses') navigate(`/courses?search=${q}`);
    else if (searchFilter === 'tests') navigate(`/mock-tests?search=${q}`);
    else if (searchFilter === 'news') navigate(`/current-affairs?search=${q}`);
    else navigate(`/courses?search=${q}`);
  };

  const handleNotificationClick = (notif) => {
    setNotifications(notifications.map(n => n.id === notif.id ? { ...n, unread: false } : n));
    setShowNotifications(false);
    navigate(notif.link);
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleDeleteNotification = (e, id) => {
    e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div style={{ backgroundColor: '#070b14', color: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif", position: 'relative' }}>
      
      {/* GLOBAL ANNOUNCEMENT BANNER */}
      {cmsHome.announcement && (
        <div style={{ background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 100%)', color: '#ffffff', padding: '10px 20px', fontSize: '13px', fontWeight: 'bold', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)' }}>
          <Flame size={16} color="#fbbf24" />
          <span>{cmsHome.announcement}</span>
          <button 
            onClick={() => navigate('/courses')}
            style={{ backgroundColor: '#ffffff', color: '#4f46e5', border: 'none', padding: '4px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: '900', cursor: 'pointer', marginLeft: '10px' }}
          >
            ENROLL NOW →
          </button>
        </div>
      )}

{/* TOP FLOATING REAL-TIME SEARCH BAR & ALERTS (FULL WIDTH BALANCED LAYOUT) */}
      <div style={{ 
        maxWidth: '1280px', 
        width: '100%', 
        margin: '0 auto', 
        padding: '24px 24px 0 24px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        gap: '20px', 
        boxSizing: 'border-box' 
      }}>
        
        {/* Full Width Flexible Search Engine Bar */}
        <div ref={searchContainerRef} style={{ position: 'relative', flex: 1, maxWidth: '850px' }}>
          <form onSubmit={handleSearchSubmit} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            backgroundColor: '#0f172a', 
            border: '1px solid #334155', 
            borderRadius: '16px', 
            padding: '6px 12px 6px 18px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <Search size={20} color="#64748b" style={{ marginRight: '12px', flexShrink: 0 }} />
            
            <input 
              type="text" 
              placeholder="Search Courses, SSC CGL Mocks, Polity, PIB News..." 
              value={searchQuery}
              onFocus={() => setShowSearchDropdown(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              style={{ 
                backgroundColor: 'transparent', 
                border: 'none', 
                color: '#ffffff', 
                fontSize: '14px', 
                width: '100%', 
                outline: 'none' 
              }}
            />

            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ backgroundColor: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px 8px' }}
              >
                <X size={16} />
              </button>
            )}

            <select 
              value={searchFilter} 
              onChange={(e) => {
                setSearchFilter(e.target.value);
                setShowSearchDropdown(true);
              }}
              style={{ 
                backgroundColor: '#1e293b', 
                color: '#cbd5e1', 
                border: '1px solid #334155', 
                borderRadius: '10px', 
                padding: '8px 12px', 
                fontSize: '12px', 
                fontWeight: 'bold', 
                outline: 'none', 
                cursor: 'pointer', 
                marginRight: '10px',
                flexShrink: 0
              }}
            >
              <option value="all">All Categories</option>
              <option value="courses">Courses</option>
              <option value="tests">Mock Tests</option>
              <option value="news">News / PIB</option>
            </select>

            <button type="submit" style={{ 
              backgroundColor: '#4f46e5', 
              color: '#ffffff', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '12px', 
              fontSize: '13px', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              flexShrink: 0 
            }}>
              Search
            </button>
          </form>

          {/* Floating Search Dropdown */}
          {showSearchDropdown && (
            <div style={{
              position: 'absolute',
              top: '58px',
              left: 0,
              right: 0,
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '16px',
              padding: '14px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.85)',
              zIndex: 99999,
              maxHeight: '360px',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px 8px 8px', borderBottom: '1px solid #1e293b', fontSize: '11px', color: '#94a3b8', fontWeight: 'bold' }}>
                <span>SUGGESTIONS ({searchResults.length})</span>
                <span style={{ textTransform: 'uppercase', color: '#818cf8' }}>Filter: {searchFilter}</span>
              </div>

              {searchResults.length > 0 ? (
                searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                      navigate(item.link);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background 0.2s',
                      marginTop: '6px',
                      backgroundColor: '#070b14',
                      border: '1px solid #1e293b'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#070b14'}
                  >
                    <div>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffffff', display: 'block' }}>
                        {item.title}
                      </span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Category: {item.type}</span>
                    </div>
                    <span style={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '3px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' }}>
                      {item.tag}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                  No matching items found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
{/* Right-Aligned Alerts & User Profile Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          
          {/* Alerts Drawer Wrapper */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                backgroundColor: showNotifications ? '#1e293b' : '#0f172a',
                border: `1px solid ${unreadCount > 0 ? '#6366f1' : '#334155'}`,
                borderRadius: '14px',
                padding: '10px 18px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <Bell size={18} color={unreadCount > 0 ? "#38bdf8" : "#94a3b8"} />
              <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Alerts</span>
              {unreadCount > 0 && (
                <span style={{
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '10px',
                  fontWeight: '900',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  position: 'absolute',
                  top: '-6px',
                  right: '-6px'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Popover */}
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '56px',
                right: '0',
                width: '380px',
                backgroundColor: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '18px',
                padding: '16px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.85)',
                zIndex: 99999
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bell size={16} color="#38bdf8" />
                    <strong style={{ fontSize: '14px', color: '#ffffff' }}>Live Alerts</strong>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        style={{ backgroundColor: 'transparent', border: 'none', color: '#818cf8', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
                      >
                        <Check size={12} /> Mark all read
                      </button>
                    )}
                    <button 
                      onClick={() => setShowNotifications(false)}
                      style={{ backgroundColor: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>
                      No alerts available.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        onClick={() => handleNotificationClick(n)}
                        style={{
                          backgroundColor: n.unread ? 'rgba(99, 102, 241, 0.12)' : '#070b14',
                          border: `1px solid ${n.unread ? 'rgba(99, 102, 241, 0.35)' : '#1e293b'}`,
                          borderRadius: '12px',
                          padding: '10px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'center'
                        }}
                      >
                        <img src={n.image} alt="Alert" style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: n.unread ? '#ffffff' : '#cbd5e1' }}>{n.title}</span>
                            <span style={{ fontSize: '10px', color: '#64748b' }}>{n.time}</span>
                          </div>
                          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '4px 0 0 0' }}>{n.desc}</p>
                        </div>

                        <button 
                          onClick={(e) => handleDeleteNotification(e, n.id)}
                          style={{ backgroundColor: 'transparent', border: 'none', color: '#f43f5e', cursor: 'pointer', padding: '4px' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar Button */}
          <button
            onClick={() => navigate('/profile')}
            title="Go to Student Profile"
            style={{
              backgroundColor: '#0f172a',
              border: '2px solid #6366f1',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden'
            }}
          >
            <img 
  src={userAvatar} 
  alt="Profile" 
  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
/>
          </button>
            </div>
        </div>

   {/* 🌟 DYNAMIC LIVE BATCHES ADS CAROUSEL BANNER SECTION */}
      <section style={{ maxWidth: '1280px', margin: '24px auto 40px auto', padding: '0 24px' }}>
        <div style={{
          position: 'relative',
          borderRadius: '28px',
          overflow: 'hidden',
          border: '1px solid #334155',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
          minHeight: '420px',
          display: 'flex',
          alignItems: 'center',
          padding: '48px 40px',
          boxSizing: 'border-box'
        }}>
          {/* Dynamic Background Image */}
          <img 
            src={heroAds[currentSlide].bgImage} 
            alt="Batch Poster" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              zIndex: 1,
              filter: 'brightness(0.28) contrast(1.25)',
              transition: 'all 0.8s ease-in-out'
            }}
          />

          {/* Dark Overlay */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(7, 11, 20, 0.95) 35%, rgba(15, 23, 42, 0.75) 100%)',
            zIndex: 2
          }}></div>

          {/* Slider Content */}
          <div style={{ position: 'relative', zIndex: 3, maxWidth: '820px' }}>
            
            {/* Badges */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '18px' }}>
              <span style={{
                backgroundColor: 'rgba(99, 102, 241, 0.25)',
                border: '1px solid rgba(99, 102, 241, 0.5)',
                color: '#a5b4fc',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Sparkles size={14} color="#a5b4fc" /> {heroAds[currentSlide].badge}
              </span>

              <span style={{
                backgroundColor: 'rgba(251, 191, 36, 0.15)',
                border: '1px solid rgba(251, 191, 36, 0.4)',
                color: '#fbbf24',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Star size={14} fill="#fbbf24" color="#fbbf24" /> {heroAds[currentSlide].rating}
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: "'Georgia', serif",
              fontSize: '38px',
              fontWeight: '900',
              lineHeight: '1.25',
              color: '#ffffff',
              margin: '0 0 16px 0',
              textShadow: '0 4px 20px rgba(0,0,0,0.8)'
            }}>
              {heroAds[currentSlide].heading}
            </h1>

            {/* Subtext */}
            <p style={{
              fontSize: '15px',
              color: '#cbd5e1',
              margin: '0 0 32px 0',
              lineHeight: '1.6',
              maxWidth: '720px'
            }}>
              {heroAds[currentSlide].subtext}
            </p>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <button 
                onClick={() => navigate(heroAds[currentSlide].ctaLink)}
                style={{
                  backgroundColor: '#4f46e5',
                  color: '#ffffff',
                  border: 'none',
                  padding: '14px 30px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 8px 25px rgba(79, 70, 229, 0.5)'
                }}
              >
                {heroAds[currentSlide].ctaText} <ArrowRight size={16} />
              </button>

              <button 
                onClick={() => navigate('/ai-assistant')}
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Bot size={18} /> Ask AI Mentor
              </button>
            </div>

            {/* Slider Dots Indicator */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {heroAds.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  style={{
                    width: currentSlide === idx ? '28px' : '10px',
                    height: '10px',
                    borderRadius: '5px',
                    backgroundColor: currentSlide === idx ? '#6366f1' : 'rgba(255,255,255,0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* QUICK LEARNING MODULES GRID */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 50px 24px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={18} color="#6366f1" /> Quick Learning Modules
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
          {[
            { title: "Course Catalog", desc: "Structured GS Foundation & Optional Batches", icon: BookOpen, path: "/courses", color: "#6366f1", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80" },
            { title: "Live Classroom", desc: "Interactive streaming, real-time chat & PDFs", icon: Tv, path: "/classroom/course_gs2", color: "#ef4444", image: "https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=600&auto=format&fit=crop&q=80" },
            { title: "Mains Answer Evaluator", desc: "Submit handwritten answers for expert remarks", icon: Award, path: "/mains-practice", color: "#10b981", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80" },
            { title: "Mock Test Engine", desc: "Timed Prelims CSAT & GS test papers", icon: HelpCircle, path: "/mock-tests", color: "#38bdf8", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80" },
            { title: "Daily Current Affairs", desc: "Simplified news analysis & editorials", icon: Newspaper, path: "/current-affairs", color: "#f59e0b", image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&auto=format&fit=crop&q=80" },
            { title: "AI Assistant Mentor", desc: "24/7 instant doubt clarification", icon: Bot, path: "/ai-assistant", color: "#a855f7", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80" }
          ].map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div key={idx} onClick={() => navigate(mod.path)} style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}>
                <div style={{ position: 'relative', height: '120px', width: '100%' }}>
                  <img src={mod.image} alt={mod.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, #0f172a 0%, transparent 80%)' }}></div>
                </div>
                <div style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Icon size={18} color={mod.color} />
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>{mod.title}</h3>
                  </div>
                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{mod.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
{/* REAL-TIME STUDY REMINDER WIDGET */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 30px 24px' }}>
        <StudyReminderWidget />
      </section>
      {/* FEATURED LIVE CLASS BATCH CARD */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 60px 24px' }}>
        <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)', border: '1px solid #4338ca', borderRadius: '24px', padding: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              🔴 LIVE CLASSROOM STREAMING NOW
            </span>
            <h3 style={{ fontFamily: "'Georgia', serif", fontSize: '22px', fontWeight: '900', color: '#ffffff', margin: '0 0 6px 0' }}>
              GS Paper 2: Fundamental Rights & Article 21 Judiciary Interpretation
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '13px', margin: 0 }}>Faculty: Target CSE Mentorship Panel • Real-time Live Chat & Instant Doubts</p>
          </div>
          <button onClick={() => navigate('/classroom/course_gs2')} style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '14px 28px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <PlayCircle size={18} /> Enter Live Classroom →
          </button>
        </div>
      </section>
    </div>
  );
}