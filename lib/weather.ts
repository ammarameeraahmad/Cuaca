import { WEATHER_CODE } from "@/data/cities";

export interface WeatherPoint {
  datetime: string;
  local_datetime: string;
  t: number;
  hu: number;
  weather: number;
  weather_desc: string;
  weather_desc_en: string;
  ws: number;
  wd: string;
  tcc: number;
  tp: number;
  vs: number;
  vs_text: string;
  image: string;
}

export interface BMKGResponse {
  lokasi: {
    provinsi: string;
    kotkab: string;
    kecamatan: string;
    desa: string;
    lon: number;
    lat: number;
    timezone: string;
  };
  data: {
    cuaca: WeatherPoint[][];
  };
}

export interface ForecastPoint {
  label: string;
  timeLabel: string;
  t: number;
  hu: number;
  ws: number;
  weather: number;
  weather_desc: string;
  icon: string;
  rainProbability: number;
  confidence: number;
  activity: string;
}

export interface ForecastSummary {
  title: string;
  subtitle: string;
  confidence: number;
  score: number;
  trendLabel: string;
  riskLabel: string;
  bestWindow: string;
  points: ForecastPoint[];
}

export function buildForecast(data: BMKGResponse): ForecastSummary {
  const flat = data.data.cuaca.flat().slice(0, 8);
  const points = flat.map((point, index) => {
    const baseRain = getRainBase(point.weather);
    const rainProbability = clamp(
      baseRain + Math.max(0, (point.hu - 55) / 150) + Math.max(0, (point.tcc - 40) / 180) + Math.max(0, (point.ws - 10) / 120) + index * 0.015,
      0.05,
      0.98
    );

    const confidence = clamp(0.89 - index * 0.03 + (point.tcc > 65 ? 0.02 : 0) - (point.weather >= 60 ? 0.03 : 0), 0.45, 0.96);

    return {
      label: formatLabel(point.datetime, index),
      timeLabel: formatClock(point.datetime),
      t: round(point.t + (index > 0 ? (point.t - flat[index - 1].t) * 0.15 : 0)),
      hu: Math.round(clamp(point.hu + rainProbability * 4, 0, 100)),
      ws: round(point.ws + Math.max(0, index - 2) * 0.25),
      weather: chooseWeatherCode(rainProbability, point.weather),
      weather_desc: chooseWeatherLabel(rainProbability, point.weather),
      icon: chooseWeatherIcon(rainProbability, point.weather),
      rainProbability: Math.round(rainProbability * 100),
      confidence: Math.round(confidence * 100),
      activity: recommendActivity(rainProbability, point.t, point.hu),
    } satisfies ForecastPoint;
  });

  const avgRain = points.reduce((sum, point) => sum + point.rainProbability, 0) / Math.max(1, points.length);
  const avgConfidence = points.reduce((sum, point) => sum + point.confidence, 0) / Math.max(1, points.length);
  const isWet = avgRain >= 55;
  const title = isWet ? "Peluang hujan meningkat" : avgRain >= 35 ? "Cuaca cenderung berubah" : "Cuaca relatif stabil";
  const subtitle = isWet
    ? "Model lokal membaca kelembapan dan awan yang naik, jadi jendela kerja lapangan lebih aman di pagi hari."
    : avgRain >= 35
      ? "Ada fluktuasi awan dan kelembapan, jadi cek ulang sebelum semprot atau panen."
      : "Pola cuaca mendukung aktivitas luar ruang dengan risiko hujan yang rendah.";

  const bestWindow = points.find((point) => point.rainProbability < 35)?.label ?? points[0]?.label ?? "Hari ini";

  return {
    title,
    subtitle,
    confidence: Math.round(avgConfidence),
    score: Math.round(100 - avgRain),
    trendLabel: avgRain >= 55 ? "Lebih basah" : avgRain >= 35 ? "Berubah-ubah" : "Lebih kering",
    riskLabel: avgRain >= 65 ? "Risiko tinggi" : avgRain >= 40 ? "Risiko sedang" : "Risiko rendah",
    bestWindow,
    points,
  };
}

export function createFallbackWeather(adm4: string): BMKGResponse {
  const isSleman = adm4 === "34.04.13.2001";
  const now = new Date();
  const weatherSets: WeatherPoint[][] = [];

  for (let day = 0; day < 3; day += 1) {
    const points: WeatherPoint[] = [];
    [0, 6, 12, 18].forEach((hour) => {
      const dt = new Date(now);
      dt.setDate(dt.getDate() + day);
      dt.setHours(hour, 0, 0, 0);

      const codeOptions = hour < 6 ? [1, 3, 60] : hour < 12 ? [1, 3, 63] : hour < 18 ? [3, 60, 63] : [3, 60, 95];
      const code = codeOptions[(day + hour) % codeOptions.length];
      const baseTemp = isSleman ? 29 : 30;
      const temperature = baseTemp + (hour === 12 ? 3 : hour === 18 ? 1 : hour === 0 ? -4 : -1) + day;
      const humidity = isSleman ? 72 + day * 2 : 68 + day * 3;

      points.push({
        datetime: dt.toISOString(),
        local_datetime: dt.toLocaleString("id-ID"),
        t: temperature,
        hu: humidity,
        weather: code,
        weather_desc: WEATHER_CODE[code]?.desc ?? "Berawan",
        weather_desc_en: WEATHER_CODE[code]?.desc ?? "Cloudy",
        ws: 5 + day + (hour >= 12 ? 2 : 0),
        wd: hour >= 12 ? "SE" : "E",
        tcc: code >= 60 ? 72 : 42,
        tp: code >= 60 ? 3.2 + day * 0.4 : 0,
        vs: 8000,
        vs_text: "> 10 km",
        image: `https://api-apps.bmkg.go.id/storage/icon/cuaca/${getIconName(code, hour)}.svg`,
      });
    });
    weatherSets.push(points);
  }

  return {
    lokasi: isSleman
      ? {
          provinsi: "DI Yogyakarta",
          kotkab: "Sleman",
          kecamatan: "Sleman",
          desa: "Caturharjo",
          lon: 110.34,
          lat: -7.734,
          timezone: "+0700",
        }
      : {
          provinsi: "DKI Jakarta",
          kotkab: "Kota Administrasi Jakarta Pusat",
          kecamatan: "Gambir",
          desa: "Gambir",
          lon: 106.8294,
          lat: -6.1806,
          timezone: "+0700",
        },
    data: { cuaca: weatherSets },
  };
}

function getRainBase(code: number) {
  if (code <= 2) return 0.1;
  if (code <= 4) return 0.24;
  if (code === 5 || code === 10 || code === 45) return 0.18;
  if (code === 60 || code === 61) return 0.55;
  if (code === 63 || code === 65 || code === 80) return 0.72;
  if (code === 95 || code === 97) return 0.88;
  return 0.35;
}

function chooseWeatherCode(rainProbability: number, fallbackCode: number) {
  if (rainProbability >= 0.82) return 95;
  if (rainProbability >= 0.65) return 63;
  if (rainProbability >= 0.48) return 60;
  if (rainProbability >= 0.32) return 3;
  return fallbackCode <= 4 ? fallbackCode : 1;
}

function chooseWeatherLabel(rainProbability: number, fallbackCode: number) {
  const code = chooseWeatherCode(rainProbability, fallbackCode);
  return WEATHER_CODE[code]?.desc ?? WEATHER_CODE[3].desc;
}

function chooseWeatherIcon(rainProbability: number, fallbackCode: number) {
  const code = chooseWeatherCode(rainProbability, fallbackCode);
  return WEATHER_CODE[code]?.icon ?? WEATHER_CODE[3].icon;
}

function recommendActivity(rainProbability: number, temp: number, humidity: number) {
  if (rainProbability >= 0.8 || humidity >= 88) return "Tunda panen berat dan cek drainase";
  if (rainProbability >= 0.6) return "Kerja pagi, siapkan pelindung hujan";
  if (temp >= 34) return "Waktu terbaik untuk siram dan lindungi tanaman";
  return "Cocok untuk tanam, semprot, dan inspeksi lahan";
}

function formatLabel(datetime: string, index: number) {
  const dt = new Date(datetime);
  if (index === 0) return "Sekarang";
  return dt.toLocaleDateString("id-ID", { weekday: "short" });
}

function formatClock(datetime: string) {
  const dt = new Date(datetime);
  return dt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function round(value: number) {
  return Math.round(value * 10) / 10;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getIconName(code: number, hour: number): string {
  const isNight = hour < 6 || hour >= 18;
  if (code === 0) return isNight ? "cerah-malam" : "cerah";
  if (code === 1 || code === 2) return isNight ? "cerah-berawan-malam" : "cerah-berawan";
  if (code === 3 || code === 4) return "berawan";
  if (code === 60 || code === 61) return "hujan-ringan";
  if (code === 63) return "hujan-sedang";
  if (code === 65) return "hujan-lebat";
  if (code === 95 || code === 97) return "hujan-petir";
  return isNight ? "berawan-malam" : "berawan";
}