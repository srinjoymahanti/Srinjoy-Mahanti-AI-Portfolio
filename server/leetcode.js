const GRAPHQL_URL = 'https://leetcode.com/graphql';
const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map();

const PROFILE_QUERY = `
  query portfolioLeetCodeProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile { ranking }
      submitStats {
        acSubmissionNum { difficulty count submissions }
      }
      userCalendar { streak totalActiveDays submissionCalendar }
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      rating
      globalRanking
      topPercentage
    }
    allQuestionsCount { difficulty count }
  }
`;

const RECENT_ACCEPTED_QUERY = `
  query portfolioRecentAccepted($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id
      title
      titleSlug
      timestamp
    }
  }
`;

const CONTEST_HISTORY_QUERY = `
  query portfolioContestHistory($username: String!) {
    userContestRankingHistory(username: $username) {
      attended
      rating
      ranking
      problemsSolved
      totalProblems
      contest { title startTime }
    }
  }
`;

const DAILY_QUESTION_QUERY = `
  query portfolioDailyQuestion {
    activeDailyCodingChallengeQuestion {
      date
      link
      question { questionId title titleSlug difficulty }
    }
  }
`;

const BADGES_QUERY = `
  query portfolioBadges($username: String!) {
    matchedUser(username: $username) {
      badges { id displayName icon creationDate }
    }
  }
`;

async function graphQL(query, variables = {}, username = '') {
  const params = new URLSearchParams({ query });
  if (Object.keys(variables).length) params.set('variables', JSON.stringify(variables));
  const response = await fetch(`${GRAPHQL_URL}?${params.toString()}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'User-Agent': 'SrinjoyMahantiPortfolio/1.0',
      Referer: username ? `https://leetcode.com/u/${encodeURIComponent(username)}/` : 'https://leetcode.com/',
    },
    signal: AbortSignal.timeout(12000),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(`LeetCode returned HTTP ${response.status}.`);
    error.status = response.status;
    throw error;
  }
  if (payload.errors?.length && !payload.data) {
    throw new Error(payload.errors[0]?.message || 'LeetCode could not return public profile data.');
  }
  return payload.data || {};
}

function getCount(list, difficulty) {
  return Number(list?.find((item) => item.difficulty === difficulty)?.count || 0);
}

function parseSubmissionCalendar(rawCalendar) {
  if (!rawCalendar) return {};
  try {
    const parsed = typeof rawCalendar === 'string' ? JSON.parse(rawCalendar) : rawCalendar;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function buildActivity(calendarRaw) {
  const rawCalendar = parseSubmissionCalendar(calendarRaw);
  const countsByDate = new Map();
  for (const [timestamp, count] of Object.entries(rawCalendar)) {
    const date = new Date(Number(timestamp) * 1000);
    if (!Number.isNaN(date.getTime())) {
      const day = date.toISOString().slice(0, 10);
      countsByDate.set(day, (countsByDate.get(day) || 0) + Number(count || 0));
    }
  }

  const today = new Date();
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 364);
  // Align the first cell to Sunday, like the familiar contribution heatmap.
  start.setUTCDate(start.getUTCDate() - start.getUTCDay());

  const days = [];
  let totalSubmissions = 0;
  let activeDays = 0;
  for (const cursor = new Date(start); cursor <= end; cursor.setUTCDate(cursor.getUTCDate() + 1)) {
    const date = cursor.toISOString().slice(0, 10);
    const count = countsByDate.get(date) || 0;
    const isWithinYear = date >= new Date(end.getTime() - 364 * 86400000).toISOString().slice(0, 10);
    if (isWithinYear) {
      totalSubmissions += count;
      if (count > 0) activeDays += 1;
    }
    days.push({
      date,
      count,
      level: count === 0 ? 0 : count < 3 ? 1 : count < 6 ? 2 : count < 10 ? 3 : 4,
    });
  }
  return { days, totalSubmissions, activeDays };
}

function normalizeDailyQuestion(data) {
  const item = data?.activeDailyCodingChallengeQuestion;
  if (!item?.question) return null;
  return {
    date: item.date || null,
    title: item.question.title,
    titleSlug: item.question.titleSlug,
    difficulty: item.question.difficulty,
    url: item.link?.startsWith('http') ? item.link : `https://leetcode.com${item.link || `/problems/${item.question.titleSlug}/`}`,
  };
}

export async function getLeetCodeSnapshot(username = '', { force = false } = {}) {
  const normalizedUsername = String(username || '').trim().replace(/^@/, '');
  if (normalizedUsername && !/^[a-zA-Z0-9_-]{1,30}$/.test(normalizedUsername)) {
    const error = new Error('Invalid LeetCode username. Use the username from your public profile URL.');
    error.status = 400;
    throw error;
  }

  const cacheKey = normalizedUsername.toLowerCase() || '__daily__';
  const cached = cache.get(cacheKey);
  if (!force && cached && Date.now() - cached.savedAt < CACHE_TTL_MS) return cached.value;

  const dailyPromise = graphQL(DAILY_QUESTION_QUERY);
  if (!normalizedUsername) {
    const dailyData = await dailyPromise;
    const value = {
      username: '',
      profileUrl: '',
      profile: null,
      dailyQuestion: normalizeDailyQuestion(dailyData),
      recentAccepted: [],
      badges: [],
      activity: null,
    };
    cache.set(cacheKey, { savedAt: Date.now(), value });
    return value;
  }

  const [profileResult, recentResult, dailyResult, badgesResult, contestHistoryResult] = await Promise.allSettled([
    graphQL(PROFILE_QUERY, { username: normalizedUsername }, normalizedUsername),
    graphQL(RECENT_ACCEPTED_QUERY, { username: normalizedUsername, limit: 8 }, normalizedUsername),
    dailyPromise,
    graphQL(BADGES_QUERY, { username: normalizedUsername }, normalizedUsername),
    graphQL(CONTEST_HISTORY_QUERY, { username: normalizedUsername }, normalizedUsername),
  ]);

  if (profileResult.status !== 'fulfilled') throw profileResult.reason;
  const profileData = profileResult.value;
  const matchedUser = profileData?.matchedUser;
  if (!matchedUser) {
    const error = new Error('That LeetCode username was not found. Check the profile URL and try again.');
    error.status = 404;
    throw error;
  }

  const acceptedCounts = matchedUser.submitStats?.acSubmissionNum || [];
  const allCounts = profileData.allQuestionsCount || [];
  const allSolvedFromRow = getCount(acceptedCounts, 'All');
  const allSolved = allSolvedFromRow || getCount(acceptedCounts, 'Easy') + getCount(acceptedCounts, 'Medium') + getCount(acceptedCounts, 'Hard');
  const allAvailable = getCount(allCounts, 'All');
  const activity = buildActivity(matchedUser.userCalendar?.submissionCalendar);
  const contest = profileData.userContestRanking || null;

  const recentData = recentResult.status === 'fulfilled' ? recentResult.value : {};
  const dailyData = dailyResult.status === 'fulfilled' ? dailyResult.value : {};
  const badgesData = badgesResult.status === 'fulfilled' ? badgesResult.value : {};
  const badges = badgesData?.matchedUser?.badges || [];
  const contestHistoryData = contestHistoryResult.status === 'fulfilled' ? contestHistoryResult.value : {};
  const contestHistory = (contestHistoryData?.userContestRankingHistory || [])
    .filter((item) => item?.attended && Number.isFinite(Number(item.rating)))
    .slice(-16)
    .map((item) => ({
      rating: Math.round(Number(item.rating)),
      ranking: item.ranking ?? null,
      problemsSolved: item.problemsSolved ?? null,
      totalProblems: item.totalProblems ?? null,
      title: item.contest?.title || 'Weekly contest',
      startTime: Number(item.contest?.startTime || 0),
    }));

  const value = {
    username: matchedUser.username || normalizedUsername,
    profileUrl: `https://leetcode.com/u/${encodeURIComponent(matchedUser.username || normalizedUsername)}/`,
    profile: {
      ranking: matchedUser.profile?.ranking ?? null,
      totalSolved: allSolved,
      totalAvailable: allAvailable,
      progressPercent: allAvailable ? Number(((allSolved / allAvailable) * 100).toFixed(1)) : 0,
      easy: { solved: getCount(acceptedCounts, 'Easy'), total: getCount(allCounts, 'Easy') },
      medium: { solved: getCount(acceptedCounts, 'Medium'), total: getCount(allCounts, 'Medium') },
      hard: { solved: getCount(acceptedCounts, 'Hard'), total: getCount(allCounts, 'Hard') },
      streak: matchedUser.userCalendar?.streak ?? 0,
      totalActiveDays: matchedUser.userCalendar?.totalActiveDays ?? 0,
      contest: contest ? {
        rating: Math.round(Number(contest.rating || 0)),
        globalRanking: contest.globalRanking ?? null,
        attendedContestsCount: contest.attendedContestsCount ?? 0,
        topPercentage: contest.topPercentage ?? null,
      } : null,
    },
    activity,
    recentAccepted: (recentData.recentAcSubmissionList || []).map((item) => ({
      id: item.id,
      title: item.title,
      titleSlug: item.titleSlug,
      timestamp: Number(item.timestamp),
      url: `https://leetcode.com/problems/${item.titleSlug}/`,
    })),
    dailyQuestion: normalizeDailyQuestion(dailyData),
    contestHistory,
    badges: badges.map((badge) => ({
      id: badge.id,
      name: badge.displayName,
      icon: badge.icon,
      earnedAt: badge.creationDate,
    })),
    partialWarnings: [
      ...(recentResult.status === 'rejected' ? ['Recent accepted submissions are temporarily unavailable.'] : []),
      ...(dailyResult.status === 'rejected' ? ['The daily challenge is temporarily unavailable.'] : []),
      ...(badgesResult.status === 'rejected' ? ['Badge data is temporarily unavailable.'] : []),
      ...(contestHistoryResult.status === 'rejected' ? ['Contest rating history is temporarily unavailable.'] : []),
    ],
  };

  cache.set(cacheKey, { savedAt: Date.now(), value });
  return value;
}
