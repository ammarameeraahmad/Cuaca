"use client";

import { CloudSun, ExternalLink, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/70 bg-white/40 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/20">
                <CloudSun className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xl font-black text-[var(--foreground)]">CuacaKita AI</div>
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700">BMKG + ML lokal</div>
              </div>
            </div>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--foreground)]/65">
              Satu sistem cuaca pertanian yang menggabungkan data BMKG, laporan warga, dan model prediksi lokal untuk membantu keputusan kerja lapangan yang lebih aman.
            </p>
          </div>

          <div>
            <div className="text-sm font-bold text-[var(--foreground)]">Fitur utama</div>
            <ul className="mt-4 space-y-3 text-sm text-[var(--foreground)]/60">
              <li>Prakiraan cuaca BMKG</li>
              <li>Prediksi 12 jam berbasis model lokal</li>
              <li>AI tanya jawab pertanian</li>
              <li>Laporan warga lapangan</li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-bold text-[var(--foreground)]">Sumber resmi</div>
            <ul className="mt-4 space-y-3 text-sm text-[var(--foreground)]/60">
              <li><a href="https://www.bmkg.go.id" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-emerald-700"><ExternalLink className="h-3.5 w-3.5" />BMKG</a></li>
              <li><a href="https://data.bmkg.go.id" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-emerald-700"><ExternalLink className="h-3.5 w-3.5" />Data BMKG</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/70 pt-6 text-center sm:flex-row">
          <p className="text-sm text-[var(--foreground)]/45">© 2026 CuacaKita AI. Data cuaca mengikuti ketentuan penggunaan BMKG.</p>
          <p className="inline-flex items-center gap-1.5 text-sm text-[var(--foreground)]/45">Dibuat dengan <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" /> untuk petani Indonesia</p>
        </div>
      </div>
    </footer>
  );
}