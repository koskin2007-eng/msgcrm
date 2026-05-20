"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Handshake,
  Inbox,
  Megaphone,
  MessageSquareText,
  Plug,
  Settings,
  Truck,
  UserRound,
  Users
} from "lucide-react";
import { connectedAccounts } from "../../lib/mock-data";
import { platformLabel } from "../../lib/format";
import { canAccessRoute } from "../../lib/permissions";
import type { AuthRole } from "../../lib/auth-types";
import type { Platform } from "../../lib/types";

const menuItems = [
  { href: "/inbox", label: "Входящие", icon: Inbox },
  { href: "/deals", label: "Сделки", icon: Handshake },
  { href: "/listings", label: "Объявления", icon: Megaphone },
  { href: "/templates", label: "Быстрые ответы", icon: MessageSquareText },
  { href: "/integrations", label: "Интеграции", icon: Plug },
  { href: "/team", label: "Команда", icon: Users },
  { href: "/delivery", label: "Доставка", icon: Truck },
  { href: "/profile", label: "Личные данные", icon: UserRound },
  { href: "/settings", label: "Настройки", icon: Settings }
];

const channelOrder: Platform[] = ["avito", "drom", "youla", "vk", "telegram"];

interface SidebarProps {
  role: AuthRole;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const visibleMenuItems = menuItems.filter((item) => canAccessRoute(role, item.href));

  return (
    <aside className="app-sidebar">
      <Link className="logo" href="/inbox">
        <span className="logo-mark">M</span>
        <span>
          <strong>MsgCRM</strong>
          <small>Единое окно продаж</small>
        </span>
      </Link>

      <nav className="main-menu" aria-label="Главное меню">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link className={`menu-link ${isActive ? "active" : ""}`} href={item.href} key={item.href}>
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <section className="sidebar-section">
        <div className="sidebar-section-title">Каналы</div>
        <div className="channel-list">
          {channelOrder.map((platform) => {
            const accounts = connectedAccounts.filter((account) => account.platform === platform);
            const unreadCount = accounts.reduce((sum, account) => sum + account.unreadCount, 0);
            const isActive = platform === "avito";
            const isSoon = platform !== "avito";

            return (
              <div className={`channel-item ${isActive ? "active" : ""} ${isSoon ? "soon" : ""}`} key={platform}>
                <span>{platformLabel(platform)}</span>
                {isSoon ? <small>скоро</small> : <strong>{unreadCount}</strong>}
              </div>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
