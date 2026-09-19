"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      setBusy(false);
      return;
    }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "No se pudo crear la cuenta");
        return;
      }
      router.push("/cursos");
      router.refresh();
    } catch {
      setError("Error de red");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="glass subtle-shadow w-full max-w-sm rounded-3xl p-7">
      <div className="mb-1 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent2 text-lg text-[#060a12]">{">_"}</span>
      </div>
      <h1 className="mt-3 text-center text-2xl font-black">Crea tu cuenta</h1>
      <p className="mt-1 text-center text-sm text-txt2">
        Empieza con <b className="text-txt">+50 XP</b> y la medalla 🐣.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-dim">Usuario</label>
          <input
            className="field"
            placeholder="devpolita"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-dim">Contraseña</label>
          <input
            className="field"
            type="password"
            placeholder="mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-dim">Repite la contraseña</label>
          <input
            className="field"
            type="password"
            placeholder="escríbela otra vez"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
      </div>

      {error && <p className="mt-4 rounded-lg border border-err/40 bg-err/10 p-3 text-sm text-err">{error}</p>}

      <button type="submit" disabled={busy} className="btn btn-primary mt-6 w-full py-3 text-sm">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {busy ? "Creando…" : "Crear cuenta"}
      </button>

      <p className="mt-5 text-center text-sm text-txt2">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-accent hover:underline">
          Entra
        </Link>
      </p>
    </form>
  );
}