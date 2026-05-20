import type {
  Company,
  ConnectedAccount,
  Conversation,
  Deal,
  DeliveryOption,
  Listing,
  Message,
  QuickReplyTemplate,
  TeamMember,
  User
} from "./types";

export const company: Company = {
  id: "company_1",
  name: "АвтоПлюс",
  createdAt: "2026-05-01T09:00:00.000Z"
};

export const currentUser: User = {
  id: "user_1",
  companyId: company.id,
  name: "Павел",
  email: "owner@example.test",
  role: "owner"
};

export const connectedAccounts: ConnectedAccount[] = [
  {
    id: "account_avito_1",
    companyId: company.id,
    platform: "avito",
    title: "Авито №1",
    status: "connected",
    unreadCount: 7,
    description: "Основной аккаунт товаров"
  },
  {
    id: "account_avito_2",
    companyId: company.id,
    platform: "avito",
    title: "Авито №2",
    status: "connected",
    unreadCount: 3,
    description: "Бытовая электроника"
  },
  {
    id: "account_avito_auto",
    companyId: company.id,
    platform: "avito",
    title: "Авито Авто",
    status: "auth_error",
    unreadCount: 1,
    description: "Нужно обновить авторизацию"
  },
  {
    id: "account_avito_realty",
    companyId: company.id,
    platform: "avito",
    title: "Авито Недвижимость",
    status: "disconnected",
    unreadCount: 0,
    description: "Канал готов к подключению"
  },
  {
    id: "account_drom",
    companyId: company.id,
    platform: "drom",
    title: "Дром",
    status: "coming_soon",
    unreadCount: 0,
    description: "Интеграция запланирована"
  },
  {
    id: "account_youla",
    companyId: company.id,
    platform: "youla",
    title: "Юла",
    status: "coming_soon",
    unreadCount: 0,
    description: "Интеграция запланирована"
  },
  {
    id: "account_vk",
    companyId: company.id,
    platform: "vk",
    title: "VK",
    status: "coming_soon",
    unreadCount: 0,
    description: "Интеграция запланирована"
  },
  {
    id: "account_telegram",
    companyId: company.id,
    platform: "telegram",
    title: "Telegram",
    status: "coming_soon",
    unreadCount: 0,
    description: "Боты и клиентские чаты"
  }
];

export const listings: Listing[] = [
  {
    id: "listing_masks",
    companyId: company.id,
    connectedAccountId: "account_avito_1",
    title: "Маски медицинские, коробка 600 шт.",
    price: 3000,
    source: "avito",
    accountTitle: "Авито №1",
    city: "Москва",
    status: "active",
    messagesCount: 18,
    stock: 42,
    dimensions: "40 × 30 × 25 см",
    weight: "3,2 кг",
    photoLabel: "Медицинские маски"
  },
  {
    id: "listing_tires",
    companyId: company.id,
    connectedAccountId: "account_avito_auto",
    title: "Комплект зимних шин R16",
    price: 18000,
    source: "avito",
    accountTitle: "Авито Авто",
    city: "Санкт-Петербург",
    status: "active",
    messagesCount: 9,
    stock: 4,
    dimensions: "70 × 70 × 90 см",
    weight: "34 кг",
    photoLabel: "Шины R16"
  },
  {
    id: "listing_iphone",
    companyId: company.id,
    connectedAccountId: "account_avito_2",
    title: "iPhone 13 128 GB",
    price: 42000,
    source: "avito",
    accountTitle: "Авито №2",
    city: "Москва",
    status: "active",
    messagesCount: 12,
    stock: 1,
    dimensions: "16 × 9 × 4 см",
    weight: "0,4 кг",
    photoLabel: "iPhone 13"
  },
  {
    id: "listing_flat",
    companyId: company.id,
    connectedAccountId: "account_avito_realty",
    title: "Аренда квартиры, 1-комнатная",
    price: 45000,
    source: "avito",
    accountTitle: "Авито Недвижимость",
    city: "Казань",
    status: "paused",
    messagesCount: 5,
    stock: 1,
    dimensions: "38 м²",
    weight: "не применимо",
    photoLabel: "Квартира"
  }
];

export const conversations: Conversation[] = [
  {
    id: "conversation_ivan",
    companyId: company.id,
    connectedAccountId: "account_avito_1",
    listingId: "listing_masks",
    customerName: "Иван",
    customerPhone: "mock-phone",
    customerPickupPoint: "Москва, ПВЗ на Тверской",
    lastMessage: "А доставка до ПВЗ сколько будет?",
    status: "new",
    source: "avito",
    createdAt: "2026-05-19T12:05:00.000Z",
    updatedAt: "2026-05-19T16:46:00.000Z",
    unreadCount: 2,
    assigneeName: "Мария",
    hasDelivery: true,
    hasDeal: false
  },
  {
    id: "conversation_sergey",
    companyId: company.id,
    connectedAccountId: "account_avito_auto",
    listingId: "listing_tires",
    customerName: "Сергей",
    customerPhone: "mock-phone",
    customerPickupPoint: "Санкт-Петербург, ПВЗ Озерки",
    lastMessage: "Торг есть?",
    status: "in_progress",
    source: "avito",
    createdAt: "2026-05-19T10:10:00.000Z",
    updatedAt: "2026-05-19T16:24:00.000Z",
    unreadCount: 0,
    assigneeName: "Мария",
    hasDelivery: false,
    hasDeal: false
  },
  {
    id: "conversation_anna",
    companyId: company.id,
    connectedAccountId: "account_avito_2",
    listingId: "listing_iphone",
    customerName: "Анна",
    customerPhone: "mock-phone",
    customerPickupPoint: "Москва, самовывоз",
    lastMessage: "Можно сегодня забрать?",
    status: "ready_to_deal",
    source: "avito",
    createdAt: "2026-05-18T17:30:00.000Z",
    updatedAt: "2026-05-19T15:55:00.000Z",
    unreadCount: 1,
    assigneeName: "Павел",
    hasDelivery: false,
    hasDeal: true
  }
];

export const messages: Message[] = [
  {
    id: "message_1",
    conversationId: "conversation_ivan",
    sender: "customer",
    text: "Здравствуйте, маски есть в наличии?",
    createdAt: "2026-05-19T16:38:00.000Z"
  },
  {
    id: "message_2",
    conversationId: "conversation_ivan",
    sender: "manager",
    text: "Здравствуйте. Да, товар в наличии.",
    createdAt: "2026-05-19T16:39:00.000Z"
  },
  {
    id: "message_3",
    conversationId: "conversation_ivan",
    sender: "customer",
    text: "Сколько штук в коробке?",
    createdAt: "2026-05-19T16:41:00.000Z"
  },
  {
    id: "message_4",
    conversationId: "conversation_ivan",
    sender: "manager",
    text: "В коробке 600 штук. Цена коробки — 3 000 ₽.",
    createdAt: "2026-05-19T16:43:00.000Z"
  },
  {
    id: "message_5",
    conversationId: "conversation_ivan",
    sender: "customer",
    text: "А доставка до ПВЗ сколько будет?",
    createdAt: "2026-05-19T16:46:00.000Z"
  },
  {
    id: "message_6",
    conversationId: "conversation_sergey",
    sender: "customer",
    text: "Здравствуйте. Шины без порезов?",
    createdAt: "2026-05-19T16:17:00.000Z"
  },
  {
    id: "message_7",
    conversationId: "conversation_sergey",
    sender: "manager",
    text: "Да, комплект ровный, остаток протектора 7 мм.",
    createdAt: "2026-05-19T16:20:00.000Z"
  },
  {
    id: "message_8",
    conversationId: "conversation_sergey",
    sender: "customer",
    text: "Торг есть?",
    createdAt: "2026-05-19T16:24:00.000Z"
  },
  {
    id: "message_9",
    conversationId: "conversation_anna",
    sender: "customer",
    text: "Можно сегодня забрать?",
    createdAt: "2026-05-19T15:55:00.000Z"
  }
];

export const deals: Deal[] = [
  {
    id: "deal_ivan_masks",
    companyId: company.id,
    conversationId: "conversation_ivan",
    customerName: "Иван",
    listingTitle: "Маски медицинские, коробка 600 шт.",
    amount: 3000,
    deliveryStatus: "СДЭК, расчёт ожидается",
    dealStatus: "waiting_pickup_point",
    managerName: "Мария",
    createdAt: "2026-05-19T16:48:00.000Z"
  },
  {
    id: "deal_anna_iphone",
    companyId: company.id,
    conversationId: "conversation_anna",
    customerName: "Анна",
    listingTitle: "iPhone 13 128 GB",
    amount: 42000,
    deliveryStatus: "Самовывоз",
    dealStatus: "waiting_payment",
    managerName: "Павел",
    createdAt: "2026-05-19T15:58:00.000Z"
  }
];

export const quickReplyTemplates: QuickReplyTemplate[] = [
  {
    id: "template_in_stock",
    companyId: company.id,
    title: "Да, товар в наличии.",
    text: "Здравствуйте. Да, товар в наличии."
  },
  {
    id: "template_price",
    companyId: company.id,
    title: "Цена за коробку — 3 000 ₽.",
    text: "Цена за коробку — 3 000 ₽."
  },
  {
    id: "template_qty",
    companyId: company.id,
    title: "В коробке 600 штук.",
    text: "В коробке 600 штук."
  },
  {
    id: "template_pvz",
    companyId: company.id,
    title: "Напишите ближайший ПВЗ и телефон.",
    text: "Напишите, пожалуйста, ближайший ПВЗ и номер телефона для доставки."
  },
  {
    id: "template_delivery",
    companyId: company.id,
    title: "Сейчас рассчитаю доставку.",
    text: "Сейчас рассчитаю доставку и напишу вам стоимость."
  }
];

export const teamMembers: TeamMember[] = [
  {
    id: "user_1",
    companyId: company.id,
    name: "Павел",
    email: "owner@example.test",
    role: "owner",
    status: "active",
    joinedAt: "2026-05-01T09:00:00.000Z"
  },
  {
    id: "user_2",
    companyId: company.id,
    name: "Мария",
    email: "manager@example.test",
    role: "manager",
    status: "active",
    joinedAt: "2026-05-04T12:00:00.000Z"
  },
  {
    id: "user_3",
    companyId: company.id,
    name: "Олег",
    email: "viewer@example.test",
    role: "viewer",
    status: "invited",
    joinedAt: "2026-05-18T11:20:00.000Z"
  }
];

export const deliveryOptions: DeliveryOption[] = [
  {
    id: "delivery_ozon",
    companyId: company.id,
    title: "Ozon Delivery",
    platform: "ozon_delivery",
    status: "coming_soon",
    priceLabel: "350 ₽",
    etaLabel: "2-4 дня"
  },
  {
    id: "delivery_cdek",
    companyId: company.id,
    title: "СДЭК",
    platform: "cdek",
    status: "coming_soon",
    priceLabel: "420 ₽",
    etaLabel: "2-3 дня"
  },
  {
    id: "delivery_boxberry",
    companyId: company.id,
    title: "Boxberry",
    platform: "boxberry",
    status: "coming_soon"
  },
  {
    id: "delivery_russian_post",
    companyId: company.id,
    title: "Почта России",
    platform: "russian_post",
    status: "coming_soon"
  },
  {
    id: "delivery_pickup",
    companyId: company.id,
    title: "Самовывоз",
    platform: "pickup",
    status: "connected"
  }
];

export function getConnectedAccount(accountId: string) {
  return connectedAccounts.find((account) => account.id === accountId);
}

export function getListing(listingId: string) {
  return listings.find((listing) => listing.id === listingId);
}

export function getMessages(conversationId: string) {
  return messages.filter((message) => message.conversationId === conversationId);
}
