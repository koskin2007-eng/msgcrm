import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const manager = await prisma.user.upsert({
    where: { email: "manager@msgcrm.ru" },
    update: {},
    create: {
      email: "manager@msgcrm.ru",
      displayName: "Manager",
      role: "ADMIN"
    }
  });

  const avitoAccount = await prisma.channelAccount.upsert({
    where: {
      type_externalId: {
        type: "AVITO",
        externalId: "demo-avito-profile"
      }
    },
    update: {},
    create: {
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
    update: {},
    create: {
      type: "TELEGRAM",
      externalId: "demo-telegram-bot",
      displayName: "Telegram demo bot"
    }
  });

  const avitoCustomer = await prisma.customer.upsert({
    where: { id: "demo-customer-avito" },
    update: {},
    create: {
      id: "demo-customer-avito",
      externalId: "avito-customer-001",
      displayName: "Avito customer"
    }
  });

  const telegramCustomer = await prisma.customer.upsert({
    where: { id: "demo-customer-telegram" },
    update: {},
    create: {
      id: "demo-customer-telegram",
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
    update: {},
    create: {
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
      assigneeId: manager.id,
      lastMessageAt: new Date("2026-05-19T12:42:00.000Z")
    },
    create: {
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
      assigneeId: manager.id,
      lastMessageAt: new Date("2026-05-19T12:31:00.000Z")
    },
    create: {
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
