import { API_BASE_URL } from '../api/config';
import React, { useState, useEffect, useMemo } from 'react';
import { Play, BookOpen, Search, RefreshCw, X, ExternalLink, Video, FileText } from 'lucide-react';

const NEWSPAPER_SOURCES = [
  { id: 'all', name: 'All Sources', icon: '📰' },
  { id: 'the-hindu', name: 'The Hindu', icon: '🐘' },
  { id: 'indian-express', name: 'Indian Express', icon: '🗞️' },
  { id: 'financial-express', name: 'Financial Express', icon: '📈' },
];

const GS_PAPERS = [
  { id: 'all', label: 'All GS Papers' },
  { id: 'GS Paper 1', label: 'GS 1 (History/Geo)' },
  { id: 'GS Paper 2', label: 'GS 2 (Polity/IR)' },
  { id: 'GS Paper 3', label: 'GS 3 (Economy/Env)' },
  { id: 'GS Paper 4', label: 'GS 4 (Ethics)' },
];

export default function CurrentAffairs() {
  // 📌 Real-Time Admin Sync Current Affairs State
  const [articles, setArticles] = useState(() => {
    const saved = localStorage.getItem('upsc_cms_ca');
    return saved ? JSON.parse(saved) : [
      { id: 'ca1', title: 'Daily Editorials: Electoral Reforms in India', date: 'Today', category: 'Polity' }
    ];
  });

  useEffect(() => {
    const syncCa = () => {
      const saved = localStorage.getItem('upsc_cms_ca');
      if (saved) setArticles(JSON.parse(saved));
    };
    window.addEventListener('storage', syncCa);
    return () => window.removeEventListener('storage', syncCa);
  }, []);
  const [selectedSource, setSelectedSource] = useState('all');
  const [selectedPaper, setSelectedPaper] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);
  const [activeTab, setActiveTab] = useState('read'); // 'read' or 'video'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, [selectedSource]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      // Connect directly to backend real-time endpoint
      const res = await fetch(`${API_BASE_URL}/api/v1/current-affairs?source=${selectedSource}&search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();

      if (data.success && data.data.length > 0) {
        setArticles(data.data);
      } else {
        setArticles([]);
      }
    } catch (err) {
      console.error("Failed to connect to backend current-affairs API:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(item => {
      const matchesPaper = selectedPaper === 'all' || 
        item.paper.toLowerCase().includes(selectedPaper.toLowerCase());

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || 
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.paper.toLowerCase().includes(q);

      return matchesPaper && matchesSearch;
    });
  }, [articles, selectedPaper, searchQuery]);

  return (
    <div style={{
      backgroundColor: '#070b14',
      color: '#f8fafc',
      minHeight: '100vh',
      width: '100%',
      padding: '32px 24px 48px 24px',
      boxSizing: 'border-box',
      textAlign: 'left',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        
        {/* MASTHEAD HEADER */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '24px',
          padding: '32px',
          marginBottom: '28px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '14px', marginBottom: '20px', fontSize: '12px', color: '#94a3b8', fontWeight: 'bold' }}>
            <span>📅 LIVE EDITORIAL GAZETTE: {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
            <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
            </span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{
              backgroundColor: 'rgba(99, 102, 241, 0.2)',
              color: '#a5b4fc',
              border: '1px solid rgba(99, 102, 241, 0.4)',
              fontSize: '11px',
              fontWeight: 'bold',
              letterSpacing: '1px',
              padding: '6px 16px',
              borderRadius: '20px',
              display: 'inline-block',
              marginBottom: '12px'
            }}>
              🏛️ UPSC CSE 2027 & COMPETITIVE EXAMS INTELLIGENCE
            </span>
            <h1 style={{ fontFamily: "'Georgia', serif", fontSize: '38px', fontWeight: '900', color: '#ffffff', margin: '0 0 10px 0', letterSpacing: '-0.5px' }}>
              DAILY EDITORIALS, MEDIA & DEEP ANALYSIS
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '14px', margin: 0, maxWidth: '780px', marginInLine: 'auto', lineHeight: '1.6' }}>
              Real-time daily national news enriched with video analysis, Prelims fact-pointers, Mains answer writing hooks, and constitutional mapping.
            </p>
          </div>
        </div>

        {/* CONTROLS DASHBOARD */}
        <div style={{
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '32px'
        }}>
          {/* Search Bar */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#070b14', border: '1px solid #334155', borderRadius: '14px', padding: '0 18px' }}>
              <Search size={18} color="#64748b" style={{ marginRight: '12px' }} />
              <input
                type="text"
                placeholder="Search topics, keywords, or GS papers (e.g. Polity, RBI, Climate, Electoral Reforms)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: 'transparent',
                  border: 'none',
                  padding: '16px 0',
                  fontSize: '14px',
                  color: '#ffffff',
                  outline: 'none'
                }}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  style={{ backgroundColor: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {/* Source Buttons */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>
                SELECT NEWSPAPER DAILIES
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {NEWSPAPER_SOURCES.map((src) => (
                  <button
                    key={src.id}
                    onClick={() => setSelectedSource(src.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: '700',
                      border: '1px solid',
                      cursor: 'pointer',
                      backgroundColor: selectedSource === src.id ? '#4f46e5' : '#1e293b',
                      color: selectedSource === src.id ? '#ffffff' : '#cbd5e1',
                      borderColor: selectedSource === src.id ? '#6366f1' : '#334155'
                    }}
                  >
                    {src.icon} {src.name}
                  </button>
                ))}
              </div>
            </div>

            {/* GS Paper Filters */}
            <div>
              <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '10px' }}>
                FILTER BY SYLLABUS PAPER
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {GS_PAPERS.map((paper) => (
                  <button
                    key={paper.id}
                    onClick={() => setSelectedPaper(paper.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: '700',
                      border: '1px solid',
                      cursor: 'pointer',
                      backgroundColor: selectedPaper === paper.id ? '#d97706' : '#1e293b',
                      color: selectedPaper === paper.id ? '#ffffff' : '#cbd5e1',
                      borderColor: selectedPaper === paper.id ? '#f59e0b' : '#334155'
                    }}
                  >
                    {paper.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ARTICLES GRID */}
        {loading ? (
          <div style={{ padding: '80px 0', textAlign: 'center', color: '#818cf8', fontWeight: 'bold' }}>
            <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 16px auto', display: 'block' }} />
            Fetching News & Video...
          </div>
        ) : filteredArticles.length === 0 ? (
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '20px', padding: '60px', textAlign: 'center', color: '#64748b' }}>
            <h3 style={{ color: '#cbd5e1', marginBottom: '8px' }}>No Articles Matched Your Search</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>Try resetting your filter or search query.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '24px',
            width: '100%'
          }}>
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                style={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
              >
                <div>
                  {/* HERO POSTER IMAGE */}
                  <div style={{ position: 'relative', height: '200px', width: '100%', overflow: 'hidden' }}>
                    <img 
                      src={article.image} 
                      alt={article.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0f172a 0%, transparent 70%)' }} />
                    
                    {/* Source Badge */}
                    <span style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      backgroundColor: '#070b14',
                      color: '#38bdf8',
                      border: '1px solid #0284c7',
                      padding: '4px 12px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: '900',
                      textTransform: 'uppercase'
                    }}>
                      {article.source}
                    </span>

                    {/* Video Analysis Badge */}
                    <button
                      onClick={() => { setActiveArticle(article); setActiveTab('video'); }}
                      style={{
                        position: 'absolute',
                        top: '14px',
                        right: '14px',
                        backgroundColor: 'rgba(225, 29, 72, 0.9)',
                        color: '#ffffff',
                        border: 'none',
                        padding: '5px 10px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backdropFilter: 'blur(4px)'
                      }}
                    >
                      <Play size={12} fill="#fff" /> Video Analysis
                    </button>
                  </div>

                  {/* CONTENT BODY */}
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '12px', color: '#64748b', fontWeight: 'bold' }}>
                      <span>📅 {article.date}</span>
                      <span>⏱️ {article.readTime}</span>
                    </div>

                    <h3 style={{
                      fontFamily: "'Georgia', serif",
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: '#ffffff',
                      marginTop: 0,
                      marginBottom: '10px',
                      lineHeight: '1.4',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {article.title}
                    </h3>

                    <p style={{
                      color: '#cbd5e1',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      margin: '0 0 16px 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {article.summary}
                    </p>
                  </div>
                </div>

                {/* FOOTER BUTTONS */}
                <div style={{
                  padding: '16px 20px',
                  borderTop: '1px solid #1e293b',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    color: '#fbbf24',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {article.paper}
                  </span>

                  <button
                    onClick={() => { setActiveArticle(article); setActiveTab('read'); }}
                    style={{
                      backgroundColor: '#4f46e5',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer'
                    }}
                  >
                    Deep Analysis →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DETAILED MODAL READER & VIDEO PLAYER */}
        {activeArticle && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}>
            <div style={{
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '24px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9)'
            }}>
              <button
                onClick={() => setActiveArticle(null)}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: '#1e293b',
                  color: '#ffffff',
                  border: 'none',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>

              {/* TABS (Article vs Video Analysis) */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <button
                  onClick={() => setActiveTab('read')}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    border: '1px solid',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: activeTab === 'read' ? '#4f46e5' : '#1e293b',
                    color: activeTab === 'read' ? '#fff' : '#cbd5e1',
                    borderColor: activeTab === 'read' ? '#6366f1' : '#334155'
                  }}
                >
                  <FileText size={16} /> Read Full Editorial Analysis
                </button>
                <button
                  onClick={() => setActiveTab('video')}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    border: '1px solid',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: activeTab === 'video' ? '#e11d48' : '#1e293b',
                    color: activeTab === 'video' ? '#fff' : '#cbd5e1',
                    borderColor: activeTab === 'video' ? '#f43f5e' : '#334155'
                  }}
                >
                  <Video size={16} /> Watch Video Editorial
                </button>
              </div>

              {/* ARTICLE HEADER */}
              <h2 style={{ fontFamily: "'Georgia', serif", fontSize: '26px', fontWeight: '900', color: '#ffffff', margin: '0 0 16px 0', lineHeight: '1.3' }}>
                {activeArticle.title}
              </h2>

              {activeTab === 'video' ? (
                /* VIDEO ANALYSIS PLAYER */
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '16px', overflow: 'hidden', border: '1px solid #334155' }}>
                    <iframe
                      src={activeArticle.videoUrl}
                      title="UPSC Video Analysis"
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '12px', textAlign: 'center' }}>
                    🎬 Expert Faculty Video Analysis & Daily Editorial Breakdown
                  </p>
                </div>
              ) : (
                /* POSTER IMAGE */
                <div style={{ width: '100%', height: '260px', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px' }}>
                  <img src={activeArticle.image} alt="Header Poster" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}

              {/* PRELIMS POINTERS */}
              <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
                <h4 style={{ color: '#fbbf24', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px 0' }}>
                  🎯 PRELIMS DIRECT HIGH-YIELD POINTERS
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#fef3c7', fontSize: '13px', lineHeight: '1.7' }}>
                  {activeArticle.prelimsPointers.map((pt, idx) => (
                    <li key={idx} style={{ marginBottom: '6px' }}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* MAINS HOOK */}
              <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
                <h4 style={{ color: '#818cf8', fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px 0' }}>
                  ✍️ MAINS 15-MARKER ANSWER HOOK
                </h4>
                <p style={{ color: '#e0e7ff', fontSize: '14px', fontStyle: 'italic', margin: 0, lineHeight: '1.6', borderLeft: '3px solid #6366f1', paddingLeft: '14px' }}>
                  "{activeArticle.mainsHook}"
                </p>
              </div>

              {/* FULL CONTENT BREAKDOWN */}
              <div style={{ borderTop: '1px solid #1e293b', paddingTop: '20px', color: '#cbd5e1', fontSize: '14px', lineHeight: '1.8' }}>
                <h3 style={{ color: '#38bdf8', fontSize: '16px', marginTop: 0 }}>Exhaustive Background & Context</h3>
                <p>{activeArticle.fullContent}</p>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}