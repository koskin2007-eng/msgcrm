# MsgCRM — Changelog

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
