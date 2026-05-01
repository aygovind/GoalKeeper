# GoalKeeper (V1)

Minimal sleep tracker focused on **fast logging** and **consistency visuals**.

## Run locally

```bash
cd goalkeeper
npm install
npm run dev
```

## Supabase setup (required for saving goals/logs)

1. Create a Supabase project
2. In Supabase SQL Editor, run:
   - `supabase/schema.sql`
3. Disable RLS for `sleep_goals` and `sleep_logs` (single-user app)
4. Create `.env`:

```bash
cp .env.example .env
```

Set:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Restart `npm run dev`.

## Deploy (Netlify)

1. Push repo to GitHub
2. Create a new Netlify site from the repo (base dir: `goalkeeper`)
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add env vars in Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
