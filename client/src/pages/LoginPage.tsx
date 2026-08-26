import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Loader2, LogIn, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const utils = trpc.useUtils();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = trpc.auth.login.useMutation({
    onSuccess: async user => {
      await utils.auth.me.invalidate();
      toast.success(`Bem-vindo de volta${user.name ? `, ${user.name}` : ""}!`);
      navigate("/admin/editorial");
    },
    onError: error => toast.error(error.message),
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      toast.error("Informe e-mail e senha.");
      return;
    }
    login.mutate({ email: email.trim(), password });
  };

  return (
    <div className="grid min-h-screen place-items-center bg-[#F5ECD8] px-6 text-[#26311E]">
      <div className="w-full max-w-md">
        <Link href="/" className="tap inline-flex items-center gap-2 text-sm font-extrabold text-[#566B37] hover:text-[#B9572D]"><ArrowLeft className="h-4 w-4" /> Voltar ao atlas público</Link>
        <form onSubmit={submit} className="mt-4 rounded-2xl border border-[#314027]/15 bg-[#FDF9F0] p-7">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#E9DCC0] text-[#B9572D]"><ShieldCheck className="h-5 w-5" /></span>
          <h1 className="display-font mt-4 text-3xl">Área da curadoria</h1>
          <p className="mt-2 text-sm leading-6 text-[#536049]">Entre com a conta editorial para gerenciar a Agenda, os destinos e as propostas de parceiros.</p>
          <label className="mt-6 block text-sm font-bold">E-mail
            <input type="email" required autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-2 h-11 w-full rounded-md border border-[#314027]/15 bg-white px-3 text-sm" />
          </label>
          <label className="mt-4 block text-sm font-bold">Senha
            <input type="password" required autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} className="mt-2 h-11 w-full rounded-md border border-[#314027]/15 bg-white px-3 text-sm" />
          </label>
          <button type="submit" disabled={login.isPending} className="tap mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#314027] px-4 text-sm font-extrabold text-[#F5ECD8] hover:bg-[#26311E] disabled:opacity-60">
            {login.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
            {login.isPending ? "Entrando…" : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
