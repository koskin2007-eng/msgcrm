# ai-Manager Application Structure

## Product Boundary

ai-Manager is built as a multi-channel CRM. Avito is the first channel, Telegram is the second, and AI-assisted replies are a shared layer used by every channel.

## Modules

### Backend API

Location: `apps/api`

Responsibilities:

- authentication and users
- channel accounts
- Avito OAuth and messenger adapter
- Telegram adapter
- unified conversations
- messages
- knowledge base
- AI reply suggestions
- automation rules
- audit log

### Web App

Location: `apps/web`

Responsibilities:

- CRM inbox
- conversation view
- reply composer
- connected accounts
- knowledge base management
- automation settings

### Shared Package

Location: `packages/shared`

Responsibilities:

- shared channel types
- conversation DTOs
- message DTOs
- constants shared between API and web

### Infrastructure

Location: `infra`

Responsibilities:

- Docker Compose templates
- environment examples
- local service definitions
- future reverse proxy configuration

## Channel Rule

Every inbound or outbound message must belong to exactly one channel account. This prevents replies from being sent from the wrong Avito or Telegram profile.

## AI Rule

AI should first operate in draft mode. Automatic replies should be enabled only after confidence rules, restricted topics, and audit logging are implemented.
