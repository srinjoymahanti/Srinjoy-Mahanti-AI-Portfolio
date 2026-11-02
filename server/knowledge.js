import { portfolio } from '../src/data/portfolio.js';

// Curated, auditable retrieval: lexical overlap ranks portfolio facts for the AI.
// This is intentionally lightweight retrieval, not embedding/vector RAG.
const projectChunks = portfolio.projects.map((project) => ({
  title: project.title,
  text: `${project.title}. ${project.category}. ${project.description}. Technologies: ${project.stack.join(', ')}. ${project.repo ? `Public source repository: ${project.repo}.` : 'A public repository link has not been provided.'}`,
}));

const chunks = [
  {
    title: 'Profile and education',
    text: `${portfolio.name} is an ${portfolio.education.degree} student at ${portfolio.education.institution}, affiliated with ${portfolio.education.university}. Study period: ${portfolio.education.period}. Expected graduation: ${portfolio.education.graduation}. CGPA: ${portfolio.education.cgpa}/10. Location: ${portfolio.location}. ${portfolio.intro}`,
  },
  {
    title: 'Technical skills',
    text: portfolio.skills.map((group) => `${group.group}: ${group.items.join(', ')}`).join('. '),
  },
  {
    title: 'Complete project inventory',
    text: `The portfolio currently contains ${portfolio.projects.length} featured projects: ${portfolio.projects.map((project) => project.title).join('; ')}. When asked to list projects, include every project in this inventory.`,
  },
  ...projectChunks,
  {
    title: 'Professional experience',
    text: portfolio.experience.map((item) => `${item.title} at ${item.organization}, ${item.location}, ${item.period}. ${item.description}`).join('. '),
  },
  {
    title: 'Achievements and coding practice',
    text: `${portfolio.highlights.map((item) => `${item.title}: ${item.detail}`).join('. ')}. The resume lists ${portfolio.leetcodeSolvedMilestone} LeetCode problems solved.`,
  },
  {
    title: 'Certifications',
    text: portfolio.certifications.map((item) => `${item.title} — ${item.issuer} (${item.detail})`).join('. '),
  },
  {
    title: 'Career interests and contact',
    text: `${portfolio.name} is interested in software engineering, full-stack development, backend development, applied AI, LLM applications, retrieval-augmented generation, and AI agents. He is open to internships and entry-level opportunities. Public email: ${portfolio.email}. LinkedIn: ${portfolio.linkedin}. GitHub: ${portfolio.github}.`,
  },
];

function tokenize(value) {
  return new Set(value.toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 2)
    .map((token) => token.endsWith('s') && token.length > 4 ? token.slice(0, -1) : token));
}

export function isProjectListQuestion(question) {
  const value = String(question || '').toLowerCase();
  const projectReference = /\bprojects?\b/.test(value);
  const inventoryIntent = /\b(what|which|list|show|all|tell|describe|how many|name)\b/.test(value);
  const asksWhatWasBuilt = /\b(what|which|how many)\b.{0,70}\bprojects?\b.{0,70}\b(built|created|developed|made|worked on)\b/.test(value);
  return (projectReference && inventoryIntent) || asksWhatWasBuilt;
}

export function formatProjectInventory() {
  const lines = portfolio.projects.map((project, index) => {
    const repo = project.repo ? `\n   GitHub: ${project.repo}` : '';
    return `${index + 1}. ${project.title}\n   ${project.description}\n   Technologies: ${project.stack.join(', ')}${repo}`;
  });
  return `Srinjoy's portfolio currently lists ${portfolio.projects.length} featured projects:\n\n${lines.join('\n\n')}`;
}

export function isGitHubQuestion(question) {
  const value = String(question || '').toLowerCase();
  return /\b(github|repositories|repository|repos|followers|following|stars|starred|forks|contributions|commits|open[- ]source)\b/.test(value);
}

export function isLeetCodeQuestion(question) {
  const value = String(question || '').toLowerCase();
  return /\b(leetcode|solved|coding profile|coding stats|contest rating|contest rank|daily challenge|submission activity|active days|streak|badges|easy|medium|hard)\b/.test(value)
    && /\b(leetcode|problem|problems|questions|coding|contest|challenge|submission|active|streak|badge|solved)\b/.test(value);
}

export function isCodingProfilesQuestion(question) {
  const value = String(question || '').toLowerCase();
  return /\b(both profiles|coding profiles|coding statistics|coding stats|competitive programming|programming profiles|github and leetcode|leetcode and github)\b/.test(value);
}

export function formatLeetCodeContext(snapshot) {
  if (!snapshot?.profile) {
    return `Live LeetCode profile data is currently unavailable. The supplied resume confirms the milestone of ${portfolio.leetcodeSolvedMilestone} problems solved, but no additional live statistics should be inferred.`;
  }
  const profile = snapshot.profile;
  const contest = profile.contest;
  const recent = (snapshot.recentAccepted || []).slice(0, 8)
    .map((problem) => `${problem.title} (${problem.url})`)
    .join('; ');
  const daily = snapshot.dailyQuestion
    ? `${snapshot.dailyQuestion.title} (${snapshot.dailyQuestion.difficulty}) — ${snapshot.dailyQuestion.url}`
    : 'Daily challenge data unavailable.';
  const badges = (snapshot.badges || []).map((badge) => badge.name).filter(Boolean).join(', ');
  const activity = snapshot.activity || {};
  return [
    `LeetCode username: @${snapshot.username}. Profile: ${snapshot.profileUrl}.`,
    `Problems solved: ${profile.totalSolved}. Easy: ${profile.easy?.solved ?? 'unknown'}/${profile.easy?.total ?? 'unknown'}; Medium: ${profile.medium?.solved ?? 'unknown'}/${profile.medium?.total ?? 'unknown'}; Hard: ${profile.hard?.solved ?? 'unknown'}/${profile.hard?.total ?? 'unknown'}.`,
    `Global ranking: ${profile.ranking ?? 'not available'}. Current streak: ${profile.streak ?? 'not available'} days. Total active days: ${profile.totalActiveDays ?? activity.activeDays ?? 'not available'}. Submissions in the last year: ${activity.totalSubmissions ?? 'not available'}.`,
    `Contest rating: ${contest?.rating ?? 'not available'}. Global contest rank: ${contest?.globalRanking ?? 'not available'}. Contests attended: ${contest?.attendedContestsCount ?? 'not available'}. Top percentage: ${contest?.topPercentage ?? 'not available'}.`,
    `Daily challenge: ${daily}`,
    `Recent accepted problems: ${recent || 'Recent accepted submissions are unavailable.'}`,
    `Badges: ${badges || 'No public badges were returned.'}`,
    ...(snapshot.partialWarnings || []).map((warning) => `Data warning: ${warning}`),
  ].join('\n');
}

export function retrievePortfolioContext(question, limit = 5) {
  const query = tokenize(question);
  const wantsProjects = isProjectListQuestion(question) || query.has('project');
  const ranked = chunks.map((chunk) => {
    const contentTokens = tokenize(`${chunk.title} ${chunk.text}`);
    let score = 0;
    for (const token of query) if (contentTokens.has(token)) score += 1;
    if (query.has('skill') && chunk.title === 'Technical skills') score += 2;
    if ((query.has('internship') || query.has('experience')) && chunk.title === 'Professional experience') score += 2;
    if ((query.has('leetcode') || query.has('coding') || query.has('solved')) && chunk.title === 'Achievements and coding practice') score += 2;
    if ((query.has('certificate') || query.has('certification')) && chunk.title === 'Certifications') score += 2;
    return { ...chunk, score };
  }).sort((a, b) => b.score - a.score);

  if (wantsProjects) {
    const fullProjectContext = [
      chunks.find((chunk) => chunk.title === 'Complete project inventory'),
      ...projectChunks,
    ];
    const supplemental = ranked.filter((chunk) => chunk.title === 'Technical skills' || chunk.title === 'Profile and education').slice(0, 1);
    return [...fullProjectContext, ...supplemental]
      .filter(Boolean)
      .map(({ title, text }) => `## ${title}\n${text}`)
      .join('\n\n');
  }

  return ranked.slice(0, limit).map(({ title, text }) => `## ${title}\n${text}`).join('\n\n');
}
