import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";


export const docLinks: Record<string, string> = {
  react: "https://reactjs.org/docs/getting-started.html",
  nextjs: "https://nextjs.org/docs",
  vuejs: "https://vuejs.org/guide/introduction.html",
  express: "https://expressjs.com/en/starter/installing.html",
  nodejs: "https://nodejs.org/en/docs",
  mongodb: "https://www.mongodb.com/docs/",
  mongoose: "https://mongoosejs.com/docs/guide.html",
  mysql: "https://dev.mysql.com/doc/",
  tailwindcss: "https://tailwindcss.com/docs",
  typescript: "https://www.typescriptlang.org/docs/",
  javascript: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  html5: "https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5",
  css3: "https://developer.mozilla.org/en-US/docs/Web/CSS",
  git: "https://git-scm.com/doc",
  github: "https://docs.github.com/en",
  docker: "https://docs.docker.com/",
  kubernetes: "https://kubernetes.io/docs/home/",
  aws: "https://docs.aws.amazon.com/",
  azure: "https://learn.microsoft.com/en-us/azure/",
  gcp: "https://cloud.google.com/docs",
  figma: "https://help.figma.com/hc/en-us",
  firebase: "https://firebase.google.com/docs",
  redux: "https://redux.js.org/introduction/getting-started",
  prisma: "https://www.prisma.io/docs/",
  graphql: "https://graphql.org/learn/",
  jest: "https://jestjs.io/docs/getting-started",
};


export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.4,
    similarityBoost: 0.8,
    speed: 0.9,
    style: 0.5,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

CRITICAL INTERVIEWER BEHAVIOR:
- You are an INTERVIEWER, not a teacher or tutor
- NEVER explain concepts, teach, or provide answers to the candidate
- NEVER give hints, suggestions, or help with technical concepts
- Your role is to ask questions and evaluate responses, not to educate

Interview Guidelines:
Follow the structured question flow:
{{questions}}

Engage naturally & react appropriately:
- Listen actively to responses and acknowledge them briefly
- If a response is vague, ask ONE brief follow-up question for clarification
- If the candidate doesn't know something, simply acknowledge and move to the next question
- Keep the conversation flowing smoothly while maintaining control

Be professional, yet warm and welcoming:
- Use official yet friendly language
- Keep responses concise and to the point (like in a real voice interview)
- Avoid robotic phrasing—sound natural and conversational

What to do when candidate struggles:
- If they say "I don't know" or give a poor answer: "Thank you for your response. Let's move on to the next question."
- If they ask for help: "I'm here to assess your knowledge, not to provide guidance. Let's continue with the interview."
- If they want you to explain something: "I'm conducting an interview to evaluate your understanding. Let's proceed with the next question."

Answer the candidate's questions professionally:
- If asked about the role, company, or expectations, provide a clear and relevant answer
- If unsure, redirect the candidate to HR for more details

Conclude the interview properly:
- Thank the candidate for their time
- Inform them that the company will reach out soon with feedback
- End the conversation on a polite and positive note

REMEMBER: You are assessing the candidate's knowledge and skills, not teaching them. Stay in the interviewer role at all times.`,
      },
    ],
  },
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

export const dummyInterviews: Interview[] = [
  {
    id: "1",
    userId: "user1",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Junior",
    questions: ["What is React?"],
    finalized: false,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    role: "Full Stack Developer",
    type: "Mixed",
    techstack: ["Node.js", "Express", "MongoDB", "React"],
    level: "Senior",
    questions: ["What is Node.js?"],
    finalized: false,
    createdAt: "2024-03-14T15:30:00Z",
  },
];
