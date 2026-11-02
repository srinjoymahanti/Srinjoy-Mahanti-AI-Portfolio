import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDown, ArrowDownRight, ArrowUpRight, Activity, Award, BookOpen, Bot,
  BriefcaseBusiness, Check, Code2, Copy, Download, FileText, Github, Globe,
  GraduationCap, Layers3, Linkedin, Mail, MapPin, Menu, RefreshCw, Send,
  Sparkles, Star, Terminal, X, Zap,
} from 'lucide-react';
import { portfolio } from './data/portfolio.js';

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] } },
};

function SectionHeading({ index, eyebrow, title, note }) {
  return (
    <div className="section-heading">
      <div>
        <div className="eyebrow"><span>{index}</span><i />{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      {note && <p className="section-note">{note}</p>}
    </div>
  );
}

function Nav({ active, setActive }) {
  const [open, setOpen] = useState(false);
  const links = [
    ['About', '#about'], ['Work', '#work'], ['Stack', '#stack'],
    ['Journey', '#journey'], ['Coding', '#coding'], ['Ask AI', '#ask-ai'],
  ];
  return (
    <header className="topbar">
      <a className="brand" href="#home" aria-label="Srinjoy Mahanti home">
        <img className="brand-photo" src={portfolio.profilePhoto} alt="" />
        <span className="brand-name">SRINJOY MAHANTI</span>
      </a>
      <nav className={open ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation">
        {links.map(([label, href]) => (
          <a key={href} className={active === href ? 'active' : ''} href={href} onClick={() => { setActive(href); setOpen(false); }}>
            {label}
          </a>
        ))}
      </nav>
      <a className="nav-cta" href={portfolio.resumeUrl} download>
        Resume <Download size={14} />
      </a>
      <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle navigation" aria-expanded={open}>
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
    </header>
  );
}

function Hero() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()));
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="hero section-shell" id="home">
      <div className="hero-grid-lines" />
      <motion.div className="hero-copy" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.11 } } }}>
        <motion.div className="availability" variants={fadeUp}><span className="availability-dot" /> {portfolio.availability.toUpperCase()}</motion.div>
        <motion.p className="hero-kicker" variants={fadeUp}>HELLO, I'M {portfolio.name.toUpperCase()}</motion.p>
        <motion.h1 variants={fadeUp}>Building useful<br /><span>software</span> with a<br />curious mind<span className="period">.</span></motion.h1>
        <motion.p className="hero-description" variants={fadeUp}>{portfolio.intro}</motion.p>
        <motion.div className="hero-actions" variants={fadeUp}>
          <a href="#work" className="button button-primary">Explore my work <ArrowDownRight size={17} /></a>
          <a href={portfolio.resumeUrl} className="button button-quiet" download>Download resume <Download size={15} /></a>
        </motion.div>
        <motion.div className="hero-meta" variants={fadeUp}>
          <span><span className="meta-label"><MapPin size={11} /> BASED IN</span>{portfolio.location}</span>
          <span><span className="meta-label"><Activity size={11} /> LOCAL TIME</span>{time || '—'} IST</span>
        </motion.div>
      </motion.div>

      <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.94, rotate: 1.5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.85, delay: 0.25 }}>
        <div className="photo-orbit orbit-a" /><div className="photo-orbit orbit-b" />
        <div className="portrait-frame">
          <img src={portfolio.profilePhoto} alt="Portrait of Srinjoy Mahanti" className="portrait-image" />
          <div className="portrait-shade" />
          <div className="portrait-caption"><span>IT UNDERGRADUATE · 2027</span><b>SRINJOY MAHANTI</b></div>
        </div>
        <div className="floating-card card-code">
          <div className="card-top"><span /><span /><span /><small>profile.js</small></div>
          <div className="code-lines"><p><b>const</b> developer = {'{'}</p><p className="indent"><i>focus</i>: <em>'Software + AI'</em>,</p><p className="indent"><i>mindset</i>: <em>'Build. Learn.'</em>,</p><p className="indent"><i>available</i>: <strong>true</strong></p><p>{'}'};</p></div>
        </div>
        <div className="floating-card card-status"><span className="status-icon"><Zap size={15} /></span><div><b>Always learning</b><small>Building · Iterating · Improving</small></div></div>
        <div className="visual-index">01 / THE INTRODUCTION</div>
      </motion.div>
      <a href="#about" className="scroll-cue"><span>SCROLL TO EXPLORE</span><ArrowDown size={15} /></a>
    </section>
  );
}

function Marquee() {
  const items = ['FULL-STACK DEVELOPMENT', 'DATA STRUCTURES & ALGORITHMS', 'GENERATIVE AI', 'API ENGINEERING', 'PROBLEM SOLVING'];
  return <div className="marquee" aria-label="Areas of interest"><div className="marquee-track">{[...items, ...items].map((item, index) => <span key={`${item}-${index}`}>{item}<i>✳</i></span>)}</div></div>;
}

function About() {
  const facts = [
    { number: '01', title: 'Software development', detail: 'Web apps & APIs', icon: <Code2 size={18} /> },
    { number: '02', title: 'Applied AI', detail: 'LLM-powered products', icon: <Sparkles size={18} /> },
    { number: '03', title: 'Problem solving', detail: '150+ DSA problems', icon: <Terminal size={18} /> },
    { number: '04', title: 'Always learning', detail: 'Build · test · improve', icon: <Zap size={18} /> },
  ];
  return (
    <section className="section-shell section-block" id="about">
      <SectionHeading index="01" eyebrow="A LITTLE ABOUT ME" title={<>Curious mind.<br /><span className="muted-heading">Builder's energy.</span></>} note="I enjoy learning how systems work, then turning that understanding into useful experiences." />
      <div className="about-layout">
        <div className="about-main">
          <p className="about-lead">I'm an Information Technology undergraduate interested in <span>software engineering</span> and <span>practical AI applications</span>.</p>
          <p className="body-copy">I like approaching problems end to end: understanding the requirement, shaping the user experience, writing application logic, integrating APIs, and refining the result. My projects span full-stack applications, data processing, and LLM-powered workflows.</p>
          <p className="body-copy">Alongside building, I'm strengthening my foundations in Data Structures and Algorithms, Object-Oriented Programming, databases, and operating systems.</p>
          <div className="about-links">
            <a href={portfolio.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={14} /></a>
            <a href={portfolio.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={14} /></a>
            <a href="#coding"><Code2 size={16} /> Coding profiles <ArrowDown size={14} /></a>
          </div>
        </div>
        <div className="about-bento">
          <div className="bento-education">
            <div className="fact-icon"><GraduationCap size={19} /></div>
            <span className="fact-label">EDUCATION</span>
            <h3>{portfolio.education.degree}</h3>
            <p>{portfolio.education.institution}</p>
            <div className="education-score">
              <span className="education-score-label">CGPA</span>
              <strong>{portfolio.education.cgpa}<small>/10</small></strong>
            </div>
            <div className="bento-bottom"><span>{portfolio.education.university}</span><span>{portfolio.education.period}</span></div>
          </div>
          <div className="bento-note"><span className="fact-label">CURRENTLY EXPLORING</span><div className="focus-chips"><span>LLM applications</span><span>RAG systems</span><span>Backend design</span><span>Problem solving</span></div></div>
        </div>
      </div>
      <div className="about-principles">{facts.map((fact) => <div className="principle" key={fact.number}><div className="principle-icon">{fact.icon}</div><span>{fact.number}</span><b>{fact.title}</b><small>{fact.detail}</small></div>)}</div>
    </section>
  );
}

function ProjectIcon({ type }) {
  if (type === 'bot') return <Bot size={24} strokeWidth={1.5} />;
  if (type === 'kanban') return <Layers3 size={24} strokeWidth={1.5} />;
  return <Sparkles size={24} strokeWidth={1.5} />;
}

function ProjectCard({ project, featured }) {
  const previewTarget = project.demo || project.repo;
  return (
    <motion.article
      className={`project-card ${featured ? 'project-featured' : ''} accent-${project.accent}`}
      variants={fadeUp}
      whileHover={{ y: -7, transition: { duration: 0.22, ease: 'easeOut' } }}
      whileTap={{ scale: 0.995 }}
    >
      <div className="project-card-top"><span className="project-number">/{project.number}</span><span className="project-category">{project.category}</span><span className="project-icon"><ProjectIcon type={project.icon} /></span></div>
      {project.screenshot && (
        <a
          className="project-preview"
          href={previewTarget}
          target="_blank"
          rel="noreferrer"
          aria-label={`Open ${project.title} ${project.demo ? 'live demo' : 'source repository'}`}
        >
          <img src={project.screenshot} alt={`${project.title} interface preview`} loading="lazy" />
          <span className="project-preview-caption">{project.demo ? 'OPEN LIVE PROJECT' : 'PROJECT PREVIEW'} <ArrowUpRight size={13} /></span>
        </a>
      )}
      <div className="project-content"><h3>{project.title}</h3><p>{project.description}</p></div>
      <div className="project-bottom"><div className="tag-list">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <div className="project-links">
          {project.demo && <a href={project.demo} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={14} /></a>}
          {project.repo && <a href={project.repo} target="_blank" rel="noreferrer">Source <Github size={14} /></a>}
        </div>
      </div>
      <div className="project-watermark"><ProjectIcon type={project.icon} /></div>
    </motion.article>
  );
}

function Work() {
  return (
    <section className="section-shell section-block" id="work">
      <SectionHeading index="02" eyebrow="SELECTED WORK" title={<>Ideas made<br /><span className="muted-heading">into working things.</span></>} note="A selection of projects across applied AI, full-stack application development, and generative tools." />
      <motion.div className="projects-grid" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.12 }} variants={{ visible: { transition: { staggerChildren: 0.12 } } }}>
        {portfolio.projects.map((project, index) => <ProjectCard key={project.number} project={project} featured={index === 0} />)}
      </motion.div>
      <div className="work-footnote"><span className="tiny-dot" /> MORE BUILDS AND EXPERIMENTS ON <a href={portfolio.github} target="_blank" rel="noreferrer">GITHUB <ArrowUpRight size={13} /></a></div>
    </section>
  );
}

function Stack() {
  return (
    <section className="section-shell section-block" id="stack">
      <SectionHeading index="03" eyebrow="TOOLS OF THE TRADE" title={<>A practical<br /><span className="muted-heading">engineering toolkit.</span></>} note="Technologies and fundamentals used across my projects and learning." />
      <div className="skills-grid">
        {portfolio.skills.map((group, index) => <motion.article className="skill-card" key={group.group} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="skill-card-head"><span>0{index + 1}</span><div>{index === 0 ? <Code2 /> : index === 1 ? <Globe /> : index === 2 ? <Layers3 /> : index === 3 ? <Sparkles /> : <BookOpen />}</div></div>
          <h3>{group.group}</h3><p>{group.description}</p><div className="skill-pills">{group.items.map((item) => <span key={item}>{item}</span>)}</div>
        </motion.article>)}
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className="section-shell section-block" id="journey">
      <SectionHeading index="04" eyebrow="EXPERIENCE & HIGHLIGHTS" title={<>Progress through<br /><span className="muted-heading">practice.</span></>} note="Professional experience, selected events, and milestones from my engineering journey." />
      <div className="journey-layout">
        <div className="timeline-wrap">
          <div className="timeline-title"><BriefcaseBusiness size={18} /><span>PROFESSIONAL EXPERIENCE</span></div>
          {portfolio.experience.map((item) => <div className="timeline-item" key={item.title}><span className="timeline-dot" /><div className="timeline-period">{item.period}</div><div className="timeline-detail"><h3>{item.title}</h3><p>{item.organization} · {item.location}</p><small>{item.description}</small></div></div>)}
        </div>
        <div className="milestones-wrap">
          <div className="timeline-title"><Award size={18} /><span>ACHIEVEMENTS & HIGHLIGHTS</span></div>
          {portfolio.highlights.map((item) => {
            const Tag = item.href ? 'a' : 'div';
            return (
              <Tag
                className={`milestone${item.href ? ' milestone-link' : ''}`}
                key={item.title}
                {...(item.href ? { href: item.href, target: '_blank', rel: 'noreferrer' } : {})}
              >
                <div className="milestone-mark">{item.mark}</div>
                <div><h3>{item.title}</h3><p>{item.detail}</p></div>
                {item.href && <ArrowUpRight size={15} />}
              </Tag>
            );
          })}
        </div>
      </div>
      <div className="certifications-block">
        <div className="timeline-title"><BookOpen size={18} /><span>CERTIFICATIONS</span></div>
        <div className="cert-grid">{portfolio.certifications.map((cert) => (
          <a className="cert-card" href={cert.url} key={cert.title} target="_blank" rel="noreferrer" aria-label={`View ${cert.title} certificate on Udemy`}>
            <div className="cert-icon"><FileText size={19} /></div>
            <div><h3>{cert.title}</h3><p>{cert.issuer} · {cert.detail}</p></div>
            <span className="cert-check"><Check size={14} /></span>
          </a>
        ))}</div>
      </div>
    </section>
  );
}

function useGitHubData() {
  const [state, setState] = useState({ loading: true, profile: null, repos: [], contributions: [], contributionTotal: null, error: '' });
  const load = async () => {
    setState((old) => ({ ...old, loading: true, error: '' }));
    try {
      const username = portfolio.githubUsername;
      const headers = { Accept: 'application/vnd.github+json' };
      const [profileResponse, reposResponse, contributionsResponse] = await Promise.allSettled([
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers }),
        fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=5&type=owner`, { headers }),
        fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`),
      ]);
      let profile = null;
      let repos = [];
      let contributions = [];
      let contributionTotal = null;
      if (profileResponse.status === 'fulfilled' && profileResponse.value.ok) profile = await profileResponse.value.json();
      if (reposResponse.status === 'fulfilled' && reposResponse.value.ok) repos = await reposResponse.value.json();
      if (contributionsResponse.status === 'fulfilled' && contributionsResponse.value.ok) {
        const payload = await contributionsResponse.value.json();
        contributions = Array.isArray(payload.contributions) ? payload.contributions : [];
        contributionTotal = payload.total?.lastYear ?? payload.total?.[new Date().getFullYear()] ?? null;
      }
      if (!profile && !repos.length && !contributions.length) throw new Error('GitHub public data could not be loaded right now. Open the profile to view current activity.');
      setState({ loading: false, profile, repos: Array.isArray(repos) ? repos.filter((repo) => !repo.fork).slice(0, 5) : [], contributions, contributionTotal, error: '' });
    } catch (error) {
      setState({ loading: false, profile: null, repos: [], contributions: [], contributionTotal: null, error: error.message || 'Could not load GitHub data.' });
    }
  };
  useEffect(() => { load(); }, []);
  return { ...state, refresh: load };
}

function GitHubPanel() {
  const { loading, profile, repos, contributions, contributionTotal, error, refresh } = useGitHubData();
  const contributionCells = useMemo(() => {
    if (!contributions.length) return [];
    return contributions.slice(-364);
  }, [contributions]);
  return (
    <div className="github-panel">
      <div className="coding-panel-head"><div className="coding-brand"><span className="coding-icon github-icon"><Github size={20} /></span><div><b>GitHub</b><small>OPEN-SOURCE & PROJECT ACTIVITY</small></div></div><a href={portfolio.github} target="_blank" rel="noreferrer">View profile <ArrowUpRight size={14} /></a></div>
      {loading && <div className="github-message"><span className="loading-dot" /> Syncing public GitHub data…</div>}
      {!loading && error && <div className="github-message github-error">{error}</div>}
      <div className="github-stats">
        <div><strong>{profile?.public_repos ?? '—'}</strong><span>PUBLIC REPOSITORIES</span></div>
        <div><strong>{profile?.followers ?? '—'}</strong><span>FOLLOWERS</span></div>
        <div><strong>{profile?.following ?? '—'}</strong><span>FOLLOWING</span></div>
        <div><strong>{contributionTotal ?? '—'}</strong><span>CONTRIBUTIONS · YEAR</span></div>
      </div>
      <div className="contribution-area">
        <div className="repo-list-head"><span>CONTRIBUTION ACTIVITY</span><span>LAST 12 MONTHS · LIVE</span></div>
        {contributionCells.length ? <div className="contribution-grid" aria-label="GitHub contribution activity">{contributionCells.map((day) => <span key={day.date} className={`contribution-cell level-${day.level ?? (day.count === 0 ? 0 : day.count < 3 ? 1 : day.count < 6 ? 2 : day.count < 10 ? 3 : 4)}`} title={`${day.date}: ${day.count} contributions`} />)}</div> : <p className="github-message">Contribution calendar is unavailable from the public feed at the moment.</p>}
        <div className="contribution-legend"><span>Less</span><i className="level-0" /><i className="level-1" /><i className="level-2" /><i className="level-3" /><i className="level-4" /><span>More</span></div>
      </div>
      <div className="repo-list-head"><span>RECENT PUBLIC REPOSITORIES</span><span>{repos.length ? `${repos.length} SHOWN` : 'LIVE PROFILE'}</span></div>
      {repos.length ? <div className="repo-list">{repos.map((repo) => <a className="repo-row" href={repo.html_url} key={repo.id} target="_blank" rel="noreferrer"><span className="repo-name"><Terminal size={14} />{repo.name}</span><span className="repo-language">{repo.language || '—'}</span><span className="repo-stars"><Star size={12} /> {repo.stargazers_count}</span><ArrowUpRight size={13} /></a>)}</div> : !loading && <p className="github-message">Public repositories will appear here when available.</p>}
      <div className="github-panel-bottom"><span>Data from the public GitHub API</span><button onClick={refresh} aria-label="Refresh GitHub stats"><RefreshCw size={14} /> Refresh stats</button></div>
    </div>
  );
}

function formatNumber(value) {
  return Number.isFinite(Number(value)) ? Number(value).toLocaleString('en-IN') : '—';
}

function LeetCodePanel() {
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const username = portfolio.leetcodeUsername?.trim() || '';
  const profileUrl = portfolio.leetcodeProfileUrl || (username ? `https://leetcode.com/u/${encodeURIComponent(username)}/` : '');

  useEffect(() => {
    let ignore = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (username) params.set('username', username);
        if (refreshKey > 0) params.set('refresh', '1');
        const query = params.toString() ? `?${params.toString()}` : '';
        const response = await fetch(`/api/leetcode${query}`, { headers: { Accept: 'application/json' } });
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.toLowerCase().includes('application/json')) throw new Error('The LeetCode endpoint did not return JSON. Check that the Express server is running.');
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || `LeetCode sync failed (HTTP ${response.status}).`);
        if (!ignore) setSnapshot(body);
      } catch (loadError) {
        if (!ignore) setError(loadError.message || 'Live LeetCode data is temporarily unavailable.');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    load();
    return () => { ignore = true; };
  }, [username, refreshKey]);

  const profile = snapshot?.profile;
  const activityDays = snapshot?.activity?.days || [];
  const solved = profile?.totalSolved ?? null;
  const solvedDisplay = solved !== null ? formatNumber(solved) : portfolio.leetcodeSolvedMilestone;
  const progress = profile?.progressPercent || 0;
  const difficulty = profile ? [
    { label: 'Easy', data: profile.easy, color: 'easy' },
    { label: 'Medium', data: profile.medium, color: 'medium' },
    { label: 'Hard', data: profile.hard, color: 'hard' },
  ] : [];
  const badges = snapshot?.badges || [];
  const contest = profile?.contest;
  const contestHistory = snapshot?.contestHistory || [];
  const ratingValues = contestHistory.map((item) => item.rating).filter((value) => Number.isFinite(value));
  const minRating = ratingValues.length ? Math.min(...ratingValues) : 0;
  const maxRating = ratingValues.length ? Math.max(...ratingValues) : 1;
  const ratingPolyline = contestHistory.map((item, index) => {
    const x = contestHistory.length > 1 ? 12 + (index / (contestHistory.length - 1)) * 576 : 300;
    const y = 92 - ((item.rating - minRating) / Math.max(1, maxRating - minRating)) * 70;
    return `${x},${y}`;
  }).join(' ');
  const latestContest = contestHistory.at(-1);

  return (
    <div className="leetcode-panel lc-dashboard">
      <div className="coding-panel-head">
        <div className="coding-brand"><span className="coding-icon leetcode-icon">L</span><div><b>LeetCode</b><small>DATA STRUCTURES & ALGORITHMS</small></div></div>
        <div className="lc-head-actions">
          <span className={profile ? 'lc-live-status' : 'profile-pending'}><i />{profile ? 'LIVE PROFILE DATA' : username ? 'SYNCING PROFILE' : 'PROFILE LINK NEEDED'}</span>
          <button className="lc-refresh" onClick={() => setRefreshKey((value) => value + 1)} title="Refresh LeetCode data" aria-label="Refresh LeetCode data"><RefreshCw size={14} /></button>
          {profileUrl && <a href={profileUrl} target="_blank" rel="noreferrer">View profile <ArrowUpRight size={14} /></a>}
        </div>
      </div>

      {loading && <div className="lc-notice"><span className="loading-dot" /> Syncing public LeetCode data…</div>}
      {error && <div className="lc-notice lc-error">{error}</div>}
      {!username && <div className="lc-notice">Add your LeetCode username in <code>src/data/portfolio.js</code> to enable your live profile statistics.</div>}

      <div className="lc-overview">
        <div className="lc-solved-block">
          <span className="fact-label">PROBLEMS SOLVED</span>
          <strong>{solvedDisplay}</strong>
          <p>{profile ? `${formatNumber(profile.totalAvailable)} problems in the public catalogue` : 'Resume-confirmed milestone'}</p>
          {profile?.ranking && <span className="lc-rank-inline">GLOBAL RANK · #{formatNumber(profile.ranking)}</span>}
        </div>
        <div className="lc-progress-ring" style={{ '--lc-progress': `${progress * 3.6}deg` }}>
          <div><b>{profile ? `${progress}%` : '150+'}</b><small>{profile ? 'CATALOGUE' : 'REPORTED'}</small></div>
        </div>
        {profile && <div className="lc-difficulty-list">{difficulty.map((item) => {
          const percent = item.data.total ? Math.min(100, item.data.solved / item.data.total * 100) : 0;
          return <div className={`lc-difficulty ${item.color}`} key={item.label}>
            <div><b>{item.label}</b><span>{formatNumber(item.data.solved)} / {formatNumber(item.data.total)}</span></div>
            <div className="lc-progress-track"><i style={{ width: `${percent}%` }} /></div>
          </div>;
        })}</div>}
      </div>

      <div className="lc-metric-grid">
        <div><span>CONTEST RATING</span><b>{contest ? formatNumber(contest.rating) : '—'}</b><small>{contest ? 'Current rating' : 'No public contest rating'}</small></div>
        <div><span>GLOBAL CONTEST RANK</span><b>{contest?.globalRanking ? `#${formatNumber(contest.globalRanking)}` : '—'}</b><small>{contest?.topPercentage ? `Top ${Number(contest.topPercentage).toFixed(2)}%` : 'Contest ranking'}</small></div>
        <div><span>CONTESTS ATTENDED</span><b>{contest ? formatNumber(contest.attendedContestsCount) : '—'}</b><small>Public contest history</small></div>
        <div><span>TOTAL ACTIVE DAYS</span><b>{profile ? formatNumber(profile.totalActiveDays) : '—'}</b><small>{profile ? `${formatNumber(profile.streak)} day current streak` : 'Profile activity'}</small></div>
      </div>

      <div className="lc-contest-grid">
        <section className="lc-subpanel lc-rating-card">
          <div className="lc-subpanel-head"><span>CONTEST RATING TREND</span><span>{contestHistory.length ? `${contestHistory.length} RECENT CONTESTS` : 'NO HISTORY'}</span></div>
          {contestHistory.length > 1 ? <>
            <svg className="lc-rating-chart" viewBox="0 0 600 112" role="img" aria-label="Contest rating trend across recent contests" preserveAspectRatio="none">
              <line x1="12" y1="94" x2="588" y2="94" />
              <line x1="12" y1="57" x2="588" y2="57" />
              <line x1="12" y1="20" x2="588" y2="20" />
              <polyline points={ratingPolyline} />
              {contestHistory.map((item, index) => {
                const x = contestHistory.length > 1 ? 12 + (index / (contestHistory.length - 1)) * 576 : 300;
                const y = 92 - ((item.rating - minRating) / Math.max(1, maxRating - minRating)) * 70;
                return <circle key={`${item.startTime}-${index}`} cx={x} cy={y} r="3.2"><title>{item.title}: {formatNumber(item.rating)}</title></circle>;
              })}
            </svg>
            <div className="lc-chart-foot"><span>EARLIER · {formatNumber(contestHistory[0].rating)}</span><b>CURRENT · {formatNumber(latestContest.rating)}</b></div>
          </> : <p className="lc-empty">{contest ? 'Contest rating history is not available yet.' : 'Join a LeetCode contest to build a public rating history.'}</p>}
        </section>
        <section className="lc-subpanel lc-contest-insight">
          <div className="lc-subpanel-head"><span>CONTEST INSIGHTS</span><span>PROFILE SNAPSHOT</span></div>
          <div className="lc-insight-stat"><span>TOP PERCENTILE</span><b>{contest?.topPercentage ? `${Number(contest.topPercentage).toFixed(2)}%` : '—'}</b></div>
          <div className="lc-insight-stat"><span>LATEST CONTEST</span><b className="lc-insight-title">{latestContest?.title || 'No contest history'}</b></div>
          <div className="lc-insight-stat"><span>PROBLEMS IN LATEST CONTEST</span><b>{latestContest?.problemsSolved != null ? `${latestContest.problemsSolved}/${latestContest.totalProblems ?? '—'}` : '—'}</b></div>
        </section>
      </div>

      <section className="lc-activity-section">
        <div className="lc-subpanel-head"><span>SUBMISSION ACTIVITY · LAST 12 MONTHS</span><span>{snapshot?.activity ? `${formatNumber(snapshot.activity.totalSubmissions)} SUBMISSIONS` : 'YEARLY HEATMAP'}</span></div>
        <div className="lc-activity-summary"><b>{snapshot?.activity ? formatNumber(snapshot.activity.totalSubmissions) : '—'}</b><span>submissions in the past year</span><small>{snapshot?.activity ? `${formatNumber(snapshot.activity.activeDays)} active days` : 'Live profile required'}</small></div>
        {activityDays.length ? <>
          <div className="lc-month-labels"><span>12 MONTHS AGO</span><span>6 MONTHS AGO</span><span>RECENT</span></div>
          <div className="lc-heatmap" aria-label="LeetCode submission activity for the last 12 months">{activityDays.map((day) => <span key={day.date} className={`lc-heat-cell level-${day.level}`} title={`${day.date}: ${day.count} submissions`} />)}</div>
          <div className="lc-heat-legend"><span>Less</span>{[0, 1, 2, 3, 4].map((level) => <i key={level} className={`level-${level}`} />)}<span>More</span></div>
        </> : <div className="lc-heatmap-empty">{loading ? 'Loading activity history…' : 'Connect your LeetCode profile to see your submission calendar.'}</div>}
      </section>

      <section className="lc-badges-section">
        <div className="lc-subpanel-head"><span>PROFILE BADGES</span><span>{badges.length ? `${badges.length} EARNED` : 'ACHIEVEMENTS'}</span></div>
        {badges.length ? <div className="lc-badges-list">{badges.slice(0, 12).map((badge) => <div className="lc-badge" key={badge.id}><span>✦</span><b>{badge.name}</b>{badge.earnedAt && <small>{new Date(badge.earnedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</small>}</div>)}</div> : <p className="lc-empty">{username ? 'No public badges returned for this profile.' : 'Your badges will appear here after your profile is connected.'}</p>}
      </section>

      <div className="leetcode-foot"><span>Public profile data via LeetCode GraphQL · Cached for 5 minutes</span><a href={profileUrl || 'https://leetcode.com/problemset/'} target="_blank" rel="noreferrer">{profileUrl ? 'Open LeetCode profile' : 'Explore problems'} <ArrowUpRight size={13} /></a></div>
      {snapshot?.partialWarnings?.length > 0 && <p className="lc-warning">{snapshot.partialWarnings.join(' ')}</p>}
    </div>
  );
}

function CodingProfiles() {
  return (
    <section className="section-shell section-block" id="coding">
      <SectionHeading index="05" eyebrow="CONSISTENCY OVER EVERYTHING" title={<>A little progress,<br /><span className="muted-heading">every day.</span></>} note="A look at my public coding profiles: live GitHub activity, LeetCode problem-solving progress, contest performance, and submission history." />
      <div className="coding-grid"><GitHubPanel /><LeetCodePanel /></div>
    </section>
  );
}

function ResumeSection() {
  return (
    <section className="resume-section" id="resume">
      <div className="section-shell resume-inner">
        <div className="resume-art"><div className="resume-paper"><div className="paper-top"><span>SM</span><i>CURRICULUM VITAE</i></div><div className="paper-rule" /><b>SRINJOY MAHANTI</b><small>INFORMATION TECHNOLOGY</small><div className="paper-lines"><i /><i /><i /><i /><i /></div><div className="paper-columns"><div><i /><i /><i /></div><div><i /><i /><i /></div></div><div className="paper-footer">2026 / 2027</div></div><div className="resume-orbit" /></div>
        <div className="resume-copy"><div className="eyebrow"><span>06</span><i /> WANT THE DETAILS?</div><h2>My journey,<br /><span>on one page.</span></h2><p>Education, experience, selected projects, technical skills, certifications, and achievements—organised into a concise resume.</p><div className="resume-meta"><span><Check size={14} /> Updated resume</span><span><FileText size={14} /> PDF document</span></div><div className="resume-actions"><a className="button button-primary" href={portfolio.resumeUrl} download="Srinjoy-Mahanti-Resume.pdf">Download resume <Download size={16} /></a><a className="resume-view" href={portfolio.resumeUrl} target="_blank" rel="noreferrer">View PDF <ArrowUpRight size={14} /></a></div></div>
      </div>
    </section>
  );
}

function AskAI() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: "Hey! I'm Srinjoy's portfolio assistant. Ask me about his projects, technical skills, education, internship, or coding journey." }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const suggestions = ['What projects has Srinjoy built?', 'What is his experience with AI?', 'What are his strongest technical skills?', 'Why would he be a good software engineering intern?'];

  const send = async (value = input) => {
    const question = value.trim();
    if (!question || loading) return;
    const next = [...messages, { role: 'user', content: question }];
    setMessages(next);
    setInput('');
    setLoading(true);
    setConnectionError('');
    try {
      const apiBase = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
      const response = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ messages: next.slice(-8) }),
      });
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.toLowerCase().includes('application/json')) {
        const responseText = await response.text();
        if (/<!doctype\s+html|<html[\s>]/i.test(responseText)) {
          throw new Error(apiBase
            ? 'The configured API address returned a website page, not the chat API. Check VITE_API_BASE_URL and the Express deployment.'
            : 'The AI service is not connected yet. Deploy the Express backend, set VITE_API_BASE_URL in the frontend environment, and redeploy.');
        }
        throw new Error(`Unexpected API response (HTTP ${response.status}).`);
      }
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || `The assistant is unavailable (HTTP ${response.status}).`);
      if (typeof body.reply !== 'string' || !body.reply.trim()) throw new Error('The assistant returned an empty response. Please try again.');
      setMessages((current) => [...current, { role: 'assistant', content: body.reply.trim() }]);
    } catch (error) {
      setConnectionError(error.message || 'Could not connect to the AI service.');
      setMessages((current) => [...current, { role: 'assistant', content: error.message || 'Could not connect. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([{ role: 'assistant', content: "Hey! I'm Srinjoy's portfolio assistant. Ask me about his projects, technical skills, education, internship, or coding journey." }]);
    setConnectionError('');
  };

  return (
    <section className="section-shell section-block ask-section" id="ask-ai">
      <SectionHeading index="07" eyebrow="MEET MY DIGITAL SIDEKICK" title={<>Ask my <span className="muted-heading">personal AI.</span></>} note="Skip the scrolling. Ask a question and get a conversational answer grounded in the public information on this portfolio." />
      <div className="ask-layout">
        <div className="ask-intro"><div className="ask-orb"><div className="ask-orb-core"><Bot size={36} /></div><span className="orb-dot dot-one" /><span className="orb-dot dot-two" /><span className="orb-dot dot-three" /></div><div className="eyebrow"><span className="live-dot" /> PORTFOLIO-AWARE ASSISTANT</div><h3>Curious about my work?<br /><span>Ask away.</span></h3><p>Explore my projects, tech stack, applied AI work, education, and experience through a dedicated AI assistant.</p><div className="ask-capabilities"><span><Check size={13} /> Project details</span><span><Check size={13} /> Technical skills</span><span><Check size={13} /> Experience & education</span></div><small className="ask-note">Answers are generated from portfolio information and may occasionally need verification.</small></div>
        <div className="ask-chat-card">
          <div className="ask-chat-head"><div className="chat-avatar"><Bot size={19} /></div><div><b>Srinjoy's AI assistant</b><span><i /> Portfolio knowledge base</span></div><button onClick={reset} title="Reset conversation" aria-label="Reset conversation"><RefreshCw size={16} /></button></div>
          <div className="ask-messages" aria-live="polite">
            {messages.map((message, index) => <div className={`ask-message ${message.role}`} key={`${index}-${message.role}`}><div className="message-label">{message.role === 'assistant' ? 'SRINJOY AI' : 'YOU'}</div><p className="message-content">{message.content}</p></div>)}
            {loading && <div className="ask-message assistant"><div className="message-label">SRINJOY AI</div><div className="typing"><i /><i /><i /></div></div>}
            {messages.length === 1 && <div className="prompt-chips">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => send(suggestion)}>{suggestion}<ArrowUpRight size={12} /></button>)}</div>}
          </div>
          {connectionError && <div className="api-warning"><span /> Backend connection needs attention: {connectionError}</div>}
          <form className="ask-form" onSubmit={(event) => { event.preventDefault(); send(); }}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask something about Srinjoy…" aria-label="Ask the AI assistant" maxLength={1200} /><button type="submit" disabled={!input.trim() || loading} aria-label="Send question">{loading ? <RefreshCw size={17} className="spin" /> : <Send size={17} />}</button></form>
          <div className="ask-foot"><span>POWERED BY GROQ · EXPRESS API</span><span>PUBLIC PORTFOLIO DATA ONLY</span></div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [sending, setSending] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const copyEmail = async () => {
    let copied = false;

    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(portfolio.email);
        copied = true;
      }
    } catch {
      // Fall back to the legacy copy command when clipboard permissions are unavailable.
    }

    if (!copied) {
      const temporaryInput = document.createElement('textarea');
      temporaryInput.value = portfolio.email;
      temporaryInput.setAttribute('readonly', '');
      temporaryInput.style.position = 'fixed';
      temporaryInput.style.opacity = '0';
      document.body.appendChild(temporaryInput);
      temporaryInput.select();
      copied = document.execCommand('copy');
      temporaryInput.remove();
    }

    if (copied) {
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 2200);
    } else {
      setFeedback({ type: 'error', text: 'Could not copy the email address. Please select and copy it manually.' });
    }
  };

  const submitContact = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const email = String(values.get('email') || '').trim();
    const message = String(values.get('message') || '').trim();
    const website = String(values.get('website') || '').trim();
    setSending(true);
    setFeedback({ type: '', text: '' });

    try {
      const apiBase = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
      const response = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, message, website }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'Your message could not be sent. Please try again.');
      }
      form.reset();
      setFeedback({ type: 'success', text: 'Message sent successfully. Thank you for reaching out!' });
    } catch (error) {
      setFeedback({ type: 'error', text: error.message || 'Could not connect to the contact service. Please try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="section-shell contact-inner">
        <div className="contact-layout">
          <div className="contact-copy">
            <div className="eyebrow"><span>08</span><i /> HAVE A PROJECT OR OPPORTUNITY?</div>
            <h2>Let's build<br /><span>something meaningful.</span></h2>
            <p>I'm open to software engineering opportunities, internships, collaborations, and interesting problems worth solving. Send me a message and I'll get back to you by email.</p>
            <div className="contact-social-links">
              <a href={portfolio.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn <ArrowUpRight size={14} /></a>
              <a href={portfolio.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub <ArrowUpRight size={14} /></a>
              <button type="button" className={`contact-email-copy${emailCopied ? ' copied' : ''}`} onClick={copyEmail} aria-label={emailCopied ? 'Email address copied' : 'Copy email address'} title={emailCopied ? 'Copied to clipboard' : 'Copy email address'}>
                <Mail size={16} /> <span>{portfolio.email}</span> {emailCopied ? <Check size={14} /> : <Copy size={14} />}
                <span className="sr-only" aria-live="polite">{emailCopied ? 'Email copied to clipboard' : ''}</span>
              </button>
            </div>
          </div>

          <form className="contact-form" onSubmit={submitContact}>
            <div className="contact-form-heading">
              <span>GET IN TOUCH</span>
              <b>Send a message</b>
            </div>
            <div className="contact-field">
              <label htmlFor="contact-email">YOUR EMAIL ADDRESS</label>
              <input id="contact-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" maxLength={254} required />
            </div>
            <div className="contact-field">
              <label htmlFor="contact-message">YOUR MESSAGE</label>
              <textarea id="contact-message" name="message" placeholder="Tell me a little about your idea, opportunity, or question…" rows={6} minLength={10} maxLength={5000} required />
            </div>
            <label className="contact-honeypot" aria-hidden="true">
              Leave this field empty
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
            <div className="contact-submit-row">
              <small>Your message will be sent directly to Srinjoy's inbox.</small>
              <button className="button button-primary" type="submit" disabled={sending}>
                {sending ? 'Sending…' : 'Send message'} {sending ? <RefreshCw size={15} className="spin" /> : <Send size={15} />}
              </button>
            </div>
            {feedback.text && <p className={`contact-feedback ${feedback.type}`} role="status" aria-live="polite">{feedback.text}</p>}
          </form>
        </div>
        <div className="contact-decoration">S<span>.</span>M</div>
      </div>
    </section>
  );
}

export default function App() {
  const [active, setActive] = useState('#home');
  useEffect(() => {
    const ids = ['about', 'work', 'stack', 'journey', 'coding', 'ask-ai', 'contact'];
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(`#${visible.target.id}`);
    }, { rootMargin: '-22% 0px -62% 0px', threshold: [0, 0.15, 0.4] });
    ids.forEach((id) => { const node = document.getElementById(id); if (node) observer.observe(node); });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="page-noise" />
      <Nav active={active} setActive={setActive} />
      <main>
        <Hero />
        <Marquee />
        <div className="section-divider" />
        <About />
        <div className="section-divider" />
        <Work />
        <div className="section-divider" />
        <Stack />
        <div className="section-divider" />
        <Journey />
        <div className="section-divider" />
        <CodingProfiles />
        <ResumeSection />
        <div className="section-divider" />
        <AskAI />
        <Contact />
      </main>
      <footer className="footer"><div className="section-shell footer-inner"><span>© {new Date().getFullYear()} {portfolio.name}</span><span>DESIGNED & BUILT WITH INTENTION <span className="footer-star">✳</span></span><a href="#home">BACK TO TOP <ArrowUpRight size={13} /></a></div></footer>
    </>
  );
}