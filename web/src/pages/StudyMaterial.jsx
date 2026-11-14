import { useState } from 'react';
import { FileText, Download, BookOpen, Search, ShieldCheck } from 'lucide-react';

export default function StudyMaterial() {
  const materials = [
    { id: 1, title: 'Complete Indian Polity Handouts & Articles Summary 2027', category: 'Polity', size: '4.2 MB', format: 'PDF' },
    { id: 2, title: 'Ancient & Medieval History Mind Maps for Quick Revision', category: 'History', size: '8.5 MB', format: 'PDF' },
    { id: 3, title: 'Economic Survey Core Highlights & Budget Analysis', category: 'Economy', size: '6.1 MB', format: 'PDF' }
  ];

  return (
    <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>Official Study Materials & Mind Maps</h1>
      <p style={{ color: '#64748b', margin: '0 0 24px 0', fontSize: '14px' }}>Curated high-yield PDF notes mapped with UPSC syllabus</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {materials.map((m) => (
          <div key={m.id} style={{ background: '#fff', padding: '22px', borderRadius: '14px', border: '1px solid #cbd5e1', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
            <span style={{ background: '#e0e7ff', color: '#4338ca', fontSize: '11px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '6px' }}>{m.category}</span>
            <h3 style={{ fontSize: '16px', color: '#0f172a', margin: '12px 0 8px 0', fontWeight: '750' }}>{m.title}</h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px 0' }}>Format: {m.format} • Size: {m.size}</p>
            <button style={{ width: '100%', background: '#4338ca', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px' }}>
              <Download size={16} /> Download Secure PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}