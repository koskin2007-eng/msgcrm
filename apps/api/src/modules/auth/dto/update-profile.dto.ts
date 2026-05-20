import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdateProfileDto {
  @IsString()
  @MinLength(2)
  displayName!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(2)
  companyName!: string;
}
