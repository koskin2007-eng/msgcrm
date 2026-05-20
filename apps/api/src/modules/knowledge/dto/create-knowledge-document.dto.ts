import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from "class-validator";

export class CreateKnowledgeDocumentDto {
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  source?: string;

  @IsString()
  @MinLength(10)
  @MaxLength(50000)
  body!: string;
}
