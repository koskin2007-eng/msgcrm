# MsgCRM — Changelog

## 2026-05-21 — Strategic pivot to Telegram AI Agents

Reoriented the current MsgCRM project without rewriting the existing foundation:

- paused Avito-first work as a future B2B integration direction;
- selected Telegram AI Agents as the next MVP direction;
- preserved existing MsgCRM auth, workspace, roles, team, profile, integrations, inbox, and knowledge-base structure;
- added server bridge architecture documentation for Telegram webhook → backend → OpenAI → suggested reply;
- added Prisma preparation for agents, Telegram bot integrations, encrypted bot tokens, and suggested replies;
- added MVP API endpoints for agents, knowledge documents, Telegram bot connection/check, and Telegram webhooks;
- added frontend pages for `/agents`, `/agents/new`, `/agents/[id]`, `/knowledge`, and `/integrations/telegram`;
- added AI suggested reply UI to `/inbox`;
- added safe placeholder environment variables for OpenAI, Telegram webhook base URL, and encryption key.

Updated files:

- README.md
- .env.example
- infra/env.production.example
- apps/api/prisma/schema.prisma
- apps/api/src/modules
- apps/web/src/app
- apps/web/src/components
- apps/web/src/lib
- packages/shared/src/index.ts
- docs/Server_Context.md
- docs/MsgCRM_Project_Prompt.md
- docs/Decisions.md
- docs/Roadmap.md

---

## 2026-05-21 — Database-backed integrations MVP

Added the first backend-backed integrations workflow:

- added `GET /api/integrations/accounts` for workspace channel accounts;
- added `POST /api/integrations/accounts` for MVP local Avito/Telegram connection placeholders;
- added `PATCH /api/integrations/accounts/:id` for enabling/disabling an account inside the current workspace;
- connected `/integrations` to backend data with mock fallback;
- kept future channels as disabled planned placeholders;
- kept real OAuth, external tokens, and platform API calls out of the MVP.

Updated files:

- apps/api/src/modules/integrations
- apps/api/src/modules/app.module.ts
- apps/web/src/app/integrations/page.tsx
- apps/web/src/components/integrations
- apps/web/src/lib/integrations-server.ts
- apps/web/src/lib/integrations-client.ts
- docs/MsgCRM_Project_Prompt.md
- docs/Decisions.md
- docs/Roadmap.md

---

## 2026-05-20 — MVP role permissions

Added first real role-based restrictions:

- added shared frontend permission helpers for `owner`, `admin`, `manager`, and `viewer`;
- hid unavailable sidebar routes by role;
- limited workspace settings to `owner` and `admin`;
- made team invitations available only to `owner` and `admin`;
- made `viewer` read-only for replies, deals, templates, integrations, and delivery actions;
- added API role guard and blocked outbound inbox messages for `viewer`;
- kept profile editing available to every authenticated user.

Updated files:

- apps/api/src/modules/auth
- apps/api/src/modules/inbox/inbox.controller.ts
- apps/api/src/modules/team/team.controller.ts
- apps/web/src/lib/permissions.ts
- apps/web/src/components/layout
- apps/web/src/app/inbox
- apps/web/src/app/deals
- apps/web/src/app/templates
- apps/web/src/app/integrations
- apps/web/src/app/delivery
- apps/web/src/app/team
- apps/web/src/app/settings
- docs/MsgCRM_Project_Prompt.md
- docs/Decisions.md
- docs/Roadmap.md

---

## 2026-05-20 — Team invitation acceptance

Added the first invitation acceptance flow for company teams:

- added hashed invitation tokens and expiration fields to `User`;
- added public invitation preview and accept endpoints;
- added `/accept-invite` page where invited employees set their password;
- updated `/team` invite form to show a one-time invitation link after creating an invitation;
- kept invitation tokens and real employee data out of mock files, docs, and GitHub.

Updated files:

- apps/api/prisma/schema.prisma
- apps/api/src/modules/team
- apps/api/src/modules/auth/auth.module.ts
- apps/web/src/app/accept-invite
- apps/web/src/components/auth/AcceptInviteForm.tsx
- apps/web/src/components/team/InviteTeamMemberForm.tsx
- apps/web/src/lib/team-client.ts
- docs/MsgCRM_Project_Prompt.md
- docs/Decisions.md
- docs/Roadmap.md

---

## 2026-05-20 — Team API and workspace invitations

Added the first database-backed team workflow:

- added `GET /api/team/members` for members inside the current workspace;
- added `POST /api/team/invitations` for MVP employee invitations;
- connected `/team` to backend data instead of mock team data;
- added invite form for name, email, and role;
- invited users are stored as inactive users in the company workspace until email invitation flow is implemented.

Updated files:

- apps/api/src/modules/team
- apps/api/src/modules/app.module.ts
- apps/web/src/app/team/page.tsx
- apps/web/src/components/team
- docs/MsgCRM_Project_Prompt.md
- docs/Decisions.md
- docs/Roadmap.md

---

## 2026-05-20 — Profile phone and personal data page

Added user profile updates for the current authentication flow:

- added phone field to registration;
- added `/profile` page “Личные данные”;
- added editing for user name, phone, email, and company name;
- profile data is stored through the database-backed auth API, not mock data or docs.

Updated files:

- apps/api/prisma/schema.prisma
- apps/api/src/modules/auth
- apps/web/src/app/profile
- apps/web/src/components/auth/RegisterForm.tsx
- docs/MsgCRM_Project_Prompt.md
- docs/Decisions.md
- docs/Roadmap.md

---

## 2026-05-20 — Authentication notes added

Added project notes for the current authentication direction:

- login by email and password is now implemented;
- future registration/profile fields should include phone number, user name, email, password, and company name;
- phone number is needed for future Avito workflows;
- password recovery should start with email reset link flow;
- future recovery by phone/SMS can be added after phone verification.

Updated files:

- docs/Decisions.md
- docs/Roadmap.md

---

## 2026-05-19 — Project knowledge base created

Added project documentation structure:

- AGENTS.md
- docs/MsgCRM_Project_Prompt.md
- docs/Decisions.md
- docs/Roadmap.md
- docs/Changelog.md

Purpose:

Create one shared project knowledge base for Codex, development work, and product decisions.
