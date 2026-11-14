import { BarChart2, Award, Clock, TrendingUp } from 'lucide-react';

export default function Performance() {
  return (
    <div style={{ padding: '32px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>Performance Analytics & Reports</h1>
      <p style={{ color: '#64748b', margin: '0 0 24px 0', fontSize: '14px' }}>Detailed breakdown of test scores, accuracy, and learning hours</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
          <Clock size={22} color="#4338ca" style={{ marginBottom: '10px' }} />
          <h4 style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '13px' }}>Total Learning Hours</h4>
          <span style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>184 Hours</span>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
          <Award size={22} color="#16a34a" style={{ marginBottom: '10px' }} />
          <h4 style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '13px' }}>Test Accuracy</h4>
          <span style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>76.4%</span>
        </div>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '14px', border: '1px solid #cbd5e1' }}>
          <TrendingUp size={22} color="#b45309" style={{ marginBottom: '10px' }} />
          <h4 style={{ margin: '0 0 4px 0', color: '#64748b', fontSize: '13px' }}>Avg Prelims Score</h4>
          <span style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a' }}>112 / 200</span>
        </div>
      </div>
    </div>
  );
}