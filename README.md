# Portfolio Website
My personal personal portfolio website built with **React**, **TypeScript**, **TailwindCSS**, and **Vite**. It includes pages for showcasing projects, skills, about me, and a downloadable resume.

## 🌐 Live Demo
👉 [View Portfolio](https://portfolio-web-mu-ten.vercel.app/)

## 🚀 Features
-⚡️ Fast and optimized with Vite
-🎨 Styled with TailwindCSS
-📄 Resume download support
-🖼️ Project showcase with reusable components
-🧭 Responsive navigation menu
-✨ TypeScript for type safety
-📊 Analytics tracking for user interactions (analytics.ts, usePageTracking.ts)
-🕹️ Interactive mini-games (SkillGame.tsx, GameComponents.tsx)
-🧩 Modular and reusable UI components (ui folder: 3D cube, letters, animations, buttons, cards)
-📨 Resume submission via API (sendResume.ts)
-🌐 Multi-page support with routing (pages folder: landing, about, projects, skills, 404)
-📝 Strong typing for external libraries (pdfjs-dist.d.ts, nodemailer.d.ts)
-🎮 Interactive and animated elements for enhanced UX (InteractiveElements.tsx, animatedRobot.tsx, TiltingName.tsx)
-📦 Configured for deployment with Vercel (vercel.json)
-🔧 Fully typed configuration and project setup (tsconfig.json, vite.config.ts, tailwind.config.js)
-🗂️ Organized project structure for scalability and maintainability

```
Root Directory/
├── api
│   └── sendResume.ts
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.cjs
├── public
│   └── JustinLuftResume.pdf
├── src
│   ├── Types
│   │   ├── env.d.ts
│   │   ├── global.d.ts
│   │   ├── nodemailer.d.ts
│   │   └── pdfjs-dist.d.ts
│   ├── analytics.ts
│   ├── components
│   │   ├── InteractiveElements.tsx
│   │   ├── NavigationMenu.tsx
│   │   ├── game
│   │   │   └── GameComponents.tsx
│   │   └── ui
│   │       ├── Interactive3DCube.tsx
│   │       ├── Letter3D.tsx
│   │       ├── TiltingName.tsx
│   │       ├── animatedRobot.tsx
│   │       ├── button.tsx
│   │       └── card.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── pages
│   │   ├── AIAssistant.tsx
│   │   ├── AboutPage.tsx
│   │   ├── LandingPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── ProjectShowcasePage.tsx
│   │   ├── ProjectsData.tsx
│   │   ├── SkillGame.tsx
│   │   ├── SkillsPage.tsx
│   │   └── index.ts
│   └── usePageTracking.ts
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
└── vite.config.ts
```
