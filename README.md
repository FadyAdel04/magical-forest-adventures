# نسيج — Landing Page

Arabic RTL landing page for **Naseeg** (نسيج), built with React, TypeScript, and Vite.

## Project structure

```
├── public/              # Static assets (favicon, etc.)
├── src/
│   ├── assets/          # Images and media
│   ├── components/
│   │   ├── layout/      # Header, footer wrappers
│   │   ├── sections/    # Page sections (Hero, Order, …)
│   │   └── ui/          # Shared UI primitives (shadcn)
│   ├── hooks/
│   ├── lib/
│   ├── App.tsx          # Main page composition
│   ├── main.tsx         # React entry point
│   └── index.css        # Global styles & Tailwind
├── index.html
├── vite.config.ts
├── vercel.json
└── package.json
```

## Scripts

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview production build
```

## Deploy on Vercel

1. Push the repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Framework preset: **Vite** (or use the included `vercel.json`).
4. Build command: `npm run build`
5. Output directory: `dist`

No extra environment variables are required for the static landing page.
