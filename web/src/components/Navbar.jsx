import { Link, useLocation } from 'react-router-dom';
import { Home as HomeIcon, BookOpen, HelpCircle, Newspaper, FileText, Bot, User, GraduationCap, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  const navLinks = [
    { path: '/home', label: 'Home', icon: HomeIcon },
    { path: '/courses', label: 'Courses', icon: BookOpen },
    { path: '/mock-tests', label: 'Mock Tests', icon: HelpCircle },
    { path: '/current-affairs', label: 'Current Affairs', icon: Newspaper },
    { path: '/mains-practice', label: 'Mains Practice', icon: FileText },
    { path: '/ai-assistant', label: 'AI Mentor', icon: Bot },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/admin', label: 'Admin Portal', icon: ShieldAlert }, // 👈 Permanent Admin Link Added
  ];

  return (
    <nav style={{ 
      background: '#0f172a', 
      padding: '0 20px', 
      height: '65px', 
      display: 'flex', 
      alignItems: 'center', 
      justify: 'space-between', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)', 
      position: 'sticky', 
      top: 0, 
      zIndex: 1000,
      width: '100%',
      boxSizing: 'border-box'
    }}>
      
      {/* Brand Logo */}
      <Link to="/home" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
        <div style={{ background: '#6366f1', padding: '6px', borderRadius: '8px', color: '#fff', display: 'flex', alignItems: 'center' }}>
          <GraduationCap size={20} />
        </div>
        <div>
          <span style={{ color: '#fff', fontSize: '16px', fontWeight: '800', letterSpacing: '0.5px' }}>
            UPSC<span style={{ color: '#6366f1' }}>IAS</span>
          </span>
          <span style={{ display: 'block', color: '#94a3b8', fontSize: '9px', fontWeight: '700', marginTop: '-2px' }}>
            EDTECH
          </span>
        </div>
      </Link>

      {/* Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 10px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '12px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease',
                color: item.path === '/admin' ? '#34d399' : (isActive ? '#ffffff' : '#94a3b8'),
                background: item.path === '/admin' ? 'rgba(16, 185, 129, 0.15)' : (isActive ? '#1e293b' : 'transparent'),
                border: item.path === '/admin' ? '1px solid rgba(16, 185, 129, 0.3)' : 'none',
                borderBottom: isActive && item.path !== '/admin' ? '2px solid #6366f1' : undefined
              }}
            >
              <Icon size={14} color={item.path === '/admin' ? '#34d399' : (isActive ? '#818cf8' : '#94a3b8')} />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* CTA Button */}
      <div style={{ flexShrink: 0 }}>
        <Link 
          to="/courses"
          style={{ 
            background: '#6366f1', 
            color: '#fff', 
            padding: '8px 14px', 
            borderRadius: '6px', 
            textDecoration: 'none', 
            fontSize: '12px', 
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            display: 'inline-block'
          }}
        >
          Enroll Now
        </Link>
      </div>

    </nav>
  );
}