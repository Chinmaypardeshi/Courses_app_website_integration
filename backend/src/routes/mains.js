const { Router } = require('express');
const { pool } = require('../db/pool');
const { getGroqChatResponse } = require('../services/groq');
const { optionalAuthenticate, requireAdmin } = require('../middleware/authenticate');

const mainsRouter = Router();

// 1. AI-powered Mains Evaluation
mainsRouter.post('/evaluate', async (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ success: false, error: 'Question and answer are both required.' });
  }

  const systemPrompt = `You are a strict, senior UPSC Civil Services Mains answer evaluator with 20+ years of experience.
Evaluate the following student's answer for a 10-mark, 150-word question based on official UPSC criteria:
1. Addressal of the question's core demand and directives (Discuss, Critically Analyze, Examine, etc.).
2. Introduction (definition, context, constitutional article/data).
3. Body structure (headings, bullet points, multi-dimensional perspectives: social, economic, political, environmental).
4. Analytical depth and relevant examples/court judgments/case studies.
5. Balanced, forward-looking conclusion/way forward.

Provide your evaluation strictly formatted as JSON with the following structure:
{
  "score": 7.5,
  "maxMarks": 10,
  "overallVerdict": "Good attempt with strong constitutional references.",
  "strengths": ["Clear introduction with relevant Article citations.", "Well organized into sub-headings."],
  "areasOfImprovement": ["Include empirical statistics.", "Add a more distinct way forward."],
  "breakdown": {
    "introduction": "8/10",
    "structure": "7.5/10",
    "depth": "7/10",
    "conclusion": "7.5/10"
  },
  "modelAnswerSnippet": "A recommended opening and closing approach..."
}`;

  try {
    const aiRes = await getGroqChatResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Question: ${question}\n\nStudent's Answer: ${answer}` },
    ], 2000, 0.4);

    let parsed = null;
    if (aiRes && aiRes.reply) {
      try {
        const jsonMatch = aiRes.reply.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        }
      } catch (parseErr) {
        // Fallback to text formatting
      }
    }

    if (!parsed) {
      parsed = {
        score: 6.5,
        maxMarks: 10,
        overallVerdict: aiRes?.reply || 'Evaluated successfully.',
        strengths: ['Relevant arguments presented', 'Consistent structure'],
        areasOfImprovement: ['Elaborate with current affairs examples', 'Improve conclusion'],
        breakdown: { introduction: '7/10', structure: '7/10', depth: '6/10', conclusion: '6.5/10' },
        modelAnswerSnippet: 'Ensure introduction defines key terms and conclusion connects to Viksit Bharat / SDG goals.',
      };
    }

    return res.status(200).json({
      success: true,
      evaluation: parsed,
      ...parsed,
    });
  } catch (err) {
    console.error('Mains AI Evaluation Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to evaluate answer.' });
  }
});

// 2. Submit to Admin / Faculty for Manual Evaluation
mainsRouter.post('/submit-to-admin', optionalAuthenticate, async (req, res) => {
  const { question, studentAnswer, answer, userName, userEmail } = req.body;
  const ansText = studentAnswer || answer;
  const userId = req.auth?.userId || null;
  const name = userName || req.auth?.name || 'Aspirant';
  const email = userEmail || req.auth?.email || 'student@upscplatform.com';

  if (!question || !ansText) {
    return res.status(400).json({ success: false, error: 'Question and answer are required.' });
  }

  try {
    const result = await pool.query(`
      INSERT INTO mains_submissions (user_id, user_name, user_email, question, student_answer, status, evaluated_by)
      VALUES ($1, $2, $3, $4, $5, 'pending', 'pending')
      RETURNING *
    `, [userId, name, email, question, ansText]);

    return res.status(200).json({
      success: true,
      message: 'Answer submitted to faculty board successfully! You will receive evaluation within 24-48 hours.',
      submissionId: result.rows[0].id,
      submission: result.rows[0],
    });
  } catch (err) {
    console.error('Mains Submit Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to submit answer.' });
  }
});

// 3. Admin: Get all mains submissions
mainsRouter.get('/admin/mains-submissions', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM mains_submissions ORDER BY created_at DESC
    `);
    return res.status(200).json({
      success: true,
      submissions: result.rows.map((r) => ({
        id: r.id,
        userId: r.user_id,
        userName: r.user_name || 'Aspirant',
        userEmail: r.user_email || '',
        question: r.question,
        studentAnswer: r.student_answer,
        score: r.score,
        feedback: r.feedback,
        strengths: r.strengths,
        improvements: r.improvements,
        status: r.status,
        evaluatedBy: r.evaluated_by,
        submittedAt: r.created_at,
        evaluatedAt: r.updated_at,
      })),
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to fetch mains submissions.' });
  }
});

// 4. Admin: Evaluate submission
mainsRouter.post('/admin/mains-evaluate/:id', requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { marks, score, feedback, strengths, improvements, modelAnswer } = req.body;
  const finalScore = score !== undefined ? score : marks || 0;

  try {
    const result = await pool.query(`
      UPDATE mains_submissions
      SET score = $1, feedback = $2, strengths = $3, improvements = $4, model_answer = $5,
          status = 'evaluated', evaluated_by = 'admin', updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `, [finalScore, feedback || '', strengths || '', improvements || '', modelAnswer || '', id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Submission not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Mains submission evaluated successfully.',
      submission: result.rows[0],
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to update evaluation.' });
  }
});

module.exports = { mainsRouter };
