import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


const techIconBaseURL = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const docLinks: Record<string, string> = {
  react: "https://react.dev/",
  nextjs: "https://nextjs.org/docs",
  vuejs: "https://vuejs.org/",
  express: "https://expressjs.com/",
  nodejs: "https://nodejs.org/en/docs",
  mongodb: "https://www.mongodb.com/docs/",
  mongoose: "https://mongoosejs.com/docs/",
  mysql: "https://dev.mysql.com/doc/",
  postgresql: "https://www.postgresql.org/docs/",
  sqlite: "https://www.sqlite.org/docs.html",
  firebase: "https://firebase.google.com/docs",
  docker: "https://docs.docker.com/",
  kubernetes: "https://kubernetes.io/docs/",
  aws: "https://docs.aws.amazon.com/",
  azure: "https://learn.microsoft.com/en-us/azure/",
  gcp: "https://cloud.google.com/docs",
  digitalocean: "https://docs.digitalocean.com/",
  heroku: "https://devcenter.heroku.com/",
  photoshop: "https://helpx.adobe.com/photoshop/user-guide.html",
  html5: "https://developer.mozilla.org/en-US/docs/Web/HTML",
  css3: "https://developer.mozilla.org/en-US/docs/Web/CSS",
  sass: "https://sass-lang.com/documentation/",
  tailwindcss: "https://tailwindcss.com/docs",
  bootstrap: "https://getbootstrap.com/docs/",
  jquery: "https://api.jquery.com/",
  typescript: "https://www.typescriptlang.org/docs/",
  javascript: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  angular: "https://angular.io/docs",
  ember: "https://guides.emberjs.com/",
  backbone: "https://backbonejs.org/",
  nestjs: "https://docs.nestjs.com/",
  graphql: "https://graphql.org/learn/",
  apollo: "https://www.apollographql.com/docs/",
  webpack: "https://webpack.js.org/concepts/",
  babel: "https://babeljs.io/docs/en/",
  rollup: "https://rollupjs.org/",
  parcel: "https://parceljs.org/docs/",
  npm: "https://docs.npmjs.com/",
  yarn: "https://classic.yarnpkg.com/en/docs/",
  git: "https://git-scm.com/doc",
  github: "https://docs.github.com/en",
  gitlab: "https://docs.gitlab.com/",
  bitbucket: "https://support.atlassian.com/bitbucket-cloud/docs/",
  figma: "https://help.figma.com/hc/en-us",
  prisma: "https://www.prisma.io/docs",
  redux: "https://redux.js.org/introduction/getting-started",
  flux: "https://facebook.github.io/flux/docs/in-depth-overview/",
  redis: "https://redis.io/docs/",
  selenium: "https://www.selenium.dev/documentation/",
  cypress: "https://docs.cypress.io/",
  jest: "https://jestjs.io/docs/getting-started",
  mocha: "https://mochajs.org/",
  chai: "https://www.chaijs.com/guide/",
  karma: "https://karma-runner.github.io/latest/index.html",
  vuex: "https://vuex.vuejs.org/",
  nuxt: "https://nuxt.com/docs",
  strapi: "https://docs.strapi.io/",
  wordpress: "https://developer.wordpress.org/",
  contentful: "https://www.contentful.com/developers/docs/",
  netlify: "https://docs.netlify.com/",
  vercel: "https://vercel.com/docs",
  amplify: "https://docs.amplify.aws/",
};

const normalizeTechName = (tech: string) => {
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings];
};


const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
};


export const getTechLogos = async (techArray: string[]) => {
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`,
      doc: docLinks[normalized] ?? "#",
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url,doc }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg",doc,
      
    }))
  );

  return results;
};


export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers/${interviewCovers[randomIndex]}`;
};
