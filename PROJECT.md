# MsgCRM

## Product

MsgCRM is a multi-channel CRM for sellers who receive messages from Avito accounts first, and later from Drom, Youla, VK, Telegram, delivery services, and other channels.

## Current Deployment Target

- Provider: Beget
- Server name: ai-manager-prod
- Location: Russia, Saint Petersburg
- OS: Ubuntu 24.04 LTS
- CPU: 4 vCPU
- RAM: 6 GB
- Disk: 80 GB NVMe
- Network: 1 Gbit/s
- Public IPv4: 155.212.219.57
- Initial SSH access: verified as root
- Current host name: ai-manager-prod

## MVP Scope

1. Build a clickable frontend MVP with mock data.
2. Separate MsgCRM user accounts from connected external accounts.
3. Prepare all core data around Company / Workspace isolation.
4. Show a three-column inbox for Avito conversations.
5. Show integrations, team, listings, quick replies, deals, delivery, and settings.
6. Add real authentication and workspace access control after the frontend MVP is stable.
7. Connect Avito OAuth/API after auth and workspace isolation are ready.
8. Add Telegram, delivery integrations, and AI-assisted replies later.

## Application Stack

- Monorepo package manager: npm workspaces
- Backend: NestJS
- Frontend: Next.js
- Language: TypeScript
- Database access: Prisma
- Database: PostgreSQL 16 with pgvector
- Queue/cache: Redis
- Deployment runtime: Docker Compose

## Repository Structure

- `apps/api` - NestJS backend API
- `apps/web` - Next.js CRM interface
- `apps/web/src/lib/mock-data.ts` - MsgCRM mock workspace data
- `apps/web/src/lib/types.ts` - frontend MVP entity types
- `apps/web/src/components` - reusable CRM layout, inbox, table, and UI components
- `packages/shared` - shared TypeScript DTOs and types
- `apps/api/prisma/schema.prisma` - initial database model
- `infra` - Docker Compose and environment templates
- `docs` - architecture notes
- `ops` - operational scripts
- `ops/ensure-database-url.mjs` - safely writes a URL-encoded PostgreSQL `DATABASE_URL`

## Initial Infrastructure

- Docker and Docker Compose
- PostgreSQL
- Redis
- Backend API
- Web frontend
- Reverse proxy with HTTPS
- Automated backups

## Server Setup Status

- Hostname set to `ai-manager-prod`
- Timezone set to `Europe/Moscow`
- System packages updated
- Kernel updated to `6.8.0-117-generic`
- Firewall enabled with inbound `22`, `80`, and `443` only
- Fail2ban enabled for SSH
- Unattended upgrades enabled
- Docker installed: `29.5.0`
- Docker Compose plugin installed: `v5.1.3`
- Swap configured: `4 GB` via `/swapfile`
- Runtime directory created: `/opt/ai-manager`
- Infrastructure compose file: `/opt/ai-manager/infra/docker-compose.yml`
- PostgreSQL container: `ai-manager-postgres`
- Redis container: `ai-manager-redis`
- PostgreSQL extension enabled: `pgvector`
- Daily PostgreSQL backup cron added: `/etc/cron.d/ai-manager-backups`

## Application Runtime Status

- Node.js installed on server: `v22.22.2`
- npm installed on server: `10.9.7`
- Production dependency audit: `0 vulnerabilities`
- TypeScript typecheck: passed
- Production build: passed
- Production compose file: `/opt/ai-manager/app/infra/docker-compose.prod.yml`
- API container: `ai-manager-api`
- Web container: `ai-manager-web`
- API local URL: `http://127.0.0.1:3001/api/health`
- Web local URL: `http://127.0.0.1:3000`
- API, Web, PostgreSQL, and Redis healthchecks: healthy
- Public HTTPS web URL: `https://crm.msgcrm.ru`
- Public HTTPS API URL: `https://api.msgcrm.ru/api/health`
- Public inbox API URL: `https://api.msgcrm.ru/api/inbox/conversations`
- Root domain redirect: `https://msgcrm.ru` -> `https://crm.msgcrm.ru`
- WWW redirect: `https://www.msgcrm.ru` -> `https://crm.msgcrm.ru`
- Reverse proxy: Caddy
- Caddy config on server: `/etc/caddy/Caddyfile`
- Caddy config reference in repo: `ops/caddy/Caddyfile`
- TLS certificates: issued automatically by Caddy/Let's Encrypt
- Frontend MVP routes: `/login`, `/register`, `/inbox`, `/deals`, `/listings`, `/templates`, `/integrations`, `/team`, `/delivery`, `/settings`
- Frontend MVP mode: mock data, no real external API calls
- Frontend MVP workspace: `company_1` / `АвтоПлюс`
- Frontend MVP interaction: select conversation, filter inbox, use quick replies, send mock message, create mock deal
- Prisma schema: applied to PostgreSQL
- Demo seed data: Avito and Telegram conversations loaded
- CRM web inbox: connected to backend API
- Inbox endpoints: list conversations, view one conversation, create outbound messages
- Production `DATABASE_URL`: stored in server `.env` with URL-encoded database password

## Security Notes

- Do not store server passwords, API tokens, OAuth secrets, or bot tokens in repository files.
- Use environment variables or server-side secret files ignored by Git.
- Replace temporary password access with SSH keys after the first setup.
- Restrict SSH and application ports with a firewall.

## SSH Access

- Primary SSH user: `deploy`
- Local private key path: `%USERPROFILE%\.ssh\ai_manager_deploy_ed25519`
- Public key fingerprint: `SHA256:k+Isak1z+NaOT6pbgE8SdF2sD/nTNNKIETl4XFXLmNw`
- `deploy` has sudo access and Docker group access.
- SSH password login is disabled.
- Direct root SSH login is disabled.
- Root password is locked.
- SSH hardening script kept for reference: `ops/ssh-hardening.sh`
