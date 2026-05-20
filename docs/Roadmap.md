# MsgCRM — Roadmap

## Current Strategic Focus — Telegram AI Agents MVP

Goal:

Turn MsgCRM into a control panel for Telegram AI agents while preserving the existing login, company/workspace, team, roles, profile, integrations, inbox, and knowledge-base foundation.

Features:

- `/agents` page;
- create/edit AI agent;
- agent role, tone, instructions, restrictions, and handoff rules;
- `/knowledge` page using the existing `KnowledgeDocument` / `KnowledgeChunk` model;
- Telegram bot integration;
- Telegram webhook endpoint;
- incoming Telegram messages;
- OpenAI suggested replies;
- approval mode by default;
- optional auto-reply mode later.

Expected result:

A business can create an AI agent, upload knowledge, connect a Telegram bot, receive Telegram conversations, and approve AI-prepared replies from MsgCRM.

---

## Stage 1 — UI MVP

Goal:

Create a clickable frontend prototype with mock data.

Pages:

- `/login`
- `/register`
- `/inbox`
- `/deals`
- `/listings`
- `/templates`
- `/integrations`
- `/team`
- `/accept-invite`
- `/delivery`
- `/profile`
- `/settings`

Core UI:

- sidebar;
- top bar;
- conversation list;
- chat window;
- listing card;
- customer card;
- delivery card;
- quick replies;
- deals table;
- integrations cards;
- team table.

Expected result:

A working prototype that visually explains the product.

---

## Stage 2 — Data model and backend skeleton

Goal:

Prepare backend structure.

Entities:

- User;
- Company / Workspace;
- TeamMember;
- ConnectedAccount;
- Listing;
- Conversation;
- Message;
- Deal;
- QuickReplyTemplate;
- DeliveryOption.

Current backend-backed MVP pieces:

- authentication/session;
- team members and invitations;
- role-based permissions;
- integration accounts via `ChannelAccount`;
- inbox conversations/messages skeleton.

Expected result:

Frontend mock data can be replaced with API data later.

---

## Stage 3 — Authentication and workspace separation

Goal:

Add real registration, login, company creation, and workspace data isolation.

Features:

- register user;
- create company/workspace;
- login/logout;
- login by email and password;
- registration phone field;
- personal data page for user name, phone, email, and company name;
- password recovery by email reset link;
- future password recovery by phone/SMS code after phone verification is implemented;
- roles;
- MVP role-based page and action permissions;
- database-backed team members;
- MVP team invitations;
- invitation acceptance and employee password setup;
- database-backed integrations page for workspace channel accounts;
- workspace-specific data.

---

## Stage 4 — First real external integration

Goal:

Connect the first external source.

Most likely first integration:

- Avito messages.

Expected result:

Messages from one external account appear inside MsgCRM inbox.

---

## Stage 5 — Reply from MsgCRM

Goal:

Allow users to answer external messages from MsgCRM.

Expected result:

A user replies inside MsgCRM, and the answer goes back to the original external platform conversation.

---

## Stage 6 — Quick replies and automation

Goal:

Speed up seller responses.

Features:

- quick reply templates;
- suggested answers;
- auto-fill customer questions;
- simple rules.

---

## Stage 7 — Delivery and deal workflow

Goal:

Turn conversations into deals.

Features:

- ask customer for phone and pickup point;
- calculate delivery mock/real API;
- create deal;
- track status;
- prepare shipping info.

---

## Stage 8 — Additional channels

Goal:

Expand beyond Avito.

Future channels:

- Drom;
- Yula;
- VK;
- Telegram;
- CDEK;
- Ozon Delivery.
