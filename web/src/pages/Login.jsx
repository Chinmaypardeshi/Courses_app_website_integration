import { API_BASE_URL } from '../api/config';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, Lock, User, GraduationCap, ArrowRight, Eye, EyeOff, 
  AlertCircle, RefreshCw, KeyRound, CheckCircle2, X 
} from 'lucide-react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile
} from '../firebase';

export default function Login() {
  const navigate = useNavigate();
  
  // Form States
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 4000);
  };

  // Clear stale session on mount
  useEffect(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

// Updated Email Trigger (Port 3000 Fix)
  const triggerWelcomeEmail = async (email, name) => {
    try {
      await fetch(`${API_BASE_URL}/api/send-welcome-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email, 
          name: name || email.split('@')[0] 
        })
      });
    } catch (err) {
      console.warn("Backend notification email error:", err.message);
    }
  };

// LOGIN & SIGNUP HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (isSignup && !formData.name)) {
      showToast("Please fill in all required fields!", "error");
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        // 1. SIGN UP (NEW USER) via Unified Backend / Supabase
        const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            fullName: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Registration failed.');
        }

        const user = data.user;
        const userData = {
          uid: user.id,
          id: user.id,
          name: user.name || formData.name.trim(),
          email: user.email,
          role: user.role || 'student',
          targetExam: 'UPSC CSE 2027',
        };

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);

        showToast(`Account Created! Welcome, ${formData.name.trim()}!`, "success");
        setTimeout(() => navigate('/home'), 1000);

      } else {
        // 2. SIGN IN (EXISTING USER) via Unified Backend / Supabase
        const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Invalid email or password.');
        }

        const user = data.user;
        const userData = {
          uid: user.id,
          id: user.id,
          name: user.name || user.full_name || formData.email.split('@')[0],
          email: user.email,
          role: user.role || 'student',
          targetExam: 'UPSC CSE 2027',
        };

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);

        showToast("Login Successful! Welcome back.", "success");
        setTimeout(() => navigate('/home'), 800);
      }

    } catch (err) {
      console.error("Auth Error:", err);
      showToast(err.message || "Authentication error! Please verify your details.", "error");
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD HANDLER
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      showToast("Please enter your email address.", "error");
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail.trim());
      showToast(`Password Reset link send to ${resetEmail} Please check your Inbox/Spam folder.`, "success");
      setShowForgotModal(false);
      setResetEmail('');
    } catch (error) {
      console.error(error);
      let errorMsg = "Failed to send password reset email. Please try again.";
      if (error.code === 'auth/user-not-found') errorMsg = "This email address is not registered!";
      if (error.code === 'auth/invalid-email') errorMsg = "Please enter a valid email address.";
      showToast(errorMsg, "error");
    } finally {
      setResetLoading(false);
    }
  };

  // GOOGLE OAUTH LOGIN
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      const userData = {
        uid: googleUser.uid,
        name: googleUser.displayName || 'Google User',
        email: googleUser.email,
        photoURL: googleUser.photoURL,
        targetExam: 'UPSC CSE 2027'
      };

      const token = await googleUser.getIdToken();
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);

      await triggerWelcomeEmail(googleUser.email, googleUser.displayName);

      showToast("Google Login Successful!", "success");
      setTimeout(() => navigate('/home'), 1000);
    } catch (err) {
      console.error("Google Auth Error:", err);
      showToast('Google Sign-In failed or cancelled.', "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'Inter', sans-serif", color: '#f8fafc' }}>
      
      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: toast.type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', padding: '14px 22px', borderRadius: '14px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1200, fontWeight: '700', fontSize: '14px', border: '1px solid rgba(255,255,255,0.2)' }}>
          {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          {toast.message}
        </div>
      )}

      {/* LOGIN/SIGNUP MAIN CARD */}
      <div style={{ width: '100%', maxWidth: '440px', background: 'linear-gradient(135deg, #131c31 0%, #0f172a 100%)', borderRadius: '28px', border: '1px solid rgba(255, 255, 255, 0.12)', padding: '40px 32px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)', position: 'relative' }}>
        
        {/* Header Icon */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', background: 'rgba(99, 102, 241, 0.15)', padding: '14px', borderRadius: '18px', color: '#818cf8', marginBottom: '14px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <GraduationCap size={32} />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff', margin: 0 }}>
            {isSignup ? 'Register UPSC Aspirant' : 'Welcome Back Aspirant'}
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '6px' }}>
            Unified Cloud Database Portal
          </p>
        </div>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', background: '#090d16', padding: '4px', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '24px' }}>
          <button 
            type="button"
            onClick={() => setIsSignup(false)}
            style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: !isSignup ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent', color: !isSignup ? '#ffffff' : '#94a3b8', fontWeight: '800', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Sign In
          </button>
          <button 
            type="button"
            onClick={() => setIsSignup(true)}
            style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: isSignup ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent', color: isSignup ? '#ffffff' : '#94a3b8', fontWeight: '800', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {isSignup && (
            <div>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Full Name</label>
              <div style={{ display: 'flex', alignItems: 'center', background: '#090d16', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '0 14px' }}>
                <User size={18} color="#94a3b8" style={{ minWidth: '18px' }} />
                <input 
                  type="text" 
                  required 
                  placeholder="Full Name" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '12px 10px', border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#ffffff' }} 
                />
              </div>
            </div>
          )}

          {/* Email Input */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Email Address</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#090d16', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '0 14px' }}>
              <Mail size={18} color="#94a3b8" style={{ minWidth: '18px' }} />
              <input 
                type="email" 
                required 
                placeholder="Enter your email address" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: '100%', padding: '12px 10px', border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#ffffff' }} 
              />
            </div>
          </div>

          {/* Password Input with Forgot Password Option */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#94a3b8' }}>Password</label>
              {!isSignup && (
                <button 
                  type="button" 
                  onClick={() => { setResetEmail(formData.email); setShowForgotModal(true); }}
                  style={{ background: 'none', border: 'none', color: '#818cf8', fontSize: '12px', fontWeight: '700', cursor: 'pointer', padding: 0 }}
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', background: '#090d16', border: '1px solid rgba(255, 255, 255, 0.12)', borderRadius: '12px', padding: '0 14px' }}>
              <Lock size={18} color="#94a3b8" style={{ minWidth: '18px' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                required 
                placeholder="••••••••" 
                value={formData.password} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{ width: '100%', padding: '12px 10px', border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#ffffff' }} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px', boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)' }}
          >
            {loading ? <RefreshCw size={18} className="animate-spin" /> : (isSignup ? 'Sign Up' : 'Sign In')} 
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* OR Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '22px 0', color: '#64748b', fontSize: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
          <span style={{ padding: '0 12px', fontWeight: '800' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }}></div>
        </div>

        {/* Google OAuth Button */}
        <button 
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{ width: '100%', background: '#131c31', border: '1px solid rgba(255, 255, 255, 0.15)', padding: '12px', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '13px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
          Sign In with Google OAuth
        </button>

        {/* Toggle Signup/Login Mode Link */}
        <p style={{ textAlign: 'center', marginTop: '22px', fontSize: '13px', color: '#94a3b8', margin: '22px 0 0 0' }}>
          {isSignup ? 'Already registered?' : "New to UPSC Platform?"}{' '}
          <button type="button" onClick={() => setIsSignup(!isSignup)} style={{ background: 'none', border: 'none', color: '#818cf8', fontWeight: '800', cursor: 'pointer', padding: 0 }}>
            {isSignup ? 'Log In' : 'Sign Up'}
          </button>
        </p>

      </div>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
          <div style={{ background: '#131c31', borderRadius: '24px', maxWidth: '420px', width: '100%', padding: '32px', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 25px 50px rgba(0,0,0,0.6)', position: 'relative' }}>
            
            <button 
              type="button"
              onClick={() => setShowForgotModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.08)', border: 'none', color: '#cbd5e1', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} />
            </button>

            <div style={{ width: '50px', height: '50px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
              <KeyRound size={24} color="#818cf8" />
            </div>

            <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', color: '#fff', fontWeight: '800' }}>Reset Password</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
              Apni registered email ID enter karein. Hum aapko password reset karne ka secure link bhejenge.
            </p>

            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Email Address</label>
                <input 
                  type="email" 
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.15)', background: '#090d16', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={resetLoading}
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#6366f1', color: '#fff', fontWeight: '800', fontSize: '14px', cursor: resetLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {resetLoading ? <RefreshCw size={18} className="animate-spin" /> : "Send Reset Link"}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}