# I.EL FAYK — MERN Stack Portfolio

A full-stack academic/creative portfolio built with MongoDB, Express, React, and Node.js.
Three independent sub-projects share one repository: a public frontend, an admin CMS, and a REST API.

---

## Deployment

This monorepo deploys as **three separate Vercel projects** (backend, frontend, admin).
Each sub-project is linked independently — set the **Root Directory** in the Vercel dashboard when you import.

### Branch → environment

| Git branch | Vercel environment | URL type |
|------------|-------------------|----------|
| `main` | Production | custom domain / `*.vercel.app` stable |
| any other branch / PR | Preview | `*-git-<branch>-*.vercel.app` |

Push to `main` → automatic Production deployment.  
Push to any other branch → automatic Preview deployment.

### How to deploy

**Option A — Git (recommended):**
1. Push the repo to GitHub.
2. On [vercel.com](https://vercel.com), import the repo **three times** — once per sub-project — setting the Root Directory to `backend`, `frontend`, and `admin` respectively.
3. Set the environment variables listed below for each project.
4. Every `git push` to `main` deploys automatically.

**Option B — CLI:**
```bash
npm i -g vercel
cd backend  && vercel --prod
cd frontend && vercel --prod
cd admin    && vercel --prod
```

### Environment variables

Set these in **Vercel Dashboard → Project → Settings → Environment Variables**.
Never commit real values — use separate values for Preview vs Production.

#### `backend`

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | **Yes** | MongoDB Atlas connection string |
| `JWT_SECRET` | **Yes** | Random secret for signing JWTs |
| `CLIENT_URL` | **Yes** | Deployed frontend URL (for CORS) |
| `ADMIN_URL` | **Yes** | Deployed admin URL (for CORS) |
| `CLOUDINARY_NAME` | No | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | No | Cloudinary API key |
| `CLOUDINARY_SECRET_KEY` | No | Cloudinary API secret |
| `ADMIN_EMAIL` | No | Seed admin e-mail |
| `ADMIN_PASSWORD` | No | Seed admin password |

#### `frontend`

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | **Yes** | Backend API base URL, e.g. `https://your-api.vercel.app/api` |

#### `admin`

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | **Yes** | Backend API base URL |
| `VITE_FRONTEND_URL` | **Yes** | Public frontend URL (used for the Preview link) |
| `VITE_CLOUDINARY_CLOUD_NAME` | No | Cloudinary cloud name |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | No | Unsigned upload preset name |

### Vercel Dashboard capabilities

From the Vercel Dashboard you can:
- Redeploy any past deployment without a new commit.
- Promote a Preview deployment to Production.
- Roll back Production to any previous deployment instantly.
- Inspect build logs, function logs, and asset sizes under the **Resources** tab.
- Assign a custom domain to any deployment.

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Prerequisites](#2-prerequisites)
3. [Local Development Setup](#3-local-development-setup)
4. [Environment Variables Reference](#4-environment-variables-reference)
5. [Cloudinary Image Uploads](#5-cloudinary-image-uploads)
6. [MongoDB Atlas (Production DB)](#6-mongodb-atlas-production-db)
7. [API Endpoints](#7-api-endpoints)
8. [Frontend Pages](#8-frontend-pages)
9. [Admin Studio](#9-admin-studio)
10. [Vercel Deployment](#10-vercel-deployment)
11. [Common Errors & Fixes](#11-common-errors--fixes)

---

## 1. Project Structure

```
mern-storefront/
├── backend/              # Node.js + Express REST API  →  port 5000
│   ├── config/db.js      # MongoDB connection
│   ├── models/           # Mongoose schemas
│   ├── controllers/      # Request handlers
│   ├── routes/           # Express routers
│   ├── server.js         # Entry point
│   └── .env.example
│
├── frontend/             # React + Vite public site    →  port 5173
│   ├── src/
│   │   ├── pages/        # Route-level components
│   │   ├── components/   # Navbar, Footer
│   │   ├── api/index.js  # All API calls in one place
│   │   └── styles/theme.js  # Shared colors & fonts (C, F)
│   └── .env.example
│
├── admin/                # React + Vite admin CMS      →  port 5174
│   ├── src/
│   │   ├── pages/Studio.jsx      # Main admin shell + all tabs
│   │   └── pages/ThemeManager.jsx  # Themes CRUD
│   └── .env.example
│
├── package.json          # Root scripts (dev, install:all)
└── README.md
```

### Root scripts

```bash
npm run install:all   # installs dependencies in all three sub-projects
npm run dev           # starts backend + frontend + admin concurrently
```

---

## 2. Prerequisites

You need these installed before you can run the project locally.

| Tool | Version | How to check |
|------|---------|--------------|
| **Node.js** | 18 or higher | `node -v` |
| **npm** | 9 or higher | `npm -v` |
| **MongoDB** | 7.x (local) | `mongod --version` |

### Install MongoDB locally (Ubuntu/Debian)

```bash
sudo snap install mongod --channel 7.0/stable --classic
sudo snap start mongod
```

On macOS with Homebrew:

```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

You can skip local MongoDB by using MongoDB Atlas (see [Section 6](#6-mongodb-atlas-production-db)).

---

## 3. Local Development Setup

### Step 1 — Clone and install

```bash
git clone <your-repo-url>
cd mern-storefront
npm run install:all
```

### Step 2 — Configure environment variables

```bash
cp backend/.env.example  backend/.env
cp frontend/.env.example frontend/.env
cp admin/.env.example    admin/.env
```

Open each `.env` file and fill in the values. For a basic local setup you only **need** to set `MONGODB_URI` in `backend/.env`. All other values have working defaults.

### Step 3 — Start everything

```bash
npm run dev
```

This runs three dev servers at the same time:

| App | URL | What it is |
|-----|-----|------------|
| Frontend | http://localhost:5173 | Public portfolio |
| Admin | http://localhost:5174 | CMS / Studio |
| Backend | http://localhost:5000 | REST API |

### Step 4 — Verify the backend is running

Open http://localhost:5000/api/health — you should see `{"status":"ok"}`.

If the backend crashes with a MongoDB connection error, make sure MongoDB is running:

```bash
sudo snap start mongod        # Linux snap
brew services start mongodb-community@7.0  # macOS
```

---

## 4. Environment Variables Reference

### `backend/.env`

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `PORT` | No | Port the API runs on | `5000` |
| `MONGODB_URI` | **Yes** | MongoDB connection string | `mongodb://localhost:27017/portfolio` |
| `CLIENT_URL` | No | Allowed frontend origin for CORS | `http://localhost:5173` |
| `ADMIN_URL` | No | Allowed admin origin for CORS | `http://localhost:5174` |

> **Tip:** For production, set `CLIENT_URL` and `ADMIN_URL` to your deployed Vercel URLs (comma-separated if needed).

### `frontend/.env`

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `VITE_API_URL` | No | Backend API base URL | `http://localhost:5000/api` |

### `admin/.env`

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `VITE_API_URL` | No | Backend API base URL | `http://localhost:5000/api` |
| `VITE_FRONTEND_URL` | No | Public site URL (used for the Preview link) | `http://localhost:5173` |
| `VITE_CLOUDINARY_CLOUD_NAME` | No | Your Cloudinary cloud name | — |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | No | Unsigned upload preset name | — |

---

## 5. Cloudinary Image Uploads

Cloudinary lets you host images in the cloud. The admin uses it for project images, hero photos, and theme covers.

### 5a — Create a free account

Go to https://cloudinary.com and sign up. Your **cloud name** is shown on the dashboard.

### 5b — Create an unsigned upload preset

1. In the Cloudinary dashboard, go to **Settings → Upload**.
2. Scroll to **Upload presets** and click **Add upload preset**.
3. Set **Signing mode** to **Unsigned**.
4. Give it a name (e.g. `portfolio_unsigned`).
5. Save.

### 5c — Add to admin/.env

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=portfolio_unsigned
```

Without these, image upload fields in the admin will still work — you can paste image URLs directly instead.

---

## 6. MongoDB Atlas (Production DB)

Atlas is the hosted version of MongoDB — no local installation needed, and it works with Vercel out of the box.

### 6a — Create a free cluster

1. Go to https://mongodb.com/atlas and sign up.
2. Create a free **M0** cluster (512 MB, always free).
3. Choose any cloud region close to you.

### 6b — Create a database user

1. In Atlas, go to **Database Access → Add New Database User**.
2. Choose **Password** authentication.
3. Note the username and password — you'll need them in the connection string.

### 6c — Allow network access

1. Go to **Network Access → Add IP Address**.
2. For Vercel deployment, click **Allow Access from Anywhere** (`0.0.0.0/0`).
3. For local development, click **Add Current IP Address**.

### 6d — Get the connection string

1. Go to **Clusters → Connect → Connect your application**.
2. Choose **Node.js** driver.
3. Copy the connection string. It looks like:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
```

4. Replace `<password>` with your actual password.
5. Paste it as `MONGODB_URI` in `backend/.env`.

---

## 7. API Endpoints

The backend exposes a REST API under `/api`. All endpoints return JSON.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check — returns `{"status":"ok"}` |
| `GET` | `/api/settings` | Site-wide settings (hero text, SEO, footer) |
| `PUT` | `/api/settings` | Update settings |
| `GET` | `/api/profile` | Identity / contact info |
| `PUT` | `/api/profile` | Update profile |
| `GET` | `/api/about` | About page data (bio, experience, talks…) |
| `PUT` | `/api/about` | Update about data |
| `GET` | `/api/skills` | All skills |
| `POST` | `/api/skills` | Create skill |
| `PUT` | `/api/skills/:id` | Update skill |
| `DELETE` | `/api/skills/:id` | Delete skill |
| `GET` | `/api/projects` | All projects (supports `?type=&status=`) |
| `POST` | `/api/projects` | Create project |
| `PUT` | `/api/projects/:id` | Update project |
| `DELETE` | `/api/projects/:id` | Delete project |
| `GET` | `/api/papers` | All research papers |
| `POST` | `/api/papers` | Create paper |
| `PUT` | `/api/papers/:id` | Update paper |
| `DELETE` | `/api/papers/:id` | Delete paper |
| `GET` | `/api/posts` | All blog posts |
| `POST` | `/api/posts` | Create post |
| `PUT` | `/api/posts/:id` | Update post |
| `DELETE` | `/api/posts/:id` | Delete post |
| `GET` | `/api/themes` | All math themes |
| `GET` | `/api/themes/:slug` | Single theme by slug |
| `POST` | `/api/themes` | Create theme |
| `PUT` | `/api/themes/:id` | Update theme |
| `DELETE` | `/api/themes/:id` | Delete theme |
| `POST` | `/api/contact` | Submit a contact form message |
| `GET` | `/api/contact` | Read all messages (admin) |
| `DELETE` | `/api/contact/:id` | Delete a message |

---

## 8. Frontend Pages

| Route | Page | Data source |
|-------|------|-------------|
| `/` | Home | `/api/settings`, `/api/themes`, `/api/skills` |
| `/projects` | Projects (with search + filters) | `/api/projects` |
| `/projects/:id` | Project detail | `/api/projects/:id` |
| `/about` | About + Resume | `/api/about`, `/api/profile`, `/api/settings` |
| `/research` | Publications + Talks | `/api/papers`, `/api/about` |
| `/writing` | Blog | `/api/posts` |
| `/contact` | Contact form | `/api/profile`, `/api/settings` |
| `/themes/:slug` | Math theme detail (Markdown) | `/api/themes/:slug` |
| `/playground` | Interactive demos | static |

All pages fall back to hardcoded placeholder data while the API request is in flight or if it fails. The site is fully usable without a backend.

---

## 9. Admin Studio

Open http://localhost:5174 after running `npm run dev`.

### Tabs

| Tab | What you can edit |
|-----|-------------------|
| **Profile** | Name, headline, bio, social links, availability |
| **Home Settings** | Hero title/subtitle/image, math/tech section intros, footer text, SEO |
| **Themes** | Math theme cards on the home page — title, image, Markdown description |
| **Skills** | Tech and math skills (icon, image, category) |
| **Projects** | Portfolio projects with Markdown descriptions |
| **About / CV** | Bio, experience, education, strengths, desk items, talks |
| **Papers** | Research publications |
| **Writing** | Blog posts |
| **Messages** | Contact form submissions |

---

## 10. Vercel Deployment

Deploy in this order: **backend → frontend → admin → back to backend** (to update CORS).

### Step 1 — Deploy the backend

1. Push your code to GitHub.
2. Go to https://vercel.com → **Add New Project**.
3. Import the repo. Set the **Root Directory** to `backend`.
4. Set these environment variables:
   - `MONGODB_URI` = your Atlas connection string
   - `CLIENT_URL` = *(leave blank for now, fill in after frontend is deployed)*
   - `ADMIN_URL` = *(leave blank for now)*
5. Click **Deploy**. Note the URL, e.g. `https://codemath-api.vercel.app`.

### Step 2 — Deploy the frontend

1. Add another project. Set **Root Directory** to `frontend`.
2. Set environment variables:
   - `VITE_API_URL` = `https://codemath-api.vercel.app/api`
3. Deploy. Note the URL, e.g. `https://codemath.vercel.app`.

### Step 3 — Deploy the admin

1. Add another project. Set **Root Directory** to `admin`.
2. Set environment variables:
   - `VITE_API_URL` = `https://codemath-api.vercel.app/api`
   - `VITE_FRONTEND_URL` = `https://codemath.vercel.app`
   - `VITE_CLOUDINARY_CLOUD_NAME` = *(optional)*
   - `VITE_CLOUDINARY_UPLOAD_PRESET` = *(optional)*
3. Deploy. Note the URL, e.g. `https://codemath-admin.vercel.app`.

### Step 4 — Update backend CORS

1. Go back to your **backend** project on Vercel → **Settings → Environment Variables**.
2. Set:
   - `CLIENT_URL` = `https://codemath.vercel.app`
   - `ADMIN_URL` = `https://codemath-admin.vercel.app`
3. **Redeploy** the backend (Deployments → the latest → Redeploy).

### Why this order matters

The frontend and admin need the backend URL to build correctly. The backend needs the frontend/admin URLs for CORS. That's why you deploy backend first with blank CORS, then fill it in after.

---

## 11. Common Errors & Fixes

### "ECONNREFUSED 127.0.0.1:27017"

MongoDB is not running locally.

```bash
# Linux (snap)
sudo snap start mongod

# macOS
brew services start mongodb-community@7.0
```

Or switch to MongoDB Atlas (see Section 6) — no local database required.

---

### "Port 5173 is already in use"

Another process is holding the port. Find and kill it:

```bash
lsof -ti:5173 | xargs kill
lsof -ti:5174 | xargs kill
```

---

### "Cannot read properties of undefined (reading 'map')"

The frontend got `undefined` from the API instead of an array. This usually means the backend is not running. Check:

1. Is the backend running? Visit http://localhost:5000/api/health.
2. Is `VITE_API_URL` in `frontend/.env` pointing to the right address?

---

### CORS error in the browser console

```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy
```

Check `backend/.env`:

```env
CLIENT_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

Restart the backend after editing `.env`.

---

### Vercel deployment error: "Cannot find module"

Make sure you set the **Root Directory** to `backend`, `frontend`, or `admin` when importing the project on Vercel — not the monorepo root.

---

### Images not uploading (Cloudinary)

- Check that `VITE_CLOUDINARY_CLOUD_NAME` and `VITE_CLOUDINARY_UPLOAD_PRESET` are set in `admin/.env`.
- Make sure the upload preset is set to **Unsigned** in the Cloudinary dashboard.
- Cloudinary free tier allows 25 GB storage and 25 GB bandwidth per month — more than enough for a portfolio.
