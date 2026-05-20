# MsgCRM — Server Context

This file describes the expected server shape for the Telegram AI Agents MVP.

## Domains

- `msgcrm.ru` — main site / Next.js frontend.
- `api.msgcrm.ru` — NestJS backend API and Telegram webhook endpoints.

## Server Responsibilities

The server should run and protect:

- Next.js frontend;
- NestJS backend API;
- PostgreSQL database with pgvector;
- Redis queue/cache;
- Nginx/Caddy/reverse proxy;
- SSL certificates;
- Telegram webhook endpoints;
- OpenAI API calls from backend only.

Telegram does not call OpenAI directly. Telegram sends webhooks to MsgCRM backend, and the backend decides which company, bot, and agent should handle the message.

## SERVER_PROFILE

Exact server values can be filled in manually when infrastructure is finalized.

- Provider: TODO
- OS: Ubuntu 22.04/24.04 or actual OS
- CPU: TODO
- RAM: TODO
- SSD: TODO
- Public IP: TODO
- SSH access: TODO
- Domain: `msgcrm.ru`
- API domain: `api.msgcrm.ru`

## Minimum Recommended MVP Configuration

- 2 vCPU
- 4 GB RAM
- 40 GB SSD
- Ubuntu
- Public IP
- HTTPS

## Production Environment Notes

Required production environment variables must be set on the server, not committed to GitHub:

- `DATABASE_URL`
- `REDIS_URL`
- `PUBLIC_WEB_URL`
- `PUBLIC_API_URL`
- `INTERNAL_API_URL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `TELEGRAM_WEBHOOK_BASE_URL`
- `ENCRYPTION_KEY`

Telegram bot tokens and OpenAI API keys must only live in protected runtime configuration or encrypted database fields.
