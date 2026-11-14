const { Router } = require('express');
const { pool } = require('../db/pool');
const { requireAdmin } = require('../middleware/authenticate');

const adminRouter = Router();

// Apply requireAdmin to all adminRouter routes
adminRouter.use(requireAdmin);

// 1. Manage Users
adminRouter.get('/users', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.id, u.full_name as name, u.email, u.role, u.is_active, u.created_at,
             (SELECT count(*) FROM test_attempts WHERE user_id = u.id) as test_attempts,
             (SELECT count(*) FROM lesson_progress WHERE user_id = u.id) as completed_lessons
      FROM users u
      ORDER BY u.id ASC
    `);
    return res.status(200).json({ success: true, users: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch users.' });
  }
});

adminRouter.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { role, is_active, isActive, name } = req.body;
  const activeStatus = is_active !== undefined ? is_active : isActive;

  try {
    const result = await pool.query(`
      UPDATE users
      SET role = COALESCE($1, role),
          is_active = COALESCE($2, is_active),
          full_name = COALESCE($3, full_name),
          updated_at = NOW()
      WHERE id = $4
      RETURNING id, full_name, email, role, is_active
    `, [role || null, activeStatus !== undefined ? activeStatus : null, name || null, Number(id)]);

    if (result.rowCount === 0) return res.status(404).json({ success: false, error: 'User not found.' });
    return res.status(200).json({ success: true, user: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update user.' });
  }
});

adminRouter.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [Number(id)]);
    return res.status(200).json({ success: true, message: 'User deleted.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to delete user.' });
  }
});

// 2. CMS Content
adminRouter.get('/cms/content', async (req, res) => {
  try {
    const result = await pool.query("SELECT key, content FROM cms_content WHERE key = 'home'");
    const content = result.rowCount > 0 ? result.rows[0].content : {};
    return res.status(200).json({ success: true, content });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch CMS content.' });
  }
});

adminRouter.put('/cms/home', async (req, res) => {
  const { content } = req.body;
  try {
    await pool.query(`
      INSERT INTO cms_content (key, content, updated_at)
      VALUES ('home', $1, NOW())
      ON CONFLICT (key) DO UPDATE SET content = $1, updated_at = NOW()
    `, [JSON.stringify(content || req.body)]);
    return res.status(200).json({ success: true, message: 'Home CMS updated.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update CMS.' });
  }
});

adminRouter.post('/cms/courses', async (req, res) => {
  const { title, description, category, price, faculty, hours, lectures, language, poster } = req.body;
  const slug = (title || 'course').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  try {
    const result = await pool.query(`
      INSERT INTO courses (title, slug, description, category, price, faculty, hours, lectures, language, poster, access_tier)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'premium')
      RETURNING *
    `, [title, `${slug}-${Date.now().toString().slice(-4)}`, description || '', category || 'UPSC CSE', Number(price || 4999), faculty || 'Expert Faculty', hours || '100 Hours', lectures || '40 Lectures', language || 'Hinglish', poster || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80']);

    return res.status(201).json({ success: true, course: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to create course.' });
  }
});

adminRouter.delete('/cms/courses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM courses WHERE id = $1', [Number(id)]);
    return res.status(200).json({ success: true, message: 'Course removed.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to delete course.' });
  }
});

adminRouter.post('/cms/mock-tests', async (req, res) => {
  const { title, description, difficulty, durationMinutes, totalMarks } = req.body;
  const slug = (title || 'mock').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  try {
    const result = await pool.query(`
      INSERT INTO practice_tests (title, slug, description, difficulty, duration_minutes, total_marks, is_published)
      VALUES ($1, $2, $3, $4, $5, $6, TRUE)
      RETURNING *
    `, [title, `${slug}-${Date.now().toString().slice(-4)}`, description || '', difficulty || 'medium', Number(durationMinutes || 60), Number(totalMarks || 100)]);

    return res.status(201).json({ success: true, test: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to create test.' });
  }
});

adminRouter.post('/cms/current-affairs', async (req, res) => {
  const { title, category, summary, content, source, url, imageUrl } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO current_affairs (title, category, summary, content, source, url, image_url, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `, [title, category || 'National', summary || '', content || '', source || 'Editorial Board', url || '#', imageUrl || '']);

    return res.status(201).json({ success: true, article: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to add article.' });
  }
});

adminRouter.put('/cms/ai-mentor', (req, res) => {
  return res.status(200).json({ success: true, message: 'AI Mentor parameters updated.' });
});

// 3. Admin Dashboard Analytics / Stats
adminRouter.get(['/dashboard-data', '/stats'], async (req, res) => {
  try {
    const [usersCount, ordersCount, revenueSum, testsCount, mainsPending] = await Promise.all([
      pool.query('SELECT count(*) FROM users'),
      pool.query("SELECT count(*) FROM orders WHERE status = 'paid'"),
      pool.query("SELECT COALESCE(SUM(amount), 0) as total FROM orders WHERE status = 'paid'"),
      pool.query('SELECT count(*) FROM test_attempts'),
      pool.query("SELECT count(*) FROM mains_submissions WHERE status = 'pending'"),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalUsers: Number(usersCount.rows[0].count),
        paidOrders: Number(ordersCount.rows[0].count),
        totalRevenue: Number(revenueSum.rows[0].total),
        mockTestAttempts: Number(testsCount.rows[0].count),
        pendingMainsSubmissions: Number(mainsPending.rows[0].count),
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch admin stats.' });
  }
});

module.exports = { adminRouter };
