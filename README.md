# Auction Graphics Studio

This app now includes:

- Supabase email/password auth
- Supabase tables for `profiles`, `organisations`, `brand_kits`, `templates`, `uploads`, and `generations`
- Supabase Storage uploads for original source images and generated previews
- OpenAI-powered graphic generation for the Create flow
- A `POST /api/generate-preview` route for generating AI previews
- A `POST /api/generate` route that stores generation input and the generated preview
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
- `OPENAI_API_KEY`
- `OPENAI_IMAGE_MODEL`

## 3. Set up Supabase

1. Create a Supabase project.
2. In the Supabase SQL editor, run [supabase/migrations/20260501_init.sql](/Users/abhishekutkarsha/Documents/Codex/Golfcarts/auction-creator-studio/supabase/migrations/20260501_init.sql).
3. Copy the project URL, publishable key, and server-side elevated key into your `.env`.
4. In Authentication, enable email/password sign-in.

Notes:

- The SQL migration creates a trigger that auto-creates a `profiles` row for each new auth user.
- The app lazily creates an `organisations` row the first time an authenticated user reaches the app.
- For server auth, the app accepts either `SUPABASE_SECRET_KEY` or the legacy `SUPABASE_SERVICE_ROLE_KEY`.

## 4. Set up OpenAI image generation

1. Create an OpenAI API key.
2. Add it to `.env` as `OPENAI_API_KEY`.
3. Leave `OPENAI_IMAGE_MODEL=gpt-image-1.5` unless you want to override it.
4. If your OpenAI org requires verification for GPT Image access, complete that before testing image generation.

Official docs:

- [OpenAI image generation guide](https://platform.openai.com/docs/guides/image-generation?lang=javascript)
- [OpenAI Images API reference](https://platform.openai.com/docs/api-reference/images/createEdit?lang=node.js)

## 5. Set up Supabase Storage

1. In Supabase, open `Storage`.
2. Create a public bucket named `auction-graphics`, or set `SUPABASE_STORAGE_BUCKET` to a different bucket name.
3. If you use a different name, update `.env` to match.
4. Keep the bucket public while testing so generated previews render without signed URLs.

## 6. Run locally

```bash
npm run dev
```

## 7. How the flow works

1. A user signs up or logs in with Supabase auth.
2. In `Create Graphic`, the request form submits to `POST /api/generate-preview`.
3. The route sends the questionnaire inputs, brand rules, and source image reference to OpenAI.
4. OpenAI returns a generated PNG preview.
5. When the user saves the design, `POST /api/generate` uploads the source image and generated preview PNG to Supabase Storage.
6. The route stores upload metadata and generation form data in Supabase.
7. `My Generations` reads the saved preview records from Supabase and displays them.

## Deployment notes

- For local Vite/TanStack Start development, `.env` is enough.
- For Cloudflare deployment, set the same Supabase variables as Worker secrets/environment variables before running `wrangler deploy`.
- Git-connected Cloudflare Worker builds are configured for this repository's `main` branch.
