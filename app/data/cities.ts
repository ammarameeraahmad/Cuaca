export interface City {
  name: string;
  adm4: string;
  prov: string;
  kabkota: string;
  lat: number;
  lon: number;
}

export const DEFAULT_ADM4 = "34.04.13.2001";

export const CITIES: City[] = [
  { name: "Caturharjo", adm4: "34.04.13.2001", prov: "DI Yogyakarta", kabkota: "Sleman", lat: -7.734, lon: 110.34 },
  { name: "Yogyakarta", adm4: "34.71.01.1001", prov: "DI Yogyakarta", kabkota: "Kota Yogyakarta", lat: -7.7956, lon: 110.3695 },
  { name: "Jakarta Pusat", adm4: "31.71.01.1001", prov: "DKI Jakarta", kabkota: "Kota Adm. Jakarta Pusat", lat: -6.1806, lon: 106.8294 },
  { name: "Bandung", adm4: "32.73.01.1001", prov: "Jawa Barat", kabkota: "Kota Bandung", lat: -6.9175, lon: 107.6191 },
  { name: "Semarang", adm4: "33.74.01.1001", prov: "Jawa Tengah", kabkota: "Kota Semarang", lat: -6.9667, lon: 110.4167 },
  { name: "Surabaya", adm4: "35.78.01.1001", prov: "Jawa Timur", kabkota: "Kota Surabaya", lat: -7.2575, lon: 112.7521 },
  { name: "Makassar", adm4: "73.71.01.1001", prov: "Sulawesi Selatan", kabkota: "Kota Makassar", lat: -5.1477, lon: 119.4327 },
  { name: "Medan", adm4: "12.71.01.1001", prov: "Sumatera Utara", kabkota: "Kota Medan", lat: 3.5952, lon: 98.6722 },
];

export const WEATHER_CODE: Record<number, { desc: string; icon: string; color: string }> = {
  0: { desc: "Cerah", icon: "☀️", color: "#f59e0b" },
  1: { desc: "Cerah Berawan", icon: "🌤️", color: "#38bdf8" },
  2: { desc: "Cerah Berawan", icon: "🌤️", color: "#38bdf8" },
  3: { desc: "Berawan", icon: "⛅", color: "#94a3b8" },
  4: { desc: "Berawan Tebal", icon: "☁️", color: "#64748b" },
  5: { desc: "Udara Kabur", icon: "🌫️", color: "#cbd5e1" },
  10: { desc: "Asap", icon: "💨", color: "#94a3b8" },
  45: { desc: "Kabut", icon: "🌁", color: "#cbd5e1" },
  60: { desc: "Hujan Ringan", icon: "🌦️", color: "#60a5fa" },
  61: { desc: "Hujan Ringan", icon: "🌦️", color: "#60a5fa" },
  63: { desc: "Hujan Sedang", icon: "🌧️", color: "#3b82f6" },
  65: { desc: "Hujan Lebat", icon: "🌧️", color: "#2563eb" },
  80: { desc: "Hujan Lokal", icon: "⛈️", color: "#8b5cf6" },
  95: { desc: "Hujan Petir", icon: "⛈️", color: "#7c3aed" },
  97: { desc: "Hujan Petir", icon: "⛈️", color: "#7c3aed" },
};