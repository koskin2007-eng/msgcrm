import { IsBoolean } from "class-validator";

export class UpdateIntegrationAccountDto {
  @IsBoolean()
  isActive!: boolean;
}
