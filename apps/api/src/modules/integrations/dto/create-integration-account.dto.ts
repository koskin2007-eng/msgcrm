import { IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateIntegrationAccountDto {
  @IsIn(["avito", "telegram"])
  platform!: "avito" | "telegram";

  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  title?: string;
}
