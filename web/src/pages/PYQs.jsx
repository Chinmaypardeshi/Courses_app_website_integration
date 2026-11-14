import { useState } from 'react';
import { FileQuestion, CheckCircle2, ArrowRight } from 'lucide-react';

export default function PYQs() {
  const pyqs = [
    { id: 1, year: 2025, exam: 'UPSC CSE Prelims', subject: 'Polity', q: 'Consider the following constitutional bodies in India...' },
    { id: 2, year: 2024, exam: 'UPSC CSE Prelims', subject: 'Economy', q: 'In the context of Indian economy, non-financial debt includes...' }
  ];

  return (
    <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>Previous Year Questions (PYQs 2015-2025)</h1>
      <p style={{ color: '#64748b', margin: '0 0 24px 0', fontSize: '14px' }}>Topic-wise solved papers with detailed explanations</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '900px' }}>
        {pyqs.map((item) => (
          <div key={item.id} style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '6px' }}>{item.exam} - {item.year}</span>
              <span style={{ fontSize: '12px', color: '#4338ca', fontWeight: 'bold' }}>Subject: {item.subject}</span>
            </div>
            <p style={{ fontSize: '15px', color: '#0f172a', fontWeight: '600', margin: '8px 0 14px 0' }}>{item.q}</p>
            <button style={{ background: 'transparent', color: '#4338ca', border: 'none', fontWeight: 'bold', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              View Answer & Expert Explanation <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}