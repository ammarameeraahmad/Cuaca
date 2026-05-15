"use client";

import { useMemo, useState } from "react";
import { CloudSun, Droplets, MapPin, Search, Thermometer, Wind, AlertTriangle } from "lucide-react";
import { ADM4_CITIES, searchADM4, type ADM4Location } from "@/data/adm4-cities";
import { WEATHER_CODE } from "@/data/cities";
import type { BMKGResponse, ForecastSummary, WeatherPoint } from "@/lib/weather";

interface WeatherSectionProps {
  selectedCity: ADM4Location;
  onSelectCity: (city: ADM4Location) => void;
  loading: boolean;
  error: string | null;
  data: BMKGResponse | null;
  forecast: ForecastSummary | null;
  source: "bmkg" | "fallback";
  onNavigate: (section: string) => void;
}

export default function WeatherSection({ 
  selectedCity, 
  onSelectCity, 
  loading, 
  error, 
  data, 
  forecast, 
  source, 
  onNavigate 
}: WeatherSectionProps) {
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [activeDay, setActiveDay] = useState(0);

  const filteredCities = useMemo(
    () => (search.trim() ? searchADM4(search) : ADM4_CITIES.slice(0, 15)),
    [search]
  );

  const todayForecast: WeatherPoint[] = data?.data.cuaca?.[activeDay] ?? [];
  const currentWeather = todayForecast[0] ?? null;
  const weatherMeta = currentWeather ? WEATHER_CODE[currentWeather.weather] ?? WEATHER_CODE[3] : null;

  return (
    <section id="weather" className="relative py-16 lg:py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-900">
            <CloudSun className="h-4 w-4" />
            Prakiraan Cuaca Real-time
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Cuaca untuk Keputusan Tani Anda
          </h2>
          <p className="mt-3 text-base text-gray-600 max-w-2xl mx-auto">
            Pilih daerah Anda dan lihat prakiraan cuaca per jam untuk membantu merencanakan pekerjaan di lapangan
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: City Selector */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                <MapPin className="inline h-5 w-5 mr-2 text-blue-600" />
                Pilih Wilayah
              </label>

              {/* Search Input */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowResults(true);
                  }}
                  onFocus={() => setShowResults(true)}
                  placeholder="Cari nama wilayah atau kode ADM4..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-900 text-sm"
                />
              </div>

              {/* Results Dropdown */}
              {showResults && (
                <div className="absolute top-24 left-6 right-6 z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city) => (
                      <button
                        key={city.adm4}
                        onClick={() => {
                          onSelectCity(city);
                          setSearch("");
                          setShowResults(false);
                          setActiveDay(0);
                        }}
                        className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition ${
                          selectedCity.adm4 === city.adm4 ? "bg-blue-100 font-semibold text-blue-900" : "text-gray-700 text-sm"
                        }`}
                      >
                        <div className="font-medium text-sm">{city.name}</div>
                        <div className="text-xs text-gray-500">Kode: {city.adm4}</div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-sm">Tidak ada wilayah ditemukan</div>
                  )}
                </div>
              )}

              {/* Selected City Display */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
                <div className="text-xs text-blue-600 font-semibold">WILAYAH TERPILIH</div>
                <div className="text-lg font-bold text-gray-900 mt-1">{selectedCity.name}</div>
                <div className="text-sm text-gray-600">Kode: {selectedCity.adm4}</div>
              </div>

              {/* Data Source Info */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                <div className="font-semibold text-green-900">📡 Data dari BMKG</div>
                <div className="text-green-800 text-xs mt-1">
                  {source === "bmkg" ? "Data real-time dari Badan Meteorologi Indonesia" : "Data simulasi (mode offline)"}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Weather Display */}
          <div className="space-y-4">
            {/* Current Weather Card */}
            {currentWeather && weatherMeta ? (
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-md p-6 text-white">
                <div className="text-sm font-semibold opacity-90">Kondisi Sekarang</div>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <div className="text-5xl font-bold">{currentWeather.t}°</div>
                    <div className="text-lg mt-1">{weatherMeta.desc}</div>
                  </div>
                    <div className="text-6xl">{weatherMeta.icon}</div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div className="bg-white/20 rounded-lg p-2">
                    <Droplets className="h-4 w-4 mb-1" />
                      <div className="font-semibold">{currentWeather.hu}%</div>
                    <div className="text-xs opacity-75">Kelembaban</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-2">
                    <Wind className="h-4 w-4 mb-1" />
                      <div className="font-semibold">{currentWeather.ws} m/s</div>
                    <div className="text-xs opacity-75">Angin</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-2">
                    <Thermometer className="h-4 w-4 mb-1" />
                      <div className="font-semibold">{currentWeather.t}°</div>
                    <div className="text-xs opacity-75">Maks</div>
                  </div>
                </div>
              </div>
            ) : loading ? (
              <div className="bg-gray-100 rounded-2xl p-8 text-center">
                <div className="animate-spin inline-block h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                <p className="mt-3 text-gray-600 font-semibold">Memuat data cuaca...</p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <AlertTriangle className="inline h-5 w-5 text-red-600 mr-2" />
                <p className="text-red-900 font-semibold text-sm">{error || "Data tidak tersedia"}</p>
              </div>
            )}

            {/* Hourly Forecast */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Prakiraan Per Jam (12 Jam Ke Depan)</h3>
              <div className="grid grid-cols-4 gap-2 overflow-x-auto pb-2">
                {todayForecast.slice(0, 12).map((point, idx) => {
                  const meta = WEATHER_CODE[point.weather] ?? WEATHER_CODE[3];
                  return (
                    <div key={idx} className="flex-shrink-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 text-center text-sm border border-blue-200">
                      <div className="font-semibold text-gray-900 text-xs">{point.datetime?.split(" ")[1] ?? `${idx * 3}:00`}</div>
                        <div className="text-3xl my-2">{meta.icon}</div>
                      <div className="font-bold text-blue-900">{point.t}°</div>
                      <div className="text-xs text-gray-600 mt-1 line-clamp-2">{meta.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
