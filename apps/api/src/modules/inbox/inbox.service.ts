import { Injectable, NotFoundException } from "@nestjs/common";
import { MessageAuthorType, MessageDirection } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service.js";

@Injectable()
export class InboxService {
  constructor(private readonly prisma: PrismaService) {}

  async listConversations() {
    const conversations = await this.prisma.conversation.findMany({
      include: {
        channelAccount: true,
        customer: true,
        listing: true,
        assignee: true,
        messages: {
          orderBy: { sentAt: "desc" },
          take: 1
        }
      },
      orderBy: [{ lastMessageAt: "desc" }, { updatedAt: "desc" }]
    });

    return conversations.map((conversation) => {
      const lastMessage = conversation.messages[0] ?? null;

      return {
        id: conversation.id,
        status: conversation.status,
        externalId: conversation.externalId,
        channel: {
          id: conversation.channelAccount.id,
          type: conversation.channelAccount.type,
          displayName: conversation.channelAccount.displayName
        },
        customer: conversation.customer
          ? {
              id: conversation.customer.id,
              displayName: conversation.customer.displayName
            }
          : null,
        listing: conversation.listing
          ? {
              id: conversation.listing.id,
              title: conversation.listing.title,
              url: conversation.listing.url
            }
          : null,
        assignee: conversation.assignee
          ? {
              id: conversation.assignee.id,
              displayName: conversation.assignee.displayName
            }
          : null,
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              direction: lastMessage.direction,
              authorType: lastMessage.authorType,
              text: lastMessage.text,
              sentAt: lastMessage.sentAt.toISOString()
            }
          : null,
        lastMessageAt: conversation.lastMessageAt?.toISOString() ?? null,
        unreadCount: 0
      };
    });
  }

  async getConversation(id: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id },
      include: {
        channelAccount: true,
        customer: true,
        listing: true,
        assignee: true,
        messages: {
          orderBy: { sentAt: "asc" }
        }
      }
    });

    if (!conversation) {
      throw new NotFoundException("Conversation not found");
    }

    return {
      id: conversation.id,
      status: conversation.status,
      externalId: conversation.externalId,
      channel: {
        id: conversation.channelAccount.id,
        type: conversation.channelAccount.type,
        displayName: conversation.channelAccount.displayName
      },
      customer: conversation.customer
        ? {
            id: conversation.customer.id,
            displayName: conversation.customer.displayName,
            phone: conversation.customer.phone
          }
        : null,
      listing: conversation.listing
        ? {
            id: conversation.listing.id,
            title: conversation.listing.title,
            url: conversation.listing.url
          }
        : null,
      assignee: conversation.assignee
        ? {
            id: conversation.assignee.id,
            displayName: conversation.assignee.displayName
          }
        : null,
      messages: conversation.messages.map((message) => ({
        id: message.id,
        direction: message.direction,
        authorType: message.authorType,
        text: message.text,
        sentAt: message.sentAt.toISOString()
      }))
    };
  }

  async createOutboundMessage(conversationId: string, text: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId }
    });

    if (!conversation) {
      throw new NotFoundException("Conversation not found");
    }

    const sentAt = new Date();
    const message = await this.prisma.message.create({
      data: {
        conversationId,
        direction: MessageDirection.OUTBOUND,
        authorType: MessageAuthorType.MANAGER,
        text,
        sentAt
      }
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: {
        status: "OPEN",
        lastMessageAt: sentAt
      }
    });

    return {
      id: message.id,
      direction: message.direction,
      authorType: message.authorType,
      text: message.text,
      sentAt: message.sentAt.toISOString()
    };
  }
}
