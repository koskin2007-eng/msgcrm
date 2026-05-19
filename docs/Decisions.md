# MsgCRM — Decisions

This file stores key project decisions.

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
