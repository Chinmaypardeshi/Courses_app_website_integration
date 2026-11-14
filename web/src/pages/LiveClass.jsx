import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Video, MessageSquare, Send, Users } from 'lucide-react';

export default function LiveClass() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, user: 'Amit Sir', text: 'Welcome students! Today we discuss Mains Answer Structure.' },
    { id: 2, user: 'Rohan', text: 'Sir, CSAT paper strategy kab discuss hogi?' }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages([...messages, { id: Date.now(), user: 'You', text: inputMsg }]);
    setInputMsg('');
  };

  return (
    <div style={{ padding: '25px', backgroundColor: '#f4f6f9', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ background: '#1a237e', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        <h1 style={{ margin: 0, color: '#1a237e', fontSize: '24px' }}>Live Class Room</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px', height: 'calc(100vh - 120px)' }}>
        
        {/* Left Area: Video Player Placeholder */}
        <div style={{ background: '#000', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff', position: 'relative' }}>
          <Video size={64} color="#3f51b5" style={{ marginBottom: '15px' }} />
          <h2 style={{ margin: 0 }}>GS Paper 2: Indian Constitution Live Stream</h2>
          <p style={{ color: '#aaa', marginTop: '8px' }}>Faculty: Dr. Vikas Sharma</p>
          <span style={{ position: 'absolute', top: '20px', left: '20px', background: '#d32f2f', color: '#fff', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ● LIVE
          </span>
        </div>

        {/* Right Area: Live Chat Panel */}
        <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '15px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
              <MessageSquare size={20} color="#1a237e" />
              <h3 style={{ margin: 0, fontSize: '16px', color: '#1a237e' }}>Live Discussion</h3>
            </div>

            {/* Messages Box */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
              {messages.map((msg) => (
                <div key={msg.id} style={{ background: msg.user === 'You' ? '#e8eaf6' : '#f5f5f5', padding: '8px 12px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#1a237e', display: 'block' }}>{msg.user}</span>
                  <span style={{ fontSize: '13px', color: '#333' }}>{msg.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
            <input 
              type="text" 
              placeholder="Ask a doubt..." 
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }}
            />
            <button type="submit" style={{ background: '#1a237e', color: '#fff', border: 'none', padding: '10px 14px', borderRadius: '6px', cursor: 'pointer' }}>
              <Send size={16} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}