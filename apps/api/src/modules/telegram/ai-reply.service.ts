import { Injectable } from "@nestjs/common";
import type { Agent, KnowledgeDocument, Message } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service.js";

interface GenerateReplyInput {
  companyId: string;
  conversationId: string;
  messageId: string;
  agentId?: string | null;
  customerMessage: string;
}

interface OpenAiResponseBody {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
}

@Injectable()
export class AiReplyService {
  constructor(private readonly prisma: PrismaService) {}

  async generateSuggestedReply(input: GenerateReplyInput) {
    const [agent, knowledgeDocuments, recentMessages] = await Promise.all([
      this.resolveAgent(input.companyId, input.agentId),
      this.prisma.knowledgeDocument.findMany({
        where: { companyId: input.companyId },
        orderBy: { updatedAt: "desc" },
        take: 5
      }),
      this.prisma.message.findMany({
        where: { conversationId: input.conversationId },
        orderBy: { sentAt: "desc" },
        take: 8
      })
    ]);

    const text = process.env.OPENAI_API_KEY
      ? await this.generateOpenAiReply({
          agent,
          knowledgeDocuments,
          recentMessages: recentMessages.reverse(),
          customerMessage: input.customerMessage
        })
      : this.generateMockReply(agent, input.customerMessage);

    const suggestedReply = await this.prisma.suggestedReply.create({
      data: {
        companyId: input.companyId,
        conversationId: input.conversationId,
        messageId: input.messageId,
        agentId: agent?.id,
        text,
        status: "DRAFT"
      }
    });

    return {
      id: suggestedReply.id,
      companyId: suggestedReply.companyId,
      conversationId: suggestedReply.conversationId,
      messageId: suggestedReply.messageId,
      agentId: suggestedReply.agentId,
      text: suggestedReply.text,
      status: suggestedReply.status,
      createdAt: suggestedReply.createdAt.toISOString(),
      updatedAt: suggestedReply.updatedAt.toISOString()
    };
  }

  private async resolveAgent(companyId: string, agentId?: string | null) {
    if (agentId) {
      return this.prisma.agent.findFirst({
        where: { id: agentId, companyId, isActive: true }
      });
    }

    return this.prisma.agent.findFirst({
      where: { companyId, isActive: true },
      orderBy: { createdAt: "asc" }
    });
  }

  private generateMockReply(agent: Agent | null, customerMessage: string) {
    const agentName = agent?.name ?? "AI-агент";

    return `${agentName}: подготовлен черновик ответа на вопрос клиента "${customerMessage}". Проверьте детали по базе знаний и отправьте после подтверждения.`;
  }

  private async generateOpenAiReply(input: {
    agent: Agent | null;
    knowledgeDocuments: KnowledgeDocument[];
    recentMessages: Message[];
    customerMessage: string;
  }) {
    const prompt = this.buildPrompt(input);
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-5.2",
        input: prompt
      })
    });

    if (!response.ok) {
      return this.generateMockReply(input.agent, input.customerMessage);
    }

    const body = (await response.json()) as OpenAiResponseBody;
    const outputText =
      body.output_text ??
      body.output
        ?.flatMap((item) => item.content ?? [])
        .filter((content) => content.type === "output_text" && content.text)
        .map((content) => content.text)
        .join("\n")
        .trim();

    return outputText || this.generateMockReply(input.agent, input.customerMessage);
  }

  private buildPrompt(input: {
    agent: Agent | null;
    knowledgeDocuments: KnowledgeDocument[];
    recentMessages: Message[];
    customerMessage: string;
  }) {
    const agent = input.agent;
    const knowledge = input.knowledgeDocuments
      .map((document) => `### ${document.title}\n${document.body}`)
      .join("\n\n");
    const history = input.recentMessages
      .map((message) => `${message.authorType}: ${message.text}`)
      .join("\n");

    return [
      "Ты AI-агент компании в MsgCRM. Подготовь короткий, точный ответ клиенту для Telegram.",
      "Ответ должен быть готов к отправке менеджером после проверки.",
      agent ? `Имя агента: ${agent.name}` : "Имя агента: AI-агент",
      agent ? `Роль: ${agent.role}` : "Роль: помощник поддержки и продаж",
      agent ? `Тон: ${agent.tone}` : "Тон: вежливый, деловой, понятный",
      agent?.instructions ? `Инструкция: ${agent.instructions}` : "",
      agent?.restrictions ? `Запрещено: ${agent.restrictions}` : "",
      agent?.handoffRules ? `Передать человеку если: ${agent.handoffRules}` : "",
      knowledge ? `База знаний:\n${knowledge}` : "База знаний пока не загружена.",
      history ? `История диалога:\n${history}` : "",
      `Новое сообщение клиента: ${input.customerMessage}`
    ]
      .filter(Boolean)
      .join("\n\n");
  }
}
