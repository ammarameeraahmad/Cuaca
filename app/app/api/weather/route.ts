import { NextResponse } from "next/server";
import { buildForecast, createFallbackWeather } from "@/lib/weather";

const DEFAULT_ADM4 = process.env.BMKG_DEFAULT_ADM4 ?? process.env.NEXT_PUBLIC_DEFAULT_ADM4 ?? "34.04.13.2001";
const BMKG_API_BASE_URL = process.env.BMKG_API_BASE_URL ?? "https://api.bmkg.go.id/publik/prakiraan-cuaca";
const TIMEOUT_MS = Number(process.env.BMKG_TIMEOUT_MS ?? "8000");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const adm4 = searchParams.get("adm4") ?? DEFAULT_ADM4;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(`${BMKG_API_BASE_URL}?adm4=${encodeURIComponent(adm4)}`, {
      headers: { Accept: "application/json" },
      signal: controller.signal,
      cache: "no-store",
    });

    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`BMKG HTTP ${response.status}`);
    }

    const json = await response.json();

    if (!json?.data?.cuaca) {
      throw new Error("Format respons BMKG tidak valid");
    }

    return NextResponse.json({
      data: json,
      forecast: buildForecast(json),
      source: "bmkg",
      adm4,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    const fallback = createFallbackWeather(adm4);
    return NextResponse.json({
      data: fallback,
      forecast: buildForecast(fallback),
      source: "fallback",
      adm4,
      updatedAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Fallback mode aktif",
    });
  }
}