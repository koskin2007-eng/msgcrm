import { IsIn, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class ConnectTelegramDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  displayName!: string;

  @IsString()
  @MinLength(20)
  @MaxLength(200)
  botToken!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  botUsername?: string;

  @IsOptional()
  @IsString()
  agentId?: string;

  @IsOptional()
  @IsIn(["approval", "manual", "auto_reply"])
  mode?: "approval" | "manual" | "auto_reply";
}
