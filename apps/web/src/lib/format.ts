import type {
  ConnectedAccountStatus,
  ConversationStatus,
  DealStatus,
  Platform,
  UserRole
} from "./types";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

export function formatTime(value: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function platformLabel(platform: Platform) {
  const labels: Record<Platform, string> = {
    avito: "Авито",
    drom: "Дром",
    youla: "Юла",
    vk: "VK",
    telegram: "Telegram",
    ozon_delivery: "Ozon Delivery",
    cdek: "СДЭК",
    boxberry: "Boxberry",
    russian_post: "Почта России",
    pickup: "Самовывоз"
  };

  return labels[platform];
}

export function roleLabel(role: UserRole | Uppercase<UserRole>) {
  const labels: Record<UserRole, string> = {
    owner: "owner",
    admin: "admin",
    manager: "manager",
    viewer: "viewer"
  };

  return labels[role.toLowerCase() as UserRole];
}

export function conversationStatusLabel(status: ConversationStatus) {
  const labels: Record<ConversationStatus, string> = {
    new: "Новое",
    in_progress: "В работе",
    waiting_customer: "Ждём клиента",
    ready_to_deal: "Готово к сделке",
    closed: "Закрыто"
  };

  return labels[status];
}

export function dealStatusLabel(status: DealStatus) {
  const labels: Record<DealStatus, string> = {
    new_lead: "Новый лид",
    waiting_pickup_point: "Ждём ПВЗ",
    delivery_calculated: "Доставка рассчитана",
    waiting_payment: "Ждём оплату",
    shipped: "Отправлено",
    closed: "Закрыто"
  };

  return labels[status];
}

export function accountStatusLabel(status: ConnectedAccountStatus) {
  const labels: Record<ConnectedAccountStatus, string> = {
    connected: "Подключён",
    auth_error: "Ошибка авторизации",
    disconnected: "Не подключён",
    coming_soon: "Скоро"
  };

  return labels[status];
}
