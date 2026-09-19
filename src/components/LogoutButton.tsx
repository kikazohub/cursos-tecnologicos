"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <button onClick={logout} disabled={busy} className="btn btn-ghost px-3 py-2 text-xs">
      <LogOut className="h-3.5 w-3.5" />
      Salir
    </button>
  );
}