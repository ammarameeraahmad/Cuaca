"use client";

import { useEffect, useState } from "react";
import { CloudSun, Menu, X, Bot, MessageSquare, Home, ChartNoAxesCombined } from "lucide-react";

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

const navItems = [
  { id: "home", label: "Beranda", icon: Home },
  { id: "weather", label: "Cuaca", icon: CloudSun },
  { id: "forecast", label: "Prediksi", icon: ChartNoAxesCombined },
  { id: "ai", label: "AI", icon: Bot },
  { id: "report", label: "Laporan", icon: MessageSquare },
];

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[rgba(248,251,244,0.85)] backdrop-blur-xl border-b border-[rgba(70,112,72,0.12)] shadow-[0_10px_30px_rgba(17,44,19,0.06)]" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          <button onClick={() => onNavigate("home")} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 transition-transform duration-300 group-hover:scale-105">
                <CloudSun className="h-5 w-5" />
              </div>
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
            </div>
            <div className="hidden sm:block text-left">
              <span className="block text-lg font-black tracking-tight text-[var(--foreground)]">CuacaKita AI</span>
              <span className="block text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">BMKG + ML lokal</span>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-1 rounded-full glass-card p-1">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${activeSection === id ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "text-[var(--foreground)]/70 hover:bg-white/70 hover:text-[var(--foreground)]"}`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => onNavigate("report")}
              className="rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              Lapor Sekarang
            </button>
          </div>

          <button onClick={() => setMenuOpen((value) => !value)} className="lg:hidden rounded-full p-2.5 text-[var(--foreground)] hover:bg-white/70">
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden mb-4 rounded-3xl glass-card-strong p-3 shadow-xl">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  onNavigate(id);
                  setMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${activeSection === id ? "bg-emerald-600 text-white" : "text-[var(--foreground)]/70 hover:bg-white/70"}`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}