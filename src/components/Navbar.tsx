import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/session";
import { LogoutButton } from "./LogoutButton";

export async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <Link href="/" className="flex items-center gap-2 font-extrabold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent2 text-sm text-[#060a12]">
            {">_"}
          </span>
          <span>
            Cursos<span className="text-gradient">Tech</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1.5 text-sm font-medium">
          <Link href="/" className="btn btn-ghost px-3 py-2 text-xs">
            Inicio
          </Link>
          <Link href="/cursos" className="btn btn-ghost px-3 py-2 text-xs">
            Cursos
          </Link>
          {user ? (
            <>
              <Link href="/perfil" className="btn btn-ghost px-3 py-2 text-xs">
                {user.username}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost px-3 py-2 text-xs">
                Entrar
              </Link>
              <Link
                href="/registro"
                className="btn btn-primary px-3 py-2 text-xs"
              >
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}