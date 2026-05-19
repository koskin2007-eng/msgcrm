import { Injectable } from "@nestjs/common";
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

@Injectable()
export class PasswordService {
  async hash(password: string) {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;

    return `scrypt:${salt}:${derivedKey.toString("hex")}`;
  }

  async verify(password: string, passwordHash: string | null) {
    if (!passwordHash) {
      return false;
    }

    const [algorithm, salt, storedHash] = passwordHash.split(":");

    if (algorithm !== "scrypt" || !salt || !storedHash) {
      return false;
    }

    const storedBuffer = Buffer.from(storedHash, "hex");
    const derivedKey = (await scrypt(password, salt, storedBuffer.length)) as Buffer;

    return (
      storedBuffer.length === derivedKey.length &&
      timingSafeEqual(storedBuffer, derivedKey)
    );
  }
}
