# Portfolio Website
My personal personal portfolio website built with **React**, **TypeScript**, **TailwindCSS**, and **Vite**. It includes pages for showcasing projects, skills, about me, and a downloadable resume.

## 🌐 Live Demo
👉 [View Portfolio](https://portfolio-web-mu-ten.vercel.app/)

## 🚀 Features
- ⚡️ Fast and optimized with Vite
- 🎨 Styled with TailwindCSS
- 📄 Resume download support
- 🖼️ Project showcase with reusable components
- 🧭 Responsive navigation menu
- ✨ TypeScript for type safety

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
## 🛠️ Installation & Setup
1. Clone this repo:
   ```bash
   git clone https://github.com/yourusername/PortfolioWeb.git
   cd PortfolioWeb-main/Root\ Directory
