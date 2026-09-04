import { useState, type FormEvent } from "react";
import { ArrowLeft, CheckCircle2, Loader2, MessageSquare, Send } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

type FeedbackCategory = "elogio" | "sugestao" | "problema";

export default function FeedbackPage() {
  const [category, setCategory] = useState<FeedbackCategory | "">("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const submitFeedback = trpc.feedbacks.submit.useMutation();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!category) return;

    setErrorMessage(null);
    try {
      await submitFeedback.mutateAsync({ category, message });
      setSubmitted(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Não foi possível registrar o feedback agora. Tente novamente.");
    }
  }

  function resetForm() {
    setCategory("");
    setMessage("");
    setSubmitted(false);
    setErrorMessage(null);
  }

  return (
    <div className="min-h-screen bg-[#F5ECD8] text-[#2E3222]">
      <header className="border-b border-[#3C482D]/10 bg-[#F5ECD8]/95 px-4 py-5 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-extrabold text-[#3C482D] hover:text-[#B9572D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9572D] focus-visible:ring-offset-2">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar ao atlas
          </Link>
          <Link href="/" className="display-font text-2xl tracking-[-0.07em] text-[#3C482D]">
            umbora <span className="text-[#B9572D]">piauí</span>
          </Link>
        </div>
      </header>

      <main className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
          <section>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#B9572D] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-white">
              <MessageSquare className="h-3.5 w-3.5" aria-hidden="true" />
              Escuta aberta
            </span>
            <h1 className="display-font mt-6 max-w-xl text-5xl leading-[0.94] tracking-[-0.06em] sm:text-6xl">
              Ajude a melhorar o Umbora Piauí.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-[#566457] sm:text-lg">
              Conte o que funcionou, o que ficou confuso ou qual conteúdo você gostaria de encontrar no atlas. Sua opinião orienta as próximas melhorias do protótipo.
            </p>
            <p className="mt-7 max-w-lg border-l-2 border-[#B9572D] pl-4 text-sm font-semibold leading-6 text-[#566B37]">
              Não pedimos nome, e-mail ou outros dados pessoais neste formulário.
            </p>
          </section>

          <section className="rounded-[2rem] border border-[#3C482D]/10 bg-[#FFFDF6] p-6 sm:p-9">
            {submitted ? (
              <div className="py-10 text-center sm:py-14" role="status" aria-live="polite">
                <CheckCircle2 className="mx-auto h-12 w-12 text-[#566B37]" aria-hidden="true" />
                <h2 className="display-font mt-5 text-4xl tracking-[-0.05em]">Obrigado por contribuir.</h2>
                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#566457]">
                  Seu feedback foi registrado com segurança e ajudará a orientar a próxima rodada de melhorias do Umbora Piauí.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <button type="button" onClick={resetForm} className="inline-flex items-center justify-center rounded-full border border-[#3C482D]/20 px-5 py-3 text-sm font-extrabold text-[#3C482D] hover:bg-[#F5ECD8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9572D] focus-visible:ring-offset-2">
                    Enviar outro
                  </button>
                  <Link href="/" className="inline-flex items-center justify-center rounded-full bg-[#3C482D] px-5 py-3 text-sm font-extrabold text-white hover:bg-[#566B37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9572D] focus-visible:ring-offset-2">
                    Voltar ao atlas
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#B9572D]">Sua leitura</p>
                  <h2 className="display-font mt-2 text-4xl tracking-[-0.05em]">Como foi sua experiência?</h2>
                </div>
                <div>
                  <label htmlFor="feedback-type" className="text-sm font-extrabold text-[#3C482D]">Tipo de feedback</label>
                  <select id="feedback-type" name="feedbackType" required value={category} onChange={(event) => setCategory(event.target.value as FeedbackCategory | "")} className="mt-2 h-12 w-full rounded-xl border border-[#3C482D]/15 bg-[#F5ECD8] px-4 text-sm font-semibold text-[#2E3222] outline-none focus:border-[#B9572D] focus:ring-2 focus:ring-[#B9572D]/30">
                    <option value="">Selecione uma opção</option>
                    <option value="elogio">O que funcionou bem</option>
                    <option value="sugestao">Sugestão de melhoria ou conteúdo</option>
                    <option value="problema">Encontrei uma dúvida ou problema</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="feedback-message" className="text-sm font-extrabold text-[#3C482D]">Seu feedback</label>
                  <textarea id="feedback-message" name="message" required minLength={10} maxLength={3000} rows={7} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Escreva sua opinião com o máximo de detalhes que desejar..." className="mt-2 w-full resize-y rounded-xl border border-[#3C482D]/15 bg-[#F5ECD8] px-4 py-3 text-sm leading-6 text-[#2E3222] outline-none placeholder:text-[#7A806D] focus:border-[#B9572D] focus:ring-2 focus:ring-[#B9572D]/30" />
                  <p className="mt-2 text-xs text-[#7A806D]">Mínimo de 10 e máximo de 3.000 caracteres. Não inclua dados pessoais.</p>
                </div>
                {errorMessage && <p className="rounded-xl bg-[#FCE8E2] px-4 py-3 text-sm font-semibold leading-6 text-[#8C3D20]" role="alert">{errorMessage}</p>}
                <button type="submit" disabled={submitFeedback.isPending || !category || message.trim().length < 10} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#B9572D] px-5 py-3.5 text-sm font-extrabold text-white hover:bg-[#A34827] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B9572D] focus-visible:ring-offset-2">
                  {submitFeedback.isPending ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Enviando...</> : <>Enviar feedback <Send className="h-4 w-4" aria-hidden="true" /></>}
                </button>
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
