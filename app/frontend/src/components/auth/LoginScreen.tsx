import { FormEvent, useState } from "react";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "../../auth/AuthProvider";

export function LoginScreen() {
  const { authMode, error, signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("encargado@robolab.local");
  const [password, setPassword] = useState("inventario-demo");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await signIn(email, password);
    } catch {
      return;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-surface-container-lowest px-4 py-8 text-on-surface md:place-items-center">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-outline-variant bg-surface shadow-panel md:grid-cols-[1fr_420px]">
        <div className="flex min-h-[420px] flex-col justify-between bg-primary p-8 text-on-primary">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]">
              <ShieldCheck size={15} />
              {authMode === "firebase" ? "Firebase Auth" : "Modo demo"}
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight">RoboLab Inventory</h1>
            <p className="mt-4 max-w-md text-base leading-7 text-white/80">
              Acceso para revisar closets, estaciones de computo, incidencias y auditorias del aula.
            </p>
          </div>

          <div className="grid gap-3 text-sm text-white/80 sm:grid-cols-3">
            <span className="rounded-md border border-white/20 px-3 py-2">Closets C1-C6</span>
            <span className="rounded-md border border-white/20 px-3 py-2">Equipos 1-12</span>
            <span className="rounded-md border border-white/20 px-3 py-2">Auditorias</span>
          </div>
        </div>

        <form className="flex flex-col justify-center gap-5 p-6 md:p-8" onSubmit={handleSubmit}>
          <div>
            <h2 className="font-display text-2xl font-bold">Iniciar sesion</h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              {authMode === "firebase"
                ? "Usa una cuenta registrada en Firebase."
                : "Las credenciales locales funcionan sin configurar Firebase."}
            </p>
          </div>

          <label className="grid gap-2 text-sm font-semibold">
            Correo
            <span className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
              <input
                className="h-11 w-full rounded-lg border border-outline-variant bg-white pl-10 pr-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                value={email}
              />
            </span>
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            Contrasena
            <span className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
              <input
                className="h-11 w-full rounded-lg border border-outline-variant bg-white pl-10 pr-3 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </span>
          </label>

          {error ? <p className="rounded-md bg-error-container px-3 py-2 text-sm text-on-error-container">{error}</p> : null}

          <button
            className="rounded-lg bg-primary px-4 py-3 text-sm font-bold text-on-primary hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={submitting}
            type="submit"
          >
            {submitting ? "Validando..." : "Entrar"}
          </button>

          <button
            className="rounded-lg border border-outline-variant px-4 py-3 text-sm font-bold text-primary hover:border-primary hover:bg-primary/5"
            onClick={() => void signInWithGoogle().catch(() => undefined)}
            type="button"
          >
            Entrar con Google
          </button>
        </form>
      </section>
    </main>
  );
}
