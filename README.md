# MsgCRM

MsgCRM is a multi-channel CRM for sellers who want one workspace for messages, deals, listings, team members, quick replies, delivery, and connected external accounts.

The first production target is:

- clickable frontend MVP with mock data
- MsgCRM user accounts separated from connected external accounts
- Company / Workspace isolation prepared in the data model
- Avito-first unified inbox
- later real auth, Avito OAuth/API, Telegram, delivery, and AI-assisted replies

## Repository Layout

- `apps/api` - backend API
- `apps/web` - web CRM interface
- `apps/web/src/lib/mock-data.ts` - mock workspace data for MVP
- `apps/web/src/components` - CRM UI components
- `packages/shared` - shared TypeScript types
- `infra` - local/deployment infrastructure templates
- `ops` - operational scripts

## Current Stack

- Backend: NestJS
- Frontend: Next.js
- Database: PostgreSQL with pgvector
- Queue/cache: Redis
- Runtime: Docker Compose

## First Development Commands

Dependencies are not installed yet. Once Node.js and npm are available:

```bash
npm install
npm run typecheck --workspaces --if-present
```
