"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Copy, Lightbulb, RefreshCw, Send, Sparkles, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AISectionProps {
  cityLabel: string;
  forecastTitle?: string | null;
  forecastSubtitle?: string | null;
}

const QUICK_QUESTIONS = [
  "Cocok menanam padi hari ini?",
  "Kapan waktu terbaik menyiram tanaman?",
  "Apakah aman semprot sore ini?",
  "Bagaimana kalau hujan 5 jam ke depan?",
  "Apa risiko cabai saat lembap tinggi?",
  "Kapan panen lebih aman dilakukan?",
];

const KNOWLEDGE_BASE: Record<string, string> = {
  default: `Saya siap membantu membaca cuaca, menyaring risiko, dan memberi saran aktivitas lapangan.`,
  hujan: `Jika peluang hujan naik, utamakan kerja pagi, hindari semprot saat angin kencang, dan cek drainase.

Gunakan jendela cuaca paling stabil untuk panen dan pemupukan.`,
  tanam: `Tanam lebih aman saat kelembapan stabil dan peluang hujan rendah. Pilih pagi hari agar bibit tidak stres panas.

Kalau tanah terlalu basah, tunda 1-2 jam sampai permukaan mengering.`,
  semprot: `Penyemprotan paling aman saat angin ringan, awan tipis, dan tidak ada potensi hujan dekat-dekat ini.

Hindari siang bolong saat suhu tinggi.`,
  siram: `Penyiraman efektif dilakukan pagi atau sore saat penguapan rendah. Jika kelembapan udara sudah tinggi, kurangi volume air.`,
  panen: `Panen paling aman saat cuaca stabil dan tidak ada hujan dalam jendela beberapa jam ke depan. Siapkan penutup hasil panen jika ada awan tebal.`,
};

function generateResponse(question: string, cityLabel: string, forecastTitle?: string | null, forecastSubtitle?: string | null) {
  const q = question.toLowerCase();

  if (q.includes("hujan") || q.includes("basah") || q.includes("lembap") || q.includes("awan")) {
    return `${KNOWLEDGE_BASE.hujan}\n\nLokasi pantauan: ${cityLabel}. ${forecastTitle ? `Model saat ini membaca: ${forecastTitle}.` : ""} ${forecastSubtitle ?? ""}`.trim();
  }

  if (q.includes("tanam") || q.includes("semai") || q.includes("bibit")) {
    return `${KNOWLEDGE_BASE.tanam}\n\nLokasi pantauan: ${cityLabel}.`;
  }

  if (q.includes("semprot") || q.includes("pestisida") || q.includes("obat")) {
    return `${KNOWLEDGE_BASE.semprot}\n\nLokasi pantauan: ${cityLabel}.`;
  }

  if (q.includes("siram") || q.includes("irigasi") || q.includes("air")) {
    return `${KNOWLEDGE_BASE.siram}\n\nLokasi pantauan: ${cityLabel}.`;
  }

  if (q.includes("panen") || q.includes("petik") || q.includes("angkat")) {
    return `${KNOWLEDGE_BASE.panen}\n\nLokasi pantauan: ${cityLabel}.`;
  }

  return `${KNOWLEDGE_BASE.default}\n\nLokasi pantauan: ${cityLabel}. ${forecastTitle ? `Ringkasan model: ${forecastTitle}.` : ""}`.trim();
}

export default function AISection({ cityLabel, forecastTitle, forecastSubtitle }: AISectionProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `${KNOWLEDGE_BASE.default}\n\nPantauan saat ini: ${cityLabel}${forecastTitle ? `\n${forecastTitle}` : ""}${forecastSubtitle ? `\n${forecastSubtitle}` : ""}`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    const assistantMessage: Message = {
      id: `${Date.now()}-assistant`,
      role: "assistant",
      content: generateResponse(content, cityLabel, forecastTitle, forecastSubtitle),
      timestamp: new Date(),
    };

    setMessages((current) => [...current, assistantMessage]);
    setLoading(false);
  };

  const copyMessage = async (message: Message) => {
    await navigator.clipboard.writeText(message.content);
    setCopied(message.id);
    window.setTimeout(() => setCopied(null), 1800);
  };

  return (
    <section id="ai" className="relative py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-2 text-sm font-medium text-emerald-800">
            <Bot className="h-4 w-4" />
            AI asisten pertanian
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl">Tanya cuaca dan keputusan lapangan dengan cepat</h2>
          <p className="mt-4 text-base leading-7 text-[var(--foreground)]/70 sm:text-lg">
            AI ini membaca konteks lokasi dan ringkasan prediksi terbaru untuk menjawab pertanyaan praktis, dari tanam sampai panen.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-[2rem] glass-card-strong p-6 soft-shadow">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Percakapan</div>
                  <div className="text-lg font-black text-[var(--foreground)]">Berbasis {cityLabel}</div>
                </div>
              </div>
              <button onClick={() => setMessages(messages.slice(0, 1))} className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-semibold text-[var(--foreground)]/75 hover:bg-white">
                <RefreshCw className="h-4 w-4" />
                Reset
              </button>
            </div>

            <div className="mt-6 space-y-4 rounded-[1.75rem] border border-white/70 bg-white/65 p-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" && <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white"><Bot className="h-4 w-4" /></div>}
                  <div className={`max-w-[85%] rounded-[1.25rem] border px-4 py-3 shadow-sm ${message.role === "user" ? "border-emerald-600/20 bg-emerald-600 text-white" : "border-white/80 bg-white text-[var(--foreground)]"}`}>
                    <div className="whitespace-pre-line text-sm leading-7">{message.content}</div>
                    <div className={`mt-2 flex items-center gap-2 text-[11px] ${message.role === "user" ? "text-white/70" : "text-[var(--foreground)]/45"}`}>
                      <span>{message.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                      {message.role === "assistant" && (
                        <button onClick={() => copyMessage(message)} className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 font-semibold text-emerald-800">
                          <Copy className="h-3 w-3" />
                          {copied === message.id ? "Tersalin" : "Salin"}
                        </button>
                      )}
                    </div>
                  </div>
                  {message.role === "user" && <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-[var(--foreground)] text-white"><User className="h-4 w-4" /></div>}
                </div>
              ))}
              {loading && (
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white"><Bot className="h-4 w-4" /></div>
                  <div className="rounded-[1.25rem] border border-white/80 bg-white px-4 py-3 text-[var(--foreground)]/55">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-600" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:120ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-emerald-600 [animation-delay:240ms]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {QUICK_QUESTIONS.map((question) => (
                <button key={question} onClick={() => void sendMessage(question)} className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-[var(--foreground)]/75 hover:bg-white">
                  {question}
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3 rounded-[1.5rem] border border-white/70 bg-white/75 p-3">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder="Tanya cuaca, tanam, semprot, panen, atau risiko hujan..."
                rows={2}
                className="min-h-[52px] flex-1 resize-none bg-transparent px-2 py-1 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--foreground)]/35"
              />
              <button onClick={() => void sendMessage()} className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 transition-transform hover:scale-[1.02] disabled:opacity-50" disabled={loading}>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] glass-card-strong p-6 soft-shadow">
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Konteks model</div>
              <div className="mt-2 text-2xl font-black text-[var(--foreground)]">{forecastTitle ?? "Menunggu prediksi"}</div>
              <p className="mt-3 text-sm leading-7 text-[var(--foreground)]/70">{forecastSubtitle ?? "Saat prediksi lokal sudah tersedia, AI akan menyesuaikan jawaban dengan kondisi cuaca terkini."}</p>
            </div>

            <div className="rounded-[2rem] glass-card-strong p-6 soft-shadow">
              <div className="flex items-center gap-2 text-lg font-bold text-[var(--foreground)]">
                <Lightbulb className="h-5 w-5 text-amber-700" />
                Cara pakai
              </div>
              <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--foreground)]/70">
                <p>1. Tanyakan hal yang spesifik: "cocok semprot sore ini" lebih baik daripada pertanyaan umum.</p>
                <p>2. Gunakan informasi lokasi untuk menyesuaikan keputusan kerja lapangan.</p>
                <p>3. Jika model menunjukkan risiko hujan tinggi, prioritaskan kerja pagi.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}