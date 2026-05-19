"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { postAuthRequest } from "../../lib/auth-client";
import { Button } from "../ui/Button";

export function LogoutButton() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogout() {
    setIsSubmitting(true);

    try {
      await postAuthRequest("logout");
    } finally {
      window.location.assign("/login");
    }
  }

  return (
    <Button disabled={isSubmitting} onClick={handleLogout} variant="ghost">
      <LogOut size={16} />
      Выйти
    </Button>
  );
}
