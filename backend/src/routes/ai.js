const { Router } = require('express');
const { getGroqChatResponse } = require('../services/groq');
const { optionalAuthenticate } = require('../middleware/authenticate');

const aiRouter = Router();

const UPSC_MENTOR_SYSTEM_PROMPT = `You are Aspiria AI, India's most advanced, encouraging, and authoritative AI Academic Mentor for UPSC Civil Services Examination (CSE) and State PSC preparation.
Your expertise spans:
- GS Paper 1: Indian Heritage, Art, Culture, History, and World/Physical Geography.
- GS Paper 2: Governance, Constitution, Polity, Social Justice, and International Relations.
- GS Paper 3: Technology, Economic Development, Bio-diversity, Environment, Security, and Disaster Management.
- GS Paper 4: Ethics, Integrity, Aptitude, Case Studies.
- Prelims CSAT & Elimination strategies.

Style Guidelines:
1. Provide structured, lucid explanations with bullet points and bold keywords.
2. Quote relevant Constitutional Articles, Supreme Court landmark judgments, government reports (NITI Aayog, Law Commission, 2nd ARC), and current affairs facts.
3. Keep your tone encouraging, scholarly, precise, and exam-oriented.
4. When relevant, offer a quick Prelims tip or a Mains answer framework.`;

// 1. Full AI Chat
aiRouter.post('/chat', optionalAuthenticate, async (req, res) => {
  const { message, messages, subject, topic } = req.body;
  const promptList = [];

  // Add system instruction
  promptList.push({
    role: 'system',
    content: `${UPSC_MENTOR_SYSTEM_PROMPT}${subject ? `\nCurrent Focus Subject: ${subject}.` : ''}${topic ? ` Topic: ${topic}.` : ''}`,
  });

  // If conversation history provided
  if (Array.isArray(messages) && messages.length > 0) {
    for (const m of messages) {
      if (m.role && m.content) {
        promptList.push({ role: m.role, content: m.content });
      }
    }
  } else if (message) {
    promptList.push({ role: 'user', content: message });
  } else {
    return res.status(400).json({ success: false, error: 'A message is required.' });
  }

  try {
    const aiRes = await getGroqChatResponse(promptList, 2500, 0.6);
    if (!aiRes) {
      return res.status(503).json({
        success: false,
        error: 'AI service temporarily unavailable. Please try again in a few moments.',
      });
    }

    return res.status(200).json({
      success: true,
      reply: aiRes.reply,
      response: aiRes.reply,
      modelUsed: aiRes.modelUsed,
    });
  } catch (err) {
    console.error('AI Chat Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to process AI chat query.' });
  }
});

// 2. Instant Doubt Clearing
aiRouter.post('/ask-doubt', optionalAuthenticate, async (req, res) => {
  const { doubt, context } = req.body;
  if (!doubt) {
    return res.status(400).json({ success: false, error: 'Doubt description is required.' });
  }

  const messages = [
    {
      role: 'system',
      content: 'You are an expert UPSC faculty mentor answering student doubts with concise, accurate 2-3 paragraph explanations citing articles, sections, and facts.',
    },
    {
      role: 'user',
      content: `${context ? `Context: ${context}\n\n` : ''}Doubt: ${doubt}`,
    },
  ];

  try {
    const aiRes = await getGroqChatResponse(messages, 1500, 0.5);
    return res.status(200).json({
      success: true,
      reply: aiRes?.reply || 'Doubt answered successfully.',
      answer: aiRes?.reply || 'Doubt answered successfully.',
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Failed to clear doubt.' });
  }
});

module.exports = { aiRouter };
