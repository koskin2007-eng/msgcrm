import { PrismaClient } from "@prisma/client";
import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";

const prisma = new PrismaClient();
const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);

  return `scrypt:${salt}:${Buffer.from(derivedKey).toString("hex")}`;
}

async function getPasswordHashFromEnv() {
  const password = process.env.INITIAL_OWNER_PASSWORD;

  if (!password) {
    return undefined;
  }

  return hashPassword(password);
}

async function main() {
  const company = await prisma.company.upsert({
    where: { id: "company_autoplus" },
    update: {
      name: "AutoPlus"
    },
    create: {
      id: "company_autoplus",
      name: "AutoPlus"
    }
  });

  const ownerEmail =
    process.env.INITIAL_OWNER_EMAIL?.trim().toLowerCase() || "pavel@example.com";
  const ownerName = process.env.INITIAL_OWNER_NAME?.trim() || "Pavel";
  const passwordHash = await getPasswordHashFromEnv();

  const manager = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: {
      companyId: company.id,
      displayName: ownerName,
      role: "OWNER",
      ...(passwordHash ? { passwordHash } : {})
    },
    create: {
      companyId: company.id,
      email: ownerEmail,
      displayName: ownerName,
      role: "OWNER",
      ...(passwordHash ? { passwordHash } : {})
    }
  });

  const avitoAccount = await prisma.channelAccount.upsert({
    where: {
      type_externalId: {
        type: "AVITO",
        externalId: "demo-avito-profile"
      }
    },
    update: {
      companyId: company.id
    },
    create: {
      companyId: company.id,
      type: "AVITO",
      externalId: "demo-avito-profile",
      displayName: "Avito demo profile"
    }
  });

  const telegramAccount = await prisma.channelAccount.upsert({
    where: {
      type_externalId: {
        type: "TELEGRAM",
        externalId: "demo-telegram-bot"
      }
    },
    update: {
      companyId: company.id
    },
    create: {
      companyId: company.id,
      type: "TELEGRAM",
      externalId: "demo-telegram-bot",
      displayName: "Telegram demo bot"
    }
  });

  const avitoCustomer = await prisma.customer.upsert({
    where: { id: "demo-customer-avito" },
    update: {
      companyId: company.id
    },
    create: {
      id: "demo-customer-avito",
      companyId: company.id,
      externalId: "avito-customer-001",
      displayName: "Avito customer"
    }
  });

  const telegramCustomer = await prisma.customer.upsert({
    where: { id: "demo-customer-telegram" },
    update: {
      companyId: company.id
    },
    create: {
      id: "demo-customer-telegram",
      companyId: company.id,
      externalId: "telegram-customer-001",
      displayName: "Telegram lead"
    }
  });

  const listing = await prisma.listing.upsert({
    where: {
      channelAccountId_externalId: {
        channelAccountId: avitoAccount.id,
        externalId: "demo-listing-001"
      }
    },
    update: {
      companyId: company.id
    },
    create: {
      companyId: company.id,
      channelAccountId: avitoAccount.id,
      externalId: "demo-listing-001",
      title: "Demo listing",
      url: "https://www.avito.ru/"
    }
  });

  const avitoConversation = await prisma.conversation.upsert({
    where: {
      channelAccountId_externalId: {
        channelAccountId: avitoAccount.id,
        externalId: "demo-avito-chat-001"
      }
    },
    update: {
      companyId: company.id,
      customerId: avitoCustomer.id,
      listingId: listing.id,
      assigneeId: manager.id,
      lastMessageAt: new Date("2026-05-19T12:42:00.000Z")
    },
    create: {
      companyId: company.id,
      channelAccountId: avitoAccount.id,
      customerId: avitoCustomer.id,
      listingId: listing.id,
      assigneeId: manager.id,
      externalId: "demo-avito-chat-001",
      status: "NEW",
      lastMessageAt: new Date("2026-05-19T12:42:00.000Z")
    }
  });

  const telegramConversation = await prisma.conversation.upsert({
    where: {
      channelAccountId_externalId: {
        channelAccountId: telegramAccount.id,
        externalId: "demo-telegram-chat-001"
      }
    },
    update: {
      companyId: company.id,
      customerId: telegramCustomer.id,
      assigneeId: manager.id,
      lastMessageAt: new Date("2026-05-19T12:31:00.000Z")
    },
    create: {
      companyId: company.id,
      channelAccountId: telegramAccount.id,
      customerId: telegramCustomer.id,
      assigneeId: manager.id,
      externalId: "demo-telegram-chat-001",
      status: "OPEN",
      lastMessageAt: new Date("2026-05-19T12:31:00.000Z")
    }
  });

  await prisma.message.upsert({
    where: {
      conversationId_externalId: {
        conversationId: avitoConversation.id,
        externalId: "demo-avito-message-001"
      }
    },
    update: {},
    create: {
      conversationId: avitoConversation.id,
      externalId: "demo-avito-message-001",
      direction: "INBOUND",
      authorType: "CUSTOMER",
      text: "Hello, is this item still available?",
      sentAt: new Date("2026-05-19T12:42:00.000Z")
    }
  });

  await prisma.message.upsert({
    where: {
      conversationId_externalId: {
        conversationId: telegramConversation.id,
        externalId: "demo-telegram-message-001"
      }
    },
    update: {},
    create: {
      conversationId: telegramConversation.id,
      externalId: "demo-telegram-message-001",
      direction: "INBOUND",
      authorType: "CUSTOMER",
      text: "Please tell me the delivery terms.",
      sentAt: new Date("2026-05-19T12:31:00.000Z")
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
