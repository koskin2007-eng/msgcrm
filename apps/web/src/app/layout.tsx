import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MsgCRM",
  description: "Единое окно сообщений и сделок для продавцов"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
