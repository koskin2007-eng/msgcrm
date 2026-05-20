import {
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from "class-validator";

export class CreateAgentDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  role!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(120)
  tone!: string;

  @IsString()
  @MinLength(10)
  @MaxLength(12000)
  instructions!: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  restrictions?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  handoffRules?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
