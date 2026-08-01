# ASQAROVGD — Portfolio Website

A production-ready portfolio for a Graphic Designer / Motion Designer / Video
Editor, built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind
CSS**, and **Prisma**. It ships with a real, working Admin Panel — not a
mockup — backed by a persistent database and real file storage.

## What's included

- Public site: home, work (with category filtering), individual project
  pages with an image/video carousel and fullscreen lightbox
- Vertical-video-first media handling (1080×1920 / 9:16) alongside 4:5 and
  16:9 — nothing is cropped or stretched; every media frame renders at its
  true aspect ratio
- A real Admin Panel at `/admin`: login, create/edit/delete projects,
  upload and reorder images & videos, build carousels, publish/unpublish,
  feature projects, manage categories, and edit all homepage/about/contact
  text and branding
- SQLite by default (zero config, genuinely persistent on disk) with a
  one-line swap to Postgres for production
- Local filesystem storage for uploads (`/public/uploads`), structured so
  moving to S3 / Cloudflare R2 later is a small, contained change

## 1. Install

Requires Node.js 18.17+.

```bash
npm install
```

## 2. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and set:

- `JWT_SECRET` — generate one with `openssl rand -base64 48`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the admin account created by the seed
  script below (change the password from inside the Admin Panel afterwards
  if you like)

`DATABASE_URL` is already set to a local SQLite file and needs no changes
to run locally.

## 3. Set up the database

```bash
npm run db:push    # creates the SQLite database and tables
npm run db:seed     # creates your admin account, default categories, and site settings
```

## 4. Run it

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin Panel: http://localhost:3000/admin/login (use the `ADMIN_EMAIL` /
  `ADMIN_PASSWORD` from your `.env`)

Log in, then add your first project from **Admin → New project**. Save the
details, then upload a cover image and carousel media on the next screen.

## Project fields & media

Each project has: title, description, category, client, year, tools/tags,
a cover image, and any number of carousel images/videos. Recommended
source sizes (originals are never cropped, this is just for sharp output):

- Vertical video / Reels: **1080×1920 (9:16)**
- Instagram post/carousel image: **1080×1350 (4:5)**
- Instagram story/cover image: **1080×1920 (9:16)**
- YouTube cover: **1920×1080 (16:9)**

## Deploying to your own server

### Option A — SQLite (simplest)

Works well on a single server (VPS, Railway, Render, Fly.io) with a
persistent disk/volume mounted for:

- `prisma/dev.db` — the database file
- `public/uploads/` — uploaded media

```bash
npm run build
npm run db:push
npm run db:seed   # first deploy only
npm run start
```

Make sure your platform gives you persistent storage — on platforms with
ephemeral filesystems (e.g. most serverless hosts), switch to Option B and
move uploads to object storage (see below).

### Option B — Postgres (recommended for serverless/edge hosts)

1. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"   // was "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
2. Set `DATABASE_URL` in `.env` to your Postgres connection string
   (Supabase, Neon, Railway, RDS, etc.)
3. Run `npm run db:push && npm run db:seed`

### Moving uploads to S3 / R2 later

`src/lib/upload.ts` is the single place that writes files to disk. Swap
its body for an S3/R2 `PutObjectCommand` call and return the resulting
public URL — every API route and component already just stores/reads a
URL string, so nothing else needs to change.

## Security notes

- Passwords are hashed with bcrypt; sessions are signed JWTs in an
  httpOnly cookie
- Every mutating API route (`POST`/`PATCH`/`DELETE`) independently
  verifies the session server-side — the middleware redirect is a UX
  convenience, not the security boundary
- Change `ADMIN_PASSWORD` and generate a fresh `JWT_SECRET` before going
  to production; never commit `.env`

## Scripts

| Command             | What it does                                  |
|----------------------|------------------------------------------------|
| `npm run dev`         | Start the dev server                          |
| `npm run build`       | Production build                              |
| `npm run start`       | Start the production server                   |
| `npm run db:push`     | Sync the Prisma schema to the database         |
| `npm run db:seed`     | Create the admin account & default data        |
| `npm run db:studio`   | Open Prisma Studio (visual DB browser)         |

## Tech stack

Next.js 14 · TypeScript · Tailwind CSS · Prisma · SQLite/Postgres ·
bcryptjs · jsonwebtoken · sharp
