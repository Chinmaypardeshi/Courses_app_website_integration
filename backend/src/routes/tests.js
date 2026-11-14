const { Router } = require('express');
const { pool } = require('../db/pool');
const { optionalAuthenticate, authenticate } = require('../middleware/authenticate');

const testsRouter = Router();

function formatTest(row) {
  return {
    id: String(row.id),
    subjectId: row.subject_id ? String(row.subject_id) : null,
    subjectName: row.subject_name || 'General Studies',
    slug: row.slug,
    title: row.title,
    description: row.description || '',
    difficulty: row.difficulty || 'medium',
    durationMinutes: Number(row.duration_minutes || 60),
    duration: `${row.duration_minutes || 60} mins`,
    totalMarks: Number(row.total_marks || 100),
    totalQuestions: Number(row.question_count || row.total_questions || 0),
    questionsCount: Number(row.question_count || row.total_questions || 0),
    isPublished: row.is_published !== false,
    accessTier: row.access_tier || 'free',
    createdAt: row.created_at,
  };
}

// 1. List tests (GET /api/tests and /api/v1/tests)
async function listTests(req, res) {
  try {
    const result = await pool.query(`
      SELECT t.*, s.name as subject_name,
             COUNT(q.id) as question_count
      FROM practice_tests t
      LEFT JOIN subjects s ON t.subject_id = s.id
      LEFT JOIN test_questions q ON q.practice_test_id = t.id
      WHERE t.is_published = TRUE
      GROUP BY t.id, s.name
      ORDER BY t.id ASC
    `);
    const formatted = result.rows.map(formatTest);
    return res.status(200).json({
      success: true,
      tests: formatted,
    });
  } catch (err) {
    console.error('Fetch Tests Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to load practice tests.' });
  }
}

// 2. Get Single Test with full questions and options
async function getTestDetails(req, res) {
  const { id } = req.params;
  try {
    let testQuery = 'SELECT t.*, s.name as subject_name FROM practice_tests t LEFT JOIN subjects s ON t.subject_id = s.id WHERE ';
    const params = [];
    if (/^\d+$/.test(id)) {
      testQuery += 't.id = $1';
      params.push(Number(id));
    } else {
      testQuery += 't.slug = $1';
      params.push(id);
    }

    const testRes = await pool.query(testQuery, params);
    if (testRes.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Test not found.' });
    }

    const test = testRes.rows[0];
    const questionsRes = await pool.query(`
      SELECT q.*, 
             json_agg(
               json_build_object(
                 'id', o.id,
                 'key', o.option_key,
                 'option_key', o.option_key,
                 'text', o.option_text,
                 'option_text', o.option_text,
                 'is_correct', o.is_correct
               ) ORDER BY o.option_key ASC
             ) as options
      FROM test_questions q
      LEFT JOIN test_options o ON o.test_question_id = q.id
      WHERE q.practice_test_id = $1
      GROUP BY q.id
      ORDER BY q.sort_order ASC
    `, [test.id]);

    const formattedQuestions = questionsRes.rows.map((q) => ({
      id: String(q.id),
      testId: String(test.id),
      questionText: q.question_text,
      question_text: q.question_text,
      explanation: q.explanation || '',
      marks: Number(q.marks || 2),
      sortOrder: Number(q.sort_order || 0),
      options: q.options || [],
    }));

    return res.status(200).json({
      success: true,
      test: formatTest({ ...test, question_count: formattedQuestions.length }),
      questions: formattedQuestions,
    });
  } catch (err) {
    console.error('Fetch Test Details Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to load test details.' });
  }
}

// 3. Submit Test Attempt
async function submitTestAttempt(req, res) {
  const { id } = req.params;
  const { answers } = req.body; // e.g. [{ questionId: 1, selectedOptionKey: 'A' }]
  const userId = req.auth?.userId || 1;

  try {
    let testId = id;
    if (!/^\d+$/.test(id)) {
      const tRes = await pool.query('SELECT id FROM practice_tests WHERE slug = $1', [id]);
      if (tRes.rowCount === 0) return res.status(404).json({ error: 'Test not found.' });
      testId = tRes.rows[0].id;
    }

    // Fetch correct options for all questions in this test
    const qRes = await pool.query(`
      SELECT q.id as question_id, q.marks, o.option_key as correct_key
      FROM test_questions q
      JOIN test_options o ON o.test_question_id = q.id AND o.is_correct = TRUE
      WHERE q.practice_test_id = $1
    `, [testId]);

    const correctMap = {};
    for (const row of qRes.rows) {
      correctMap[row.question_id] = { correctKey: row.correct_key, marks: Number(row.marks || 2) };
    }

    let score = 0;
    let correctCount = 0;
    const answerList = Array.isArray(answers) ? answers : [];

    for (const ans of answerList) {
      const qInfo = correctMap[ans.questionId];
      if (qInfo && qInfo.correctKey === ans.selectedOptionKey) {
        score += qInfo.marks;
        correctCount += 1;
      }
    }

    const totalQuestions = qRes.rowCount;
    const attemptRes = await pool.query(`
      INSERT INTO test_attempts (user_id, practice_test_id, score, total_questions, correct_answers, completed_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id, score, total_questions, correct_answers, completed_at
    `, [userId, testId, score, totalQuestions, correctCount]);

    const attempt = attemptRes.rows[0];

    // Save individual answers
    for (const ans of answerList) {
      const qInfo = correctMap[ans.questionId];
      const isCorrect = qInfo ? qInfo.correctKey === ans.selectedOptionKey : false;
      await pool.query(`
        INSERT INTO user_answers (test_attempt_id, test_question_id, selected_option_key, is_correct)
        VALUES ($1, $2, $3, $4)
      `, [attempt.id, ans.questionId, ans.selectedOptionKey, isCorrect]);
    }

    return res.status(200).json({
      success: true,
      attemptId: attempt.id,
      score: attempt.score,
      totalQuestions: attempt.total_questions,
      correctAnswers: attempt.correct_answers,
      accuracy: totalQuestions > 0 ? ((correctCount / totalQuestions) * 100).toFixed(1) : 0,
      completedAt: attempt.completed_at,
    });
  } catch (err) {
    console.error('Submit Attempt Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to record test attempt.' });
  }
}

// 4. User's attempts history
async function getUserAttempts(req, res) {
  const userId = req.auth?.userId || 1;
  try {
    const result = await pool.query(`
      SELECT a.*, t.title as test_title, t.slug as test_slug
      FROM test_attempts a
      JOIN practice_tests t ON a.practice_test_id = t.id
      WHERE a.user_id = $1
      ORDER BY a.completed_at DESC
    `, [userId]);

    return res.status(200).json({
      success: true,
      attempts: result.rows.map((r) => ({
        id: String(r.id),
        testId: String(r.practice_test_id),
        testTitle: r.test_title,
        testSlug: r.test_slug,
        score: Number(r.score),
        totalQuestions: Number(r.total_questions),
        correctAnswers: Number(r.correct_answers),
        completedAt: r.completed_at,
      })),
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to load test history.' });
  }
}

testsRouter.get('/', listTests);
testsRouter.get('/attempts/me', optionalAuthenticate, getUserAttempts);
testsRouter.get('/:id', getTestDetails);
testsRouter.post('/:id/attempt', optionalAuthenticate, submitTestAttempt);

module.exports = { testsRouter };
