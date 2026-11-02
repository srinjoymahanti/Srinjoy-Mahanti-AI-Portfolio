const API_ROOT = 'https://api.github.com';
const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map();

function normalizeRepo(repo) {
  return {
    id: repo.id,
    name: repo.name,
    fullName: repo.full_name,
    description: repo.description || '',
    url: repo.html_url,
    language: repo.language || 'Not specified',
    stars: Number(repo.stargazers_count || 0),
    forks: Number(repo.forks_count || 0),
    isFork: Boolean(repo.fork),
    archived: Boolean(repo.archived),
    updatedAt: repo.updated_at || null,
    topics: Array.isArray(repo.topics) ? repo.topics : [],
  };
}

async function githubGet(path) {
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'SrinjoyMahantiPortfolio/1.0',
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const response = await fetch(`${API_ROOT}${path}`, {
    headers,
    signal: AbortSignal.timeout(12000),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload?.message || `GitHub returned HTTP ${response.status}.`);
    error.status = response.status === 404 ? 404 : response.status === 403 || response.status === 429 ? 429 : 502;
    throw error;
  }
  return payload;
}

export async function getGitHubSnapshot(username, { force = false } = {}) {
  const normalizedUsername = String(username || '').trim().replace(/^@/, '');
  if (!/^[a-zA-Z0-9-]{1,39}$/.test(normalizedUsername)) {
    const error = new Error('Invalid GitHub username.');
    error.status = 400;
    throw error;
  }

  const cacheKey = normalizedUsername.toLowerCase();
  const cached = cache.get(cacheKey);
  if (!force && cached && Date.now() - cached.savedAt < CACHE_TTL_MS) return cached.value;

  const profile = await githubGet(`/users/${encodeURIComponent(normalizedUsername)}`);
  const publicRepositoryCount = Number(profile.public_repos || 0);
  const pages = Math.max(1, Math.min(5, Math.ceil(publicRepositoryCount / 100)));
  const repoPages = await Promise.all(Array.from({ length: pages }, (_, index) =>
    githubGet(`/users/${encodeURIComponent(normalizedUsername)}/repos?type=owner&sort=updated&per_page=100&page=${index + 1}`),
  ));
  const rawRepositories = repoPages.flat().filter((repo) => !repo.private);
  const repositories = rawRepositories.map(normalizeRepo);
  const originalRepositories = repositories.filter((repo) => !repo.isFork);
  const languageCounts = new Map();
  for (const repo of originalRepositories) {
    if (repo.language && repo.language !== 'Not specified') {
      languageCounts.set(repo.language, (languageCounts.get(repo.language) || 0) + 1);
    }
  }

  const value = {
    username: profile.login || normalizedUsername,
    profileUrl: profile.html_url || `https://github.com/${normalizedUsername}`,
    fetchedAt: new Date().toISOString(),
    profile: {
      name: profile.name || profile.login || normalizedUsername,
      bio: profile.bio || '',
      followers: Number(profile.followers || 0),
      following: Number(profile.following || 0),
      publicRepositories: publicRepositoryCount,
      accountCreatedAt: profile.created_at || null,
      avatarUrl: profile.avatar_url || '',
    },
    publicRepositoryCount,
    fetchedRepositoryCount: repositories.length,
    publicRepositories: [...repositories].sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0)),
    originalPublicRepositoryCount: originalRepositories.length,
    totalStars: originalRepositories.reduce((sum, repo) => sum + repo.stars, 0),
    totalForks: originalRepositories.reduce((sum, repo) => sum + repo.forks, 0),
    languages: [...languageCounts.entries()]
      .map(([language, count]) => ({ language, repositories: count }))
      .sort((a, b) => b.repositories - a.repositories)
      .slice(0, 8),
    topRepositories: [...originalRepositories]
      .sort((a, b) => b.stars - a.stars || new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
      .slice(0, 10),
    recentRepositories: [...originalRepositories]
      .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0))
      .slice(0, 10),
    note: 'GitHub public profile data only. Public repository totals may include forks; the original repository count excludes repositories marked as forks. Private repositories are not visible through this public endpoint.',
  };

  cache.set(cacheKey, { savedAt: Date.now(), value });
  return value;
}

export function formatGitHubContext(snapshot) {
  if (!snapshot) return 'Live GitHub profile data is currently unavailable.';
  const profile = snapshot.profile || {};
  const topRepos = (snapshot.topRepositories || []).slice(0, 8)
    .map((repo) => `${repo.fullName} (${repo.language}; ${repo.stars} stars; ${repo.forks} forks) — ${repo.description || 'No description'}`)
    .join('\n');
  const publicRepoNames = (snapshot.publicRepositories || []).slice(0, 30)
    .map((repo) => `${repo.fullName}${repo.isFork ? ' [fork]' : ''} — ${repo.language}; ${repo.stars} stars; ${repo.url}`)
    .join('\n');
  const languages = (snapshot.languages || []).map((item) => `${item.language}: ${item.repositories} repositories`).join(', ');
  return [
    `GitHub username: @${snapshot.username}. Profile: ${snapshot.profileUrl}.`,
    `GitHub currently reports ${snapshot.publicRepositoryCount} public repositories. ${snapshot.originalPublicRepositoryCount} non-fork public repositories were present in the fetched repository inventory (${snapshot.fetchedRepositoryCount} repository records fetched).`,
    `Followers: ${profile.followers ?? 'unknown'}. Following: ${profile.following ?? 'unknown'}. Stars across fetched non-fork public repositories: ${snapshot.totalStars ?? 'unknown'}. Forks across those repositories: ${snapshot.totalForks ?? 'unknown'}.`,
    `Top programming languages in fetched non-fork public repositories: ${languages || 'not available'}.`,
    `Repositories with the most stars:\n${topRepos || 'No public repositories were returned.'}`,
    `Public repository inventory (up to 30 records):\n${publicRepoNames || 'No public repositories were returned.'}`,
    snapshot.note,
  ].join('\n');
}

export function formatGitHubRepositoryCount(snapshot) {
  if (!snapshot) return 'Live GitHub repository information is temporarily unavailable. Please open Srinjoy’s public GitHub profile to verify the current count.';
  return `GitHub currently reports ${snapshot.publicRepositoryCount} public repositories for @${snapshot.username}. Of the repository records retrieved, ${snapshot.originalPublicRepositoryCount} are not marked as forks. The public total can include forks and excludes private repositories, so it is the count of publicly listed repositories—not a verified count of projects authored from scratch. Profile: ${snapshot.profileUrl}`;
}
