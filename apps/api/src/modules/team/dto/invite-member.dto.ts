import { IsEmail, IsIn, IsString, MinLength } from "class-validator";

export class InviteMemberDto {
  @IsString()
  @MinLength(2)
  displayName!: string;

  @IsEmail()
  email!: string;

  @IsIn(["admin", "manager", "viewer"])
  role!: "admin" | "manager" | "viewer";
}
