import {
  BadRequestException,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service.js";
import type { CreateAgentDto } from "./dto/create-agent.dto.js";
import type { UpdateAgentDto } from "./dto/update-agent.dto.js";

const agentInclude = {
  telegramBotIntegrations: {
    select: {
      id: true,
      displayName: true,
      botUsername: true,
      status: true,
      approvalRequired: true,
      autoReplyEnabled: true
    }
  },
  knowledgeLinks: {
    select: {
      documentId: true
    }
  }
} satisfies Prisma.AgentInclude;

type AgentWithRelations = Prisma.AgentGetPayload<{ include: typeof agentInclude }>;
type NormalizedAgentData = {
  name?: string;
  role?: string;
  tone?: string;
  instructions?: string;
  restrictions?: string | null;
  handoffRules?: string | null;
};

@Injectable()
export class AgentsService {
  constructor(private readonly prisma: PrismaService) {}

  async listAgents(companyId: string) {
    const agents = await this.prisma.agent.findMany({
      where: { companyId },
      include: agentInclude,
      orderBy: [{ isActive: "desc" }, { createdAt: "asc" }]
    });

    return agents.map((agent) => this.toResponse(agent));
  }

  async getAgent(companyId: string, id: string) {
    const agent = await this.prisma.agent.findFirst({
      where: { id, companyId },
      include: agentInclude
    });

    if (!agent) {
      throw new NotFoundException("Agent not found");
    }

    return this.toResponse(agent);
  }

  async createAgent(companyId: string, dto: CreateAgentDto) {
    const data = this.normalizeAgentData(dto);

    if (!data.name || !data.role || !data.tone || !data.instructions) {
      throw new BadRequestException("Agent name, role, tone and instructions are required");
    }

    const agent = await this.prisma.agent.create({
      data: {
        companyId,
        name: data.name,
        role: data.role,
        tone: data.tone,
        instructions: data.instructions,
        restrictions: data.restrictions,
        handoffRules: data.handoffRules,
        isActive: dto.isActive ?? true
      },
      include: agentInclude
    });

    return this.toResponse(agent);
  }

  async updateAgent(companyId: string, id: string, dto: UpdateAgentDto) {
    await this.ensureAgent(companyId, id);

    const agent = await this.prisma.agent.update({
      where: { id },
      data: {
        ...this.normalizeAgentData(dto, true),
        ...(typeof dto.isActive === "boolean" ? { isActive: dto.isActive } : {})
      },
      include: agentInclude
    });

    return this.toResponse(agent);
  }

  async disableAgent(companyId: string, id: string) {
    await this.ensureAgent(companyId, id);

    const agent = await this.prisma.agent.update({
      where: { id },
      data: { isActive: false },
      include: agentInclude
    });

    return this.toResponse(agent);
  }

  private async ensureAgent(companyId: string, id: string) {
    const agent = await this.prisma.agent.findFirst({
      where: { id, companyId },
      select: { id: true }
    });

    if (!agent) {
      throw new NotFoundException("Agent not found");
    }
  }

  private normalizeAgentData(dto: CreateAgentDto | UpdateAgentDto, partial = false) {
    const data: NormalizedAgentData = {};

    if (dto.name !== undefined) {
      data.name = dto.name.trim();
    }

    if (dto.role !== undefined) {
      data.role = dto.role.trim();
    }

    if (dto.tone !== undefined) {
      data.tone = dto.tone.trim();
    }

    if (dto.instructions !== undefined) {
      data.instructions = dto.instructions.trim();
    }

    if (dto.restrictions !== undefined) {
      data.restrictions = dto.restrictions.trim() || null;
    }

    if (dto.handoffRules !== undefined) {
      data.handoffRules = dto.handoffRules.trim() || null;
    }

    return data;
  }

  private toResponse(agent: AgentWithRelations) {
    const assignedBot = agent.telegramBotIntegrations[0] ?? null;

    return {
      id: agent.id,
      companyId: agent.companyId,
      name: agent.name,
      role: agent.role,
      tone: agent.tone,
      instructions: agent.instructions,
      restrictions: agent.restrictions,
      handoffRules: agent.handoffRules,
      isActive: agent.isActive,
      assignedTelegramBot: assignedBot
        ? {
            id: assignedBot.id,
            displayName: assignedBot.displayName,
            botUsername: assignedBot.botUsername,
            status: assignedBot.status
          }
        : null,
      mode: assignedBot?.autoReplyEnabled
        ? "auto_reply"
        : assignedBot?.approvalRequired === false
          ? "manual"
          : "approval",
      knowledgeDocumentIds: agent.knowledgeLinks.map((link) => link.documentId),
      createdAt: agent.createdAt.toISOString(),
      updatedAt: agent.updatedAt.toISOString()
    };
  }
}
