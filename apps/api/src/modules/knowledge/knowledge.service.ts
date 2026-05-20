import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import type { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service.js";
import type { CreateKnowledgeDocumentDto } from "./dto/create-knowledge-document.dto.js";
import type { UpdateKnowledgeDocumentDto } from "./dto/update-knowledge-document.dto.js";

const documentInclude = {
  chunks: {
    select: {
      id: true
    }
  },
  agentLinks: {
    select: {
      agentId: true
    }
  }
} satisfies Prisma.KnowledgeDocumentInclude;

type DocumentWithRelations = Prisma.KnowledgeDocumentGetPayload<{
  include: typeof documentInclude;
}>;

@Injectable()
export class KnowledgeService {
  constructor(private readonly prisma: PrismaService) {}

  async listDocuments(companyId: string) {
    const documents = await this.prisma.knowledgeDocument.findMany({
      where: { companyId },
      include: documentInclude,
      orderBy: { updatedAt: "desc" }
    });

    return documents.map((document) => this.toResponse(document));
  }

  async getDocument(companyId: string, id: string) {
    const document = await this.prisma.knowledgeDocument.findFirst({
      where: { id, companyId },
      include: documentInclude
    });

    if (!document) {
      throw new NotFoundException("Knowledge document not found");
    }

    return this.toResponse(document);
  }

  async createDocument(companyId: string, dto: CreateKnowledgeDocumentDto) {
    const title = dto.title.trim();
    const body = dto.body.trim();
    const source = dto.source?.trim() || "manual";

    if (!title || !body) {
      throw new BadRequestException("Knowledge document title and body are required");
    }

    const document = await this.prisma.knowledgeDocument.create({
      data: {
        companyId,
        title,
        source,
        body,
        chunks: {
          create: {
            content: body
          }
        }
      },
      include: documentInclude
    });

    return this.toResponse(document);
  }

  async updateDocument(
    companyId: string,
    id: string,
    dto: UpdateKnowledgeDocumentDto
  ) {
    await this.ensureDocument(companyId, id);

    const data: Prisma.KnowledgeDocumentUpdateInput = {};
    const body = dto.body?.trim();

    if (dto.title !== undefined) {
      data.title = dto.title.trim();
    }

    if (dto.source !== undefined) {
      data.source = dto.source.trim() || null;
    }

    if (body !== undefined) {
      data.body = body;
    }

    if (data.title === "" || data.body === "") {
      throw new BadRequestException("Knowledge document title and body are required");
    }

    const document = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.knowledgeDocument.update({
        where: { id },
        data,
        include: documentInclude
      });

      if (body !== undefined) {
        await tx.knowledgeChunk.deleteMany({ where: { documentId: id } });
        await tx.knowledgeChunk.create({
          data: {
            documentId: id,
            content: body
          }
        });
      }

      return tx.knowledgeDocument.findUniqueOrThrow({
        where: { id: updated.id },
        include: documentInclude
      });
    });

    return this.toResponse(document);
  }

  async deleteDocument(companyId: string, id: string) {
    await this.ensureDocument(companyId, id);

    await this.prisma.$transaction(async (tx) => {
      await tx.agentKnowledgeLink.deleteMany({ where: { documentId: id } });
      await tx.knowledgeChunk.deleteMany({ where: { documentId: id } });
      await tx.knowledgeDocument.delete({ where: { id } });
    });

    return { id, deleted: true };
  }

  private async ensureDocument(companyId: string, id: string) {
    const document = await this.prisma.knowledgeDocument.findFirst({
      where: { id, companyId },
      select: { id: true }
    });

    if (!document) {
      throw new NotFoundException("Knowledge document not found");
    }
  }

  private toResponse(document: DocumentWithRelations) {
    return {
      id: document.id,
      companyId: document.companyId,
      title: document.title,
      source: document.source,
      body: document.body,
      chunksCount: document.chunks.length,
      agentIds: document.agentLinks.map((link) => link.agentId),
      createdAt: document.createdAt.toISOString(),
      updatedAt: document.updatedAt.toISOString()
    };
  }
}
