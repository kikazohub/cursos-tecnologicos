"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/cursos";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error ?? "No se pudo iniciar sesión");
        return;
      }
      router.push(next);
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
      <h1 className="mt-3 text-center text-2xl font-black">Bienvenido de nuevo</h1>
      <p className="mt-1 text-center text-sm text-txt2">Recupera tu racha de aprendizaje.</p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-dim">Usuario</label>
          <input
            className="field"
            placeholder="p. ej. devpolita"
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
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
      </div>

      {error && <p className="mt-4 rounded-lg border border-err/40 bg-err/10 p-3 text-sm text-err">{error}</p>}

      <button type="submit" disabled={busy} className="btn btn-primary mt-6 w-full py-3 text-sm">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {busy ? "Entrando…" : "Entrar"}
      </button>

      <p className="mt-5 text-center text-sm text-txt2">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-semibold text-accent hover:underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
}