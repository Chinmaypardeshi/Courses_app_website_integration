const Groq = require('groq-sdk');
const { env } = require('../config/env');

const groq = new Groq({
  apiKey: env.groqApiKey || '',
});

let cachedModel = null;
let lastModelCheck = 0;

async function getAvailableModel() {
  if (cachedModel && Date.now() - lastModelCheck < 300000) {
    return cachedModel;
  }
  try {
    const list = await groq.models.list();
    const activeModels = list.data
      .map((m) => m.id)
      .filter((id) => !id.includes('whisper') && !id.includes('guard'));

    // Prefer llama-3.3-70b or llama-3.1-70b or first active text model
    const preferred = activeModels.find((id) => id.includes('llama-3.3-70b') || id.includes('llama-3.1-70b') || id.includes('mixtral')) || activeModels[0];
    if (preferred) {
      cachedModel = preferred;
      lastModelCheck = Date.now();
      return cachedModel;
    }
  } catch (err) {
    console.warn('⚠️ Could not fetch Groq model list, defaulting to llama-3.3-70b-versatile:', err.message);
  }
  return 'llama-3.3-70b-versatile';
}

async function getGroqChatResponse(messages, maxTokens = 2500, temperature = 0.6) {
  if (!env.groqApiKey) {
    return {
      reply: 'UPSC AI Mentor is running in offline mode. Please configure GROQ_API_KEY for live answers.',
      modelUsed: 'mock',
    };
  }

  const model = await getAvailableModel();
  try {
    const completion = await groq.chat.completions.create({
      messages,
      model,
      temperature,
      max_tokens: maxTokens,
    });

    if (completion.choices[0]?.message?.content) {
      return {
        reply: completion.choices[0].message.content,
        modelUsed: model,
      };
    }
  } catch (err) {
    console.error('Groq Chat Completion Error:', err.message);
    // Try fallback model
    try {
      const fallback = await groq.chat.completions.create({
        messages,
        model: 'llama3-8b-8192',
        temperature,
        max_tokens: maxTokens,
      });
      return {
        reply: fallback.choices[0]?.message?.content || 'Unable to generate response.',
        modelUsed: 'llama3-8b-8192',
      };
    } catch (fallbackErr) {
      console.error('Groq Fallback Error:', fallbackErr.message);
    }
  }
  return null;
}

module.exports = {
  groq,
  getGroqChatResponse,
};
