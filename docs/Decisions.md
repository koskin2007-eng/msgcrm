# MsgCRM — Decisions

This file stores key project decisions.

---

## 2026-05-21 — Database-backed integrations MVP

Decision:

- `/integrations` should read connected external accounts from backend `ChannelAccount` rows for the current company/workspace.
- `GET /api/integrations/accounts` returns only accounts owned by the authenticated user's company.
- `POST /api/integrations/accounts` creates MVP local placeholders for Avito and Telegram accounts without real OAuth.
- `PATCH /api/integrations/accounts/:id` enables or disables a workspace account.
- Only `OWNER` and `ADMIN` can create or update integration accounts.
- Drom, Yula, VK, and other future channels remain visible as `coming_soon` placeholders until their real models/API flows are added.
- Real Avito/Telegram access tokens must not be created, mocked with real values, logged, or committed during this MVP step.

Reason:

The CRM needs workspace-owned integration records before real OAuth and message sync are connected. A database-backed placeholder flow lets us validate permissions, workspace isolation, and UI behavior without handling production platform credentials yet.

---

## 2026-05-20 — Project name and domain

Decision:

- Public project name: **MsgCRM**
- Domain: **msgcrm.ru**
- Working/internal concept name: **Avito Ответ**

Reason:

The product should not depend on the Avito brand name. MsgCRM is shorter, neutral, and can grow beyond Avito into Drom, Yula, VK, Telegram, delivery services, and other channels.

---

## 2026-05-20 — Product direction

Decision:

MsgCRM starts as a separate CRM/inbox system, not as an add-on to an existing CRM.

Reason:

The first product pain is simple: sellers need one window for messages from several selling accounts. A separate interface gives more freedom and can later integrate with other CRMs if needed.

---

## 2026-05-20 — MVP scope

Decision:

The first MVP should focus on:

- login/register mock;
- company/workspace model;
- team model;
- integrations mock;
- inbox;
- conversations;
- quick replies;
- listings;
- deals;
- delivery calculation mock;
- settings.

Do not build real integrations in the first UI MVP.

Reason:

The product must first clearly demonstrate the workflow before connecting real APIs.

---

## 2026-05-20 — Account model

Decision:

The system must clearly separate:

1. MsgCRM user accounts.
2. Connected external platform accounts.

Reason:

A customer logs into MsgCRM and works inside a company/workspace. Inside that workspace, they connect external Avito/Drom/VK/Telegram accounts.

---

## 2026-05-20 — Page naming

Decision:

Use **Integrations** instead of **Accounts** for connected external services.

Reason:

The word “Accounts” can confuse user accounts and connected Avito/Drom/VK accounts.

---

## 2026-05-20 — Authentication fields and password recovery

Decision:

MsgCRM now supports login by email and password. Future registration/profile fields should include:

- phone number;
- user name;
- email;
- password;
- company name.

Phone number is required for future Avito-related workflows and account/contact operations.

Password recovery should be implemented through email first:

1. User clicks “Forgot password?” on the login page.
2. User enters email.
3. System creates a one-time password reset token with expiration time.
4. System sends a reset link to the user email.
5. User opens the link and sets a new password.
6. System invalidates the reset token and old active sessions if needed.

Later, after phone verification is implemented, password recovery can additionally support phone/SMS code recovery.

Reason:

Email/password is enough for the first working authentication flow. Phone should be added next because Avito workflows may require phone identity, contact confirmation, or seller account operations.

---

## 2026-05-20 — Profile and phone implementation

Decision:

- `User.phone` is stored in Prisma as nullable `String?`.
- Registration requires a phone value in the UI/API, but the database field remains nullable to avoid breaking existing users.
- `/auth/me` returns the current user's phone together with user and company data.
- Profile updates use `PATCH /api/auth/profile` and update only the authenticated user's record and their own company/workspace.
- The repository must contain only placeholders or mock-safe values, not real profile data.

Reason:

Phone is needed for seller workflows, but existing registered users may not have a phone yet. Keeping the column nullable makes the migration safer while the UI can still require the value for new registrations.

---

## 2026-05-20 — Team invitations MVP

Decision:

- Team members are real `User` records filtered by the authenticated user's `companyId`.
- `/team` should read members from `GET /api/team/members`.
- MVP invitations use `POST /api/team/invitations` and create an inactive user inside the same workspace.
- Only `OWNER` and `ADMIN` roles can create invitations.
- Invited users receive an invite link in the UI and activate their account through `/accept-invite`.
- The MVP invite form allows `admin`, `manager`, and `viewer`, but not another `owner`.

Reason:

This gives the CRM a real company/team boundary without building a full permission system or email delivery before the product workflow is ready.

---

## 2026-05-20 — Invitation token security

Decision:

- Invitation links use random one-time tokens.
- The database stores only `inviteTokenHash`, never the raw invite token.
- Invitation links expire after 7 days.
- Accepting an invitation sets the employee password, activates the user, clears the invite token hash, and records `acceptedAt`.
- Public invitation endpoints return only the data needed to show the accept screen: employee name, email, role, company name, and expiration time.
- Email delivery is still outside the MVP; the owner/admin manually copies the generated invitation link.

Reason:

Team onboarding needs to be usable before email sending is connected, but invite secrets must not be stored in source files, logs, docs, or the database in raw form.

---

## 2026-05-20 — MVP role permissions

Decision:

MsgCRM now uses a simple MVP permission matrix:

- `owner` and `admin` can manage workspace-level areas: settings, integrations, and team invitations.
- `manager` can work with sales operations: inbox replies, quick replies, deals, listings, and delivery calculation.
- `viewer` can open workspace data in read-only mode but cannot send replies, create deals, edit templates, calculate delivery, manage integrations, or invite employees.
- Every authenticated user can open and edit their own personal profile.
- Backend role checks are added for outbound inbox messages and team invitations; UI controls are disabled or hidden to match those rules.

Reason:

The product needs real safety boundaries before external channels and customer data grow, but the first MVP should stay simple and avoid a complex permission system.

---

## 2026-05-20 — Personal data storage rule

Decision:

Registered users, companies, sessions, phones, emails, password hashes, Avito tokens, customer contacts, and other personal or sensitive data must be stored only in the application database or protected infrastructure.

They must not be committed to GitHub.

GitHub repository may contain only:

- application code;
- database schema;
- migrations;
- documentation;
- mock data without real personal data;
- `.env.example` files without real secrets.

GitHub repository must not contain:

- real user lists;
- real emails;
- real phone numbers;
- real passwords;
- password hashes from production;
- session tokens;
- Avito access/refresh tokens;
- database dumps;
- `.env` files with real credentials;
- backups with personal data.

Reason:

User registration data is personal data. It must remain inside the database and protected runtime environment, not in the public source repository.
