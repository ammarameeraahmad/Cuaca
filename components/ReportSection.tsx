"use client";

import { useState } from "react";
import { CheckCircle, Clock, Filter, MessageSquare, MapPin, TrendingUp, ThumbsDown, ThumbsUp, AlertTriangle } from "lucide-react";

interface Report {
  id: string;
  nama: string;
  lokasi: string;
  kota: string;
  kategori: string;
  kondisiAktual: string;
  kondisiDiharapkan: string;
  deskripsi: string;
  waktu: Date;
  status: "pending" | "verified" | "ditolak";
  upvotes: number;
  downvotes: number;
  userVoted: "up" | "down" | null;
}

const INITIAL_REPORTS: Report[] = [
  {
    id: "1",
    nama: "Pak Slamet",
    lokasi: "Caturharjo, Sleman",
    kota: "DI Yogyakarta",
    kategori: "Hujan Ekstrem",
    kondisiAktual: "Hujan deras sejak subuh",
    kondisiDiharapkan: "BMKG memprediksi cerah berawan",
    deskripsi: "Lahan mulai tergenang dan beberapa petak padi muda rebah. Kami pakai laporan ini untuk menyesuaikan rencana kerja pagi.",
    waktu: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "verified",
    upvotes: 28,
    downvotes: 1,
    userVoted: null,
  },
  {
    id: "2",
    nama: "Bu Ratna",
    lokasi: "Ciawi, Bogor",
    kota: "Jawa Barat",
    kategori: "Suhu Tinggi",
    kondisiAktual: "Siang terasa jauh lebih panas dari prakiraan",
    kondisiDiharapkan: "BMKG memprediksi 32°C",
    deskripsi: "Cabai dan sayuran daun tampak stres di jam 11-14. Kami menahan siram dan mulsa tambahan dipasang.",
    waktu: new Date(Date.now() - 5 * 60 * 60 * 1000),
    status: "pending",
    upvotes: 12,
    downvotes: 0,
    userVoted: null,
  },
  {
    id: "3",
    nama: "Mas Hendra",
    lokasi: "Polanharjo, Klaten",
    kota: "Jawa Tengah",
    kategori: "Angin Kencang",
    kondisiAktual: "Angin cukup kuat menjelang malam",
    kondisiDiharapkan: "Angin ringan",
    deskripsi: "Dahan kecil patah dan beberapa tanaman muda miring. Laporan ini membantu kami memberi peringatan antar tetangga.",
    waktu: new Date(Date.now() - 11 * 60 * 60 * 1000),
    status: "verified",
    upvotes: 41,
    downvotes: 2,
    userVoted: null,
  },
];

const statusConfig = {
  pending: { label: "Dalam tinjauan", icon: Clock, tone: "text-amber-700", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  verified: { label: "Terverifikasi", icon: CheckCircle, tone: "text-emerald-700", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  ditolak: { label: "Ditolak", icon: AlertTriangle, tone: "text-rose-700", bg: "bg-rose-500/10", border: "border-rose-500/20" },
};

export default function ReportSection() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | Report["status"]>("all");
  const [form, setForm] = useState({ nama: "", lokasi: "", kota: "", kondisiAktual: "", kondisiDiharapkan: "", deskripsi: "" });

  const filteredReports = reports.filter((report) => filterStatus === "all" || report.status === filterStatus);

  const handleVote = (id: string, type: "up" | "down") => {
    setReports((current) =>
      current.map((report) => {
        if (report.id !== id) return report;
        if (report.userVoted === type) {
          return {
            ...report,
            upvotes: type === "up" ? report.upvotes - 1 : report.upvotes,
            downvotes: type === "down" ? report.downvotes - 1 : report.downvotes,
            userVoted: null,
          };
        }

        return {
          ...report,
          upvotes: type === "up" ? report.upvotes + 1 : report.userVoted === "up" ? report.upvotes - 1 : report.upvotes,
          downvotes: type === "down" ? report.downvotes + 1 : report.userVoted === "down" ? report.downvotes - 1 : report.downvotes,
          userVoted: type,
        };
      })
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setReports((current) => [
      {
        id: `${Date.now()}`,
        ...form,
        kategori: "Laporan Warga",
        waktu: new Date(),
        status: "pending",
        upvotes: 0,
        downvotes: 0,
        userVoted: null,
      },
      ...current,
    ]);
    setForm({ nama: "", lokasi: "", kota: "", kondisiAktual: "", kondisiDiharapkan: "", deskripsi: "" });
    setShowForm(false);
  };

  const stats = {
    total: reports.length,
    verified: reports.filter((report) => report.status === "verified").length,
    pending: reports.filter((report) => report.status === "pending").length,
  };

  return (
    <section id="report" className="relative py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-2 text-sm font-medium text-emerald-800">
            <MessageSquare className="h-4 w-4" />
            Laporan warga
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl">Kalibrasi model dengan kondisi lapangan</h2>
          <p className="mt-4 text-base leading-7 text-[var(--foreground)]/70 sm:text-lg">
            Laporan yang konsisten membantu memperkaya pembacaan cuaca mikro, terutama saat BMKG dan kondisi lahan berbeda.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total laporan", value: stats.total, tone: "text-sky-700" },
            { label: "Terverifikasi", value: stats.verified, tone: "text-emerald-700" },
            { label: "Dalam tinjauan", value: stats.pending, tone: "text-amber-700" },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.75rem] glass-card-strong p-5 text-center soft-shadow">
              <div className={`text-3xl font-black ${item.tone}`}>{item.value}</div>
              <div className="mt-1 text-sm text-[var(--foreground)]/55">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[var(--foreground)]/35" />
              {(["all", "pending", "verified"] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${filterStatus === status ? "bg-emerald-600 text-white" : "bg-white/70 text-[var(--foreground)]/65 hover:bg-white"}`}
                >
                  {status === "all" ? "Semua" : status === "pending" ? "Tinjauan" : "Terverifikasi"}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredReports.map((report) => {
                const status = statusConfig[report.status];
                const StatusIcon = status.icon;

                return (
                  <div key={report.id} className="rounded-[2rem] glass-card-strong overflow-hidden soft-shadow">
                    <div className="border-b border-white/70 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-sm font-black text-white">{report.nama.charAt(0)}</div>
                          <div>
                            <div className="font-bold text-[var(--foreground)]">{report.nama}</div>
                            <div className="mt-1 flex items-center gap-1 text-xs text-[var(--foreground)]/45"><MapPin className="h-3.5 w-3.5" />{report.lokasi}, {report.kota}</div>
                          </div>
                        </div>
                        <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${status.bg} ${status.border} ${status.tone}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 p-5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--foreground)]/45">
                        <span className="rounded-full bg-white/70 px-3 py-1 font-semibold text-[var(--foreground)]/60">{report.kategori}</span>
                        <span>{report.waktu.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border border-rose-500/15 bg-rose-500/6 p-4">
                          <div className="text-xs font-semibold text-rose-700">Kondisi aktual</div>
                          <div className="mt-1 text-sm leading-6 text-[var(--foreground)]/70">{report.kondisiAktual}</div>
                        </div>
                        <div className="rounded-2xl border border-sky-500/15 bg-sky-500/6 p-4">
                          <div className="text-xs font-semibold text-sky-700">Prakiraan BMKG</div>
                          <div className="mt-1 text-sm leading-6 text-[var(--foreground)]/70">{report.kondisiDiharapkan}</div>
                        </div>
                      </div>

                      <p className="text-sm leading-7 text-[var(--foreground)]/70">{report.deskripsi}</p>

                      <div className="flex items-center gap-3 border-t border-white/70 pt-4">
                        <span className="flex-1 text-xs text-[var(--foreground)]/40">Apakah laporan ini akurat?</span>
                        <button onClick={() => handleVote(report.id, "up")} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold ${report.userVoted === "up" ? "bg-emerald-600 text-white" : "bg-white/70 text-[var(--foreground)]/55 hover:bg-white"}`}>
                          <ThumbsUp className="h-3.5 w-3.5" />
                          {report.upvotes}
                        </button>
                        <button onClick={() => handleVote(report.id, "down")} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold ${report.userVoted === "down" ? "bg-rose-600 text-white" : "bg-white/70 text-[var(--foreground)]/55 hover:bg-white"}`}>
                          <ThumbsDown className="h-3.5 w-3.5" />
                          {report.downvotes}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 h-fit rounded-[2rem] glass-card-strong p-6 soft-shadow">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Kontribusi</div>
                <div className="mt-1 text-2xl font-black text-[var(--foreground)]">Lapor kondisi lapangan</div>
              </div>
              <button onClick={() => setShowForm((value) => !value)} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">{showForm ? "Tutup" : "Tambah"}</button>
            </div>

            <p className="mt-3 text-sm leading-7 text-[var(--foreground)]/70">Laporan yang masuk dapat dipakai untuk membaca perbedaan BMKG vs kondisi mikro di lahan.</p>

            {showForm ? (
              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                {[
                  { key: "nama", label: "Nama" },
                  { key: "lokasi", label: "Lokasi" },
                  { key: "kota", label: "Kota / Kabupaten" },
                  { key: "kondisiAktual", label: "Kondisi aktual" },
                  { key: "kondisiDiharapkan", label: "Prakiraan BMKG" },
                  { key: "deskripsi", label: "Deskripsi" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-[var(--foreground)]/45">{field.label}</label>
                    {field.key === "deskripsi" ? (
                      <textarea
                        required
                        value={form[field.key as keyof typeof form]}
                        onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                        rows={4}
                        className="w-full rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-emerald-500"
                      />
                    ) : (
                      <input
                        required
                        value={form[field.key as keyof typeof form]}
                        onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
                        className="w-full rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-emerald-500"
                      />
                    )}
                  </div>
                ))}

                <button type="submit" className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white">
                  <TrendingUp className="h-4 w-4" />
                  Kirim laporan
                </button>
              </form>
            ) : (
              <div className="mt-5 rounded-[1.5rem] border border-dashed border-emerald-500/25 bg-emerald-500/8 p-5 text-sm leading-7 text-emerald-900">
                Laporan warga akan menaikkan kualitas bacaan lokal, terutama untuk perubahan cepat seperti hujan deras mendadak, angin kencang, atau suhu yang lebih panas dari prakiraan.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}