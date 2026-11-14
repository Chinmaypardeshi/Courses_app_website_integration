import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Tv, PlayCircle, FileText, MessageSquare, ArrowLeft, Download, 
  Send, CheckCircle, Clock, Video, User, HelpCircle, Shield
} from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
const COURSE_DATABASE = {
  "course_gs1": {
    title: "GS Paper 1: History, Art & Geography Complete Masterclass 2027",
    faculty: "Foundation Course Faculty",
    liveTitle: "Lecture 24: Ancient Indian Temple Architecture & Art Forms",
    // 🔴 ONLY Live Stream URL Updated
    streamUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    recordedLectures: [
      { id: 1, title: "Lec 01: Introduction to Indus Valley Civilization", duration: "1h 45m", date: "20 Oct 2026", url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4" },
      { id: 2, title: "Lec 02: Vedic Period & Religious Movements", duration: "1h 50m", date: "21 Oct 2026", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
      { id: 3, title: "Lec 03: Mauryan Empire Architecture & Pillars", duration: "2h 10m", date: "22 Oct 2026", url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4" }
    ],
    notes: [
      { id: "pdf1", title: "Indus Valley & Vedic Period Handouts (PDF)", size: "4.2 MB" },
      { id: "pdf2", title: "Art & Culture Architecture Summary Charts", size: "2.8 MB" }
    ]
  },
  "course_gs2": {
    title: "GS Paper 2: Indian Polity, Governance & International Relations",
    faculty: "Target CSE Mentorship Panel",
    liveTitle: "Live Class: Fundamental Rights & Article 21 Judiciary Interpretation",
    // 🔴 ONLY Live Stream URL Updated
    streamUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    recordedLectures: [
      { id: 1, title: "Lec 01: Preamble & Basic Structure Doctrine", duration: "2h 00m", date: "18 Oct 2026", url: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4" },
      { id: 2, title: "Lec 02: Citizenship & Article 12-18 Breakdown", duration: "1h 40m", date: "19 Oct 2026", url: "https://www.w3schools.com/html/mov_bbb.mp4" }
    ],
    notes: [
      { id: "pdf1", title: "Complete Laxmikanth Chapter 7 Handout (PDF)", size: "5.1 MB" },
      { id: "pdf2", title: "Landmark Supreme Court Judgments Compilation", size: "3.6 MB" }
    ]
  }
};
// Simulated Live Student Comments Engine
const AUTO_STUDENT_COMMENTS = [
  { user: "Priya Sharma", text: "Sir Article 19(1)(a) me commercial speech included hai na?" },
  { user: "Rohan Verma", text: "Audio and video quality is super crisp today!" },
  { user: "Faculty Mentor", text: "Yes Priya, Sakal Papers case covers commercial speech protection.", isTeacher: true },
  { user: "Karan Adani", text: "PDF notes class ke baad download section me milenge?" },
  { user: "Sneha Reddy", text: "Puttaswamy 9-judge bench judgment clear ho gaya, thanks sir!" },
  { user: "Faculty Mentor", text: "Keep noting down key SC judgment case names in your Mains notebook.", isTeacher: true }
];
export default function Classroom() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const activeCourseKey = courseId && COURSE_DATABASE[courseId] ? courseId : "course_gs2";
  const courseData = COURSE_DATABASE[activeCourseKey];

  const [activeTab, setActiveTab] = useState('live'); 
  const [selectedVideo, setSelectedVideo] = useState(courseData.streamUrl);
  const [videoTitle, setVideoTitle] = useState(courseData.liveTitle);

  // Live Chat
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "Ananya V.", text: "Sir, does Article 21 cover the Right to Privacy judgment?", time: "10:14 AM" },
    { id: 2, user: "Faculty Mentor", text: "Yes Ananya, refer to Puttaswamy Case (2017).", time: "10:15 AM", isTeacher: true },
    { id: 3, user: "Rahul S.", text: "Voice and screen are crystal clear!", time: "10:16 AM" }
  ]);
  const [newChatText, setNewChatText] = useState("");



  // 👇 IS LINE KE THEEK NICHE PASTE KAREIN 👇
  const [isLiveStreamActive, setIsLiveStreamActive] = useState(true);
  const chatBottomRef = useRef(null);

  // Auto-Scroll Chat to Bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Realtime Live Chat Simulator (Adds comments every 7 seconds in Live Tab)
  useEffect(() => {
    if (activeTab !== 'live') return;
    let index = 0;
    const interval = setInterval(() => {
      if (index < AUTO_STUDENT_COMMENTS.length) {
        const comment = AUTO_STUDENT_COMMENTS[index];
        setChatMessages(prev => [...prev, {
          id: Date.now(),
          user: comment.user,
          text: comment.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isTeacher: comment.isTeacher || false
        }]);
        index++;
      } else {
        index = 0;
      }
    }, 7000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!newChatText.trim()) return;
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      user: "You (Aspirant)",
      text: newChatText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewChatText("");
  };

// Doubts System (Connected with Admin Panel via LocalStorage)
  const [doubts, setDoubts] = useState(() => {
    const saved = localStorage.getItem('upsc_classroom_doubts');
    return saved ? JSON.parse(saved) : [];
  });
  const [doubtText, setDoubtText] = useState("");

  // Live Auto-Sync when Admin Replies in Admin Panel
  useEffect(() => {
    const syncDoubts = () => {
      const saved = localStorage.getItem('upsc_classroom_doubts');
      if (saved) setDoubts(JSON.parse(saved));
    };
    window.addEventListener('storage', syncDoubts);
    return () => window.removeEventListener('storage', syncDoubts);
  }, []);

  const handleAskDoubt = (e) => {
    e.preventDefault();
    if (!doubtText.trim()) return;

    const newDoubt = {
      id: Date.now(),
      courseId: activeCourseKey,
      courseTitle: courseData.title,
      question: doubtText.trim(),
      status: "Pending Faculty Reply",
      answer: null,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedDoubts = [newDoubt, ...doubts];
    setDoubts(updatedDoubts);
    localStorage.setItem('upsc_classroom_doubts', JSON.stringify(updatedDoubts));
    window.dispatchEvent(new Event('storage'));

    setDoubtText("");
    alert("🎉 Doubt submitted to Admin Panel!");
  };
// Real Notes Download Engine
  const handleDownloadPdf = (title) => {
    const realNotesContent = `
================================================================
UPSCIAS EDTECH - CLASSROOM STUDY MATERIAL
Subject: ${title}
================================================================

1. FUNDAMENTAL RIGHTS (ARTICLE 12 - 35)
----------------------------------------------------------------
- Part III of the Constitution is described as the 'Magna Carta of India'.
- Article 12: Definition of 'State'.
- Article 13: Laws inconsistent with or in derogation of Fundamental Rights.

2. RIGHT TO EQUALITY (ARTICLE 14 - 18)
----------------------------------------------------------------
- Article 14: Equality before law and equal protection of laws.
- Article 15: Prohibition of discrimination on grounds of religion, race, caste, sex or place of birth.
- Article 16: Equality of opportunity in matters of public employment.
- Article 17: Abolition of Untouchability.
- Article 18: Abolition of Titles.

3. LANDMARK SUPREME COURT JUDGMENTS
----------------------------------------------------------------
- Kesavananda Bharati Case (1973): Basic Structure Doctrine.
- Maneka Gandhi Case (1978): Due Process of Law under Article 21.
- K.S. Puttaswamy Case (2017): Right to Privacy as a Fundamental Right under Article 21.

================================================================
Downloaded from UPSCIAS LMS Platform - All Rights Reserved
================================================================
    `;

    const blob = new Blob([realNotesContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_Notes.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <div style={{ backgroundColor: '#070b14', color: '#f8fafc', minHeight: '100vh', padding: '80px 24px 40px 24px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
        
        {/* Navigation Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <button 
            onClick={() => navigate('/profile')}
            style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', color: '#cbd5e1', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 'bold' }}
          >
            <ArrowLeft size={16} /> Back to Profile
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span> LIVE STREAM
            </span>
            <span style={{ color: '#94a3b8', fontSize: '13px' }}>Faculty: <strong style={{ color: '#ffffff' }}>{courseData.faculty}</strong></span>
          </div>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#ffffff', margin: '0 0 20px 0' }}>
          {courseData.title}
        </h1>

        {/* Video Player + Chat Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: (activeTab === 'live' && isLiveStreamActive) ? 'minmax(0, 1fr) 380px' : '1fr', gap: '24px' }}>
          
          {/* Main Video Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
      {/* VIDEO PLAYER CONTAINER WITH DYNAMIC LIVE / RECORDED STREAM */}
        <div style={{ backgroundColor: '#000000', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1e293b', boxShadow: '0 15px 30px rgba(0,0,0,0.5)', aspectRatio: '16/9', position: 'relative' }}>
          
          {/* 🔴 LIVE BADGE OVERLAY */}
          {isLiveStreamActive ? (
            <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 10 }}>
              <div style={{ backgroundColor: '#ef4444', color: '#ffffff', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: '#ffffff', borderRadius: '50%' }}></span> 🔴 LIVE STREAMING
              </div>
              <span style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', color: '#38bdf8', border: '1px solid #334155', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                ● 142 Aspirants Online
              </span>
            </div>
          ) : (
            <div style={{ position: 'absolute', top: '16px', left: '16px', backgroundColor: 'rgba(15, 23, 42, 0.85)', color: '#38bdf8', border: '1px solid #1e293b', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px', zIndex: 10 }}>
              📹 RECORDED LECTURE
            </div>
          )}

          {/* 🎥 HIGH-RELIABILITY LIVE MP4 VIDEO PLAYER */}
          <video
            key={selectedVideo}
            controls
            autoPlay
            playsInline
            controlsList="nodownload"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          >
            <source src={selectedVideo || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"} type="video/mp4" />
            Aapka browser video tag ko support nahi karta hai.
          </video>

        </div>

          {/* Video Title & Status Badge */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#ffffff', fontWeight: 'bold' }}>
                  📺 {videoTitle}
                </h3>
               
              </div>
              
              {/* Red Live Button (Click karte hi Live Stream run karega) */}
              <button
                onClick={() => {
                  setSelectedVideo(courseData.streamUrl);
                  setVideoTitle(courseData.liveTitle);
                  setIsLiveStreamActive(true);
                  setActiveTab('live');
                }}
                style={{ 
                  backgroundColor: isLiveStreamActive ? 'rgba(239, 68, 68, 0.2)' : '#070b14', 
                  padding: '8px 16px', 
                  borderRadius: '10px', 
                  border: `1px solid ${isLiveStreamActive ? '#ef4444' : '#334155'}`, 
                  fontSize: '12px', 
                  color: isLiveStreamActive ? '#ef4444' : '#38bdf8', 
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isLiveStreamActive ? '🔴 LIVE STREAM' : '▶ Switch to Live'}
              </button>
            </div>
{/* Navigation Tabs */}
            <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #1e293b', paddingBottom: '10px' }}>
              {[
                { id: 'live', label: '🔴 Live Stream', icon: Tv },
                { id: 'recorded', label: '📹 Recorded Lectures', icon: PlayCircle },
                { id: 'notes', label: '📄 PDF Notes', icon: FileText },
                { id: 'doubts', label: '❓ Ask Doubt', icon: HelpCircle }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      if (tab.id === 'live') {
                        setSelectedVideo(courseData.streamUrl);
                        setVideoTitle(courseData.liveTitle);
                        setIsLiveStreamActive(true);
                      }
                    }}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 'bold',
                      border: '1px solid',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: activeTab === tab.id ? '#4f46e5' : '#0f172a',
                      color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
                      borderColor: activeTab === tab.id ? '#6366f1' : '#1e293b'
                    }}
                  >
                    <Icon size={16} /> {tab.label}
                  </button>
                );
              })}
            </div>

            {/* RECORDED LECTURES TAB */}
            {activeTab === 'recorded' && (
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#ffffff', fontWeight: 'bold' }}>
                  Recorded Lectures Playlist ({courseData.recordedLectures.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {courseData.recordedLectures.map((lec) => (
                    <div
                      key={lec.id}
                      style={{
                        backgroundColor: '#070b14',
                        border: '1px solid #1e293b',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <h5 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#ffffff', fontWeight: 'bold' }}>{lec.title}</h5>
                        <span style={{ color: '#64748b', fontSize: '12px' }}>Date: {lec.date} • Duration: {lec.duration}</span>
                      </div>
                     <button
  onClick={() => {
    setSelectedVideo(lec.url);
    setVideoTitle(lec.title);
    setIsLiveStreamActive(false);
  }}
  style={{ backgroundColor: selectedVideo === lec.url && !isLiveStreamActive ? '#10b981' : '#4f46e5', color: '#ffffff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      <PlayCircle size={14} /> {selectedVideo === lec.url && !isLiveStreamActive ? 'Now Playing' : 'Play Lecture'}
                    </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PDF NOTES TAB */}
            {activeTab === 'notes' && (
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#ffffff', fontWeight: 'bold' }}>
                  Class Study Material & PDF Handouts
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {courseData.notes.map((pdf) => (
                    <div
                      key={pdf.id}
                      style={{
                        backgroundColor: '#070b14',
                        border: '1px solid #1e293b',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <h5 style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#ffffff', fontWeight: 'bold' }}>{pdf.title}</h5>
                        <span style={{ color: '#64748b', fontSize: '12px' }}>Format: PDF • Size: {pdf.size}</span>
                      </div>
                      <button
                       onClick={() => handleDownloadPdf(pdf.title)}
                        style={{ backgroundColor: '#070b14', color: '#38bdf8', border: '1px solid #0284c7', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Download size={14} /> Download PDF
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ASK DOUBT TAB */}
            {activeTab === 'doubts' && (
              <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#ffffff', fontWeight: 'bold' }}>
                  Submit Academic Doubt to Faculty
                </h4>
                <form onSubmit={handleAskDoubt} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                  <textarea
                    rows="4"
                    value={doubtText}
                    onChange={(e) => setDoubtText(e.target.value)}
                    placeholder="Type your question or conceptual doubt regarding this lecture..."
                    style={{ backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '12px', padding: '14px', color: '#ffffff', outline: 'none', fontSize: '13px' }}
                  ></textarea>
                  <button
                    type="submit"
                    style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
                  >
                    Submit Doubt to Mentor →
                  </button>
                </form>

                {doubts.length > 0 && (
                  <div>
                    <h5 style={{ color: '#818cf8', fontSize: '13px', margin: '0 0 10px 0' }}>Your Submitted Doubts:</h5>
                    {doubts.map(d => (
                      <div key={d.id} style={{ backgroundColor: '#070b14', border: '1px solid #1e293b', padding: '12px', borderRadius: '10px', marginBottom: '8px', fontSize: '13px' }}>
                        <p style={{ margin: '0 0 4px 0', color: '#ffffff' }}>Q: {d.question}</p>
                        <span style={{ color: '#34d399', fontSize: '11px', fontWeight: 'bold' }}>Status: {d.status} ({d.time})</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Live Chat Sidebar */}
          {(activeTab === 'live' && isLiveStreamActive) && (
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '18px', display: 'flex', flexDirection: 'column', height: '620px' }}>
            
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare size={18} color="#818cf8" />
                <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>Live Class Chat</h4>
              </div>
              <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 'bold' }}>● 142 Aspirants Online</span>
            </div>

            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    backgroundColor: msg.isTeacher ? 'rgba(99, 102, 241, 0.15)' : '#070b14',
                    border: msg.isTeacher ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid #1e293b',
                    borderRadius: '10px',
                    padding: '10px 12px',
                    fontSize: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ color: msg.isTeacher ? '#818cf8' : '#38bdf8' }}>{msg.user}</strong>
                    <span style={{ color: '#64748b', fontSize: '10px' }}>{msg.time}</span>
                  </div>
                  <p style={{ margin: 0, color: '#e2e8f0', lineHeight: '1.4' }}>{msg.text}</p>
                </div>
              ))}
              {/* 👇 IS LINE 357 KE NICHE PASTE KAREIN 👇 */}
              <div ref={chatBottomRef} />
            </div>

            <form onSubmit={handleSendChat} style={{ padding: '12px', borderTop: '1px solid #1e293b', display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={newChatText}
                onChange={(e) => setNewChatText(e.target.value)}
                placeholder="Ask doubt in live chat..."
                style={{ flex: 1, backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '8px', padding: '10px 12px', color: '#ffffff', fontSize: '12px', outline: 'none' }}
              />
              <button
                type="submit"
                style={{ backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer' }}
              >
                <Send size={14} />
              </button>
            </form>

          </div>
)}
        </div>
      </div>
    </div>
  );
}