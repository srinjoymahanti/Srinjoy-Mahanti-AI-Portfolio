export const portfolio = {
  name: 'Srinjoy Mahanti',
  initials: 'SM',
  role: 'Software Developer · Applied AI Enthusiast',
  headline: 'Building useful software. Exploring intelligent systems.',
  intro: 'I am an Information Technology undergraduate graduating in 2027, interested in building reliable web applications and practical AI-powered products. I enjoy solving problems, integrating APIs, and turning ideas into clear, usable experiences.',
  location: 'Kolkata, West Bengal, India',
  availability: 'Open to internships & entry-level opportunities',
  email: 'srinjoymahanti@gmail.com',
  github: 'https://github.com/srinjoymahanti',
  githubUsername: 'srinjoymahanti',
  linkedin: 'https://www.linkedin.com/in/srinjoy-mahanti-6168b5306/',
  // Extracted from the clickable LeetCode link in the supplied resume PDF.
  leetcodeUsername: 'srinjoymahanti',
  leetcodeProfileUrl: 'https://leetcode.com/u/srinjoymahanti/',
  leetcodeSolvedMilestone: '150+',
  resumeUrl: '/resume.pdf',
  profilePhoto: '/profile-photo.png',

  education: {
    degree: 'B.Tech · Information Technology',
    institution: 'Netaji Subhash Engineering College',
    university: 'MAKAUT',
    period: 'August 2023 – June 2027',
    graduation: '2027',
    cgpa: '7.6',
  },

  skills: [
    {
      group: 'Programming languages',
      description: 'Foundations for problem-solving and application logic.',
      items: ['Java', 'JavaScript', 'Python', 'C', 'SQL'],
    },
    {
      group: 'Frontend engineering',
      description: 'Building responsive, accessible user experiences.',
      items: ['React.js', 'HTML5', 'CSS3', 'Tailwind CSS'],
    },
    {
      group: 'Backend & databases',
      description: 'Connecting services, APIs, and application data.',
      items: ['Node.js', 'Express.js', 'REST APIs', 'API Integration', 'MongoDB'],
    },
    {
      group: 'AI & developer tools',
      description: 'Applying modern AI APIs and practical development tools.',
      items: ['LLM APIs', 'Generative AI', 'Groq API', 'NumPy', 'Git', 'GitHub', 'Streamlit'],
    },
    {
      group: 'Computer science',
      description: 'Core concepts that support dependable engineering.',
      items: ['Data Structures & Algorithms', 'OOP', 'DBMS', 'Operating Systems'],
    },
  ],

  projects: [
    {
      number: '01',
      title: 'Apple Customer Support AI Agent',
      category: 'APPLIED AI · SUPPORT AUTOMATION',
      description: 'An AI-powered customer-support application built around historical AppleSupport interactions. It classifies customer intent, retrieves relevant cases, generates evidence-grounded responses, and decides whether a request should be handled automatically or escalated.',
      stack: ['Python', 'Groq API', 'GPT-OSS-120B', 'Pandas', 'NumPy', 'Streamlit'],
      icon: 'bot',
      accent: 'violet',
      repo: 'https://github.com/srinjoymahanti/Apple-Support-AI-Agent',
      demo: 'https://apple-support-ai-agent-srinjoy-mahanti.streamlit.app/',
      screenshot: '/apple-support-ai-agent.svg',
    },
    {
      number: '02',
      title: 'Task Board Lite',
      category: 'FULL-STACK · PRODUCTIVITY',
      description: 'A lightweight Kanban-style task board with a Spring Boot REST API and React interface. Users can create, update, delete, and organize tasks across To Do, In Progress, and Done columns.',
      stack: ['React', 'Spring Boot', 'Java', 'H2 Database', 'REST API'],
      icon: 'kanban',
      accent: 'lime',
      repo: 'https://github.com/srinjoymahanti/Task_Board_Lite',
      demo: 'https://task-board-lite-dun.vercel.app/',
      screenshot: '/task-board-lite.svg',
    },
    {
      number: '03',
      title: 'Text-to-Image Generator',
      category: 'GENERATIVE AI · FRONTEND',
      description: 'A web application that turns text prompts into generated images through the ClipDrop API, with a focused interface for experimenting with creative prompts.',
      stack: ['React', 'Tailwind CSS', 'ClipDrop API'],
      icon: 'image',
      accent: 'orange',
      repo: 'https://github.com/srinjoymahanti/TextToImageGenerator',
      demo: 'https://text-to-image-generator-ten.vercel.app/',
      screenshot: '/text-to-image-generator.svg',
    },
  ],

  experience: [
    {
      period: 'September 2026 – October 2026',
      title: 'AI Web Development Intern',
      organization: 'InAmigos Foundation',
      location: 'Remote',
      description: 'Developed and enhanced web-based solutions using AI-assisted development tools based on project requirements. Implemented and refined website features with a focus on responsive design, usability, and user experience. Collaborated remotely to complete assigned development tasks within deadlines.',
    },
  ],

  certifications: [
    {
      title: 'MERN Stack: All You Need to Know with Practical Project',
      issuer: 'Udemy',
      detail: '22 hours',
      url: 'https://www.udemy.com/certificate/UC-00addc1b-50d6-4348-8f3a-4be27302b783/',
    },
    {
      title: 'Complete Bootstrap & React Bootcamp with Hands-On Projects',
      issuer: 'Udemy',
      detail: '13 hours',
      url: 'https://www.udemy.com/certificate/UC-e26350be-098c-4538-a52a-e7e94e4813c7/',
    },
  ],

  highlights: [
    {
      title: 'Smart India Hackathon 2025',
      detail: 'Participated in a team-based, problem-statement-driven software development challenge.',
      mark: 'SIH',
    },
    {
      title: 'HackNITR 7.0',
      detail: 'Selected among 500+ teams; participated with Team CodeNix at NIT Rourkela.',
      mark: 'HN',
    },
    {
      title: 'The Big Code by Google',
      detail: 'Qualified for the first round among 50,000+ participants.',
      mark: 'G',
    },
    {
      title: 'LeetCode problem solving',
      detail: 'Solved 150+ Data Structures and Algorithms problems.',
      mark: 'DSA',
    },
  ],
};