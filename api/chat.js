// Vercel serverless function — Claude Haiku RAG chat for Resume101.
// Reads resume101_RAG.txt (bundled via vercel.json includeFiles),
// retrieves relevant sections via keyword match, calls Claude Haiku.
//
// Env vars required:
//   ANTHROPIC_API_KEY — from console.anthropic.com

const { readFileSync } = require('fs');
const { join } = require('path');

// Module-level cache: survives warm invocations
let ragSections = null;

function loadRag() {
  if (ragSections) return ragSections;
  try {
    const raw = readFileSync(join(__dirname, '..', 'resume101_RAG.txt'), 'utf-8');
    ragSections = parseRag(raw);
  } catch {
    ragSections = [];
  }
  return ragSections;
}

function parseRag(text) {
  // Split on numbered items (e.g. "1. ", "2. ", etc.)
  const chunks = text.split(/\n(?=\d+\.\s)/);
  return chunks.map(chunk => {
    const keywordsMatch = chunk.match(/\* Keywords:\s*(.+)/i);
    const answerMatch = chunk.match(/\* Answer\/Information:\s*([\s\S]+?)(?=\n\*|\n\d+\.|$)/i);
    const topicMatch = chunk.match(/\* Topic\/Question:\s*(.+)/i);
    return {
      raw: chunk.trim(),
      keywords: keywordsMatch ? keywordsMatch[1].toLowerCase().split(/,\s*/) : [],
      topic: topicMatch ? topicMatch[1].trim() : '',
      answer: answerMatch ? answerMatch[1].trim() : chunk.trim(),
    };
  }).filter(s => s.answer.length > 20);
}

function retrieveRelevant(query, sections, topK = 3) {
  const words = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2);
  const scored = sections.map(section => {
    let score = 0;
    for (const word of words) {
      if (section.keywords.some(kw => kw.includes(word) || word.includes(kw))) score += 2;
      if (section.raw.toLowerCase().includes(word)) score += 1;
    }
    return { section, score };
  });
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(s => s.section);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });
  }

  const { messages = [], actorName = '' } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' });
  }

  // Retrieve relevant RAG sections based on the last user message
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';
  const sections = loadRag();
  const relevant = retrieveRelevant(lastUserMsg, sections);
  const ragContext = relevant.length > 0
    ? relevant.map(s => `Q: ${s.topic}\nA: ${s.answer}`).join('\n\n')
    : 'No specific guidance found — answer generally from your industry expertise.';

  const systemPrompt = `You are the Resume101 assistant — an expert guide for parents building professional actor resumes for their children. Your knowledge comes from Child Actor 101 and the expertise of Corey Ralston, a Hollywood youth talent manager specializing in TV and film child actors.

You help parents with:
- Resume formatting and industry standards
- Credit organization and hierarchy
- Union status (SAG-AFTRA, Non-Union, etc.)
- Headshots, representation, and casting
- Special skills, training, and professional positioning
- Audition preparation and career development

${actorName ? `The actor you're helping with is named ${actorName}.` : ''}

Tone: warm, experienced, direct, slightly cinematic. Like a trusted industry mentor, not a chatbot.

Keep responses to 2–4 sentences unless a question genuinely requires more. No legal or medical advice. Stay focused on child actor careers.

Relevant industry guidance for this conversation:
---
${ragContext}
---`;

  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: systemPrompt,
        messages: messages.slice(-10), // last 10 messages to keep context manageable
      }),
    });

    if (!anthropicRes.ok) {
      const text = await anthropicRes.text();
      console.error('Anthropic error:', anthropicRes.status, text);
      return res.status(502).json({ error: 'AI service unavailable' });
    }

    const data = await anthropicRes.json();
    const content = data.content?.[0]?.text || "I'm not sure about that one — try rephrasing or ask me something else about the resume.";
    return res.status(200).json({ content });
  } catch (err) {
    console.error('chat handler error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
};
