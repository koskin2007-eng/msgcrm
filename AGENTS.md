# AGENTS.md

## Project

This repository contains the MsgCRM project.

MsgCRM is a CRM/inbox system for sellers. It collects messages from Avito and future channels such as Drom, Yula, VK, Telegram and delivery services into one workspace.

## Required reading

Before making product, UI, architecture, data model, or routing decisions, read:

- docs/MsgCRM_Project_Prompt.md
- docs/Decisions.md
- docs/Roadmap.md

## Product rules

1. MsgCRM must separate two account types:
   - MsgCRM user account: user login, company/workspace, team, roles.
   - Connected external accounts: Avito, Drom, Yula, VK, Telegram and other services.

2. Each company/workspace must only see its own data.

3. MVP priority:
   - login/register;
   - company/workspace logic;
   - team page;
   - integrations page;
   - inbox;
   - conversations;
   - quick replies;
   - deals;
   - listings;
   - delivery mock;
   - settings.

4. Do not build these in the first MVP:
   - real Avito API integration;
   - real backend authorization;
   - payments;
   - complex analytics;
   - warehouse accounting;
   - telephony;
   - mobile app;
   - real delivery API;
   - complex permission system.

## Development rules

When changing UI, pages, components, mock data, product behavior, or data models:

1. Update code.
2. Update docs/MsgCRM_Project_Prompt.md if the core product behavior changes.
3. Add a short note to docs/Changelog.md.
4. Add a decision to docs/Decisions.md if the change affects architecture, product logic, naming, or MVP scope.

## Interface rules

Use a clean SaaS desktop-first interface.

Base colors:

- Dark primary: #0F172A
- Blue accent: #2563EB
- Green success: #22C55E
- Orange new/warning: #F97316
- Page background: #F8FAFC
- Cards: #FFFFFF
- Borders: #E2E8F0
- Main text: #111827
- Secondary text: #64748B

The main `/inbox` screen should use a three-column layout:

1. Sidebar with menu and channels.
2. Conversation list.
3. Chat area with listing/customer/delivery panels.

## Coding style

Prefer:

- Next.js
- React
- TypeScript
- Tailwind CSS
- component-based structure
- mock data separated from components
- clear naming
- simple MVP logic before complex abstractions

If the repository uses a different stack, adapt to the existing structure.
