# PropMemory

PropMemory is an AI-powered property management app for UK private landlords who self-manage a small portfolio. It keeps a full memory of every property — lease dates, payment history, maintenance logs, and tenant notes — and lets landlords chat with an AI that knows everything about each tenancy.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 + CSS custom properties |
| AI | Google Gemini 1.5 Pro (`@google/generative-ai`) |
| Database + Auth | Supabase (PostgreSQL + Row Level Security) |
| Routing | React Router v7 |
| Data fetching | TanStack Query v5 |
| Notifications | react-hot-toast |
| Icons | lucide-react |
| CSV parsing | papaparse |

---

## Setup Instructions

### Prerequisites
- Node.js 18+ (uses `.nvm` — run `nvm use 22` if you have nvm)
- A free [Supabase](https://supabase.com) account
- A Google AI Studio API key from [aistudio.google.com](https://aistudio.google.com)

### 1. Clone and install

```bash
git clone <your-repo-url>
cd propmemory
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste the contents of `src/lib/schema.sql` → click **Run**
3. Go to **Settings → API** → copy your **Project URL** and **anon public** key

### 3. Get your Gemini API key

1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click **Create API key**
3. Copy the key (starts with `AIza...`)

### 4. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_GEMINI_API_KEY=AIzaSy...
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — create an account and add your first property.

---

## How to Deploy to Vercel

1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Add the three environment variables from `.env.local` in the **Environment Variables** section → click **Deploy**

That's it. Vercel auto-detects Vite and handles the build.

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL (e.g. `https://abc123.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key — safe to expose in the browser |
| `VITE_GEMINI_API_KEY` | Google Gemini API key from AI Studio |

> All `VITE_` variables are embedded into the client bundle at build time. The Gemini key is sent directly from the browser to Google's API. This is acceptable for personal/demo use. For a multi-tenant production app, proxy AI calls through a server-side API route.

---

## How to Set Up the Demo Account

See `DEMO_SETUP.md` for step-by-step instructions on creating the demo account (`demo@propmemory.com`) and seeding it with 10 sample properties so visitors can try the app without signing up.

---

## Project Structure

```
src/
├── components/
│   ├── chat/          # ChatPanel, MessageBubble, DraftCard, InsightsBar, QuickPrompts
│   ├── import/        # CSVImporter, ImportPreview
│   ├── layout/        # AppShell, Sidebar, TopBar
│   ├── memory/        # MemoryPanel, LeaseSection, PaymentHistory, MaintenanceLog, LandlordNotes
│   ├── property/      # PropertyCard, PropertyList, AddPropertyModal
│   └── ui/            # Skeleton, Button, Badge, Modal, Spinner, EmptyState
├── hooks/
│   ├── useProperties.js   # CRUD for properties
│   ├── useChat.js         # Chat history + AI message sending
│   ├── useImport.js       # CSV parsing + bulk import
│   └── useInsights.js     # (reserved)
├── lib/
│   ├── ai.js          # Gemini API wrapper
│   ├── supabase.js    # Supabase client
│   ├── utils.js       # Date, currency, class helpers
│   └── schema.sql     # Database schema (paste into Supabase SQL editor)
├── pages/
│   ├── Dashboard.jsx  # Property grid
│   ├── Property.jsx   # Chat + Memory tabs
│   ├── Login.jsx      # Sign in / Sign up / Demo
│   └── Onboarding.jsx # First property setup
└── prompts/
    ├── systemPrompt.js    # Main AI prompt builder
    ├── importPrompt.js    # CSV import prompt
    ├── insightsPrompt.js  # Property insights prompt
    └── draftPrompt.js     # Tone descriptions for UI
```

---

## Known Limitations (V1)

- **No email sending** — "Approve & Send" logs the draft as sent in the activity log but does not actually email the tenant. Integration with SendGrid/Resend is a V2 feature.
- **AI calls from browser** — The Gemini API key is exposed in the client bundle. Fine for personal use; for production, route through a server.
- **No real-time updates** — Property and chat data refresh on navigation, not via websocket. Supabase Realtime can be added in V2.
- **CSV import is AI-dependent** — If the Gemini API is slow, the import step can take 10–20 seconds on large files.
- **Single landlord per account** — The schema supports one landlord per Supabase auth user. Multi-user / agency support would require a `teams` table.
