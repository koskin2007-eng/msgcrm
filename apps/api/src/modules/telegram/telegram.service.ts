import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { MessageAuthorType, MessageDirection, TelegramBotStatus } from "@prisma/client";
import { randomBytes } from "node:crypto";
import { PrismaService } from "../prisma/prisma.service.js";
import type { ConnectTelegramDto } from "./dto/connect-telegram.dto.js";
import type { UpdateTelegramIntegrationDto } from "./dto/update-telegram-integration.dto.js";
import { AiReplyService } from "./ai-reply.service.js";
import { SecretEncryptionService } from "./secret-encryption.service.js";

interface TelegramWebhookUpdate {
  update_id?: number;
  message?: {
    message_id: number;
    text?: string;
    date?: number;
    chat: {
      id: number | string;
      username?: string;
      first_name?: string;
      last_name?: string;
    };
    from?: {
      id: number | string;
      username?: string;
      first_name?: string;
      last_name?: string;
    };
  };
}

interface TelegramApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
}

interface TelegramMe {
  id: number;
  username?: string;
  first_name?: string;
}

type TelegramMode = "approval" | "manual" | "auto_reply";

@Injectable()
export class TelegramService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiReplyService: AiReplyService,
    private readonly encryption: SecretEncryptionService
  ) {}

  async listIntegrations(companyId: string) {
    const integrations = await this.prisma.telegramBotIntegration.findMany({
      where: { companyId },
      include: {
        agent: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: "asc" }
    });

    return integrations.map((integration) => this.toResponse(integration));
  }

  async connectIntegration(companyId: string, dto: ConnectTelegramDto) {
    await this.ensureAgentBelongsToCompany(companyId, dto.agentId);

    const mode = dto.mode ?? "approval";
    const integration = await this.prisma.telegramBotIntegration.create({
      data: {
        companyId,
        agentId: dto.agentId || null,
        displayName: dto.displayName.trim(),
        botUsername: dto.botUsername?.trim() || null,
        botTokenEncrypted: this.encryption.encrypt(dto.botToken.trim()),
        webhookSecret: randomBytes(32).toString("base64url"),
        ...this.modeToFlags(mode),
        status: TelegramBotStatus.DISCONNECTED
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return this.toResponse(integration);
  }

  async updateIntegration(
    companyId: string,
    id: string,
    dto: UpdateTelegramIntegrationDto
  ) {
    const integration = await this.findIntegration(companyId, id);
    await this.ensureAgentBelongsToCompany(companyId, dto.agentId);

    const data = {
      ...(dto.displayName !== undefined ? { displayName: dto.displayName.trim() } : {}),
      ...(dto.botUsername !== undefined
        ? { botUsername: dto.botUsername.trim() || null }
        : {}),
      ...(dto.botToken !== undefined
        ? { botTokenEncrypted: this.encryption.encrypt(dto.botToken.trim()) }
        : {}),
      ...(dto.agentId !== undefined ? { agentId: dto.agentId || null } : {}),
      ...(dto.mode ? this.modeToFlags(dto.mode) : {}),
      ...(dto.isActive === false
        ? { status: TelegramBotStatus.DISCONNECTED }
        : integration.status === TelegramBotStatus.DISCONNECTED && dto.isActive === true
          ? { status: TelegramBotStatus.CONNECTED }
          : {})
    };

    const updated = await this.prisma.telegramBotIntegration.update({
      where: { id: integration.id },
      data,
      include: {
        agent: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return this.toResponse(updated);
  }

  async checkIntegration(companyId: string, id: string) {
    const integration = await this.findIntegration(companyId, id);

    if (!integration.botTokenEncrypted) {
      throw new BadRequestException("Telegram bot token is not stored");
    }

    const token = this.encryption.decrypt(integration.botTokenEncrypted);
    const me = await this.callTelegram<TelegramMe>(token, "getMe");
    const webhookUrl = this.buildWebhookUrl(integration.webhookSecret);

    if (webhookUrl) {
      await this.callTelegram(token, "setWebhook", {
        url: webhookUrl,
        secret_token: integration.webhookSecret
      });
    }

    const updated = await this.prisma.telegramBotIntegration.update({
      where: { id: integration.id },
      data: {
        botUsername: me.username ?? integration.botUsername,
        status: TelegramBotStatus.CONNECTED
      },
      include: {
        agent: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return {
      ...this.toResponse(updated),
      webhookUrl,
      bot: {
        id: me.id,
        username: me.username ?? null,
        firstName: me.first_name ?? null
      }
    };
  }

  async handleWebhook(
    webhookSecret: string,
    secretToken: string | undefined,
    update: TelegramWebhookUpdate
  ) {
    if (secretToken && secretToken !== webhookSecret) {
      throw new UnauthorizedException("Invalid Telegram webhook secret");
    }

    const integration = await this.prisma.telegramBotIntegration.findUnique({
      where: { webhookSecret },
      include: {
        agent: true,
        company: true
      }
    });

    if (!integration || integration.status === TelegramBotStatus.DISCONNECTED) {
      throw new NotFoundException("Telegram integration not found");
    }

    const message = update.message;
    const text = message?.text?.trim();

    if (!message || !text) {
      return { ok: true, skipped: true };
    }

    const channelAccount = await this.prisma.channelAccount.upsert({
      where: {
        type_externalId: {
          type: "TELEGRAM",
          externalId: `telegram-bot:${integration.id}`
        }
      },
      create: {
        companyId: integration.companyId,
        type: "TELEGRAM",
        displayName: integration.displayName,
        externalId: `telegram-bot:${integration.id}`,
        isActive: true
      },
      update: {
        companyId: integration.companyId,
        displayName: integration.displayName,
        isActive: true
      }
    });

    const customerExternalId = `telegram:${message.from?.id ?? message.chat.id}`;
    const customerDisplayName = this.getTelegramDisplayName(message.from ?? message.chat);
    const customer = await this.prisma.customer.upsert({
      where: {
        id: await this.resolveCustomerId(integration.companyId, customerExternalId)
      },
      create: {
        companyId: integration.companyId,
        externalId: customerExternalId,
        displayName: customerDisplayName
      },
      update: {
        displayName: customerDisplayName
      }
    });

    const sentAt = message.date
      ? new Date(message.date * 1000)
      : new Date();
    const conversation = await this.prisma.conversation.upsert({
      where: {
        channelAccountId_externalId: {
          channelAccountId: channelAccount.id,
          externalId: `telegram-chat:${message.chat.id}`
        }
      },
      create: {
        companyId: integration.companyId,
        channelAccountId: channelAccount.id,
        customerId: customer.id,
        externalId: `telegram-chat:${message.chat.id}`,
        status: "NEW",
        lastMessageAt: sentAt
      },
      update: {
        companyId: integration.companyId,
        customerId: customer.id,
        status: "NEW",
        lastMessageAt: sentAt
      }
    });

    const inboundMessage = await this.prisma.message.upsert({
      where: {
        conversationId_externalId: {
          conversationId: conversation.id,
          externalId: `telegram:${message.message_id}`
        }
      },
      create: {
        conversationId: conversation.id,
        externalId: `telegram:${message.message_id}`,
        direction: MessageDirection.INBOUND,
        authorType: MessageAuthorType.CUSTOMER,
        text,
        sentAt
      },
      update: {
        text,
        sentAt
      }
    });

    const suggestedReply = await this.aiReplyService.generateSuggestedReply({
      companyId: integration.companyId,
      conversationId: conversation.id,
      messageId: inboundMessage.id,
      agentId: integration.agentId,
      customerMessage: text
    });

    await this.prisma.telegramBotIntegration.update({
      where: { id: integration.id },
      data: { lastWebhookAt: new Date() }
    });

    return {
      ok: true,
      conversationId: conversation.id,
      messageId: inboundMessage.id,
      suggestedReplyId: suggestedReply.id
    };
  }

  private async findIntegration(companyId: string, id: string) {
    const integration = await this.prisma.telegramBotIntegration.findFirst({
      where: { id, companyId },
      include: {
        agent: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!integration) {
      throw new NotFoundException("Telegram integration not found");
    }

    return integration;
  }

  private async ensureAgentBelongsToCompany(companyId: string, agentId?: string) {
    if (!agentId) {
      return;
    }

    const agent = await this.prisma.agent.findFirst({
      where: { id: agentId, companyId },
      select: { id: true }
    });

    if (!agent) {
      throw new BadRequestException("Selected agent does not belong to this company");
    }
  }

  private async resolveCustomerId(companyId: string, externalId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { companyId, externalId },
      select: { id: true }
    });

    return customer?.id ?? randomBytes(16).toString("hex");
  }

  private getTelegramDisplayName(user: {
    username?: string;
    first_name?: string;
    last_name?: string;
  }) {
    const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ");

    return fullName || (user.username ? `@${user.username}` : "Telegram клиент");
  }

  private modeToFlags(mode: TelegramMode) {
    return {
      autoReplyEnabled: mode === "auto_reply",
      approvalRequired: mode !== "auto_reply" && mode !== "manual"
    };
  }

  private getMode(integration: {
    autoReplyEnabled: boolean;
    approvalRequired: boolean;
  }): TelegramMode {
    if (integration.autoReplyEnabled) {
      return "auto_reply";
    }

    return integration.approvalRequired ? "approval" : "manual";
  }

  private buildWebhookUrl(webhookSecret: string) {
    const baseUrl =
      process.env.TELEGRAM_WEBHOOK_BASE_URL ?? process.env.PUBLIC_API_URL;

    if (!baseUrl) {
      return null;
    }

    return `${baseUrl.replace(/\/+$/, "")}/api/telegram/webhook/${webhookSecret}`;
  }

  private async callTelegram<T>(
    token: string,
    method: string,
    payload?: Record<string, unknown>
  ) {
    const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: payload ? JSON.stringify(payload) : undefined
    });
    const body = (await response.json()) as TelegramApiResponse<T>;

    if (!response.ok || !body.ok || body.result === undefined) {
      throw new BadRequestException(
        body.description ?? "Telegram API request failed"
      );
    }

    return body.result;
  }

  private toResponse(integration: {
    id: string;
    companyId: string;
    agentId: string | null;
    displayName: string;
    botUsername: string | null;
    webhookSecret: string;
    status: TelegramBotStatus;
    autoReplyEnabled: boolean;
    approvalRequired: boolean;
    lastWebhookAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    agent?: {
      id: string;
      name: string;
    } | null;
  }) {
    return {
      id: integration.id,
      companyId: integration.companyId,
      agentId: integration.agentId,
      displayName: integration.displayName,
      botUsername: integration.botUsername,
      webhookUrl: this.buildWebhookUrl(integration.webhookSecret),
      status: integration.status,
      mode: this.getMode(integration),
      approvalRequired: integration.approvalRequired,
      autoReplyEnabled: integration.autoReplyEnabled,
      lastWebhookAt: integration.lastWebhookAt?.toISOString() ?? null,
      agent: integration.agent
        ? {
            id: integration.agent.id,
            name: integration.agent.name
          }
        : null,
      createdAt: integration.createdAt.toISOString(),
      updatedAt: integration.updatedAt.toISOString()
    };
  }
}
