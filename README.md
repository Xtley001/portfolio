# Christley Olubela — Portfolio

Minimal dark portfolio for a quant trader / algo dev. Built with Next.js 14, deployed on Vercel, content managed via GitHub API + admin panel.

---

## Stack

- **Framework** — Next.js 14 (App Router)
- **Styling** — Tailwind CSS + custom CSS variables
- **Fonts** — Syne (display) + DM Mono (mono)
- **Content** — MDX (projects) + JSON (site content)
- **Images** — Cloudinary
- **Deploy** — Vercel (auto-deploy on GitHub push)
- **Admin** — Password-protected panel at `/admin`

---

## Project Structure

```
├── app/
│   ├── page.tsx                  # Home — loads site.json + projects, passes as props
│   ├── layout.tsx
│   ├── admin/page.tsx            # Admin panel (all sections editable)
│   └── api/admin/
│       ├── login/route.ts
│       ├── logout/route.ts
│       ├── projects/route.ts
│       ├── publish/route.ts
│       ├── site/route.ts         # Read/write content/site.json via GitHub API
│       └── upload/route.ts       # Cloudinary image upload
├── components/
│   ├── Hero.tsx                  # Accepts hero prop from site.json
│   ├── Stats.tsx                 # Accepts stats prop
│   ├── Stack.tsx                 # Accepts stack prop
│   ├── Persona.tsx               # Accepts persona prop
│   ├── Timeline.tsx              # Accepts timeline prop
│   ├── Contact.tsx               # Accepts contact prop
│   ├── Projects.tsx              # Accepts projects array
│   └── ProjectCard.tsx
├── content/
│   ├── site.json                 # ALL non-project site content (editable via admin)
│   └── projects/                 # One .mdx per project
├── lib/
│   ├── site.ts                   # getSiteData() server helper
│   └── projects.ts               # getAllProjects(), getProjectBySlug()
└── styles/globals.css
```

---

## Environment Variables

```env
# Admin access
ADMIN_PASSWORD=your_password_here

# GitHub API (for saving content)
GITHUB_TOKEN=ghp_...
GITHUB_OWNER=Xtley001
GITHUB_REPO=portfolio

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset

# Session
SESSION_SECRET=random_32char_string
```

---

## Content Editing

All site content is stored in `content/site.json`. Edit it directly **or** use the admin panel at `/admin`.

The admin panel covers every visible section:

| Tab | What it edits |
|-----|--------------|
| **Projects** | Create / edit project MDX files |
| **Hero** | Name, tagline, availability, location, handle, avatar |
| **Stack** | Tech categories and items (add/remove/reorder) |
| **Persona** | Mind text, interests, research topics, hobbies |
| **Stats** | The four stat counters |
| **Timeline** | On-chain milestones (year + event) |
| **Contact** | Email, GitHub, Twitter, LinkedIn, Telegram, note |

Saving any section pushes the updated JSON to GitHub → Vercel auto-deploys in ~30s.

---

## Adding a Project

### Via Admin Panel (recommended)
1. Go to `/admin` → **Projects** tab → **+ New Project**
2. Fill in all fields, upload image, write description
3. Click **Publish**

### Manually
Create `content/projects/your-slug.mdx`:

```mdx
---
slug: your-slug
name: Project Name
tagline: One-line description
year: 2024
status: active
tech: ["Rust", "Solana"]
github: https://github.com/Xtley001/...
live: https://...
image: https://res.cloudinary.com/...
featured: true
---

Extended description in MDX here.
```

Commit and push. Vercel deploys automatically.

---

## Local Development

```bash
npm install
cp .env.example .env.local
# fill in your env vars
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Deploy

Push to GitHub. Vercel picks it up automatically.

Make sure all env vars are set in Vercel → Project Settings → Environment Variables.

---

## Updates Applied

| # | Change |
|---|--------|
| 01 | Universal site data layer (`content/site.json` + `lib/site.ts`) |
| 02 | Full admin panel expansion — all sections editable |
| 03 | Profile picture CSS bug fixed (removed duplicate inline overlay) |
| 03 | Name clip bug fixed (removed `overflow-hidden` from name wrapper) |
| 04 | Section spacing tightened across all components |
| 04 | Projects grid ghost-column bug fixed (explicit column count) |
| 04 | `ProjectCard` uses `minHeight` instead of `height:100%` |
| 08 | Image upload error surfacing — full error message shown in admin |
