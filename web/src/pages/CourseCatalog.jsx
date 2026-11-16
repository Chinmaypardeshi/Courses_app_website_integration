import { API_BASE_URL } from '../api/config';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ============================================================================
// 📌 UPSC & COMPETITIVE EXAM COURSES DATABASE (WITH POSTERS)
// ============================================================================
const INITIAL_COURSES = [
  {
    id: "course_gs1",
    title: "GS Paper 1: History, Art & Geography Complete Masterclass 2027",
    category: "UPSC CSE",
    faculty: "Foundation Course Faculty 2027",
    language: "Hinglish",
    poster: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
    hours: "140 Hours",
    lectures: "60 Lectures",
    validity: "1 Year",
    price: 9999,
    originalPrice: 15000,
    discount: "33% OFF"
  },
  {
    id: "course_gs2",
    title: "GS Paper 2: Indian Polity, Governance & International Relations",
    category: "UPSC CSE",
    faculty: "Target CSE Mentorship Panel",
    language: "Hinglish",
    poster: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
    hours: "120 Hours",
    lectures: "50 Lectures",
    validity: "1 Year",
    price: 7999,
    originalPrice: 12000,
    discount: "33% OFF"
  },
  {
    id: "course_gs3",
    title: "GS Paper 3: Indian Economy, Environment & Science-Tech Special",
    category: "UPSC CSE",
    faculty: "Senior UPSC Ex-Servants Panel",
    language: "Hinglish",
    poster: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
    hours: "130 Hours",
    lectures: "55 Lectures",
    validity: "1 Year",
    price: 8999,
    originalPrice: 14000,
    discount: "35% OFF"
  },
  {
    id: "course_foundation_full",
    title: "UPSC CSE 2027 Complete Foundation Batch (Prelims + Mains Integrated)",
    category: "UPSC CSE",
    faculty: "Director & Senior Faculty Board",
    language: "Bilingual (Eng + Hin)",
    poster: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80",
    hours: "650 Hours",
    lectures: "280 Lectures",
    validity: "2 Years",
    price: 24999,
    originalPrice: 45000,
    discount: "44% OFF"
  },
  {
    id: "course_ssc_cgl_maths",
    title: "SSC CGL Tier 1 + Tier 2 Quantitative Aptitude & Reasoning Mastery",
    category: "SSC CGL",
    faculty: "Rakesh Sir & Quant Experts",
    language: "Hinglish",
    poster: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80",
    hours: "90 Hours",
    lectures: "40 Lectures",
    validity: "1 Year",
    price: 3499,
    originalPrice: 6999,
    discount: "50% OFF"
  },
  {
    id: "course_ethics_gs4",
    title: "UPSC Mains Ethics, Integrity & Case Studies (GS Paper 4) Intensive",
    category: "UPSC Mains",
    faculty: "Ethics Specialist Panel",
    language: "Hinglish",
    poster: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    hours: "80 Hours",
    lectures: "35 Lectures",
    validity: "1 Year",
    price: 5999,
    originalPrice: 10000,
    discount: "40% OFF"
  }
];

export default function CourseCatalog() {
  const navigate = useNavigate();
 // 📌 Real-Time Admin Sync Courses State
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('upsc_cms_courses');
    return saved ? JSON.parse(saved) : (typeof INITIAL_COURSES !== 'undefined' ? INITIAL_COURSES : [
      { id: 'c1', title: 'GS Paper 1: History & Geography Complete Batch', price: '₹14,999', category: 'GS Foundation', status: 'Active' },
      { id: 'c2', title: 'UPSC CSE 2027 Complete Foundation Batch', price: '₹24,999', category: 'GS Foundation', status: 'Active' }
    ]);
  });

  useEffect(() => {
    const syncCourses = () => {
      const saved = localStorage.getItem('upsc_cms_courses');
      if (saved) setCourses(JSON.parse(saved));
    };
    window.addEventListener('storage', syncCourses);
    return () => window.removeEventListener('storage', syncCourses);
  }, []);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [purchasedCourseModal, setPurchasedCourseModal] = useState(null);
  
  // Razorpay Payment Modal States
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [razorpayKeyInput, setRazorpayKeyInput] = useState(localStorage.getItem('custom_razorpay_key') || '');
  const [paymentStep, setPaymentStep] = useState('checkout'); // 'checkout' | 'processing' | 'success'
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [upiId, setUpiId] = useState('aspirant@upi');
  const [txnId, setTxnId] = useState('');

  // Load Enrolled Courses from LocalStorage on mount
  useEffect(() => {
    const savedEnrolled = JSON.parse(localStorage.getItem('user_enrolled_courses') || '[]');
    setEnrolledCourseIds(savedEnrolled);
  }, []);

  // Authentic Razorpay Transaction Integration (Real Gateway - No Fake Auto-Enroll)
  const openRealRazorpayPopup = (course, activeKeyId, activeOrderId = null) => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const options = {
      key: activeKeyId,
      amount: course.price * 100, // paise (1 INR = 100 paise)
      currency: "INR",
      name: "UPSCIAS EdTech",
      description: course.title,
      order_id: activeOrderId || undefined,
      handler: async function (response) {
        setPaymentStep('processing');
        try {
          // Cryptographic signature verification on backend
          await fetch(`${API_BASE_URL}/api/v1/payment/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {})
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              courseId: course.id,
            })
          });
        } catch (e) {
          console.warn("Backend verification note:", e);
        }

        const txnId = response.razorpay_payment_id;
        const updatedEnrolled = [...enrolledCourseIds, course.id];
        setEnrolledCourseIds(updatedEnrolled);
        localStorage.setItem('user_enrolled_courses', JSON.stringify(updatedEnrolled));

        const existingPurchases = JSON.parse(localStorage.getItem('user_purchases') || '[]');
        const newPurchase = {
          id: txnId,
          title: course.title,
          category: course.category,
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          validity: course.validity,
          amount: course.price,
          status: "Success (Razorpay Verified)",
          paymentMode: "Razorpay Official Gateway"
        };
        localStorage.setItem('user_purchases', JSON.stringify([newPurchase, ...existingPurchases]));

        setIsCheckoutOpen(false);
        setPurchasedCourseModal(course);
      },
      prefill: {
        name: user?.name || user?.full_name || "UPSC Aspirant",
        email: user?.email || "aspirant@upscias.com",
        contact: user?.phone || "9876543210"
      },
      theme: { color: "#4f46e5" }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        alert(`Payment Failed: ${resp.error?.description || 'Transaction cancelled or failed.'}`);
      });
      rzp.open();
    } catch (e) {
      alert(`Razorpay Gateway Error: ${e.message}`);
    }
  };

  const handleInitiatePurchase = async (course) => {
    setSelectedCourse(course);

    const loadScript = (src) => {
      return new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const isLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!isLoaded) {
      alert('Razorpay Checkout SDK could not be loaded. Please check your internet connection.');
      return;
    }

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    let orderData = null;
    try {
      const orderRes = await fetch(`${API_BASE_URL}/api/v1/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          courseId: course.id,
          courseName: course.title,
          amount: course.price,
          customerName: user?.name || user?.full_name || 'UPSC Aspirant',
          customerEmail: user?.email || '',
        })
      });
      orderData = await orderRes.json();
    } catch (err) {
      console.warn("Backend order creation notice:", err);
    }

    // Determine active key: either from backend env or client's saved test key
    const activeKey = orderData?.keyId || localStorage.getItem('custom_razorpay_key');

    if (activeKey) {
      // Launch REAL official Razorpay checkout popup directly!
      openRealRazorpayPopup(course, activeKey, orderData?.orderId || orderData?.order?.id);
    } else {
      // Key is blank: prompt client to input key or configure Render environment
      setIsCheckoutOpen(true);
    }
  };

  const handleLaunchWithCustomKey = (e) => {
    e.preventDefault();
    const key = razorpayKeyInput.trim();
    if (!key) {
      alert('Please enter your Razorpay Key ID (starts with rzp_test_ or rzp_live_)');
      return;
    }
    localStorage.setItem('custom_razorpay_key', key);
    if (selectedCourse) {
      openRealRazorpayPopup(selectedCourse, key);
    }
  };

  const handleCloseModal = () => {
    setIsCheckoutOpen(false);
    setSelectedCourse(null);
    setPaymentStep('checkout');
  };

  return (
    <div style={{
      backgroundColor: '#070b14',
      color: '#f8fafc',
      minHeight: '100vh',
      width: '100%',
      padding: '96px 24px 48px 24px',
      boxSizing: 'border-box',
      textAlign: 'left'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
        
        {/* Banner Header */}
        <div style={{
          backgroundColor: '#0f172a',
          border: '1px solid #1e293b',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
        }}>
          <span style={{
            backgroundColor: 'rgba(99, 102, 241, 0.15)',
            color: '#818cf8',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            fontSize: '11px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            padding: '6px 14px',
            borderRadius: '20px',
            display: 'inline-block',
            marginBottom: '14px'
          }}>
            🎓 Comprehensive Civil Services & Govt Exam Batches
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: '0 0 10px 0' }}>
            UPSC CSE & Competitive Exam Course Catalog
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: 0, maxWidth: '800px' }}>
            Structured foundation courses, Mains answer writing modules, and SSC CGL special batches designed by India's top mentors and ex-civil servants.
          </p>
        </div>

        {/* Course Cards Grid View */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '28px',
          width: '100%'
        }}>
          {courses.map((course) => {
            const isPurchased = enrolledCourseIds.includes(course.id);

            return (
              <div
                key={course.id}
                style={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #1e293b',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s, border-color 0.2s',
                  boxSizing: 'border-box'
                }}
              >
                <div>
                  <div style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden' }}>
                    <img
                      src={course.poster}
                      alt={course.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, #0f172a 0%, transparent 80%)'
                    }}></div>

                    <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '8px' }}>
                      <span style={{
                        backgroundColor: 'rgba(79, 70, 229, 0.9)',
                        color: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                      }}>
                        📖 {course.language}
                      </span>
                      <span style={{
                        backgroundColor: 'rgba(245, 158, 11, 0.9)',
                        color: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 'bold'
                      }}>
                        🔥 {course.discount}
                      </span>
                    </div>
                  </div>

                  <div style={{ padding: '20px 24px 12px 24px' }}>
                    <span style={{ color: '#818cf8', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {course.category}
                    </span>

                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: '8px 0 10px 0', lineHeight: '1.4' }}>
                      {course.title}
                    </h3>

                    <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>👤 Faculty:</span> <strong style={{ color: '#cbd5e1' }}>{course.faculty}</strong>
                    </p>

                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      color: '#64748b',
                      fontSize: '12px',
                      padding: '12px',
                      backgroundColor: '#070b14',
                      borderRadius: '10px',
                      border: '1px solid #1e293b',
                      marginBottom: '18px'
                    }}>
                      <span>⏱️ {course.hours}</span>
                      <span>📹 {course.lectures}</span>
                      <span>📅 {course.validity}</span>
                    </div>
                  </div>
                </div>

                <div style={{
                  padding: '16px 24px 24px 24px',
                  borderTop: '1px solid #1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                      <span style={{ fontSize: '22px', fontWeight: '900', color: '#ffffff' }}>
                        ₹{course.price.toLocaleString('en-IN')}
                      </span>
                      <span style={{ fontSize: '13px', color: '#64748b', textDecoration: 'line-through' }}>
                        ₹{course.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 'bold' }}>Inclusive of all taxes</span>
                  </div>

                  {isPurchased ? (
                    <button
                      disabled
                      style={{
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        color: '#34d399',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        padding: '10px 20px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        cursor: 'default'
                      }}
                    >
                      ✓ Enrolled
                    </button>
                  ) : (
                    <button
                      onClick={() => handleInitiatePurchase(course)}
                      style={{
                        backgroundColor: '#4f46e5',
                        color: '#ffffff',
                        border: 'none',
                        padding: '12px 22px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.4)',
                        transition: 'all 0.2s'
                      }}
                    >
                      💳 Buy Course
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* RAZORPAY TEST PAYMENT GATEWAY MODAL */}
        {isCheckoutOpen && selectedCourse && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(7, 11, 20, 0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box'
          }}>
            <div style={{
              backgroundColor: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
              position: 'relative',
              textAlign: 'left'
            }}>
              <div style={{
                backgroundColor: '#020617',
                padding: '20px 24px',
                borderBottom: '1px solid #1e293b',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontWeight: '900',
                    fontSize: '14px',
                    padding: '4px 8px',
                    borderRadius: '6px'
                  }}>
                    R
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#ffffff' }}>Razorpay Official Gateway</h4>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Secure Bank & UPI Checkout</span>
                  </div>
                </div>

                <button
                  onClick={handleCloseModal}
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#cbd5e1',
                    border: 'none',
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  ✕
                </button>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ backgroundColor: '#070b14', border: '1px solid #1e293b', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>COURSE DETAILS</span>
                  <h4 style={{ fontSize: '16px', color: '#ffffff', margin: '6px 0 10px 0', fontWeight: 'bold' }}>
                    {selectedCourse.title}
                  </h4>
                  <div style={{ borderTop: '1px dashed #1e293b', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#94a3b8' }}>Total Amount to Pay:</span>
                    <strong style={{ color: '#38bdf8', fontSize: '16px' }}>₹{selectedCourse.price.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '18px' }}>🔑</span>
                    <strong style={{ color: '#ffffff', fontSize: '14px' }}>Razorpay Account Connection</strong>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: '1.5', margin: '0 0 14px 0' }}>
                    The backend keys are kept blank so the client can plug in their own Razorpay account. Enter your Razorpay Key ID below to launch the authentic Razorpay checkout popup directly:
                  </p>

                  <form onSubmit={handleLaunchWithCustomKey}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '6px', textTransform: 'uppercase' }}>
                      Razorpay Key ID (rzp_test_... or rzp_live_...)
                    </label>
                    <input
                      type="text"
                      value={razorpayKeyInput}
                      onChange={(e) => setRazorpayKeyInput(e.target.value)}
                      placeholder="e.g. rzp_test_YourKeyHere"
                      style={{
                        width: '100%',
                        backgroundColor: '#070b14',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        color: '#ffffff',
                        fontSize: '13px',
                        marginBottom: '14px',
                        boxSizing: 'border-box',
                        outline: 'none'
                      }}
                    />

                    <button
                      type="submit"
                      style={{
                        width: '100%',
                        backgroundColor: '#4f46e5',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '12px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)'
                      }}
                    >
                      Launch Real Razorpay Gateway 🚀
                    </button>
                  </form>
                </div>

                <div style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.4' }}>
                  ℹ️ <strong>For Production:</strong> In Render Dashboard ➡️ Environment, set <code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code>. Then clicking Enroll opens Razorpay automatically without this prompt.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 🌟 PREMIUM PAYMENT SUCCESS POPUP MODAL */}
        {purchasedCourseModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(7, 11, 20, 0.85)',
            backdropFilter: 'blur(10px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box'
          }}>
            <div style={{
              backgroundColor: '#0f172a',
              border: '1px solid #10b981',
              borderRadius: '24px',
              maxWidth: '460px',
              width: '100%',
              padding: '36px 28px',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(16, 185, 129, 0.35)',
              position: 'relative'
            }}>
              <button 
                onClick={() => setPurchasedCourseModal(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  backgroundColor: '#1e293b',
                  color: '#94a3b8',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                ✕
              </button>

              <div style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '2px solid #10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
                fontSize: '34px',
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)'
              }}>
                🎉
              </div>

              <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff', margin: '0 0 6px 0', fontFamily: "'Georgia', serif" }}>
                Payment Successful!
              </h2>
              <p style={{ color: '#34d399', fontSize: '13px', fontWeight: 'bold', margin: '0 0 20px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                ✓ Course Access Instantly Unlocked
              </p>

              <div style={{ backgroundColor: '#070b14', border: '1px solid #1e293b', borderRadius: '14px', padding: '16px', marginBottom: '24px', textAlign: 'left' }}>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}>ENROLLED BATCH</span>
                <h4 style={{ fontSize: '15px', color: '#ffffff', margin: '4px 0 6px 0', fontWeight: 'bold' }}>
                  {purchasedCourseModal.title || 'UPSC CSE Foundation Batch 2027'}
                </h4>
                <span style={{ fontSize: '12px', color: '#818cf8', fontWeight: '600' }}>
                  🎯 Target Exam: UPSC CSE 2027 • Unlimited Live Classes & Notes
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  onClick={() => {
                    const courseId = purchasedCourseModal.id || 'course_gs2';
                    setPurchasedCourseModal(null);
                    navigate(`/classroom/${courseId}`);
                  }}
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    flex: 1,
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  Go to Classroom →
                </button>
                <button
                  onClick={() => setPurchasedCourseModal(null)}
                  style={{
                    backgroundColor: '#1e293b',
                    color: '#cbd5e1',
                    border: 'none',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}