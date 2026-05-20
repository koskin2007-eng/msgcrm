function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getPublicApiUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL;

  if (configuredUrl) {
    return stripTrailingSlash(configuredUrl);
  }

  if (typeof window === "undefined") {
    return "http://127.0.0.1:3001";
  }

  const { hostname, protocol } = window.location;

  if (hostname === "msgcrm.ru" || hostname.endsWith(".msgcrm.ru")) {
    return "https://api.msgcrm.ru";
  }

  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return `${protocol}//${hostname}:3001`;
  }

  return "http://127.0.0.1:3001";
}

async function getResponseMessage(response: Response) {
  const body = await response.json().catch(() => null);
  const message = body?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  return message || body?.error || `Request failed with status ${response.status}`;
}

export async function postAuthRequest(path: "login" | "logout" | "register", data?: unknown) {
  const response = await fetch(`${getPublicApiUrl()}/api/auth/${path}`, {
    method: "POST",
    headers: data ? { "Content-Type": "application/json" } : undefined,
    credentials: "include",
    body: data ? JSON.stringify(data) : undefined
  });

  if (!response.ok) {
    throw new Error(await getResponseMessage(response));
  }

  return response.json();
}
