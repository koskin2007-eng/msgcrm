import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import type { ChannelAccount, ChannelType } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service.js";
import type { CreateIntegrationAccountDto } from "./dto/create-integration-account.dto.js";
import type { UpdateIntegrationAccountDto } from "./dto/update-integration-account.dto.js";

type IntegrationPlatform = "avito" | "drom" | "youla" | "vk" | "telegram";
type IntegrationStatus = "connected" | "auth_error" | "disconnected" | "coming_soon";

interface IntegrationAccountResponse {
  id: string;
  companyId: string;
  platform: IntegrationPlatform;
  title: string;
  status: IntegrationStatus;
  unreadCount: number;
  description: string;
  isPlaceholder?: boolean;
}

const channelTypeByPlatform: Record<CreateIntegrationAccountDto["platform"], ChannelType> = {
  avito: "AVITO",
  telegram: "TELEGRAM"
};

const platformByChannelType: Record<ChannelType, Extract<IntegrationPlatform, "avito" | "telegram">> = {
  AVITO: "avito",
  TELEGRAM: "telegram"
};

const basePlaceholders: IntegrationAccountResponse[] = [
  {
    id: "placeholder_avito",
    companyId: "",
    platform: "avito",
    title: "Авито",
    status: "disconnected",
    unreadCount: 0,
    description: "Подключите первый профиль Авито",
    isPlaceholder: true
  },
  {
    id: "placeholder_telegram",
    companyId: "",
    platform: "telegram",
    title: "Telegram",
    status: "disconnected",
    unreadCount: 0,
    description: "Подключите Telegram-бота или клиентские чаты",
    isPlaceholder: true
  },
  {
    id: "placeholder_drom",
    companyId: "",
    platform: "drom",
    title: "Дром",
    status: "coming_soon",
    unreadCount: 0,
    description: "Интеграция запланирована"
  },
  {
    id: "placeholder_youla",
    companyId: "",
    platform: "youla",
    title: "Юла",
    status: "coming_soon",
    unreadCount: 0,
    description: "Интеграция запланирована"
  },
  {
    id: "placeholder_vk",
    companyId: "",
    platform: "vk",
    title: "VK",
    status: "coming_soon",
    unreadCount: 0,
    description: "Интеграция запланирована"
  }
];

function getAccountStatus(account: ChannelAccount): IntegrationStatus {
  if (!account.isActive) {
    return "disconnected";
  }

  if (account.tokenExpiresAt && account.tokenExpiresAt <= new Date()) {
    return "auth_error";
  }

  return "connected";
}

function getAccountDescription(account: ChannelAccount) {
  const platform = platformByChannelType[account.type];

  if (!account.isActive) {
    return "Аккаунт отключён в MsgCRM";
  }

  if (account.tokenExpiresAt && account.tokenExpiresAt <= new Date()) {
    return "Нужно обновить авторизацию";
  }

  return platform === "telegram"
    ? "Telegram-канал workspace"
    : "Внешний профиль Авито";
}

@Injectable()
export class IntegrationsService {
  constructor(private readonly prisma: PrismaService) {}

  async listAccounts(companyId: string): Promise<IntegrationAccountResponse[]> {
    const accounts = await this.prisma.channelAccount.findMany({
      where: {
        companyId
      },
      include: {
        _count: {
          select: {
            conversations: {
              where: {
                status: "NEW"
              }
            }
          }
        }
      },
      orderBy: [{ type: "asc" }, { createdAt: "asc" }]
    });

    const connected = accounts.map((account) => this.toResponse(account, companyId));
    const platformsWithAccounts = new Set(connected.map((account) => account.platform));
    const placeholders = basePlaceholders
      .filter(
        (account) =>
          account.status === "coming_soon" || !platformsWithAccounts.has(account.platform)
      )
      .map((account) => ({
        ...account,
        companyId
      }));

    return [...connected, ...placeholders];
  }

  async createAccount(companyId: string, dto: CreateIntegrationAccountDto) {
    const type = channelTypeByPlatform[dto.platform];

    if (!type) {
      throw new BadRequestException("Unsupported integration platform");
    }

    const count = await this.prisma.channelAccount.count({
      where: {
        companyId,
        type
      }
    });

    const account = await this.prisma.channelAccount.create({
      data: {
        companyId,
        type,
        displayName: dto.title?.trim() || this.getDefaultTitle(dto.platform, count + 1),
        externalId: `manual:${companyId}:${dto.platform}:${Date.now()}`,
        isActive: true
      },
      include: {
        _count: {
          select: {
            conversations: {
              where: {
                status: "NEW"
              }
            }
          }
        }
      }
    });

    return this.toResponse(account, companyId);
  }

  async updateAccount(
    companyId: string,
    accountId: string,
    dto: UpdateIntegrationAccountDto
  ) {
    const account = await this.prisma.channelAccount.findFirst({
      where: {
        id: accountId,
        companyId
      }
    });

    if (!account) {
      throw new NotFoundException("Integration account not found");
    }

    const updatedAccount = await this.prisma.channelAccount.update({
      where: {
        id: account.id
      },
      data: {
        isActive: dto.isActive
      },
      include: {
        _count: {
          select: {
            conversations: {
              where: {
                status: "NEW"
              }
            }
          }
        }
      }
    });

    return this.toResponse(updatedAccount, companyId);
  }

  private getDefaultTitle(platform: CreateIntegrationAccountDto["platform"], index: number) {
    return platform === "telegram" ? `Telegram №${index}` : `Авито №${index}`;
  }

  private toResponse(
    account: ChannelAccount & { _count: { conversations: number } },
    companyId: string
  ): IntegrationAccountResponse {
    return {
      id: account.id,
      companyId,
      platform: platformByChannelType[account.type],
      title: account.displayName,
      status: getAccountStatus(account),
      unreadCount: account._count.conversations,
      description: getAccountDescription(account)
    };
  }
}
