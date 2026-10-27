# PricePilot

Price comparison website that searches real-time prices from trusted retailers using Google Shopping data.

## Features

- **Search any product** — compare prices from Amazon, Walmart, Best Buy, and more
- **Real-time prices** — powered by SerpApi Google Shopping API
- **Autocomplete suggestions** — local product catalog as you type
- **Sort results** — by price, rating, shipping speed, or retailer
- **Mobile-friendly** — responsive table layout that switches to cards on small screens
- **Optional sign-in** — create an account to save preferences (demo, in-memory store)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- GSAP animations
- NextAuth.js (credentials provider)
- SerpApi (Google Shopping API)

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example file and add your SerpApi key:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add:

```
SERPAPI_KEY=your_serpapi_key_here
AUTH_SECRET=your_auth_secret
```

`NEXTAUTH_URL` is optional. Leave it unset in local development: Auth.js v5
derives the URL from the request. If you do set it, include the auth base path
(e.g. `NEXTAUTH_URL=http://localhost:3000/api/auth`), because the beta uses the
URL's path as the auth base path.

Get a free SerpApi key at https://serpapi.com

Generate an auth secret:

```bash
openssl rand -base64 32
```

### 3. Run the development server

```bash
npm run dev
```

Open http://localhost:3000

### 4. Run checks

```bash
npm run type-check     # TypeScript type check
npm run lint           # ESLint
npm run build          # Production build
```

## Notes

- Search works without signing in — no account required to browse prices
- Sign-up/login uses a mock in-memory store (for demo purposes only)
- Without a SerpApi key, sample/labeled fallback data is shown
- No secrets are committed to git — `.env.local` is gitignored

## Deployment

Ready to deploy on Vercel. Add your environment variables in the Vercel dashboard before deploying.
