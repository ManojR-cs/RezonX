# RezonX frontend

The RezonX single-page frontend uses React, Vite, Tailwind CSS, Framer Motion, Lenis, and Lucide.

## Supabase configuration

The public client uses the same `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` variable names as `rezonx-cms`. Add the CMS public values to a local `rezonx-app/.env.local` (see `.env.example`) or provide them to the Vite build environment. The service-role key is not used by this frontend.

Public data is read from the CMS-managed `projects`, `activities`, `achievements`, `gallery`, `site_settings`, and `statistics` tables. The project details modal also uses the documented public `project_likes` and `project_comments` tables. CMS Storage image URLs are used directly; local RezonX photos are used for matching activity or achievement records with no CMS image.

## Local development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
```

The About copy, join link, and any mapped local photos are sourced from the original RezonX site.
