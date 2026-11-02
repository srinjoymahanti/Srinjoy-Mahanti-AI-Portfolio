# Srinjoy Mahanti — AI Developer Portfolio

A responsive developer portfolio built with **React + Vite**, Tailwind CSS, Framer Motion, and an Express API for a dedicated portfolio-aware AI assistant. The design keeps the dark editorial / lime-accent direction of the reference while using original layout and copy.

## Included

- Portrait-led responsive hero using `public/profile-photo.png`
- Downloadable resume at `public/resume.pdf`
- About, education, technical skills, projects, experience, achievements, and certifications
- Dedicated **Ask my Personal AI** section with suggested questions and conversation history
- Express endpoint for the AI assistant, using Groq server-side
- Live GitHub profile snapshots injected into chat answers for repository counts, public repo inventory, stars, forks, followers, and languages
- Live LeetCode profile snapshots injected into chat answers for solved totals, difficulty breakdown, contest metrics, activity, daily challenge, recent accepted submissions, and badges
- Lightweight keyword-based portfolio knowledge retrieval (not vector/embedding RAG)
- GitHub profile metrics, recent public repositories, and contribution calendar
- Live LeetCode dashboard: solved count, difficulty distribution, contest rating/rank, daily challenge, recent accepted problems, badges, and a 12-month activity heatmap
- Mobile navigation, reduced-motion support, accessible form labels, loading/error states

## Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, Lucide React
- Backend: Node.js, Express
- AI: Groq Chat Completions API
- Public profile data: GitHub REST API/contribution feed and LeetCode's public GraphQL endpoint (server-side)

No Next.js is used or listed as a skill. The Doctor Appointment System is not included.

## Run locally

Requirements: Node.js 22.12+ and npm.

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Add your Groq key to `.env`:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
# Optional; increases GitHub API rate limit. Never expose this to the frontend.
GITHUB_TOKEN=
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
```

Start the React frontend and Express backend together:

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend health check: http://localhost:4000/api/health
- Chat endpoint: `POST http://localhost:4000/api/chat`
- GitHub snapshot: `GET http://localhost:4000/api/github`
- LeetCode snapshot: `GET http://localhost:4000/api/leetcode?username=YOUR_LEETCODE_USERNAME` (the `username` parameter can be omitted to load only the daily challenge)

General conversational AI answers require a valid Groq API key. GitHub repository-count/list questions and LeetCode/GitHub profile-stat questions have deterministic live-data responses and can still work without Groq. The rest of the portfolio works without an AI key. Live LeetCode profile data is connected using the public profile URL embedded in your resume.

## Personalize profile links

Edit `src/data/portfolio.js`:

- `githubUsername` is currently `srinjoymahanti` and powers the live GitHub section.
- The LeetCode username `srinjoymahanti` and profile URL are already connected from the clickable profile link embedded in the supplied resume. If the profile handle changes, update `leetcodeUsername` and `leetcodeProfileUrl` in `src/data/portfolio.js`.
- The three featured project repository buttons are connected to the matching public GitHub repositories. Add a `demo` URL in `src/data/portfolio.js` only when a live demo is available.
- The profile photo and resume are already included in `public/`.

Example assistant questions: 'How many public repositories does Srinjoy have?', 'List his GitHub repositories', 'How many LeetCode problems has he solved?', 'What is his contest rating?', 'What is today's LeetCode challenge?', and 'Summarize his GitHub and LeetCode profiles.' The assistant fetches live GitHub data when visitors ask about repositories, repository counts, stars, followers, forks, or open-source activity. It also fetches live LeetCode data for questions about solved problems, difficulty breakdown, contest metrics, streaks, daily challenge, recent accepted problems, or badges. Repository counts refer to publicly listed repositories; private repositories are not visible and the public total may include forks. These snapshots are cached for five minutes. A GitHub token is optional and should only be configured on the server.

The dashboard uses the connected public LeetCode profile for live figures. If LeetCode is temporarily unavailable, it falls back to the resume-confirmed 150+ solved milestone and keeps the daily challenge/metrics clearly marked as unavailable rather than copying values from the example screenshots.

## Deployment

### Frontend — Vercel

- Import the project repository.
- Framework preset: Vite.
- Build command: `npm run build`.
- Output directory: `dist`.
- Add environment variable `VITE_API_BASE_URL=https://YOUR-EXPRESS-SERVICE.onrender.com` (no trailing slash).

### Backend — Render

- Create a Node web service from the same repository.
- Build command: `npm install`.
- Start command: `npm start`.
- Add `GROQ_API_KEY`, `GROQ_MODEL`, `PORT` (if needed), and `CLIENT_ORIGIN=https://YOUR-PORTFOLIO.vercel.app`.
- Deploy the backend, confirm `/api/health` returns JSON, then redeploy the frontend after setting `VITE_API_BASE_URL`.

The Vite `/api` proxy is for local development only. In production, the React app calls the separately deployed Express service.

## Accuracy notes

The project list and experience are based on the resume/profile details supplied for this portfolio. Project-list chatbot questions are answered from the full structured project catalog so retrieval ranking cannot omit listed projects. LeetCode data comes from the public, undocumented GraphQL endpoint and is cached by the local Express service for five minutes; LeetCode may change or rate-limit this endpoint. Live profile data requires the correct public username. No LeetCode session cookie or private account data is used.
