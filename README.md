# Auction Graphics Studio

This app now includes:

- Supabase email/password auth
- Supabase tables for `profiles`, `organisations`, `brand_kits`, `templates`, `uploads`, and `generations`
- Supabase Storage uploads for original source images and generated previews
- A `POST /api/generate` route that stores generation input and returns a saved mock preview
- A live `My Generations` page backed by Supabase

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

Copy [.env.example](/Users/abhishekutkarsha/Documents/Codex/Golfcarts/auction-creator-studio/.env.example) to `.env` for local development.

Required variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_SECRET_KEY`
- `SUPABASE_STORAGE_BUCKET`

## 3. Set up Supabase

1. Create a Supabase project.
2. In the Supabase SQL editor, run [supabase/migrations/20260501_init.sql](/Users/abhishekutkarsha/Documents/Codex/Golfcarts/auction-creator-studio/supabase/migrations/20260501_init.sql).
3. Copy the project URL, publishable key, and server-side elevated key into your `.env`.
4. In Authentication, enable email/password sign-in.

Notes:

- The SQL migration creates a trigger that auto-creates a `profiles` row for each new auth user.
- The app lazily creates an `organisations` row the first time an authenticated user reaches the app.
- For server auth, the app accepts either `SUPABASE_SECRET_KEY` or the legacy `SUPABASE_SERVICE_ROLE_KEY`.

## 4. Set up Supabase Storage

1. In Supabase, open `Storage`.
2. Create a public bucket named `auction-graphics`, or set `SUPABASE_STORAGE_BUCKET` to a different bucket name.
3. If you use a different name, update `.env` to match.
4. Keep the bucket public while testing so generated previews render without signed URLs.

## 5. Run locally

```bash
npm run dev
```

## 6. How the flow works

1. A user signs up or logs in with Supabase auth.
2. In `Create Graphic`, the existing live preview is rendered to a mock PNG.
3. The form submits to `POST /api/generate`.
4. The route uploads the original source image and generated preview PNG to Supabase Storage.
5. The route stores upload metadata and generation form data in Supabase.
6. `My Generations` reads the saved preview records from Supabase and displays them.

## Deployment notes

- For local Vite/TanStack Start development, `.env` is enough.
- For Cloudflare deployment, set the same Supabase variables as Worker secrets/environment variables before running `wrangler deploy`.
