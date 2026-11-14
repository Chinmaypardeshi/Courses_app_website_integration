import { useState } from 'react';
import { Calendar, CheckSquare, Flame, Plus } from 'lucide-react';

export default function StudyPlanner() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Complete Polity Chapter 4 - Fundamental Rights', done: true },
    { id: 2, title: 'Read Daily Editorials & PIB Summary', done: false },
    { id: 3, title: 'Attempt Sectional Mock Test on Modern History', done: false }
  ]);

  return (
    <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>Daily Study Planner & Goals</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>Track your daily milestones and maintain your study streak 🔥</p>
        </div>
        <div style={{ background: '#dcfce7', color: '#15803d', padding: '8px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Flame size={16} /> 14 Days Active Streak
        </div>
      </div>

      <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #cbd5e1', maxWidth: '800px' }}>
        <h3 style={{ margin: '0 0 16px 0', color: '#0f172a' }}>Today's Target Checklist</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tasks.map((t) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <input type="checkbox" checked={t.done} onChange={() => {}} style={{ width: '18px', height: '18px', accentColor: '#4338ca' }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: t.done ? '#94a3b8' : '#0f172a', textDecoration: t.done ? 'line-through' : 'none' }}>{t.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}