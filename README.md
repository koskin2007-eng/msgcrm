# MsgCRM

MsgCRM is a platform for creating AI agents for Telegram sales and support. It lets a company create an agent, upload knowledge, connect a Telegram bot, and use OpenAI-powered replies inside one protected workspace.

The product keeps the existing multi-channel CRM foundation for future integrations such as Avito, Drom, Yula, VK, delivery services, and other B2B channels. Avito-first work is paused as a future integration direction while the current MVP focuses on Telegram AI Agents.

The first production target is:

- Telegram AI Agents MVP
- real MsgCRM user accounts and company/workspace separation
- AI agent setup: role, tone, instructions, restrictions, handoff rules
- company knowledge base for FAQ, regulations, and support documents
- Telegram bot connection through backend webhook bridge
- OpenAI suggested replies with approval mode by default
- MsgCRM user accounts separated from connected external accounts
- Company / Workspace isolation prepared in the data model
- later Avito OAuth/API, delivery, analytics, and additional channels

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

## Telegram AI Agents Flow

```text
Client writes to Telegram
Telegram sends webhook to MsgCRM backend
Backend resolves Telegram bot, company, and assigned agent
Backend loads agent instructions and company knowledge
Backend calls OpenAI if OPENAI_API_KEY is configured
Backend stores a suggested reply
Manager approves or edits the reply in MsgCRM
```

Telegram never sends messages directly to OpenAI. MsgCRM backend is the bridge/webhook layer and is responsible for workspace isolation, token encryption, OpenAI calls, and reply approval.

## First Development Commands

Dependencies are not installed yet. Once Node.js and npm are available:

```bash
npm install
npm run typecheck --workspaces --if-present
```

## Secrets

Real `.env` files, Telegram bot tokens, OpenAI API keys, session tokens, personal data, and database dumps must never be committed to GitHub. Use `.env.example` and `infra/env.production.example` only as placeholder templates.
