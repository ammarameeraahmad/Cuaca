"use client";

import { useCallback, useState } from "react";
import type { BMKGResponse, ForecastSummary } from "@/lib/weather";

export interface WeatherEnvelope {
  data: BMKGResponse;
  forecast: ForecastSummary;
  source: "bmkg" | "fallback";
  adm4: string;
  updatedAt: string;
  error?: string;
}

export function useBMKG() {
  const [data, setData] = useState<BMKGResponse | null>(null);
  const [forecast, setForecast] = useState<ForecastSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<WeatherEnvelope["source"]>("fallback");

  const fetchWeather = useCallback(async (adm4: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/weather?adm4=${encodeURIComponent(adm4)}`, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = (await response.json()) as WeatherEnvelope;
      setData(json.data);
      setForecast(json.forecast);
      setSource(json.source);
      setError(json.error ?? null);
    } catch (requestError) {
      const message = requestError instanceof Error ? requestError.message : "Gagal mengambil cuaca";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, forecast, loading, error, source, fetchWeather };
}