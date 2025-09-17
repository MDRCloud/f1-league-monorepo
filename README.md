# F1 Racing League – Monorepo (F1 25)

Production‑ready, self‑hosted app for managing an F1 Racing League using **F1 25**.
Runs on two Ubuntu 24.04 servers (DEV/LIVE) via Docker & Docker Compose.

## Stack
- **Frontend:** Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui + Radix UI
- **API:** NestJS + TypeScript + Prisma (PostgreSQL) + Swagger (OpenAPI)
- **Auth:** NextAuth (credentials provider), JWT sessions; roles: Admin, Steward, Driver, Viewer
- **DB:** PostgreSQL; **Cache/Queue:** Redis (optional)
- **Tests:** Vitest (unit), Playwright (smoke)
- **CI:** GitHub Actions (lint/build/test/push images)
- **Theming:** Tailwind CSS variables + JSON theme config
- **Accessibility:** WCAG 2.1 AA minded

## Quick Start (Ubuntu 24.04)
```bash
# 1) Install Docker Engine & Compose plugin
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo   "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu   $(. /etc/os-release && echo $VERSION_CODENAME) stable" |   sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 2) Clone/copy this repo and configure environment
cp deploy/env.example .env

# 3) Production (recommended for LIVE)
docker compose -f deploy/docker-compose.prod.yml up -d

# 4) Development
docker compose -f deploy/docker-compose.dev.yml up -d

# Helpful shortcuts
make dev
make prod
```

Once containers are up:
- Web (public): `http://localhost:8080` (via Caddy)  
- API Swagger: `http://localhost:8080/api/docs`  
- Admin login (seeded): **admin@league.local / admin123**

## Repo Structure
```
/apps
  /api      # NestJS API + Prisma
  /web      # Next.js frontend
/packages
  /ui       # Shared UI utilities & theming
  /config   # tsconfig/eslint shared
/deploy
  docker-compose.dev.yml
  docker-compose.prod.yml
  Caddyfile
  env.example
/docs       # setup & data model diagrams
```

## Make targets
- `make dev` – build & run dev stack, auto-migrate & seed db.
- `make prod` – build images & run production stack.
- `make logs` – tail all service logs.
- `make down` – stop all services.

## Notes
- The API performs `prisma migrate deploy` and `prisma db seed` on start (idempotent).
- Admin overrides require a **reason**; changes are logged to `AuditLog` (Admin/Steward visible only).
- Public REST endpoints under `/api/v1/*` are read-only and documented via Swagger.

### Admin UI status (in progress)
- Credentials-based login now available at `/admin/login` via NextAuth (Credentials provider).
- Authenticated admin shell for Admin/Steward roles with placeholder sections while CRUD tooling is implemented.

---

### Security & Ops
- Helmet/CSP enabled on API; rate-limits on auth endpoints.
- Strong validation using `class-validator` (API) and `zod` (Web).
- Basic healthcheck endpoints and container healthchecks.
- JWT secrets & NextAuth secrets must be set in `.env` for production.
