import React, { useState, useEffect } from 'react';

// ============================================================================
// 📌 MOCK TESTS DATABASE & EXAM DATA WITH HIGH-RES TEST THUMBNAILS
// ============================================================================
const AVAILABLE_TESTS = [
  {
    id: "upsc_gs1_2027",
    title: "UPSC CSE Prelims GS Paper 1 Full Mock 2027",
    category: "UPSC Prelims",
    level: "Standard",
    badge: "🔥 Most Popular",
    badgeColor: "#6366f1",
    thumbnail: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80",
    questionsCount: 5,
    timeMins: 10,
    totalMarks: 10,
    positiveMarks: 2.0,
    negativeMarks: 0.66,
    questions: [
      {
        id: 1,
        question: "Which of the following Constitutional Amendment Acts inserted Article 21A (Right to Education) into the Constitution of India?",
        options: [
          "44th Amendment Act, 1978",
          "86th Amendment Act, 2002",
          "91st Amendment Act, 2003",
          "103rd Amendment Act, 2019"
        ],
        correct: 1,
        explanation: "The 86th Constitutional Amendment Act, 2002 inserted Article 21A in the Constitution of India to provide free and compulsory education of all children in the age group of six to fourteen years as a Fundamental Right."
      },
      {
        id: 2,
        question: "Consider the following statements regarding the Monetary Policy Committee (MPC):\n1. It is a 6-member statutory body constituted under the RBI Act, 1934.\n2. The RBI Governor has a casting vote in case of an equality of votes.\nWhich of the statements given above is/are correct?",
        options: [
          "1 only",
          "2 only",
          "Both 1 and 2",
          "Neither 1 nor 2"
        ],
        correct: 2,
        explanation: "Both statements are correct. Section 45ZB of the amended RBI Act, 1934 provides for an empowered six-member Monetary Policy Committee (MPC). The Governor of RBI has a second or casting vote in case of a tie."
      },
      {
        id: 3,
        question: "The 'Kunming-Montreal Global Biodiversity Framework' was adopted under which of the following international conventions?",
        options: [
          "UN Framework Convention on Climate Change (UNFCCC)",
          "UN Convention to Combat Desertification (UNCCD)",
          "UN Convention on Biological Diversity (UNCBD)",
          "Ramsar Convention on Wetlands"
        ],
        correct: 2,
        explanation: "The Kunming-Montreal Global Biodiversity Framework (GBF) was adopted during the 15th meeting of the Conference of the Parties (COP 15) to the Convention on Biological Diversity (CBD) in December 2022."
      },
      {
        id: 4,
        question: "With reference to the Indian Judiciary, consider the following statements:\n1. Any retired judge of the Supreme Court of India can be called back to sit and act as a Supreme Court judge by the Chief Justice of India.\n2. A High Court in India has the power to review its own judgment just like the Supreme Court does.\nWhich of the statements given above is/are correct?",
        options: [
          "1 only",
          "2 only",
          "Both 1 and 2",
          "Neither 1 nor 2"
        ],
        correct: 2,
        explanation: "Under Article 128, the CJI can request a retired SC judge with the prior consent of the President. High Courts as courts of record also possess inherent power to review their own judgments."
      },
      {
        id: 5,
        question: "The 'India-Middle East-Europe Economic Corridor (IMEC)' includes which of the following infrastructure routes?",
        options: [
          "Northern Corridor connecting India to Russia via Iran",
          "East Corridor connecting India to the Arabian Gulf and Northern Corridor connecting Gulf to Europe",
          "Southern Corridor linking India to South-East Asia",
          "Western Maritime Route connecting India directly to Africa"
        ],
        correct: 1,
        explanation: "IMEC comprises two main corridors: the East Corridor connecting India to the Arabian Gulf, and the Northern Corridor connecting the Arabian Gulf to Europe."
      }
    ]
  },
  {
    id: "ssc_cgl_tier1_quant",
    title: "SSC CGL Tier 1 Quantitative & Reasoning Speed Mock",
    category: "SSC CGL",
    level: "Standard",
    badge: "⚡ High Speed Test",
    badgeColor: "#d97706",
    thumbnail: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&auto=format&fit=crop&q=80",
    questionsCount: 5,
    timeMins: 8,
    totalMarks: 10,
    positiveMarks: 2.0,
    negativeMarks: 0.50,
    questions: [
      {
        id: 1,
        question: "If a sum of money doubles itself at simple interest in 8 years, what is the rate of interest per annum?",
        options: [
          "10%",
          "12.5%",
          "15%",
          "8%"
        ],
        correct: 1,
        explanation: "Simple Interest = Principal. SI = (P * R * T) / 100 => P = (P * R * 8) / 100 => R = 100 / 8 = 12.5% per annum."
      },
      {
        id: 2,
        question: "Select the related letter pair from the given options: Ratio: Analogy :: Proportion : ?",
        options: [
          "Equation",
          "Symmetry",
          "Fractions",
          "Relation"
        ],
        correct: 1,
        explanation: "Just as Ratio is related to Analogy in logical comparison, Proportion represents mathematical Symmetry."
      },
      {
        id: 3,
        question: "The ratio of the ages of A and B is 4:5. Four years hence, the sum of their ages will be 44 years. What is the present age of A?",
        options: [
          "16 years",
          "20 years",
          "24 years",
          "12 years"
        ],
        correct: 0,
        explanation: "Let ages be 4x and 5x. Four years hence: (4x + 4) + (5x + 4) = 44 => 9x + 8 = 44 => 9x = 36 => x = 4. Age of A = 4 * 4 = 16 years."
      },
      {
        id: 4,
        question: "If 'CODES' is written as 'DQEFT' in a certain code language, how will 'UPSC' be written in that code?",
        options: [
          "VQTD",
          "VQTE",
          "VRTD",
          "UQTDE"
        ],
        correct: 0,
        explanation: "Each letter is shifted forward by +1: U(+1)->V, P(+1)->Q, S(+1)->T, C(+1)->D. Result: VQTD."
      },
      {
        id: 5,
        question: "A train running at a speed of 72 km/h crosses a pole in 15 seconds. What is the length of the train?",
        options: [
          "200 meters",
          "300 meters",
          "250 meters",
          "350 meters"
        ],
        correct: 1,
        explanation: "Speed in m/s = 72 * (5/18) = 20 m/s. Distance (Length of train) = Speed * Time = 20 * 15 = 300 meters."
      }
    ]
  },
  {
    id: "polity_sectional_1",
    title: "Indian Polity & Constitution Sectional Test (Art 1 - 51A)",
    category: "UPSC Prelims",
    level: "Standard",
    badge: "🏛️ High Yield Polity",
    badgeColor: "#059669",
    thumbnail: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80",
    questionsCount: 4,
    timeMins: 6,
    totalMarks: 8,
    positiveMarks: 2.0,
    negativeMarks: 0.66,
    questions: [
      {
        id: 1,
        question: "Which Article of the Constitution of India provides for the Abolition of Untouchability?",
        options: ["Article 14", "Article 17", "Article 19", "Article 21"],
        correct: 1,
        explanation: "Article 17 explicitly abolishes untouchability and forbids its practice in any form."
      },
      {
        id: 2,
        question: "Which part of the Indian Constitution deals with Fundamental Duties?",
        options: ["Part III", "Part IV", "Part IV-A", "Part V"],
        correct: 2,
        explanation: "Part IV-A (Article 51A) incorporated through the 42nd Amendment Act 1976 deals with Fundamental Duties."
      },
      {
        id: 3,
        question: "The Directive Principles of State Policy (DPSP) are borrowed from the constitution of which country?",
        options: ["USA", "Ireland", "Britain", "Canada"],
        correct: 1,
        explanation: "DPSPs contained in Part IV of the Indian Constitution were borrowed from the Irish Constitution."
      },
      {
        id: 4,
        question: "Under which Article can the Supreme Court issue writs for the enforcement of Fundamental Rights?",
        options: ["Article 32", "Article 226", "Article 136", "Article 143"],
        correct: 0,
        explanation: "Article 32 gives the right to individuals to move the Supreme Court directly for enforcement of Fundamental Rights."
      }
    ]
  }
];

export default function MockTests() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedTest, setSelectedTest] = useState(null);
  const [examState, setExamState] = useState("selection"); // 'selection' | 'instructions' | 'active' | 'result'
  // 📌 Real-Time Admin Sync Mock Tests State
  const [mockTests, setMockTests] = useState(() => {
    const saved = localStorage.getItem('upsc_cms_mocks');
    return saved ? JSON.parse(saved) : (typeof AVAILABLE_TESTS !== 'undefined' ? AVAILABLE_TESTS : [
      { id: 'm1', title: 'Prelims Mock Test 1: Polity & Constitution', totalQuestions: 100, duration: '120 Mins', status: 'Published' }
    ]);
  });

  useEffect(() => {
    const syncMocks = () => {
      const saved = localStorage.getItem('upsc_cms_mocks');
      if (saved) setMockTests(JSON.parse(saved));
    };
    window.addEventListener('storage', syncMocks);
    return () => window.removeEventListener('storage', syncMocks);
  }, []);
  // Active Test State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [reviewStatus, setReviewStatus] = useState({});
  const [visitedStatus, setVisitedStatus] = useState({ 0: true });
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Timer Countdown Effect
  useEffect(() => {
    let timer = null;
    if (examState === "active" && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examState, secondsLeft]);

  // Start Exam Flow
  const handleOpenInstructions = (test) => {
    setSelectedTest(test);
    setExamState("instructions");
  };

  const handleStartExam = () => {
    setUserAnswers({});
    setReviewStatus({});
    setVisitedStatus({ 0: true });
    setCurrentQIndex(0);
    setSecondsLeft(selectedTest.timeMins * 60);
    setExamState("active");
  };

  const handleSelectOption = (qIdx, optionIdx) => {
    setUserAnswers((prev) => ({ ...prev, [qIdx]: optionIdx }));
  };

  const handleNextQuestion = () => {
    if (currentQIndex < selectedTest.questions.length - 1) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      setVisitedStatus((prev) => ({ ...prev, [nextIdx]: true }));
    }
  };

  const handlePrevQuestion = () => {
    if (currentQIndex > 0) {
      const prevIdx = currentQIndex - 1;
      setCurrentQIndex(prevIdx);
      setVisitedStatus((prev) => ({ ...prev, [prevIdx]: true }));
    }
  };

  const handleToggleReview = () => {
    setReviewStatus((prev) => ({ ...prev, [currentQIndex]: !prev[currentQIndex] }));
  };

  const handleClearAnswer = () => {
    setUserAnswers((prev) => {
      const updated = { ...prev };
      delete updated[currentQIndex];
      return updated;
    });
  };

  const handleJumpToQuestion = (idx) => {
    setCurrentQIndex(idx);
    setVisitedStatus((prev) => ({ ...prev, [idx]: true }));
  };

  const handleSubmitTest = () => {
    setExamState("result");
  };

  // Score Calculation
  const calculateResults = () => {
    if (!selectedTest) return { score: 0, correct: 0, incorrect: 0, unattempted: 0, accuracy: 0 };
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    selectedTest.questions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      if (ans === undefined) {
        unattempted++;
      } else if (ans === q.correct) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const score = (correct * selectedTest.positiveMarks) - (incorrect * selectedTest.negativeMarks);
    const attempted = correct + incorrect;
    const accuracy = attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    return { score: score.toFixed(2), correct, incorrect, unattempted, accuracy };
  };

  // Format Timer MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredTests = AVAILABLE_TESTS.filter(t => {
    if (activeTab === "All") return true;
    return t.category.toLowerCase().includes(activeTab.toLowerCase());
  });

  return (
    <div style={{
      backgroundColor: '#070b14',
      color: '#f8fafc',
      minHeight: '100vh',
      width: '100%',
      padding: examState === 'active' ? '0' : '40px 24px 48px 24px',
      boxSizing: 'border-box',
      textAlign: 'left',
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: examState === 'active' ? '100%' : '1280px', margin: '0 auto', width: '100%' }}>
        
        {/* ==================================================================== */}
        {/* VIEW 1: TEST SELECTION DASHBOARD WITH VISUAL BANNER POSTERS */}
        {/* ==================================================================== */}
        {examState === "selection" && (
          <div>
            {/* Banner Header */}
            <div style={{
              backgroundColor: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '20px',
              padding: '32px',
              marginBottom: '28px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)'
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
                🎯 National Level Computer Based Test (CBT) Series
              </span>
              <h1 style={{ fontFamily: "'Georgia', serif", fontSize: '32px', fontWeight: '900', color: '#ffffff', margin: '0 0 10px 0' }}>
                Full-Length Mocks & Sectional Practice Tests
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: 0, maxWidth: '800px' }}>
                Simulate authentic exam conditions for UPSC CSE Prelims, SSC CGL Tier 1/2, and State PSCs with live negative marking and detailed analytical solutions.
              </p>
            </div>

            {/* Category Tabs */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '28px', borderBottom: '1px solid #1e293b', paddingBottom: '14px' }}>
              {["All", "UPSC Prelims", "SSC CGL"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    border: '1px solid',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: activeTab === tab ? '#4f46e5' : '#0f172a',
                    color: activeTab === tab ? '#ffffff' : '#94a3b8',
                    borderColor: activeTab === tab ? '#6366f1' : '#1e293b'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Test Cards Grid With HD Images */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '24px',
              width: '100%'
            }}>
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  style={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #1e293b',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justify: 'space-between',
                    minHeight: '320px',
                    boxSizing: 'border-box',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                    transition: 'all 0.2s'
                  }}
                >
                  <div>
                    {/* Visual Card Image Poster Header */}
                    <div style={{ position: 'relative', height: '160px', width: '100%', overflow: 'hidden' }}>
                      <img 
                        src={test.thumbnail} 
                        alt={test.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to top, #0f172a 0%, transparent 70%)' }}></div>
                      
                      {/* Badge Tags */}
                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: '#070b14',
                        color: '#38bdf8',
                        border: '1px solid #0284c7',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: '900',
                        textTransform: 'uppercase'
                      }}>
                        {test.category}
                      </span>

                      <span style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        backgroundColor: test.badgeColor || '#4f46e5',
                        color: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                      }}>
                        {test.badge}
                      </span>
                    </div>

                    {/* Card Content Details */}
                    <div style={{ padding: '16px 20px 12px 20px' }}>
                      <h3 style={{ fontFamily: "'Georgia', serif", fontSize: '17px', fontWeight: 'bold', color: '#ffffff', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                        {test.title}
                      </h3>

                      <div style={{ display: 'flex', gap: '14px', color: '#94a3b8', fontSize: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <span style={{ backgroundColor: '#070b14', border: '1px solid #1e293b', padding: '4px 8px', borderRadius: '6px' }}>📝 {test.questionsCount} Qs</span>
                        <span style={{ backgroundColor: '#070b14', border: '1px solid #1e293b', padding: '4px 8px', borderRadius: '6px' }}>⏱️ {test.timeMins} Mins</span>
                        <span style={{ backgroundColor: '#070b14', border: '1px solid #1e293b', padding: '4px 8px', borderRadius: '6px' }}>🏆 {test.totalMarks} Marks</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Button Footer */}
                  <div style={{ padding: '12px 20px 16px 20px', borderTop: '1px solid #1e293b' }}>
                    <button
                      onClick={() => handleOpenInstructions(test)}
                      style={{
                        width: '100%',
                        backgroundColor: '#4f46e5',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '12px',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <span>▶ Start Mock Test Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 2: EXAM GUIDELINES MODAL */}
        {/* ==================================================================== */}
        {examState === "instructions" && selectedTest && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            boxSizing: 'border-box'
          }}>
            <div style={{
              backgroundColor: '#0b1120',
              border: '1px solid #334155',
              borderRadius: '20px',
              maxWidth: '650px',
              width: '100%',
              padding: '32px',
              position: 'relative',
              textAlign: 'left'
            }}>
              <button
                onClick={() => setExamState("selection")}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: '#1e293b',
                  color: '#ffffff',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ✕
              </button>

              <span style={{ color: '#818cf8', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                ⚙️ Official Examination Guidelines
              </span>
              <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#ffffff', margin: '8px 0 12px 0' }}>
                {selectedTest.title}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', marginBottom: '24px' }}>
                Please review the test parameters and evaluation rules carefully before initiating your exam session:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '16px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>TOTAL QUESTIONS</span>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: '4px 0 0 0' }}>{selectedTest.questionsCount} Qs</p>
                </div>
                <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '16px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>TIME ALLOTTED</span>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffffff', margin: '4px 0 0 0' }}>{selectedTest.timeMins} Mins</p>
                </div>
                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '16px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#34d399', fontWeight: 'bold' }}>CORRECT ANSWER</span>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#34d399', margin: '4px 0 0 0' }}>+{selectedTest.positiveMarks} Marks</p>
                </div>
                <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '16px', borderRadius: '12px' }}>
                  <span style={{ fontSize: '11px', color: '#f87171', fontWeight: 'bold' }}>NEGATIVE MARKING</span>
                  <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#f87171', margin: '4px 0 0 0' }}>-{selectedTest.negativeMarks} Marks</p>
                </div>
              </div>

              <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #1e293b', marginBottom: '28px' }}>
                <p style={{ color: '#fbbf24', fontSize: '12px', margin: 0 }}>
                  ⚠️ The countdown timer will start immediately upon clicking begin and cannot be paused once initiated.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setExamState("selection")}
                  style={{ backgroundColor: '#1e293b', color: '#cbd5e1', border: 'none', padding: '12px 24px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Back
                </button>
                <button
                  onClick={handleStartExam}
                  style={{ backgroundColor: '#10b981', color: '#ffffff', border: 'none', padding: '12px 28px', borderRadius: '10px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  I am Ready, Begin Test
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 3: LIVE COMPUTER BASED TEST (CBT) INTERFACE */}
        {/* ==================================================================== */}
        {examState === "active" && selectedTest && (
          <div style={{ width: '100%', minHeight: '100vh', backgroundColor: '#070b14', display: 'flex', flexDirection: 'column' }}>
            
            {/* Top Examination Header */}
            <div style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #1e293b', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
                  {selectedTest.title}
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Question {currentQIndex + 1} of {selectedTest.questions.length}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* Timer Box */}
                <div style={{ backgroundColor: '#070b14', border: '1px solid #334155', padding: '8px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Time Left:</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: secondsLeft < 120 ? '#ef4444' : '#10b981' }}>
                    ⏱️ {formatTime(secondsLeft)}
                  </span>
                </div>

                <button
                  onClick={handleSubmitTest}
                  style={{ backgroundColor: '#ef4444', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Submit Test
                </button>
              </div>
            </div>

            {/* Main Exam Layout Split */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', flex: 1, height: 'calc(100vh - 73px)' }}>
              
              {/* Left Question & Options Panel */}
              <div style={{ padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyBetween: 'space-between', borderRight: '1px solid #1e293b' }}>
                <div>
                  {/* Marks & Question Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#818cf8' }}>
                      Question {currentQIndex + 1}
                    </span>
                    <span style={{ fontSize: '12px', color: '#34d399', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                      +{selectedTest.positiveMarks} Marks / -{selectedTest.negativeMarks} Negative
                    </span>
                  </div>

                  {/* Question Text */}
                  <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '14px', padding: '24px', marginBottom: '28px' }}>
                    <p style={{ fontSize: '16px', color: '#ffffff', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-line', fontWeight: '500' }}>
                      {selectedTest.questions[currentQIndex].question}
                    </p>
                  </div>

                  {/* Options List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                    {selectedTest.questions[currentQIndex].options.map((opt, oIdx) => {
                      const isSelected = userAnswers[currentQIndex] === oIdx;
                      return (
                        <div
                          key={oIdx}
                          onClick={() => handleSelectOption(currentQIndex, oIdx)}
                          style={{
                            backgroundColor: isSelected ? 'rgba(79, 70, 229, 0.2)' : '#0f172a',
                            border: `1px solid ${isSelected ? '#6366f1' : '#1e293b'}`,
                            borderRadius: '12px',
                            padding: '16px 20px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: `2px solid ${isSelected ? '#6366f1' : '#475569'}`,
                            backgroundColor: isSelected ? '#6366f1' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: '#ffffff'
                          }}>
                            {String.fromCharCode(65 + oIdx)}
                          </div>
                          <span style={{ fontSize: '14px', color: isSelected ? '#ffffff' : '#cbd5e1' }}>
                            {opt}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Question Control Buttons */}
                <div style={{ borderTop: '1px solid #1e293b', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={handleToggleReview}
                      style={{
                        backgroundColor: reviewStatus[currentQIndex] ? '#8b5cf6' : '#1e293b',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 18px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      {reviewStatus[currentQIndex] ? "🟣 Marked for Review" : "Mark for Review"}
                    </button>
                    <button
                      onClick={handleClearAnswer}
                      style={{ backgroundColor: '#1e293b', color: '#94a3b8', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Clear Answer
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      disabled={currentQIndex === 0}
                      onClick={handlePrevQuestion}
                      style={{
                        backgroundColor: '#1e293b',
                        color: currentQIndex === 0 ? '#475569' : '#ffffff',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: currentQIndex === 0 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={handleNextQuestion}
                      style={{ backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', padding: '10px 24px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Save & Next →
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Side Question Palette Panel */}
              <div style={{ backgroundColor: '#0f172a', padding: '24px', overflowY: 'auto' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#94a3b8', uppercase: 'true', marginBottom: '16px' }}>
                  QUESTION PALETTE
                </h4>

                {/* Status Legend */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11px', color: '#cbd5e1', marginBottom: '24px', backgroundColor: '#070b14', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '3px' }}></span> Answered
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '12px', height: '12px', backgroundColor: '#ef4444', borderRadius: '3px' }}></span> Unanswered
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '12px', height: '12px', backgroundColor: '#8b5cf6', borderRadius: '3px' }}></span> Review
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '12px', height: '12px', backgroundColor: '#334155', borderRadius: '3px' }}></span> Not Visited
                  </div>
                </div>

                {/* Grid Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                  {selectedTest.questions.map((_, idx) => {
                    const isAns = userAnswers[idx] !== undefined;
                    const isRev = reviewStatus[idx];
                    const isVis = visitedStatus[idx];
                    const isCurrent = currentQIndex === idx;

                    let bg = '#334155'; // Not visited default
                    if (isRev) bg = '#8b5cf6';
                    else if (isAns) bg = '#10b981';
                    else if (isVis) bg = '#ef4444';

                    return (
                      <button
                        key={idx}
                        onClick={() => handleJumpToQuestion(idx)}
                        style={{
                          backgroundColor: bg,
                          color: '#ffffff',
                          border: isCurrent ? '2px solid #ffffff' : 'none',
                          borderRadius: '8px',
                          height: '40px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          boxShadow: isCurrent ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
                        }}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* VIEW 4: TEST RESULT & SCORE ANALYTICS */}
        {/* ==================================================================== */}
        {examState === "result" && selectedTest && (
          <div>
            {/* Scorecard Header */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '32px', marginBottom: '28px', textAlign: 'center' }}>
              <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' }}>
                ✅ Test Submitted Successfully
              </span>
              <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#ffffff', margin: '12px 0 6px 0' }}>
                {selectedTest.title} - Performance Report
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '13px' }}>Detailed score metrics and explanation breakdown</p>

              {/* Score Summary Metrics */}
              {(() => {
                const res = calculateResults();
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '28px' }}>
                    <div style={{ backgroundColor: '#070b14', border: '1px solid #1e293b', padding: '20px', borderRadius: '12px' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>TOTAL SCORE</span>
                      <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#818cf8', margin: '6px 0 0 0' }}>{res.score} / {selectedTest.totalMarks}</h2>
                    </div>
                    <div style={{ backgroundColor: '#070b14', border: '1px solid #1e293b', padding: '20px', borderRadius: '12px' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>ACCURACY RATE</span>
                      <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#34d399', margin: '6px 0 0 0' }}>{res.accuracy}%</h2>
                    </div>
                    <div style={{ backgroundColor: '#070b14', border: '1px solid #1e293b', padding: '20px', borderRadius: '12px' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>CORRECT ANSWERS</span>
                      <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981', margin: '6px 0 0 0' }}>{res.correct} Qs</h2>
                    </div>
                    <div style={{ backgroundColor: '#070b14', border: '1px solid #1e293b', padding: '20px', borderRadius: '12px' }}>
                      <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 'bold' }}>INCORRECT ANSWERS</span>
                      <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#ef4444', margin: '6px 0 0 0' }}>{res.incorrect} Qs</h2>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Detailed Explanations Breakdown */}
            <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
                  📖 Question & Detailed Solution Key
                </h3>
                <button
                  onClick={() => setExamState("selection")}
                  style={{ backgroundColor: '#4f46e5', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Back to All Tests
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'flex-direction', gap: '24px' }}>
                {selectedTest.questions.map((q, qIdx) => {
                  const userAns = userAnswers[qIdx];
                  const isCorrect = userAns === q.correct;
                  const isUnattempted = userAns === undefined;

                  return (
                    <div
                      key={q.id}
                      style={{
                        backgroundColor: '#070b14',
                        border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.4)' : isUnattempted ? '#334155' : 'rgba(239, 68, 68, 0.4)'}`,
                        borderRadius: '14px',
                        padding: '24px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#ffffff' }}>
                          Question {qIdx + 1}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 'bold',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.15)' : isUnattempted ? 'rgba(148, 163, 184, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: isCorrect ? '#34d399' : isUnattempted ? '#94a3b8' : '#f87171'
                        }}>
                          {isCorrect ? "Correct (+2.0)" : isUnattempted ? "Unattempted (0.0)" : "Incorrect (-0.66)"}
                        </span>
                      </div>

                      <p style={{ fontSize: '15px', color: '#ffffff', marginBottom: '16px', lineHeight: '1.5' }}>
                        {q.question}
                      </p>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                        {q.options.map((opt, oIdx) => {
                          const isOptionUserSelection = userAns === oIdx;
                          const isOptionCorrect = q.correct === oIdx;

                          let bg = '#0f172a';
                          let border = '#1e293b';
                          let text = '#94a3b8';

                          if (isOptionCorrect) {
                            bg = 'rgba(16, 185, 129, 0.15)';
                            border = '#10b981';
                            text = '#34d399';
                          } else if (isOptionUserSelection && !isOptionCorrect) {
                            bg = 'rgba(239, 68, 68, 0.15)';
                            border = '#ef4444';
                            text = '#f87171';
                          }

                          return (
                            <div key={oIdx} style={{ backgroundColor: bg, border: `1px solid ${border}`, borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: text }}>
                              <strong>{String.fromCharCode(65 + oIdx)}.</strong> {opt} {isOptionCorrect && " (Correct Answer)"} {isOptionUserSelection && !isOptionCorrect && " (Your Choice)"}
                            </div>
                          );
                        })}
                      </div>

                      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '10px', padding: '16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#818cf8', display: 'block', marginBottom: '6px' }}>
                          💡 DETAILED EXPLANATION:
                        </span>
                        <p style={{ fontSize: '13px', color: '#cbd5e1', margin: 0, lineHeight: '1.6' }}>
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}