import { useEffect, useState } from "react";
import {
  ChevronLeft,
  LogIn,
  LoaderCircle,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const markImage = "/manus-storage/bora-piaui-sun-river-mark_032a7fc1.png";

const errorLabels: Record<string, string> = {
  oauth_unavailable:
    "O login por conta está indisponível neste ambiente: o provedor OAuth não foi configurado (variável OAUTH_SERVER_URL).",
};

export default function LoginPage() {
  const [, navigate] = useLocation();
  const meQuery = trpc.auth.me.useQuery();
  const utils = trpc.useUtils();
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    if (error)
      setAuthError(
        errorLabels[error] ??
          "Não foi possível concluir o login. Tente novamente."
      );
  }, []);

  const logout = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/");
    },
  });

  const user = meQuery.data ?? null;

  return (
    <div className="grid min-h-screen place-items-center bg-[#F5ECD8] px-4 text-[#2E3222]">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="tap mb-5 inline-flex items-center gap-2 text-sm font-extrabold text-[#566B37] hover:text-[#B9572D]"
        >
          <ChevronLeft className="h-4 w-4" /> Voltar ao atlas
        </Link>

        <div className="rounded-[2rem] border border-[#3C482D]/14 bg-[#FFFDF6] p-7 shadow-[0_18px_55px_rgba(59,70,42,.12)]">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#B9572D]">
              <img
                src={markImage}
                alt="Marca Bora Piauí"
                className="h-9 w-9 object-contain"
              />
            </span>
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#B9572D]">
                Bora Piauí
              </p>
              <h1 className="display-font text-2xl tracking-[-0.04em]">
                Área de acesso
              </h1>
            </div>
          </div>

          {authError && (
            <p
              role="alert"
              className="mt-5 rounded-xl border border-[#B9572D]/30 bg-[#FFF5EF] px-4 py-3 text-sm leading-6 text-[#8C3D20]"
            >
              {authError}
            </p>
          )}

          {meQuery.isPending ? (
            <p className="mt-6 flex items-center gap-2 text-sm font-bold text-[#66705E]">
              <LoaderCircle className="h-4 w-4 animate-spin text-[#B9572D]" />{" "}
              Verificando sessão…
            </p>
          ) : user ? (
            <div className="mt-6">
              <div className="flex items-center gap-3 rounded-2xl border border-[#3C482D]/12 bg-[#F5ECD8] px-4 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#3C482D] text-sm font-extrabold text-white">
                  {(user.name ?? "?").slice(0, 1).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold">
                    {user.name ?? "Conta sem nome"}
                  </p>
                  <p className="text-xs font-bold text-[#68705C]">
                    Papel: {user.role === "admin" ? "administrador" : "usuário"}
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-2">
                {user.role === "admin" && (
                  <Link
                    href="/admin/editorial"
                    className="tap inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#3C482D] px-4 text-sm font-extrabold text-white hover:bg-[#566B37]"
                  >
                    <ShieldCheck className="h-4 w-4" /> Abrir painel editorial
                  </Link>
                )}
                <button
                  type="button"
                  disabled={logout.isPending}
                  onClick={() => logout.mutate()}
                  className="tap inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#3C482D]/18 px-4 text-sm font-extrabold text-[#3C482D] hover:bg-[#EDE0C4] disabled:opacity-50"
                >
                  {logout.isPending ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  Sair da conta
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-sm leading-6 text-[#66705E]">
                Entre para acessar os painéis de curadoria de destinos, agenda
                cultural e propostas de parceiros.
              </p>
              <a
                href="/api/oauth/login?redirect=/admin/editorial"
                className="tap mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#B9572D] px-4 text-sm font-extrabold text-white hover:bg-[#CD6D45]"
              >
                <LogIn className="h-4 w-4" /> Entrar com minha conta
              </a>
              <p className="mt-4 text-xs leading-5 text-[#68705C]">
                O acesso administrativo depende do papel atribuído no servidor
                após a autenticação.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
