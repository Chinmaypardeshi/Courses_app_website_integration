const { Router } = require('express');
const { pool } = require('../db/pool');
const { optionalAuthenticate, authenticate } = require('../middleware/authenticate');

const classroomRouter = Router();

// 1. Secure Video Playback Info
classroomRouter.get('/videos/secure-playback/:videoId', optionalAuthenticate, (req, res) => {
  const { videoId } = req.params;
  const mockPlayback = {
    videoId,
    title: `Lecture ${videoId}: High-Yield UPSC Analysis`,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: '45 mins',
    playbackToken: `jwt_vid_${Date.now()}_${videoId}`,
    watermark: req.auth?.email || 'Aspiria Learner',
    resolutions: ['360p', '720p', '1080p'],
  };
  return res.status(200).json({ success: true, playback: mockPlayback });
});

// 2. Downloadable Videos
classroomRouter.get('/downloads/videos', optionalAuthenticate, (req, res) => {
  const list = [
    { id: 'vid_gs1_1', title: 'GS 1: Revolt of 1857 & Freedom Struggle', size: '145 MB', duration: '55 mins', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    { id: 'vid_gs2_1', title: 'GS 2: Preamble & Constitutional Doctrines', size: '120 MB', duration: '45 mins', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
    { id: 'vid_gs3_1', title: 'GS 3: Union Budget & Monetary Policy', size: '160 MB', duration: '60 mins', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
  ];
  return res.status(200).json({ success: true, videos: list });
});

// 3. Downloadable Notes & Study Materials
classroomRouter.get(['/downloads/notes', '/study-materials'], async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM study_materials ORDER BY id ASC');
    const materials = result.rows.map((row) => ({
      id: String(row.id),
      title: row.title,
      description: row.description || '',
      category: row.category || 'General Studies',
      fileUrl: row.file_url,
      file_url: row.file_url,
      fileType: row.file_type || 'PDF',
      file_type: row.file_type || 'PDF',
      fileSize: row.file_size || '5 MB',
      file_size: row.file_size || '5 MB',
      downloadCount: row.download_count || 0,
      accessTier: row.access_tier || 'free',
      access_tier: row.access_tier || 'free',
    }));
    return res.status(200).json({ success: true, notes: materials, materials });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to load study notes.' });
  }
});

// 4. Videos List
classroomRouter.get('/videos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.id, l.title, l.duration, l.video_url, c.title as course_title, c.slug as course_slug
      FROM lessons l
      JOIN courses c ON l.course_id = c.id
      WHERE l.video_url IS NOT NULL AND l.video_url != ''
      ORDER BY l.id ASC
    `);
    const videos = result.rows.map((r) => ({
      id: String(r.id),
      title: r.title,
      courseTitle: r.course_title,
      courseSlug: r.course_slug,
      duration: r.duration,
      videoUrl: r.video_url,
    }));
    return res.status(200).json({ success: true, videos });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to load video lectures.' });
  }
});

// 5. Live Classes Chat
classroomRouter.get('/live-classes/:classId/chat', async (req, res) => {
  const { classId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM live_class_messages WHERE class_id = $1 AND is_doubt = FALSE ORDER BY created_at ASC',
      [classId]
    );
    return res.status(200).json({ success: true, messages: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to load live class chat.' });
  }
});

classroomRouter.post('/live-classes/:classId/chat', optionalAuthenticate, async (req, res) => {
  const { classId } = req.params;
  const { message, userName } = req.body;
  if (!message) return res.status(400).json({ success: false, error: 'Message cannot be empty.' });

  const name = userName || req.auth?.name || 'Aspirant';
  const role = req.auth?.role || 'student';

  try {
    const result = await pool.query(`
      INSERT INTO live_class_messages (class_id, user_name, user_role, message, is_doubt)
      VALUES ($1, $2, $3, $4, FALSE)
      RETURNING *
    `, [classId, name, role, message]);

    return res.status(200).json({ success: true, chatMessage: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to post message.' });
  }
});

// 6. Live Classes Doubts
classroomRouter.post('/live-classes/:classId/doubts', optionalAuthenticate, async (req, res) => {
  const { classId } = req.params;
  const { doubt, question, userName } = req.body;
  const content = doubt || question;
  if (!content) return res.status(400).json({ success: false, error: 'Doubt text cannot be empty.' });

  const name = userName || req.auth?.name || 'Aspirant';

  try {
    const result = await pool.query(`
      INSERT INTO live_class_messages (class_id, user_name, user_role, message, is_doubt, status)
      VALUES ($1, $2, 'student', $3, TRUE, 'open')
      RETURNING *
    `, [classId, name, content]);

    return res.status(200).json({
      success: true,
      message: 'Doubt submitted to faculty successfully.',
      doubt: result.rows[0],
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to submit doubt.' });
  }
});

module.exports = { classroomRouter };
