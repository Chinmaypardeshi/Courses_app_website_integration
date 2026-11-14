import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Play, Lock, BookOpen, ChevronDown, ChevronRight 
} from 'lucide-react';
import API from '../api/axios';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [activeLecture, setActiveLecture] = useState(null);
  const [expandedSubject, setExpandedSubject] = useState(1);

  const sampleCurriculum = [
    {
      id: 1,
      title: 'Ancient & Medieval History',
      chapters: [
        {
          id: 101,
          title: 'Indus Valley Civilization & Vedic Age',
          lectures: [
            { id: 1001, title: 'Harappan Town Planning & Trade Systems', duration: '45 mins', isDemo: true, videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' },
            { id: 1002, title: 'Vedic Literature & Society Transition', duration: '50 mins', isDemo: false, videoUrl: '' }
          ]
        }
      ]
    }
  ];

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await API.get(`/courses/${id || 1}`);
        setCourse(res.data.course || { title: 'GS Paper 1: History & Geography Complete Batch' });
      } catch (err) {
        setCourse({ title: 'GS Paper 1: History & Geography Complete Batch' });
      }
    };
    fetchCourseDetails();
  }, [id]);

  return (
    <div style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
        <button 
          onClick={() => navigate('/courses')}
          style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}
        >
          <ArrowLeft size={18} /> Back to Catalog
        </button>
        <h1 style={{ margin: 0, color: '#0f172a', fontSize: '22px', fontWeight: '800' }}>
          {course?.title || 'Course Details'}
        </h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '25px' }}>
        <div>
          <div style={{ background: '#000', borderRadius: '16px', overflow: 'hidden', minHeight: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {activeLecture?.videoUrl ? (
              <video controls style={{ width: '100%', maxHeight: '420px' }} src={activeLecture.videoUrl} autoPlay />
            ) : (
              <div style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>
                <Play size={48} color="#6366f1" style={{ marginBottom: '12px' }} />
                <h3 style={{ color: '#fff', margin: '0 0 8px 0' }}>Select a Demo Lecture to Start</h3>
              </div>
            )}
          </div>
        </div>

        <div style={{ background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '18px', color: '#0f172a', margin: '0 0 20px 0', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={20} color="#4338ca" /> Course Curriculum
          </h2>
          {sampleCurriculum.map((sub) => (
            <div key={sub.id} style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '10px' }}>
              <div 
                onClick={() => setExpandedSubject(expandedSubject === sub.id ? null : sub.id)}
                style={{ background: '#f8fafc', padding: '14px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '700', fontSize: '14px' }}
              >
                <span>{sub.title}</span>
                {expandedSubject === sub.id ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </div>
              {expandedSubject === sub.id && (
                <div style={{ padding: '12px 18px' }}>
                  {sub.chapters.map((chap) => (
                    <div key={chap.id}>
                      {chap.lectures.map((lec) => (
                        <div 
                          key={lec.id}
                          onClick={() => lec.isDemo && setActiveLecture(lec)}
                          style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: '8px', cursor: lec.isDemo ? 'pointer' : 'not-allowed', background: '#f8fafc', marginBottom: '6px' }}
                        >
                          <span style={{ fontSize: '13px', fontWeight: '600' }}>{lec.title}</span>
                          <span style={{ fontSize: '11px', fontWeight: 'bold', color: lec.isDemo ? '#15803d' : '#94a3b8' }}>
                            {lec.isDemo ? 'Free Demo' : 'Locked'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}