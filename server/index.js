import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import nodemailer from 'nodemailer';
import { retrievePortfolioContext, isProjectListQuestion, formatProjectInventory, isGitHubQuestion, isLeetCodeQuestion, isCodingProfilesQuestion, formatLeetCodeContext } from './knowledge.js';
import { getLeetCodeSnapshot } from './leetcode.js';
import { getGitHubSnapshot, formatGitHubContext, formatGitHubRepositoryCount } from './github.js';
import { portfolio } from '../src/data/portfolio.js';

const app = express();
const PORT = Number(process.env.PORT || 4000);
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map((value) => value.trim());
const gmailUser = (process.env.GMAIL_USER || '').trim();
const gmailAppPassword = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
const contactTransporter = gmailUser && gmailAppPassword
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: { user: gmailUser, pass: gmailAppPassword },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 20000,
    })
  : null;

app.disable('x-powered-by');
app.use(cors({ origin(origin, callback) {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
  return callback(null, false);
} }));
app.use(express.json({ limit: '24kb' }));
app.use('/api/chat', rateLimit({ windowMs: 60 * 1000, limit: 12, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: 'Too many messages. Please try again in a minute.' } }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok', assistantConfigured: Boolean(process.env.GROQ_API_KEY), contactConfigured: Boolean(contactTransporter), githubApi: 'available', leetcodeApi: 'available' }));

// Public LeetCode data is fetched server-side to avoid browser CORS restrictions.
// Configure the public username in src/data/portfolio.js; no LeetCode cookies are used.
app.use('/api/leetcode', rateLimit({ windowMs: 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false }));

app.get('/api/leetcode', async (req, res) => {
  try {
    const username = typeof req.query.username === 'string' ? req.query.username : '';
    const snapshot = await getLeetCodeSnapshot(username, { force: req.query.refresh === '1' });
    return res.json(snapshot);
  } catch (error) {
    const status = Number.isInteger(error.status) ? error.status : 502;
    console.error('LeetCode API error:', error.message);
    return res.status(status).json({ error: error.message || 'Live LeetCode data is temporarily unavailable.' });
  }
});

// Public GitHub profile data is fetched server-side and cached for five minutes.
app.use('/api/github', rateLimit({ windowMs: 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false }));

app.get('/api/github', async (req, res) => {
  try {
    const username = typeof req.query.username === 'string' && req.query.username.trim()
      ? req.query.username
      : portfolio.githubUsername;
    const snapshot = await getGitHubSnapshot(username, { force: req.query.refresh === '1' });
    return res.json(snapshot);
  } catch (error) {
    const status = Number.isInteger(error.status) ? error.status : 502;
    console.error('GitHub API error:', error.message);
    return res.status(status).json({ error: error.message || 'Live GitHub data is temporarily unavailable.' });
  }
});

function isRepositoryCountQuestion(question) {
  const value = String(question || '').toLowerCase();
  return /\b(how many|number of|count of|total)\b/.test(value)
    && /\b(repository|repositories|repo|repos)\b/.test(value);
}

function isGitHubRepositoryListQuestion(question) {
  const value = String(question || '').toLowerCase();
  return /\b(list|show|which|what|name)\b/.test(value)
    && /\b(repository|repositories|repo|repos)\b/.test(value);
}

function formatGitHubRepositoryList(snapshot) {
  if (!snapshot) return formatGitHubQuickAnswer(null);
  const repositories = snapshot.publicRepositories || [];
  const lines = repositories.slice(0, 25).map((repo, index) =>
    `${index + 1}. ${repo.name}${repo.isFork ? ' (fork)' : ''} — ${repo.language}; ${repo.stars} stars; ${repo.url}${repo.description ? `\n   ${repo.description}` : ''}`,
  );
  const remaining = Math.max(0, repositories.length - lines.length);
  return `GitHub currently reports ${snapshot.publicRepositoryCount} public repositories for @${snapshot.username}. Here are ${lines.length} public repositories returned by the API${remaining ? `; ${remaining} more were not included in this message` : ''}:\n\n${lines.join('\n\n')}\n\nPublic profile: ${snapshot.profileUrl}. Private repositories are not included.`;
}

function formatLeetCodeQuickAnswer(snapshot) {
  if (!snapshot?.profile) {
    return `I couldn't retrieve live LeetCode statistics right now. Srinjoy's resume confirms a milestone of ${portfolio.leetcodeSolvedMilestone} problems solved. His live profile is ${portfolio.leetcodeProfileUrl}.`;
  }
  const p = snapshot.profile;
  const c = p.contest;
  const lines = [
    `Srinjoy's live LeetCode profile (@${snapshot.username}) currently shows ${p.totalSolved} problems solved.`,
    `Difficulty breakdown: Easy ${p.easy?.solved ?? '—'}, Medium ${p.medium?.solved ?? '—'}, Hard ${p.hard?.solved ?? '—'}.`,
    `Global ranking: ${p.ranking ?? 'not available'}.`,
    `Contest rating: ${c?.rating ?? 'not available'}; contests attended: ${c?.attendedContestsCount ?? 'not available'}; contest global rank: ${c?.globalRanking ?? 'not available'}.`,
    `Activity: ${p.streak ?? 0}-day current streak, ${p.totalActiveDays ?? snapshot.activity?.activeDays ?? '—'} active days, ${snapshot.activity?.totalSubmissions ?? '—'} submissions in the last year.`,
  ];
  if (snapshot.dailyQuestion) lines.push(`Today's challenge: ${snapshot.dailyQuestion.title} (${snapshot.dailyQuestion.difficulty}) — ${snapshot.dailyQuestion.url}`);
  if (snapshot.recentAccepted?.length) lines.push(`Recent accepted problems: ${snapshot.recentAccepted.slice(0, 5).map((item) => item.title).join(', ')}.`);
  lines.push(`Profile: ${snapshot.profileUrl}`);
  return lines.join('\n');
}

function formatGitHubQuickAnswer(snapshot) {
  if (!snapshot) return 'I could not retrieve live GitHub information right now. You can view Srinjoy’s public profile at https://github.com/srinjoymahanti.';
  const p = snapshot.profile;
  const popular = (snapshot.topRepositories || []).slice(0, 5).map((repo) => `${repo.name} (${repo.stars} stars)`).join(', ');
  return [
    `Srinjoy's GitHub account is @${snapshot.username}. GitHub currently reports ${snapshot.publicRepositoryCount} public repositories. ${snapshot.originalPublicRepositoryCount} fetched public repositories are not marked as forks.`,
    `The fetched non-fork repositories have ${snapshot.totalStars} stars and ${snapshot.totalForks} forks in total. The account has ${p.followers} followers and follows ${p.following} accounts.`,
    `Popular repositories by stars: ${popular || 'not available'}.`,
    `Profile: ${snapshot.profileUrl}`,
    'The public repository total can include forks and does not include private repositories; it should not be interpreted as a verified count of projects authored from scratch.',
  ].join('\n');
}

app.post('/api/chat', async (req, res) => {
  try {
    const inputMessages = req.body?.messages;
    if (!Array.isArray(inputMessages) || inputMessages.length === 0 || inputMessages.length > 8) {
      return res.status(400).json({ error: 'Send between 1 and 8 chat messages.' });
    }
    const messages = inputMessages.map((message) => {
      if (!['user', 'assistant'].includes(message?.role) || typeof message?.content !== 'string') throw new Error('Invalid message format.');
      const content = message.content.trim();
      if (!content || content.length > 1200) throw new Error('Each message must contain 1–1200 characters.');
      return { role: message.role, content };
    });
    const userQuestions = messages.filter((message) => message.role === 'user').map((message) => message.content);
    const latestQuestion = userQuestions.at(-1);
    if (!latestQuestion) return res.status(400).json({ error: 'A user message is required.' });

    // Project-list questions are deterministic and always include the full catalog.
    if (isProjectListQuestion(latestQuestion)) {
      return res.json({ reply: formatProjectInventory(), source: 'portfolio-project-catalog' });
    }

    // Pull live GitHub and/or LeetCode data only when the visitor asks about coding profiles.
    // Both requests are cached by their service modules to keep API traffic controlled.
    const asksBothProfiles = isCodingProfilesQuestion(latestQuestion);
    const shouldLoadGitHub = asksBothProfiles || isGitHubQuestion(latestQuestion);
    const shouldLoadLeetCode = asksBothProfiles || isLeetCodeQuestion(latestQuestion);
    const [githubResult, leetcodeResult] = await Promise.all([
      shouldLoadGitHub
        ? getGitHubSnapshot(portfolio.githubUsername, { force: false }).then((value) => ({ status: 'fulfilled', value })).catch((reason) => ({ status: 'rejected', reason }))
        : Promise.resolve({ status: 'skipped' }),
      shouldLoadLeetCode
        ? getLeetCodeSnapshot(portfolio.leetcodeUsername, { force: false }).then((value) => ({ status: 'fulfilled', value })).catch((reason) => ({ status: 'rejected', reason }))
        : Promise.resolve({ status: 'skipped' }),
    ]);

    const githubSnapshot = githubResult.status === 'fulfilled' ? githubResult.value : null;
    const leetcodeSnapshot = leetcodeResult.status === 'fulfilled' ? leetcodeResult.value : null;

    // Repository-count questions use the authoritative GitHub public_repos field directly.
    // This also works when the Groq key has not been configured yet.
    if (shouldLoadGitHub && isRepositoryCountQuestion(latestQuestion)) {
      if (githubSnapshot) return res.json({ reply: formatGitHubRepositoryCount(githubSnapshot), source: 'live-github-api' });
      return res.json({ reply: formatGitHubQuickAnswer(null), source: 'github-api-unavailable' });
    }
    if (shouldLoadGitHub && isGitHubRepositoryListQuestion(latestQuestion)) {
      return res.json({ reply: formatGitHubRepositoryList(githubSnapshot), source: 'live-github-api' });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      if (shouldLoadGitHub && shouldLoadLeetCode) {
        return res.json({ reply: `${formatGitHubQuickAnswer(githubSnapshot)}\n\n${formatLeetCodeQuickAnswer(leetcodeSnapshot)}`, source: 'live-coding-profiles' });
      }
      if (shouldLoadGitHub) return res.json({ reply: formatGitHubQuickAnswer(githubSnapshot), source: 'live-github-api' });
      if (shouldLoadLeetCode) return res.json({ reply: formatLeetCodeQuickAnswer(leetcodeSnapshot), source: 'live-leetcode-api' });
      return res.status(503).json({ error: 'The AI assistant is not configured yet. Add GROQ_API_KEY to the server environment.' });
    }

    const context = retrievePortfolioContext(userQuestions.join(' '));
    const liveContext = [
      shouldLoadGitHub ? `LIVE GITHUB DATA (fetched from GitHub's public API):\n${githubSnapshot ? formatGitHubContext(githubSnapshot) : `GitHub data could not be fetched: ${githubResult.reason?.message || 'temporarily unavailable'}. Do not invent values.`}` : '',
      shouldLoadLeetCode ? `LIVE LEETCODE DATA (fetched from LeetCode's public profile endpoint):\n${leetcodeSnapshot ? formatLeetCodeContext(leetcodeSnapshot) : `LeetCode data could not be fetched: ${leetcodeResult.reason?.message || 'temporarily unavailable'}. Use only the resume-confirmed ${portfolio.leetcodeSolvedMilestone} solved milestone if relevant and clearly label it as a resume milestone, not a live figure.`}` : '',
    ].filter(Boolean).join('\n\n');
    const systemPrompt = `You are the portfolio assistant for Srinjoy Mahanti. Answer recruiter and visitor questions using only the portfolio context and any live profile data provided below. Be concise, professional, friendly, and specific. Do not invent metrics, dates, responsibilities, repository URLs, awards, certifications, or technical experience. Treat live GitHub and LeetCode values as authoritative for the fetched timestamp. Clearly distinguish public GitHub repositories from private repositories and never imply that a repository count proves authorship. For LeetCode, distinguish the live profile total from the older resume milestone. If live data is unavailable, say so; do not fabricate a number. If a visitor asks for repository counts, use the GitHub public repository count exactly as provided. If a visitor asks about LeetCode, use the supplied live solved count, difficulty totals, contest stats, activity, daily challenge, or recent accepted problems as relevant. Do not claim to be Srinjoy; speak about him in the third person. Keep answers relevant to the question. Project-list questions are answered from the complete featured-project catalog, not just the highest-ranked retrieval result.\n\nPORTFOLIO CONTEXT:\n${context}\n\n${liveContext}`;

    const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature: 0.35,
        max_completion_tokens: 500,
      }),
      signal: AbortSignal.timeout(25000),
    });
    const payload = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      console.error('Groq API error:', upstream.status, payload?.error?.message || 'Unknown error');
      return res.status(502).json({ error: 'The AI service could not complete that request. Please try again.' });
    }
    const reply = payload?.choices?.[0]?.message?.content;
    if (typeof reply !== 'string' || !reply.trim()) return res.status(502).json({ error: 'The AI service returned an empty response. Please try again.' });
    return res.json({ reply: reply.trim() });
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') return res.status(504).json({ error: 'The AI request timed out. Please try again.' });
    if (error.message?.includes('Invalid message') || error.message?.includes('Each message')) return res.status(400).json({ error: error.message });
    console.error('Chat route error:', error.message);
    return res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});

// Contact form: validate the visitor's email and send the message through the
// portfolio owner's Gmail account. Credentials stay exclusively on the server.
app.use('/api/contact', rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many messages from this connection. Please try again later.' },
}));

function isValidContactEmail(value) {
  return typeof value === 'string'
    && value.length <= 254
    && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
    && !/[\r\n]/.test(value);
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

app.post('/api/contact', async (req, res) => {
  const { email, message, website } = req.body || {};

  // Quietly accept honeypot submissions without sending mail.
  if (typeof website === 'string' && website.trim()) {
    return res.json({ ok: true, message: 'Thank you for reaching out.' });
  }

  const visitorEmail = typeof email === 'string' ? email.trim() : '';
  const visitorMessage = typeof message === 'string' ? message.trim() : '';

  if (!isValidContactEmail(visitorEmail)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (visitorMessage.length < 10 || visitorMessage.length > 5000) {
    return res.status(400).json({ error: 'Your message must be between 10 and 5,000 characters.' });
  }
  if (!contactTransporter) {
    return res.status(503).json({ error: 'Email delivery is not configured. Add GMAIL_USER and GMAIL_APP_PASSWORD to the backend .env file, then restart the server.' });
  }

  try {
    await contactTransporter.sendMail({
      from: { name: `${portfolio.name} · Portfolio`, address: gmailUser },
      to: portfolio.email,
      replyTo: visitorEmail,
      subject: 'New message from your portfolio website',
      text: `You received a new message through your portfolio contact form.\n\nVisitor email: ${visitorEmail}\n\nMessage:\n${visitorMessage}\n`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#20251b"><h2>New portfolio message</h2><p><strong>Visitor email:</strong> ${escapeHtml(visitorEmail)}</p><p><strong>Message:</strong></p><p>${escapeHtml(visitorMessage).replace(/\r?\n/g, '<br>')}</p></div>`,
    });
    return res.json({ ok: true, message: 'Your message has been sent successfully.' });
  } catch (error) {
    console.error('Contact email delivery failed:', error.code || error.message);
    return res.status(502).json({ error: 'Your message could not be delivered right now. Please try again later.' });
  }
});

// Return JSON for unknown API paths so clients never receive an HTML 404 page
// when they accidentally call an endpoint that does not exist.
app.use('/api', (_req, res) => res.status(404).json({ error: 'API endpoint not found.' }));

app.listen(PORT, () => console.log(`Portfolio API listening on http://localhost:${PORT}`));
