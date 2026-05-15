"use client";

import { useEffect, useState } from "react";
import { ArrowDown, Bot, CloudSun, Shield, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

const stats = [
  { value: "24", label: "Jam pantau", suffix: "/7" },
  { value: "12", label: "Jam prediksi", suffix: "+" },
  { value: "1", label: "ADM4 fokus", suffix: "" },
  { value: "AI", label: "Model lokal", suffix: "" },
];

export default function HeroSection({ onNavigate }: HeroSectionProps) {
  const [currentStat, setCurrentStat] = useState(0);
  const [clock, setClock] = useState<string | null>(null);

  useEffect(() => {
    // Set initial clock on client only to prevent hydration mismatch
    setClock(
      new Date().toLocaleString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );

    const timer = setInterval(() => {
      setClock(
        new Date().toLocaleString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentStat((index) => (index + 1) % stats.length), 2400);
    return () => clearInterval(timer);
  }, []);

  if (!clock) {
    return (
      <section id="home" className="relative overflow-hidden pt-24 lg:pt-28">
        <div className="absolute inset-0 -z-10">
          <img src="/images/hero-bg.jpg" alt="Lahan pertanian" className="h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(245,250,242,0.92)_0%,rgba(243,247,239,0.84)_48%,rgba(243,247,239,1)_100%)]" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 lg:pb-20 h-96" />
      </section>
    );
  }

  return (
    <section id="home" className="relative overflow-hidden pt-24 lg:pt-28">
      <div className="absolute inset-0 -z-10">
        <img src="/images/hero-bg.jpg" alt="Lahan pertanian" className="h-full w-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(245,250,242,0.92)_0%,rgba(243,247,239,0.84)_48%,rgba(243,247,239,1)_100%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12 lg:pb-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.35fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-2 text-sm font-medium text-emerald-800">
              <Sparkles className="h-4 w-4" />
              Cuaca lapangan, laporan warga, dan prediksi lokal dalam satu sistem
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-7xl">
              Prediksi cuaca yang
              <span className="block bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                lebih rapi untuk kerja lapangan
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[var(--foreground)]/72 sm:text-lg">
              Sistem ini menggabungkan data BMKG, kalibrasi laporan warga, dan model prediksi lokal untuk membantu keputusan tanam, semprot, siram, dan panen pada wilayah fokus ADM4 34.04.13.2001.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate("weather")}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition-transform hover:scale-[1.02]"
              >
                <CloudSun className="h-4 w-4" />
                Cek prakiraan
              </button>
              <button
                onClick={() => onNavigate("ai")}
                className="inline-flex items-center gap-2 rounded-full glass-card px-6 py-3 text-sm font-semibold text-[var(--foreground)] transition-transform hover:scale-[1.02]"
              >
                <Bot className="h-4 w-4 text-teal-700" />
                Tanya AI
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {[
                { icon: CloudSun, label: "Data BMKG real-time" },
                { icon: Shield, label: "Kalibrasi laporan warga" },
                { icon: Bot, label: "Model prediksi lokal" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-medium text-[var(--foreground)]/70 shadow-sm">
                  <Icon className="h-3.5 w-3.5 text-emerald-700" />
                  {label}
                </div>
              ))}
            </div>

            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl glass-card-strong px-4 py-3 text-sm text-[var(--foreground)]/70 soft-shadow">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-emerald-700">Waktu lokal</span>
              <span>{clock} WIB</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-emerald-500/10 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] glass-card-strong p-6 shadow-[0_24px_60px_rgba(17,44,19,0.12)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(31,138,76,0.12),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(26,166,184,0.08),transparent_35%)]" />
              <div className="relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Ringkasan sistem</div>
                    <h2 className="mt-1 text-2xl font-black text-[var(--foreground)]">CuacaKita AI</h2>
                  </div>
                  <div className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">Live</div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  {stats.map((stat, index) => (
                    <div key={stat.label} className={`rounded-3xl border p-4 ${currentStat === index ? "border-emerald-500 bg-emerald-500/10" : "border-white/70 bg-white/70"}`}>
                      <div className="text-3xl font-black text-[var(--foreground)]">
                        {stat.value}
                        <span className="text-emerald-700">{stat.suffix}</span>
                      </div>
                      <div className="mt-1 text-xs font-medium text-[var(--foreground)]/55">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-3 rounded-3xl bg-white/75 p-4">
                  {[
                    { label: "Prediksi 12 jam", value: "Disaring dari tren BMKG + pola kelembapan", tone: "text-emerald-700" },
                    { label: "Aktivitas aman", value: "Pagi untuk kerja berat, sore untuk monitoring", tone: "text-teal-700" },
                    { label: "Sinyal risiko", value: "Fokus pada hujan, angin, dan kelembapan", tone: "text-amber-700" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3 rounded-2xl border border-white/80 bg-white/80 p-3">
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <div>
                        <div className="text-sm font-semibold text-[var(--foreground)]">{item.label}</div>
                        <div className={`mt-0.5 text-sm ${item.tone}`}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button onClick={() => onNavigate("weather")} className="inline-flex flex-col items-center gap-2 text-sm font-medium text-[var(--foreground)]/50 transition-colors hover:text-[var(--foreground)]">
            <span className="uppercase tracking-[0.25em]">Jelajahi</span>
            <ArrowDown className="h-5 w-5 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}