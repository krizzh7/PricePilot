# PricePilot

Price comparison website that searches real-time prices from trusted retailers using Google Shopping data.

Browsing and searching are public — no account is required. Signing in is optional and uses a demo account store.

## Features

- **Search any product** — compare prices from Amazon, Walmart, Best Buy, and more
- **Real-time prices** — powered by SerpApi Google Shopping API
- **Autocomplete suggestions** — local product catalog as you type
- **Grid and table views** — responsive table layout that switches to cards on small screens
- **Sort results** — by price, rating, shipping speed, or retailer (both directions)
- **Lowest-price detection** — badges and savings are calculated from the actual minimum offer
- **Side-by-side compare** — add up to 3 offers and compare them in a modal
- **Optional accounts** — demo sign-up/sign-in; browsing never requires it
- **Dark mode** — persistent light/dark theme toggle

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- GSAP and Framer Motion animations
- NextAuth.js v5 beta (credentials provider, JWT sessions)
- next-themes
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

<<<<<<< HEAD
<<<<<<< Updated upstream
=======
`NEXTAUTH_URL` is optional. Leave it unset in local development: Auth.js v5
derives the URL from the request. If you do set it, include the auth base path
(e.g. `NEXTAUTH_URL=http://localhost:3000/api/auth`), because the beta uses the
URL's path as the auth base path. Setting it to a bare origin breaks server-side
session reads (see Troubleshooting).

>>>>>>> Stashed changes
=======
`NEXTAUTH_URL` is optional. Leave it unset in local development: Auth.js v5
derives the URL from the request. If you do set it, include the auth base path
(e.g. `NEXTAUTH_URL=http://localhost:3000/api/auth`), because the beta uses the
URL's path as the auth base path.

>>>>>>> 208ea39c4e993acfad398782b1b287fc16bd8a91
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

## How Search Behaves

- The query lives in the URL (`/search?q=...`), so results are shareable and support back/forward navigation.
- Queries are trimmed and capped at 200 characters; longer deep links are shortened and flagged in the UI.
- Re-submitting the same term refreshes prices instead of doing nothing.
- Navigating back to `/search` without a query clears stale results, errors, and demo notices.
- Missing shipping or availability data is shown as **"Shipping info at retailer"** / **"Check availability"** rather than being invented.
- Out-of-stock or unknown availability is visually distinct from confirmed in-stock offers.
- Without a SerpApi key — or when the upstream API fails — the API returns clearly labeled sample data (`demo: true`).
- External offer links are validated to `http(s)` only; anything else falls back to a Google search link.

## Project Layout

```
app/                 Routes, layout, API handlers, middleware
  api/search/        SerpApi proxy with validation and rate-limit handling
  api/auth/          NextAuth route handlers
  auth/              Sign-in / sign-up screen
  search/            Search results screen
components/          UI, results, compare, search, marketing, auth
context/             Compare state provider
lib/                 Auth config, SerpApi client, validation, utilities
types/               Shared TypeScript types
```

## Recent Fixes

### Auth and routing

- Fixed the `/auth` page being unreachable: middleware treated Auth.js error payloads (the string `"Bad request."`) as a valid session and redirected anonymous users to `/`.
- Middleware now only redirects **real** sessions (`req.auth?.user`) away from `/auth`, and only matches that route.
- Fixed server-side session parsing with `NEXTAUTH_URL`: Auth.js v5 beta uses the URL's path as the auth base path, so a bare origin broke `/session`. The variable is now optional and documented correctly.
- Auth validation: shared email/password rules, case-insensitive emails, 8-character minimum, and `trustHost` for self-hosting.
- Removed the blanket auth gate — the site is publicly browsable as the UI and README state.

### Search and data

- Sanitized SerpApi `product_link` values so `javascript:`/`data:` URLs can never reach an anchor `href`.
- Normalized retailer matching (longer names first) so short keys such as `hp` cannot shadow specific retailers, and names like `B&H Photo` still resolve.
- Price parsing handles grouped numbers and ranges (`$1,299.99 – $1,399.99`).
- Shipping days are parsed from `delivery_days` or delivery text; availability and review counts are parsed defensively.
- Fixed a duplicated-number bug in the "Save up to" ticker (it rendered `$70.00.00`).
- Search autocomplete no longer opens on page load; it appears only while the field is focused.
- The global `/` shortcut no longer steals the key while a `<select>` is focused.
- Duplicate `?q=` parameters and over-length deep links are normalized on the server.

### Results, sorting, and compare

- Shared one sorting implementation between the sort dropdown and table headers, with all eight presets.
- "Lowest price" badges are derived from the actual minimum price (ties included) instead of row position.
- Savings are calculated from real min/max offer prices.
- Compare identity is `retailer::title::price`, because Google Shopping offers often share the same `product_link`.
- Compare modal: Escape to close, body scroll lock, literal Tailwind column classes, ARIA labels, and a fallback link when an offer has no URL.
- The compare modal now closes when the last item is removed or cleared, so it cannot reappear unexpectedly.
- Toasts render above the compare dock and modal.

### Accessibility and UI correctness

- `aria-sort` moved to the `<th>`; search input exposes the combobox/listbox semantics.
- Fixed list semantics (`<li>` inside `<ul>`), `<dl>` ordering in the stats band, and removed the incorrect dialog role from the auth card.
- `ScrollReveal` now renders its `id`, so section anchors (`#how-it-works`, `#testimonials`) work; added `scroll-mt` for the sticky header plus storage/IntersectionObserver fallbacks.
- Removed an invalid Tailwind utility, restored the skeleton `.shimmer` animation, and fixed semantic color tokens so `/opacity` modifiers compile.
- Restored missing design tokens/shadows and added `context/**` to Tailwind's content globs.

### Tooling and documentation

- Added `.eslintrc.json` so `npm run lint` runs non-interactively.
- Corrected the README environment variable from `NEXT_PUBLIC_SERPAPI_KEY` to the server-only `SERPAPI_KEY`.
- `npm run type-check`, `npm run lint`, and `npm run build` all pass. The only lint output is five `<img>` optimization warnings (favicons are external and intentionally not optimized through `next/image`).

## Known Limitations

- Accounts live in an in-memory `Map` and are lost on server restart; this is a demo, not production auth.
- Preferences (saved searches, price alerts) are not persisted yet.
- Login has no rate limiting or account lockout.
- Offer data depends on SerpApi availability; fallback sample data is labeled in the UI.
- Favicons use plain `<img>` tags, which produces the remaining lint warnings.

## Notes

- Search works without signing in — no account required to browse prices
- Sign-up/login uses a mock in-memory store (for demo purposes only)
- Without a SerpApi key, sample/labeled fallback data is shown
- No secrets are committed to git — `.env.local` is gitignored

## Troubleshooting

**Visiting `/auth` while signed out redirects home.**
Check that `NEXTAUTH_URL`/`AUTH_URL` is either unset or includes `/api/auth`. A bare origin makes Auth.js v5 beta look for `/session` instead of `/api/auth/session`.

**Accounts disappear after a restart.**
Expected: the demo user store is in memory.

**Prices look like samples.**
The UI shows a "Demo mode" notice when the API key is missing or upstream data is unavailable.

## Deployment

Ready to deploy on Vercel. Add your environment variables in the Vercel dashboard before deploying. Prefer leaving `NEXTAUTH_URL` unset (Auth.js derives it from the request) or set it to the full auth base path.
