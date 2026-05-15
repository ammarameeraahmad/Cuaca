"use client";

import { useState } from "react";
import { AlertTriangle, Shield, Bug } from "lucide-react";

interface Pest {
  name: string;
  description: string;
  conditions: {
    temp_min: number;
    temp_max: number;
    humidity_min: number;
  };
  recommendations: string[];
  icon: string;
}

const PESTS: Pest[] = [
  {
    name: "Wereng Coklat",
    description: "Hama yang menyerang batang padi",
    conditions: { temp_min: 20, temp_max: 28, humidity_min: 70 },
    recommendations: [
      "Monitor berkala di area tepi sawah",
      "Terapkan pencegahan dengan varietas tahan",
      "Pertahankan sanitasi lahan",
      "Pertimbangkan aplikasi insektisida organik jika diperlukan",
    ],
    icon: "🐛",
  },
  {
    name: "Penyakit Blast",
    description: "Penyakit jamur pada daun dan leher padi",
    conditions: { temp_min: 16, temp_max: 26, humidity_min: 80 },
    recommendations: [
      "Pastikan drainase sawah optimal",
      "Hindari pemupukan nitrogen berlebih",
      "Gunakan varietas toleran",
      "Aplikasi fungisida jika gejala awal terlihat",
    ],
    icon: "🌾",
  },
  {
    name: "Belalang Hijau",
    description: "Hama yang memakan daun dan buah tanaman",
    conditions: { temp_min: 23, temp_max: 32, humidity_min: 60 },
    recommendations: [
      "Lakukan penjarangan gulma secara rutin",
      "Perangkap cahaya di malam hari",
      "Aplikasi pestisida nabati",
      "Pertahankan musuh alami di lahan",
    ],
    icon: "🦗",
  },
  {
    name: "Kerat Ubi",
    description: "Hama perusak umbi tanaman pertanian",
    conditions: { temp_min: 18, temp_max: 28, humidity_min: 65 },
    recommendations: [
      "Rotasi tanaman dengan bijak",
      "Panen hama secara manual",
      "Gunakan mulsa organik",
      "Aplikasi nematoda bermanfaat",
    ],
    icon: "🪲",
  },
  {
    name: "Ulat Grayak",
    description: "Hama yang menyerang daun dengan cara bergerombol",
    conditions: { temp_min: 21, temp_max: 30, humidity_min: 75 },
    recommendations: [
      "Panen manual ulat saat populasi rendah",
      "Semprot dengan Bt (Bacillus thuringiensis)",
      "Tanam tanaman trap (refugium)",
      "Jaga kelembaban tanah optimal",
    ],
    icon: "🐛",
  },
  {
    name: "Penggerek Batang",
    description: "Hama yang merusak struktur batang padi",
    conditions: { temp_min: 22, temp_max: 31, humidity_min: 70 },
    recommendations: [
      "Gunakan varietas tahan terhadap penggerek",
      "Pemupukan sesuai rekomendasi",
      "Jaga kelembaban lahan yang cukup",
      "Aplikasi insektisida tepat waktu jika diperlukan",
    ],
    icon: "🐛",
  },
];

export default function PestSection() {
  const [temperature, setTemperature] = useState(25);
  const [humidity, setHumidity] = useState(75);

  const calculateRiskLevel = (pest: Pest): "rendah" | "sedang" | "tinggi" => {
    const tempInRange = temperature >= pest.conditions.temp_min && temperature <= pest.conditions.temp_max;
    const humidityInRange = humidity >= pest.conditions.humidity_min;

    if (tempInRange && humidityInRange) {
      return "tinggi";
    } else if (tempInRange || humidityInRange) {
      return "sedang";
    }
    return "rendah";
  };

  const getRiskColor = (level: "rendah" | "sedang" | "tinggi") => {
    switch (level) {
      case "tinggi":
        return "from-red-500/10 to-red-600/5 border-red-300 bg-red-50";
      case "sedang":
        return "from-yellow-500/10 to-yellow-600/5 border-yellow-300 bg-yellow-50";
      case "rendah":
        return "from-green-500/10 to-green-600/5 border-green-300 bg-green-50";
    }
  };

  const getRiskBadgeColor = (level: "rendah" | "sedang" | "tinggi") => {
    switch (level) {
      case "tinggi":
        return "bg-red-200 text-red-800";
      case "sedang":
        return "bg-yellow-200 text-yellow-800";
      case "rendah":
        return "bg-green-200 text-green-800";
    }
  };

  return (
    <section id="forecast" className="relative w-full scroll-mt-24 bg-gradient-to-b from-slate-50/50 to-white py-20 sm:py-24">
      {/* Decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 top-20 h-64 w-64 rounded-full bg-gradient-to-br from-emerald-200/20 to-transparent blur-3xl"></div>
        <div className="absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-gradient-to-tr from-amber-200/20 to-transparent blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600">
            <Bug className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Analisis Risiko Hama</h2>
            <p className="text-slate-600">Deteksi potensi serangan hama berdasarkan kondisi cuaca</p>
          </div>
        </div>

        {/* Weather Condition Sliders */}
        <div className="mb-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h3 className="mb-6 text-lg font-semibold text-slate-900">Parameter Cuaca Real-time</h3>

          <div className="space-y-6">
            {/* Temperature Slider */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Suhu (°C)</label>
                <span className="text-2xl font-bold text-emerald-600">{temperature}°C</span>
              </div>
              <input
                type="range"
                min="10"
                max="35"
                step="1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>10°C</span>
                <span>35°C</span>
              </div>
            </div>

            {/* Humidity Slider */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Kelembaban (%)</label>
                <span className="text-2xl font-bold text-emerald-600">{humidity}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                step="1"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="mt-2 flex justify-between text-xs text-slate-500">
                <span>30%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pest Risk Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PESTS.map((pest) => {
            const riskLevel = calculateRiskLevel(pest);
            const riskLabel =
              riskLevel === "tinggi"
                ? "TINGGI - Tindakan Segera"
                : riskLevel === "sedang"
                  ? "SEDANG - Perhatian Khusus"
                  : "RENDAH - Monitor Berkala";

            return (
              <div
                key={pest.name}
                className={`group overflow-hidden rounded-xl border-2 bg-gradient-to-br p-6 transition-all duration-300 hover:shadow-lg ${getRiskColor(riskLevel)}`}
              >
                {/* Risk Badge */}
                <div className="mb-3 flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${getRiskBadgeColor(riskLevel)}`}>
                    {riskLevel === "tinggi" ? <AlertTriangle className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                    {riskLabel}
                  </span>
                </div>

                {/* Pest Info */}
                <div className="mb-4 flex items-start gap-3">
                  <span className="text-3xl">{pest.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">{pest.name}</h4>
                    <p className="text-sm text-slate-600">{pest.description}</p>
                  </div>
                </div>

                {/* Conditions */}
                <div className="mb-4 rounded-lg bg-white/50 p-3 text-xs">
                  <p className="font-semibold text-slate-700">Kondisi Picu:</p>
                  <p className="text-slate-600">
                    Suhu: {pest.conditions.temp_min}°C - {pest.conditions.temp_max}°C, Kelembaban: ≥ {pest.conditions.humidity_min}%
                  </p>
                </div>

                {/* Recommendations */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-700">Rekomendasi Penanganan:</p>
                  <ul className="space-y-1 text-xs text-slate-600">
                    {pest.recommendations.slice(0, 2).map((rec, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-emerald-600">✓</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                  {pest.recommendations.length > 2 && <p className="text-xs font-medium text-slate-500">+ {pest.recommendations.length - 2} rekomendasi lainnya</p>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-12 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-900">Tips Pencegahan Umum</h4>
              <ul className="mt-2 space-y-1 text-sm text-blue-800">
                <li>• Lakukan rotasi tanaman setiap musim</li>
                <li>• Jaga kebersihan dan sanitasi lahan</li>
                <li>• Gunakan varietas tanaman yang tahan hama</li>
                <li>• Pantau perkembangan hama secara rutin</li>
                <li>• Terapkan pengendalian terpadu (IPM) untuk hasil optimal</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
