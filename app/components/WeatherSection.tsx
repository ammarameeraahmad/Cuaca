"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, ChevronRight, CloudSun, Droplets, MapPin, RefreshCw, Search, Thermometer, Wind, Eye } from "lucide-react";
import { CITIES, type City, WEATHER_CODE } from "@/data/cities";
import type { BMKGResponse, ForecastSummary, WeatherPoint } from "@/lib/weather";

interface WeatherSectionProps {
  selectedCity: City;
  onSelectCity: (city: City) => void;
  loading: boolean;
  error: string | null;
  data: BMKGResponse | null;
  forecast: ForecastSummary | null;
  source: "bmkg" | "fallback";
  onNavigate: (section: string) => void;
}

export default function WeatherSection({ selectedCity, onSelectCity, loading, error, data, forecast, source, onNavigate }: WeatherSectionProps) {
  const [search, setSearch] = useState("");
  const [activeDay, setActiveDay] = useState(0);

  const filteredCities = useMemo(
    () => CITIES.filter((city) => city.name.toLowerCase().includes(search.toLowerCase()) || city.prov.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  const todayForecast: WeatherPoint[] = data?.data.cuaca?.[activeDay] ?? [];
  const currentWeather = todayForecast[0] ?? null;
  const weatherMeta = currentWeather ? WEATHER_CODE[currentWeather.weather] ?? WEATHER_CODE[3] : null;
  const allDays = data?.data.cuaca ?? [];

  return (
    <section id="weather" className="relative py-20 lg:py-24">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(247,250,243,0.5)_0%,rgba(238,245,232,0.9)_38%,rgba(243,247,239,0.98)_100%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full glass-card px-4 py-2 text-sm font-medium text-emerald-800">
            <CloudSun className="h-4 w-4" />
            Prakiraan BMKG + prediksi lokal
          </div>
          <h2 className="mt-5 text-3xl font-black tracking-tight text-[var(--foreground)] sm:text-4xl lg:text-5xl">
            Cuaca real-time untuk keputusan lapangan
          </h2>
          <p className="mt-4 text-base leading-7 text-[var(--foreground)]/70 sm:text-lg">
            Pilih wilayah, baca kondisi sekarang, lalu lihat prediksi 12 jam yang sudah disaring oleh model lokal untuk membantu kerja tani yang lebih aman.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] glass-card-strong p-6 soft-shadow">
              <div className="flex items-center gap-2 text-lg font-bold text-[var(--foreground)]">
                <MapPin className="h-5 w-5 text-emerald-700" />
                Pilih wilayah
              </div>

              <div className="relative mt-4">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--foreground)]/35" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari kota atau provinsi"
                  className="w-full rounded-2xl border border-white/70 bg-white/80 py-3 pl-10 pr-4 text-sm text-[var(--foreground)] outline-none transition focus:border-emerald-500"
                />
              </div>

              <div className="mt-4 max-h-[28rem] space-y-2 overflow-auto pr-1">
                {filteredCities.map((city) => (
                  <button
                    key={city.adm4}
                    onClick={() => {
                      onSelectCity(city);
                      setActiveDay(0);
                    }}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all ${selectedCity.adm4 === city.adm4 ? "border-emerald-500 bg-emerald-500/10 text-[var(--foreground)]" : "border-white/70 bg-white/70 text-[var(--foreground)]/75 hover:bg-white/90"}`}
                  >
                    <div>
                      <div className="font-semibold">{city.name}</div>
                      <div className="text-xs text-[var(--foreground)]/45">{city.prov}</div>
                    </div>
                    <ChevronRight className={`h-4 w-4 ${selectedCity.adm4 === city.adm4 ? "text-emerald-700" : "text-[var(--foreground)]/30"}`} />
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-4 text-sm text-emerald-900">
                <div className="font-semibold">Sumber data</div>
                <div className="mt-1 text-emerald-900/75">BMKG resmi, fallback lokal, dan model prediksi internal saat API tidak tersedia.</div>
              </div>
            </div>

            <div className="rounded-[2rem] glass-card-strong p-6 soft-shadow">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Model insight</div>
                  <h3 className="mt-2 text-2xl font-black text-[var(--foreground)]">{forecast?.title ?? "Menunggu data"}</h3>
                </div>
                <div className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">{forecast?.confidence ?? 0}% confidence</div>
              </div>

              <p className="mt-4 text-sm leading-7 text-[var(--foreground)]/70">{forecast?.subtitle ?? "Data sedang dimuat dari BMKG dan disiapkan untuk prediksi lokal."}</p>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  { label: "Stabilitas", value: `${forecast?.score ?? 0}%`, tone: "text-emerald-700" },
                  { label: "Risiko", value: forecast?.riskLabel ?? "-", tone: "text-amber-700" },
                  { label: "Jendela aman", value: forecast?.bestWindow ?? "-", tone: "text-teal-700" },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/70 bg-white/75 p-3 text-center">
                    <div className={`text-sm font-semibold ${item.tone}`}>{item.label}</div>
                    <div className="mt-1 text-sm font-black text-[var(--foreground)]">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {error && (
              <div className="rounded-[1.5rem] border border-amber-500/25 bg-amber-500/10 p-4 text-amber-900">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
                  <div>
                    <div className="font-semibold">Mode fallback aktif</div>
                    <p className="mt-1 text-sm leading-6 text-amber-900/75">{error}. Sistem tetap menampilkan prakiraan lokal yang sudah disimulasikan agar antarmuka tidak berhenti.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="overflow-hidden rounded-[2rem] glass-card-strong p-6 soft-shadow">
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(31,138,76,0.12),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(26,166,184,0.08),transparent_34%)]" />

              {loading ? (
                <div className="flex min-h-[24rem] items-center justify-center rounded-[1.5rem] border border-white/70 bg-white/70">
                  <RefreshCw className="h-8 w-8 animate-spin text-emerald-700" />
                </div>
              ) : currentWeather ? (
                <>
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-[var(--foreground)]/55">
                        <MapPin className="h-4 w-4" />
                        {selectedCity.name}, {selectedCity.prov}
                      </div>
                      <div className="mt-4 flex items-end gap-5">
                        <div className="text-7xl">{weatherMeta?.icon ?? "🌤️"}</div>
                        <div>
                          <div className="text-6xl font-black leading-none text-[var(--foreground)]">{currentWeather.t}°</div>
                          <div className="mt-2 text-xl font-semibold text-[var(--foreground)]/75">{currentWeather.weather_desc}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-[31rem]">
                      {[
                        { icon: Droplets, label: "Kelembapan", value: `${currentWeather.hu}%`, tone: "text-sky-700" },
                        { icon: Wind, label: "Angin", value: `${currentWeather.ws.toFixed(1)} km/j`, tone: "text-teal-700" },
                        { icon: Eye, label: "Pandang", value: currentWeather.vs_text, tone: "text-violet-700" },
                        { icon: Thermometer, label: "Awan", value: `${currentWeather.tcc}%`, tone: "text-amber-700" },
                      ].map(({ icon: Icon, label, value, tone }) => (
                        <div key={label} className="rounded-2xl border border-white/70 bg-white/80 p-4">
                          <Icon className={`h-5 w-5 ${tone}`} />
                          <div className="mt-2 text-lg font-black text-[var(--foreground)]">{value}</div>
                          <div className="text-xs text-[var(--foreground)]/45">{label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-emerald-500/15 bg-emerald-500/8 p-4 text-sm text-emerald-900">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>BMKG {source === "bmkg" ? "aktif" : "fallback lokal"}</span>
                      <span className="text-emerald-900/55">•</span>
                      <span>Prediksi model: {forecast?.confidence ?? 0}% confidence</span>
                      <span className="text-emerald-900/55">•</span>
                      <span>Arah angin {currentWeather.wd}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-[1.5rem] border border-white/70 bg-white/70 p-10 text-center text-[var(--foreground)]/50">
                  Pilih kota untuk menampilkan cuaca.
                </div>
              )}
            </div>

            {allDays.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-3">
                {allDays.map((dayData, index) => {
                  const temps = getDayTemp(dayData);
                  return (
                    <button
                      key={index}
                      onClick={() => setActiveDay(index)}
                      className={`rounded-[1.5rem] border p-4 text-center transition-all ${activeDay === index ? "border-emerald-500 bg-emerald-500/10" : "border-white/70 bg-white/75 hover:bg-white/90"}`}
                    >
                      <div className="text-2xl">{getDayIcon(dayData)}</div>
                      <div className="mt-2 text-sm font-bold text-[var(--foreground)]">{getDayLabel(index)}</div>
                      <div className="text-xs text-[var(--foreground)]/45">{getDateLabel(index)}</div>
                      <div className="mt-2 text-xs font-semibold"><span className="text-amber-700">{temps.max}°</span><span className="mx-1 text-[var(--foreground)]/25">/</span><span className="text-sky-700">{temps.min}°</span></div>
                    </button>
                  );
                })}
              </div>
            )}

            {todayForecast.length > 0 && (
              <div id="forecast" className="rounded-[2rem] glass-card-strong p-6 soft-shadow">
                <div className="flex items-center gap-2 text-lg font-bold text-[var(--foreground)]">
                  <CloudSun className="h-5 w-5 text-emerald-700" />
                  Prediksi per jam
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {forecast?.points?.length
                    ? forecast.points.map((point) => (
                        <div key={`${point.label}-${point.timeLabel}`} className="rounded-2xl border border-white/70 bg-white/80 p-4 text-center">
                          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--foreground)]/45">{point.label}</div>
                          <div className="mt-2 text-sm text-[var(--foreground)]/55">{point.timeLabel}</div>
                          <div className="my-3 text-4xl">{point.icon}</div>
                          <div className="text-2xl font-black text-[var(--foreground)]">{point.t}°</div>
                          <div className="mt-1 text-xs text-[var(--foreground)]/60">{point.weather_desc}</div>
                          <div className="mt-3 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-800">Hujan {point.rainProbability}%</div>
                          <div className="mt-2 text-xs text-[var(--foreground)]/55">Confidence {point.confidence}%</div>
                          <div className="mt-2 text-xs font-medium text-[var(--foreground)]/70">{point.activity}</div>
                        </div>
                      ))
                    : todayForecast.map((point, index) => {
                        const dt = new Date(point.local_datetime || point.datetime);
                        const hour = dt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
                        const meta = WEATHER_CODE[point.weather] ?? WEATHER_CODE[3];

                        return (
                          <div key={index} className="rounded-2xl border border-white/70 bg-white/80 p-4 text-center">
                            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--foreground)]/45">{hour}</div>
                            <div className="my-3 text-4xl">{meta.icon}</div>
                            <div className="text-2xl font-black text-[var(--foreground)]">{point.t}°</div>
                            <div className="mt-1 text-xs text-[var(--foreground)]/60">{point.weather_desc}</div>
                            <div className="mt-3 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-800">{point.hu}% lembap</div>
                          </div>
                        );
                      })}
                </div>
              </div>
            )}

            <button
              onClick={() => onNavigate("ai")}
              className="flex w-full items-center justify-between rounded-[1.5rem] border border-emerald-500/20 bg-emerald-500/8 px-5 py-4 text-left transition-all hover:border-emerald-500/35 hover:bg-emerald-500/12"
            >
              <div>
                <div className="text-sm font-semibold text-[var(--foreground)]">Lihat rekomendasi AI berdasarkan cuaca ini</div>
                <div className="text-sm text-[var(--foreground)]/50">Gunakan model lokal untuk menanyakan aktivitas pertanian paling aman.</div>
              </div>
              <ChevronRight className="h-5 w-5 text-emerald-700" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function getDayLabel(index: number) {
  const date = new Date();
  date.setDate(date.getDate() + index);
  if (index === 0) return "Hari ini";
  if (index === 1) return "Besok";
  return date.toLocaleDateString("id-ID", { weekday: "long" });
}

function getDateLabel(index: number) {
  const date = new Date();
  date.setDate(date.getDate() + index);
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function getDayIcon(dayData: WeatherPoint[]) {
  if (!dayData.length) return "☁️";
  const point = dayData[Math.floor(dayData.length / 2)];
  return WEATHER_CODE[point.weather]?.icon ?? "☁️";
}

function getDayTemp(dayData: WeatherPoint[]) {
  if (!dayData.length) return { min: "--", max: "--" };
  const temps = dayData.map((point) => point.t);
  return {
    min: Math.min(...temps),
    max: Math.max(...temps),
  };
}