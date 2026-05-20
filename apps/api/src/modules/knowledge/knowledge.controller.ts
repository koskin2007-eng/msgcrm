import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from "@nestjs/common";
import type { AuthenticatedUser } from "../auth/auth.types.js";
import { CurrentUser } from "../auth/decorators/current-user.decorator.js";
import { Roles } from "../auth/decorators/roles.decorator.js";
import { AuthGuard } from "../auth/guards/auth.guard.js";
import { RoleGuard } from "../auth/guards/role.guard.js";
import { CreateKnowledgeDocumentDto } from "./dto/create-knowledge-document.dto.js";
import { UpdateKnowledgeDocumentDto } from "./dto/update-knowledge-document.dto.js";
import { KnowledgeService } from "./knowledge.service.js";

@Controller("knowledge")
@UseGuards(AuthGuard)
export class KnowledgeController {
  constructor(private readonly knowledgeService: KnowledgeService) {}

  @Get("documents")
  listDocuments(@CurrentUser() user: AuthenticatedUser) {
    return this.knowledgeService.listDocuments(user.companyId);
  }

  @Post("documents")
  @Roles("OWNER", "ADMIN")
  @UseGuards(RoleGuard)
  createDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: CreateKnowledgeDocumentDto
  ) {
    return this.knowledgeService.createDocument(user.companyId, body);
  }

  @Get("documents/:id")
  getDocument(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.knowledgeService.getDocument(user.companyId, id);
  }

  @Patch("documents/:id")
  @Roles("OWNER", "ADMIN")
  @UseGuards(RoleGuard)
  updateDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() body: UpdateKnowledgeDocumentDto
  ) {
    return this.knowledgeService.updateDocument(user.companyId, id, body);
  }

  @Delete("documents/:id")
  @Roles("OWNER", "ADMIN")
  @UseGuards(RoleGuard)
  deleteDocument(@CurrentUser() user: AuthenticatedUser, @Param("id") id: string) {
    return this.knowledgeService.deleteDocument(user.companyId, id);
  }
}
