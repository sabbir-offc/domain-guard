# Domain Guard Admin

Next.js admin panel for the Domain Guard system.

**Version:** 0.4.0

---

## What's new in v0.4

- **Access requests page** at `/requests` — review pending requests with status tabs (Pending / Approved / Denied / All)
- **One-click approve** — adds the domain to the allowlist + marks the request resolved + (optionally) pings Slack
- **Deny with note** — capture a reason for the audit trail
- **Sidebar pending badge** — amber count next to "Access requests" so you never miss one
- **Employees list** at `/employees` — every employee who has triggered a block, sorted by recency, with pending request count
- **Employee deep-dive** at `/employees/[id]` — 14-day timeline chart, top blocked domains, recent events table, request history
- **Dashboard top employees are clickable** — drill into any employee from the dashboard

---

## Stack

- Next.js 15 (App Router) · React 19 · TypeScript
- Tailwind CSS · Recharts · lucide-react
- Server-side data fetching with httpOnly cookie auth (JWT never touches client JS)

---

## Setup

### 0. Backend running

This admin needs `domain-guard-server` running on a known URL.

```bash
cd ../domain-guard-server
npm install && npm run dev
```

### 1. Configure

```bash
cd domain-guard-admin
cp .env.example .env.local
# .env.local: BACKEND_URL=http://localhost:4000
```

### 2. Install + run

```bash
npm install
npm run dev
```

Open **http://localhost:3000** → log in with the same `ADMIN_USERNAME` / `ADMIN_PASSWORD` as the backend.

### 3. Build for production

```bash
npm run build
npm start
```

---

## Pages

| Route | Description |
|---|---|
| `/login` | Login form (server action sets httpOnly cookie) |
| `/` | Dashboard — stats, 14-day trend, type pie, top domains/employees |
| `/allowlist` | Allowlist editor with quick-add, search, bulk replace |
| `/requests` ⭐ | Access requests with status tabs, one-click approve/deny |
| `/employees` ⭐ | Employee list with totals + pending counts |
| `/employees/[id]` ⭐ | Employee deep-dive: timeline, top domains, events, requests |
| `/events` | Block log with URL-driven filters |

⭐ = new in v0.4

---

## Architecture

```
Browser  ──▶  Next.js (3000)  ──▶  Backend (4000)  ──▶  MongoDB
              │
              ├─ Server components fetch using cookie JWT
              ├─ Server actions handle login (sets httpOnly cookie)
              ├─ Route handlers proxy mutations from client components
              └─ Middleware redirects unauthenticated → /login
```

**Why a proxy?** Client components can't read httpOnly cookies. They `fetch("/api/...")` on Next.js, which reads the cookie server-side and forwards to the backend with the proper `Authorization` header. JWT stays out of `localStorage`.

---

## Request approval flow

```
Employee blocked → submits request from blocked.html
                                      │
                                      ▼
                       POST /api/v1/access-requests (extension)
                                      │
                                      ▼
                      Backend stores AccessRequest (status: pending)
                                      │
                                      ▼
                      Slack ping (if SLACK_WEBHOOK_URL set)
                                      │
                                      ▼
Admin sees pending badge in sidebar → goes to /requests
                                      │
                                      ▼
                    Clicks Approve → PUT /api/requests/:id
                                      │
                                      ▼
                Backend: marks approved, adds domain to allowlist
                                      │
                                      ▼
            Within 5 min, all extensions sync the new allowlist
```

---

## File map

```
domain-guard-admin/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   ├── login/
│   ├── (app)/
│   │   ├── layout.tsx                  Sidebar layout, fetches pending count
│   │   ├── page.tsx                    Dashboard
│   │   ├── allowlist/page.tsx
│   │   ├── requests/page.tsx           ⭐ NEW
│   │   ├── employees/page.tsx          ⭐ NEW
│   │   ├── employees/[id]/page.tsx     ⭐ NEW
│   │   └── events/page.tsx
│   └── api/
│       ├── logout/
│       ├── allowlist/
│       └── requests/[id]/route.ts      ⭐ NEW (PUT proxy)
├── components/
│   ├── Logo.tsx
│   ├── Sidebar.tsx                     Now with pending badge
│   ├── StatCard.tsx
│   ├── TopList.tsx
│   ├── Charts.tsx
│   ├── AllowlistEditor.tsx
│   ├── EventsFilters.tsx
│   └── RequestActions.tsx              ⭐ NEW (approve/deny client)
├── lib/
│   ├── api.ts
│   ├── auth.ts
│   ├── types.ts                        + AccessRequest, EmployeeSummary, EmployeeDetail
│   └── utils.ts
└── middleware.ts
```

---

## Roadmap

### ✅ v0.3 — Polished Next.js admin
### ✅ v0.4 — Request access workflow + per-employee deep-dive + Slack

### v0.5 — Multi-team allowlists
- Sales / QA / engineering get different lists
- Per-employee profile assignment

### v0.6 — Per-employee API keys
- Each PC has its own key, revocable individually

### v0.7 — Notifications & alerts
- Email digest of pending requests
- Anomaly alerts (sudden block spikes from one employee)
- Browser push for approved requests

---

Built for NeXbit LTD · Brand: `#29AAE1` cyan / `#0E1C42` navy
