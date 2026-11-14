import { API_BASE_URL } from '../api/config';
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, User, RefreshCw, Copy, Check, Lightbulb, Sparkles, BookOpen } from 'lucide-react';

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Welcome to your **Real-Time Academic AI Faculty Mentor**. Ask any question regarding UPSC CSE, SSC CGL, BPSC, GS (I–IV), CSAT, or Current Affairs.",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const chatEndRef = useRef(null);
// 📌 Real-Time Admin Sync AI Mentor Configuration
  const [aiConfig, setAiConfig] = useState(() => {
    const saved = localStorage.getItem('upsc_cms_ai');
    return saved ? JSON.parse(saved) : { 
      systemPrompt: "You are an expert UPSC CSE Mentor. Provide precise answers with constitutional references.",
      modelName: "HuggingFace-Mistral-7B",
      temperature: 0.7 
    };
  });

  useEffect(() => {
    const syncAiConfig = () => {
      const saved = localStorage.getItem('upsc_cms_ai');
      if (saved) setAiConfig(JSON.parse(saved));
    };
    window.addEventListener('storage', syncAiConfig);
    return () => window.removeEventListener('storage', syncAiConfig);
  }, []);
  const starterPrompts = [
    "Tell me about BPSC Exam Pattern & Syllabus",
    "Tell me about SSC CGL Exam Pattern",
    "Analyze Article 324 & Independence of ECI",
    "15-Marker Answer Structuring Strategy"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const renderFormattedMessage = (text) => {
    if (!text) return null;
    const lines = text.split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} style={{ height: '6px' }} />;

      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} style={{ color: '#a5b4fc', margin: '12px 0 6px 0', fontSize: '15px', fontWeight: '800' }}>
            {trimmed.replace('### ', '').replace(/\*\*/g, '')}
          </h3>
        );
      }

      const formatInline = (str) => {
        const parts = str.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, pIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={pIdx} style={{ color: '#ffffff', fontWeight: '800' }}>{part.slice(2, -2)}</strong>;
          }
          return part;
        });
      };

      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        return (
          <div key={idx} style={{ display: 'flex', gap: '8px', marginLeft: '10px', marginBottom: '5px', lineHeight: '1.6' }}>
            <span style={{ color: '#818cf8', fontWeight: 'bold' }}>•</span>
            <span style={{ color: '#cbd5e1' }}>{formatInline(trimmed.replace(/^[\*\-]\s*/, ''))}</span>
          </div>
        );
      }

      return (
        <p key={idx} style={{ margin: '0 0 6px 0', color: '#cbd5e1', lineHeight: '1.65' }}>
          {formatInline(trimmed)}
        </p>
      );
    });
  };

  const handleSendMessage = async (textToSend = null) => {
    const messageText = textToSend || inputMessage;
    if (!messageText.trim() || isLoading) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText })
      });

      const data = await response.json();
      const fullReply = data.reply || "No response generated.";

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: fullReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: `### **Real-Time Academic Analysis on "${messageText}"**\n\n* **Overview:** Connecting query with core exam syllabus.\n* **Key Focus:** Link concepts with PYQs and reference books.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ height: 'calc(100vh - 70px)', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: "'Inter', sans-serif", padding: '16px 24px', display: 'flex', justifyContent: 'center', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: '1280px', width: '100%', display: 'flex', flexDirection: 'column', height: '100%', background: '#111827', borderRadius: '20px', border: '1px solid rgba(99, 102, 241, 0.2)', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)', overflow: 'hidden' }}>
        
        {/* HEADER */}
        <div style={{ padding: '16px 24px', background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <BookOpen size={22} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Real-Time Academic AI Study Engine <Sparkles size={16} color="#818cf8" />
              </h2>
              <span style={{ fontSize: '12px', color: '#34d399', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }}></span> Live Study Analysis Active
              </span>
            </div>
          </div>

          <button onClick={() => setMessages([messages[0]])} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#cbd5e1', padding: '8px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} /> Reset
          </button>
        </div>

        {/* CHAT MESSAGES */}
        <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ display: 'flex', gap: '14px', justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
              {msg.sender === 'ai' && (
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8', flexShrink: 0 }}>
                  <Bot size={20} />
                </div>
              )}

              <div style={{ maxWidth: '80%', background: msg.sender === 'user' ? '#4f46e5' : '#0f172a', padding: '18px 22px', borderRadius: '16px', border: msg.sender === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)', color: '#f8fafc' }}>
                <div style={{ fontSize: '14px' }}>
                  {msg.sender === 'ai' ? renderFormattedMessage(msg.text) : msg.text}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '11px', color: '#64748b' }}>
                  <span>{msg.time}</span>
                  {msg.sender === 'ai' && (
                    <button onClick={() => copyToClipboard(msg.text, msg.id)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      {copiedId === msg.id ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
                    </button>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#312e81', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                  <User size={20} />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div style={{ color: '#818cf8', fontSize: '13px', fontWeight: 'bold' }}>
              ⚡ Analysis...
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* PROMPTS & INPUT */}
        {messages.length <= 2 && (
          <div style={{ padding: '0 24px 14px 24px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {starterPrompts.map((prompt, idx) => (
              <button key={idx} onClick={() => handleSendMessage(prompt)} style={{ background: '#0f172a', border: '1px solid rgba(99, 102, 241, 0.25)', color: '#c7d2fe', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', cursor: 'pointer' }}>
                <Lightbulb size={14} color="#fbbf24" style={{ marginRight: '6px' }} /> {prompt}
              </button>
            ))}
          </div>
        )}

        <div style={{ padding: '18px 24px', background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="text" 
              placeholder="Ask any study question..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              style={{ flex: 1, padding: '16px 20px', borderRadius: '14px', background: '#111827', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
            />
            <button type="submit" disabled={isLoading || !inputMessage.trim()} style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '0 26px', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}