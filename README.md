# GPCS — Global Platform for Collaboration and Science

React + TypeScript + Vite + Tailwind CSS + React Router + Lucide, backed by Supabase (Auth, PostgreSQL, Storage, Realtime) with Row Level Security on every table.

## Run it

```bash
npm install
cp .env.example .env.local      # add your Supabase URL and anon key
npm run dev
```

## Set up Supabase

1. Create a project at supabase.com.
2. In the SQL editor, run the files in `supabase/migrations/` in order: `0001_schema`, `0002_security`, `0003_storage`, `0004_seed`, `0005_launch`.
3. Authentication → Providers → Email: enable. Turn email confirmation on or off as you prefer; the app handles both.
4. Copy the project URL and anon key into `.env.local`.

`0004_seed` loads reference data only: the OECD discipline taxonomy and the 17 UN Sustainable Development Goals. There are no fictional researchers, projects or discoveries. Every screen starts empty and fills with what real people add.

## Structure

| Route | Environment |
| --- | --- |
| `/discover` | Challenges, community-submitted discoveries and technologies (each with a required source link), world map |
| `/research`, `/research/:id` | Research list, workspace with sources, notes, documents |
| `/innovate`, `/innovate/:id` | Projects, stages, task board, progress |
| `/collaborate`, `/collaborate/workspaces/:id`, `/collaborate/people/:id` | People directory, workspaces, join requests, invitations, realtime discussion |
| `/knowledge`, `/knowledge/:slug` | Discipline map and list |
| `/my`, `/my/saved`, `/my/profile` | Personal overview, saved items, profile |
| `/login`, `/register` | Authentication |

```
src/
  components/{ui,layout,forms,map,knowledge}   design system and shell
  context/                                     theme, auth, saved items, taxonomy
  lib/api/                                     one typed module per domain
  pages/                                       one folder per environment
supabase/migrations/                           schema, RLS, storage, seed
```

## Security model

- Every table has RLS enabled. Public content is readable by anyone; private content only by its owner and members of workspaces it is shared with.
- Workspace roles: `owner` (lead), `editor` (may add sources, notes, documents and manage tasks on shared items), `viewer` (read and discuss).
- A workspace can only link research or projects its owner owns, so linking someone else's work never grants edit rights.
- Joining happens only through `respond_join_request` / `respond_workspace_invite` (SECURITY DEFINER RPCs that check the caller). Clients cannot insert themselves into `workspace_members`.
- Notifications are written by database triggers; clients can only mark them read. Profile updates are limited by column grants.
- Documents live in a private bucket and are served through 60-second signed URLs.

## Data honesty

- The map and discipline graph are computed from real public profiles and public research. They are empty until people add a country or tag disciplines.
- Discoveries and technologies are community submissions and must link to an original source. The platform does not generate or invent scientific claims.

## Features added for launch

- Password reset (`/forgot-password`, `/reset-password`).
- Report button on research, projects, discoveries, workspaces and profiles (stored in `reports`, reviewed in the Supabase dashboard).
- My GPCS → Profile: download all your data as JSON, or permanently delete your account.
- Per-account rate limits on creating content (migration `0005`).
- Terms, Privacy and Community Guidelines pages. These are plain-language drafts and **must be reviewed by a lawyer** before launch.
- "New from the community" on Discover, from real public research.

See `LAUNCH.md` for the full pre-launch checklist.

## Deploy (Vercel or Netlify)

1. Push the repo to GitHub and import it in Vercel or Netlify. Build command `npm run build`, output folder `dist`.
2. Add the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the host's settings.
3. `vercel.json` and `public/_redirects` make routes such as `/research` work on refresh.
4. In Supabase → Authentication → URL Configuration, set **Site URL** to your live address and add it to **Redirect URLs**.

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs the type-check, tests and build on every push, so build errors show up in the Actions tab.

## Scripts

`npm run dev` · `npm run build` (type-check and bundle) · `npm run typecheck` · `npm test`
