const { Router } = require('express');
const { pool } = require('../db/pool');
const { authenticate, optionalAuthenticate } = require('../middleware/authenticate');

const coursesRouter = Router();

function formatCourse(row) {
  return {
    id: String(row.id),
    subjectId: row.subject_id ? String(row.subject_id) : null,
    subject_id: row.subject_id ? String(row.subject_id) : null,
    subjectName: row.subject_name || '',
    slug: row.slug,
    title: row.title,
    description: row.description || '',
    category: row.category || 'UPSC CSE',
    faculty: row.faculty || 'Senior UPSC Faculty',
    language: row.language || 'Hinglish',
    poster: row.poster || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    hours: row.hours || '120 Hours',
    lectures: row.lectures || '50 Lectures',
    validity: row.validity || '1 Year',
    price: Number(row.price || 0),
    originalPrice: Number(row.original_price || 0),
    original_price: Number(row.original_price || 0),
    discount: row.discount || '0% OFF',
    accessTier: row.access_tier || 'free',
    access_tier: row.access_tier || 'free',
    sortOrder: Number(row.sort_order || 0),
    createdAt: row.created_at,
  };
}

function formatLesson(row) {
  return {
    id: String(row.id),
    courseId: row.course_id ? String(row.course_id) : null,
    course_id: row.course_id ? String(row.course_id) : null,
    slug: row.slug,
    title: row.title,
    content: row.content || '',
    videoUrl: row.video_url || '',
    video_url: row.video_url || '',
    duration: row.duration || '45 mins',
    accessTier: row.access_tier || 'free',
    access_tier: row.access_tier || 'free',
    sortOrder: Number(row.sort_order || 0),
    createdAt: row.created_at,
  };
}

// 1. GET /api/courses (for React Web)
coursesRouter.get('/courses', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, s.name as subject_name
      FROM courses c
      LEFT JOIN subjects s ON c.subject_id = s.id
      ORDER BY c.sort_order ASC, c.id ASC
    `);
    const formatted = result.rows.map(formatCourse);
    return res.json({ success: true, courses: formatted });
  } catch (err) {
    console.error('Fetch Courses Error:', err);
    return res.status(500).json({ success: false, error: 'Database query failed' });
  }
});

// 2. GET /api/courses/:id (by ID or Slug)
coursesRouter.get('/courses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    let query = 'SELECT c.*, s.name as subject_name FROM courses c LEFT JOIN subjects s ON c.subject_id = s.id WHERE ';
    const params = [];
    if (/^\d+$/.test(id)) {
      query += 'c.id = $1';
      params.push(Number(id));
    } else {
      query += 'c.slug = $1';
      params.push(id);
    }

    const result = await pool.query(query, params);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Course not found' });
    }
    return res.json({ success: true, course: formatCourse(result.rows[0]) });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch course details' });
  }
});

// 3. GET /api/study/subjects (for Flutter Mobile)
coursesRouter.get('/study/subjects', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM subjects ORDER BY name ASC');
    const subjects = result.rows.map((row) => ({
      id: String(row.id),
      slug: row.slug,
      name: row.name,
      description: row.description || '',
    }));
    return res.status(200).json({ subjects });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load study subjects' });
  }
});

// 4. GET /api/study/courses (for Flutter Mobile)
coursesRouter.get('/study/courses', optionalAuthenticate, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, s.name as subject_name
      FROM courses c
      LEFT JOIN subjects s ON c.subject_id = s.id
      ORDER BY c.sort_order ASC, c.id ASC
    `);
    return res.status(200).json({ courses: result.rows.map(formatCourse) });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load courses' });
  }
});

// 5. GET /api/study/courses/:courseId
coursesRouter.get('/study/courses/:courseId', optionalAuthenticate, async (req, res) => {
  const { courseId } = req.params;
  try {
    let query = 'SELECT c.*, s.name as subject_name FROM courses c LEFT JOIN subjects s ON c.subject_id = s.id WHERE ';
    const params = [];
    if (/^\d+$/.test(courseId)) {
      query += 'c.id = $1';
      params.push(Number(courseId));
    } else {
      query += 'c.slug = $1';
      params.push(courseId);
    }

    const result = await pool.query(query, params);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Course not found.' });
    }
    return res.status(200).json({ course: formatCourse(result.rows[0]) });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load course' });
  }
});

// 6. GET /api/study/courses/:courseId/lessons
coursesRouter.get('/study/courses/:courseId/lessons', optionalAuthenticate, async (req, res) => {
  const { courseId } = req.params;
  try {
    let courseQuery = 'SELECT id FROM courses WHERE ';
    const params = [];
    if (/^\d+$/.test(courseId)) {
      courseQuery += 'id = $1';
      params.push(Number(courseId));
    } else {
      courseQuery += 'slug = $1';
      params.push(courseId);
    }

    const courseRes = await pool.query(courseQuery, params);
    if (courseRes.rowCount === 0) {
      return res.status(404).json({ error: 'Course not found.' });
    }

    const cId = courseRes.rows[0].id;
    const lessonsRes = await pool.query(`
      SELECT * FROM lessons WHERE course_id = $1 ORDER BY sort_order ASC, id ASC
    `, [cId]);

    return res.status(200).json({ lessons: lessonsRes.rows.map(formatLesson) });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load course lessons' });
  }
});

// 7. GET /api/study/lessons/:lessonId
coursesRouter.get('/study/lessons/:lessonId', optionalAuthenticate, async (req, res) => {
  const { lessonId } = req.params;
  try {
    let query = 'SELECT * FROM lessons WHERE ';
    const params = [];
    if (/^\d+$/.test(lessonId)) {
      query += 'id = $1';
      params.push(Number(lessonId));
    } else {
      query += 'slug = $1';
      params.push(lessonId);
    }

    const result = await pool.query(query, params);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Lesson not found.' });
    }
    return res.status(200).json({ lesson: formatLesson(result.rows[0]) });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load lesson' });
  }
});

// 8. Progress tracking: GET /api/study/progress
coursesRouter.get('/study/progress', authenticate, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT lesson_id FROM lesson_progress WHERE user_id = $1
    `, [req.auth.userId]);
    const completedLessonIds = result.rows.map((r) => String(r.lesson_id));
    return res.status(200).json({ completedLessonIds });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch study progress.' });
  }
});

// 9. Progress tracking: POST /api/study/lessons/:lessonId/progress
coursesRouter.post('/study/lessons/:lessonId/progress', authenticate, async (req, res) => {
  const { lessonId } = req.params;
  const { completed } = req.body;
  try {
    if (completed) {
      await pool.query(`
        INSERT INTO lesson_progress (user_id, lesson_id, completed_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (user_id, lesson_id) DO UPDATE SET completed_at = NOW()
      `, [req.auth.userId, lessonId]);
    } else {
      await pool.query(`
        DELETE FROM lesson_progress WHERE user_id = $1 AND lesson_id = $2
      `, [req.auth.userId, lessonId]);
    }
    return res.status(200).json({ lessonId, completed: !!completed });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update lesson progress.' });
  }
});

module.exports = { coursesRouter };
