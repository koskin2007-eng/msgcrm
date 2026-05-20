import { BadRequestException, Injectable } from "@nestjs/common";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

const ENCRYPTION_PREFIX = "v1";

@Injectable()
export class SecretEncryptionService {
  encrypt(value: string) {
    const key = this.getKey();
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", key, iv);
    const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();

    return [
      ENCRYPTION_PREFIX,
      iv.toString("base64url"),
      tag.toString("base64url"),
      encrypted.toString("base64url")
    ].join(":");
  }

  decrypt(value: string) {
    const [prefix, ivValue, tagValue, encryptedValue] = value.split(":");

    if (
      prefix !== ENCRYPTION_PREFIX ||
      !ivValue ||
      !tagValue ||
      !encryptedValue
    ) {
      throw new BadRequestException("Stored Telegram token has an invalid format");
    }

    const key = this.getKey();
    const decipher = createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(ivValue, "base64url")
    );
    decipher.setAuthTag(Buffer.from(tagValue, "base64url"));

    return Buffer.concat([
      decipher.update(Buffer.from(encryptedValue, "base64url")),
      decipher.final()
    ]).toString("utf8");
  }

  private getKey() {
    const secret = process.env.ENCRYPTION_KEY;

    if (!secret) {
      throw new BadRequestException(
        "ENCRYPTION_KEY is required before storing Telegram bot tokens"
      );
    }

    return createHash("sha256").update(secret).digest();
  }
}
