const { Router } = require('express');
const { pool } = require('../db/pool');
const { optionalAuthenticate, authenticate } = require('../middleware/authenticate');

const studentRouter = Router();

// 1. Reminders
studentRouter.get('/reminders', optionalAuthenticate, async (req, res) => {
  const userId = req.auth?.userId || 2;
  try {
    const result = await pool.query(
      'SELECT * FROM student_reminders WHERE user_id = $1 ORDER BY id ASC',
      [userId]
    );
    return res.status(200).json({ success: true, reminders: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch reminders.' });
  }
});

studentRouter.post('/reminders', optionalAuthenticate, async (req, res) => {
  const userId = req.auth?.userId || 2;
  const { title, time, date } = req.body;
  if (!title) return res.status(400).json({ success: false, error: 'Reminder title is required.' });

  try {
    const result = await pool.query(`
      INSERT INTO student_reminders (user_id, title, time, date, is_completed)
      VALUES ($1, $2, $3, $4, FALSE)
      RETURNING *
    `, [userId, title, time || '10:00 AM', date || 'Today']);

    return res.status(201).json({ success: true, reminder: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to create reminder.' });
  }
});

studentRouter.delete('/reminders/:id', optionalAuthenticate, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM student_reminders WHERE id = $1', [Number(id)]);
    return res.status(200).json({ success: true, message: 'Reminder deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to delete reminder.' });
  }
});

// 2. Reviews
studentRouter.get('/reviews/:courseId', async (req, res) => {
  const { courseId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM reviews WHERE course_id = $1 ORDER BY created_at DESC',
      [courseId]
    );
    return res.status(200).json({ success: true, reviews: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to load reviews.' });
  }
});

studentRouter.post('/reviews', optionalAuthenticate, async (req, res) => {
  const { courseId, rating, comment, userName } = req.body;
  if (!courseId) return res.status(400).json({ success: false, error: 'courseId is required.' });

  const userId = req.auth?.userId || null;
  const name = userName || req.auth?.name || 'Aspirant';

  try {
    const result = await pool.query(`
      INSERT INTO reviews (course_id, user_id, user_name, rating, comment)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [courseId, userId, name, Number(rating || 5), comment || '']);

    return res.status(201).json({ success: true, review: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to submit review.' });
  }
});

// 3. Student Dashboard Overview
studentRouter.get('/student/dashboard', optionalAuthenticate, async (req, res) => {
  const userId = req.auth?.userId || 2;
  try {
    const [coursesRes, lessonsRes, testsRes] = await Promise.all([
      pool.query('SELECT count(*) FROM courses'),
      pool.query('SELECT count(*) FROM lesson_progress WHERE user_id = $1', [userId]),
      pool.query('SELECT count(*) FROM test_attempts WHERE user_id = $1', [userId]),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalAvailableCourses: Number(coursesRes.rows[0].count),
        completedLessons: Number(lessonsRes.rows[0].count),
        testsAttempted: Number(testsRes.rows[0].count),
        dailyStudyStreak: 7,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch student dashboard.' });
  }
});

// 4. User Analytics
studentRouter.get('/user/analytics', authenticate, async (req, res) => {
  const userId = req.auth.userId;
  try {
    const [attemptsRes, progressRes] = await Promise.all([
      pool.query('SELECT score, total_questions, correct_answers, completed_at FROM test_attempts WHERE user_id = $1 ORDER BY completed_at DESC LIMIT 10', [userId]),
      pool.query('SELECT count(*) FROM lesson_progress WHERE user_id = $1', [userId]),
    ]);

    let totalScore = 0;
    let totalQuestions = 0;
    for (const a of attemptsRes.rows) {
      totalScore += Number(a.score);
      totalQuestions += Number(a.total_questions);
    }

    return res.status(200).json({
      success: true,
      analytics: {
        testsTaken: attemptsRes.rowCount,
        averageAccuracy: totalQuestions > 0 ? ((totalScore / (totalQuestions * 2)) * 100).toFixed(1) : 0,
        completedLessonsCount: Number(progressRes.rows[0].count),
        recentAttempts: attemptsRes.rows,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to load analytics.' });
  }
});

// 5. User Preferences
studentRouter.put('/user/preferences', authenticate, async (req, res) => {
  const userId = req.auth.userId;
  const { preferences } = req.body;
  try {
    await pool.query(
      'UPDATE users SET preferences = $1, updated_at = NOW() WHERE id = $2',
      [JSON.stringify(preferences || {}), userId]
    );
    return res.status(200).json({ success: true, message: 'Preferences updated.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to save preferences.' });
  }
});

module.exports = { studentRouter };
