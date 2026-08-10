# My Notes

No-login, share-by-link notepad with auto totals detection (Cement/Saria/سیمنٹ style keyword+number summing). Dark glassmorphism UI, Next.js App Router.

## How sharing works (no backend, no login)

- Notes live in `localStorage` on the device that created them ("owned" notes) — fully editable there, auto-saves as you type.
- The **Share** button copies a URL with the note content encoded in the `?d=` query param (base64).
- Anyone who opens that link on another device/browser sees the note **read-only** (decoded straight from the URL — no server needed).
- They get a **"Save as My Note"** button which forks it into their own editable copy on their own device. They can never edit your original; you can never edit their fork. Each side only edits what it owns.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel (recommended, free)

1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com/new, import the repo.
3. Framework preset: Next.js (auto-detected). No env vars needed.
4. Deploy — done. Every push to `main` auto-deploys.

## Deploy from CLI

```bash
npm i -g vercel
vercel
```

## Tech

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion · lucide-react · uuid
