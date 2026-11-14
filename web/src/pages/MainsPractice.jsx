import React, { useState, useEffect } from 'react';
import { 
  FileText, Upload, Send, Clock, Award, CheckCircle2, 
  AlertCircle, Sparkles, BookOpen, UserCheck, RefreshCw, MessageSquare 
} from 'lucide-react';
import API from '../api/axios';

export default function MainsPractice() {
  const [selectedPaper, setSelectedPaper] = useState('GS2');
  const [answerText, setAnswerText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'Pending' | 'Evaluated'
  const [evaluationResult, setEvaluationResult] = useState(null);
  
  // Timer state
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const activeQuestion = {
    id: `q_${selectedPaper.toLowerCase()}_1`,
    paper: selectedPaper,
    text: selectedPaper === 'GS1' 
      ? "Critically examine the impact of climate change on ocean currents and marine ecosystems."
      : "Discuss the constitutional role and independence of the Election Commission of India in safeguarding free and fair elections.",
    maxMarks: 15,
    wordLimit: 250
  };

  const wordCount = answerText.trim() === '' ? 0 : answerText.trim().split(/\s+/).length;

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3500);
  };

  // Timer Effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => setSeconds(prev => prev + 1), 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  // REAL-TIME POLLING: Check every 3 seconds if Admin evaluated this submission
  useEffect(() => {
    let pollInterval = null;

    if (submissionId && submissionStatus === 'Pending') {
      pollInterval = setInterval(async () => {
        // 1. Check API
        try {
          const res = await API.get('/api/admin/mains-submissions', {
            headers: { 'x-user-role': 'admin' }
          });
          if (res.data && res.data.submissions) {
            const mySub = res.data.submissions.find(s => s.id === submissionId);
            if (mySub && mySub.status === 'Evaluated') {
              setSubmissionStatus('Evaluated');
              setEvaluationResult(mySub.evaluation);
              showToast("🎉 Faculty Admin evaluated your answer copy!", "success");
              clearInterval(pollInterval);
              return;
            }
          }
        } catch (err) {}

        // 2. Check Shared Local Queue Sync
        const adminQueue = JSON.parse(localStorage.getItem('mains_admin_queue') || '[]');
        const mySub = adminQueue.find(s => s.id === submissionId);
        if (mySub && mySub.status === 'Evaluated') {
          setSubmissionStatus('Evaluated');
          setEvaluationResult(mySub.evaluation);
          showToast("🎉 Faculty Admin evaluated your answer copy!", "success");
          clearInterval(pollInterval);
        }
      }, 3000);
    }

    return () => clearInterval(pollInterval);
  }, [submissionId, submissionStatus]);

  // File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      showToast(`Selected copy: ${file.name}`, "success");
    }
  };

  // Submit Answer to Admin Dashboard
  const handleSubmitForEvaluation = async () => {
    if (wordCount < 10 && !uploadedFile) {
      showToast("Please write an answer or upload handwritten PDF copy.", "error");
      return;
    }

    setIsSubmitting(true);
    setIsTimerRunning(false);

    try {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const newSubId = `SUB-${Date.now().toString().slice(-4)}`;

      const payload = {
        id: newSubId,
        userName: storedUser.name || 'Naman',
        userEmail: storedUser.email || 'namankn03@gmail.com',
        paper: selectedPaper,
        questionId: activeQuestion.id,
        questionText: activeQuestion.text,
        answerText: answerText || `[PDF Copy Attached: ${uploadedFile?.name || 'Handwritten_Copy.pdf'}]`,
        fileUrl: uploadedFile ? URL.createObjectURL(uploadedFile) : null,
        fileName: uploadedFile ? uploadedFile.name : null,
        fileType: uploadedFile ? 'pdf' : 'text',
        submittedAt: new Date().toISOString(),
        status: 'Pending',
        evaluation: null
      };

      // 1. Local Storage Admin Queue Push (Instant Sync)
      const existingQueue = JSON.parse(localStorage.getItem('mains_admin_queue') || '[]');
      localStorage.setItem('mains_admin_queue', JSON.stringify([payload, ...existingQueue]));

      // 2. API Push
      try {
        await API.post('/api/mains/submit-to-admin', payload);
      } catch (e) {}

      setSubmissionId(newSubId);
      setSubmissionStatus('Pending');
      showToast("Answer submitted directly to Admin Queue!", "success");

    } catch (err) {
      showToast("Failed to submit answer.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#090d16', color: '#f8fafc', fontFamily: "'Inter', sans-serif", padding: '30px 20px' }}>
      
      {/* Toast Notification */}
      {toast.show && (
        <div style={{ position: 'fixed', top: '24px', right: '24px', background: toast.type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #10b981, #059669)', color: '#ffffff', padding: '14px 22px', borderRadius: '14px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', gap: '12px', zIndex: 1200, fontWeight: '700', fontSize: '14px' }}>
          {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          {toast.message}
        </div>
      )}

      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* HEADER */}
        <div style={{ background: '#131c31', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#818cf8', fontSize: '12px', fontWeight: '800', marginBottom: '6px' }}>
              <FileText size={16} /> REAL-TIME MAINS EVALUATION ENGINE
            </div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '900', color: '#fff' }}>UPSC Mains Daily Answer Writing</h1>
          </div>

          {/* Paper Selector */}
          <div style={{ display: 'flex', gap: '8px', background: '#090d16', padding: '4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            {['GS1', 'GS2', 'GS3', 'GS4'].map(p => (
              <button 
                key={p} 
                onClick={() => { setSelectedPaper(p); setSubmissionStatus(null); setSubmissionId(null); }} 
                style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: selectedPaper === p ? '#6366f1' : 'transparent', color: selectedPaper === p ? '#fff' : '#94a3b8', fontWeight: '800', cursor: 'pointer', fontSize: '12px' }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* QUESTION DISPLAY */}
        <div style={{ background: '#131c31', borderRadius: '20px', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '800' }}>
              {activeQuestion.paper} • Marks: {activeQuestion.maxMarks} • Word Limit: {activeQuestion.wordLimit} Words
            </span>

            {/* Timer */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: '900', color: '#34d399', background: '#090d16', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                ⏱️ {formatTime(seconds)}
              </span>
              <button 
                onClick={() => setIsTimerRunning(!isTimerRunning)} 
                style={{ background: isTimerRunning ? '#ef4444' : '#10b981', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '8px', fontWeight: '800', cursor: 'pointer', fontSize: '12px' }}
              >
                {isTimerRunning ? 'Pause' : 'Start Timer'}
              </button>
            </div>
          </div>

          <h3 style={{ margin: 0, fontSize: '18px', color: '#fff', fontWeight: '800', lineHeight: 1.5 }}>
            {activeQuestion.text}
          </h3>
        </div>

        {/* INPUT AREA */}
        <div style={{ background: '#131c31', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '13px', fontWeight: '800', color: '#cbd5e1' }}>
              Write your structured answer or upload handwritten copy PDF:
            </label>
            <span style={{ fontSize: '12px', fontWeight: '800', color: wordCount > 250 ? '#f87171' : '#38bdf8' }}>
              Word Count: {wordCount} / {activeQuestion.wordLimit}
            </span>
          </div>

          <textarea 
            rows={10} 
            placeholder="Write your UPSC Mains structured answer here (Introduction, Body Points with Constitutional Articles/Data, Conclusion)..."
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            style={{ width: '100%', padding: '16px', borderRadius: '14px', background: '#090d16', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', outline: 'none', fontSize: '14px', lineHeight: 1.6, boxSizing: 'border-box' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <input type="file" accept="application/pdf,image/*" id="file-upload" onChange={handleFileUpload} style={{ display: 'none' }} />
              <label 
                htmlFor="file-upload" 
                style={{ background: 'rgba(255,255,255,0.08)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '10px 18px', borderRadius: '12px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <Upload size={16} /> {uploadedFile ? uploadedFile.name : 'Upload Handwritten Answer Copy (PDF / Photo)'}
              </label>
            </div>

            <button 
              onClick={handleSubmitForEvaluation} 
              disabled={isSubmitting} 
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}
            >
              {isSubmitting ? <RefreshCw size={18} className="animate-spin" /> : <Send size={18} />} 
              {isSubmitting ? 'Submitting to Admin...' : 'Submit Answer for Faculty Evaluation'}
            </button>
          </div>
        </div>

        {/* STATUS & REAL EVALUATION DISPLAY */}
        {submissionStatus && (
          <div style={{ background: '#131c31', borderRadius: '24px', border: submissionStatus === 'Evaluated' ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(245, 158, 11, 0.5)', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <UserCheck size={22} color={submissionStatus === 'Evaluated' ? '#34d399' : '#fbbf24'} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#fff', fontWeight: '900' }}>
                    Faculty Evaluation Status: <span style={{ color: submissionStatus === 'Evaluated' ? '#34d399' : '#fbbf24' }}>{submissionStatus}</span>
                  </h3>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Submission ID: {submissionId}</span>
                </div>
              </div>

              {submissionStatus === 'Pending' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '8px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <RefreshCw size={14} className="animate-spin" /> Sent to Admin Panel Queue. Live syncing...
                </div>
              )}
            </div>

            {/* REAL EVALUATION RESULT DISPLAY */}
            {submissionStatus === 'Evaluated' && evaluationResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '10px' }}>
                
                <div style={{ background: '#090d16', padding: '20px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '800', textTransform: 'uppercase' }}>Faculty Marks Awarded</span>
                    <h2 style={{ margin: '4px 0 0 0', fontSize: '32px', fontWeight: '900', color: '#34d399' }}>
                      {evaluationResult.marks} <span style={{ fontSize: '18px', color: '#94a3b8' }}>/ {evaluationResult.maxMarks || 15}</span>
                    </h2>
                  </div>

                  <div style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '10px 18px', borderRadius: '12px', textAlign: 'right' }}>
                    <span style={{ fontSize: '11px', color: '#a5b4fc', fontWeight: '800' }}>Structure Assessment</span>
                    <div style={{ fontSize: '14px', fontWeight: '800', color: '#fff', marginTop: '2px' }}>{evaluationResult.structureGrade || 'Good Structure'}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                  <div style={{ background: '#090d16', padding: '18px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#34d399', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} /> Key Strengths
                    </h4>
                    <p style={{ margin: 0, color: '#cbd5e1', fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                      {Array.isArray(evaluationResult.strengths) ? evaluationResult.strengths.join('\n') : evaluationResult.strengths}
                    </p>
                  </div>

                  <div style={{ background: '#090d16', padding: '18px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <h4 style={{ margin: '0 0 10px 0', color: '#f87171', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertCircle size={16} /> Areas for Improvement
                    </h4>
                    <p style={{ margin: 0, color: '#cbd5e1', fontSize: '13px', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                      {Array.isArray(evaluationResult.weaknesses) ? evaluationResult.weaknesses.join('\n') : evaluationResult.weaknesses}
                    </p>
                  </div>
                </div>

                {evaluationResult.evaluatorNotes && (
                  <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '16px 20px', borderRadius: '14px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                    <strong style={{ color: '#818cf8', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <MessageSquare size={15} /> Faculty Evaluator Remarks:
                    </strong>
                    <p style={{ margin: 0, color: '#f1f5f9', fontSize: '13px', lineHeight: 1.6, fontStyle: 'italic' }}>
                      "{evaluationResult.evaluatorNotes}"
                    </p>
                  </div>
                )}

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}