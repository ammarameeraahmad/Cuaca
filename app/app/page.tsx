"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import WeatherSection from "../components/WeatherSection";
import AISection from "../components/AISection";
import ReportSection from "../components/ReportSection";
import Footer from "../components/Footer";
import { CITIES, DEFAULT_ADM4, type City } from "../data/cities";
import { useBMKG } from "../hooks/useBMKG";

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<City>(() => CITIES.find((city) => city.adm4 === DEFAULT_ADM4) ?? CITIES[0]);
  const [activeSection, setActiveSection] = useState("home");
  const { data, forecast, loading, error, source, fetchWeather } = useBMKG();

  useEffect(() => {
    void fetchWeather(selectedCity.adm4);
  }, [fetchWeather, selectedCity.adm4]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          if (id) setActiveSection(id);
        });
      },
      { threshold: 0.3 }
    );

    ["home", "weather", "forecast", "ai", "report"].forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (section: string) => {
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(section);
  };

  const forecastSummary = forecast?.title ?? null;
  const forecastDetails = forecast?.subtitle ?? null;

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar activeSection={activeSection} onNavigate={scrollToSection} />
      <main>
        <HeroSection onNavigate={scrollToSection} />
        <WeatherSection
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          loading={loading}
          error={error}
          data={data}
          forecast={forecast}
          source={source}
          onNavigate={scrollToSection}
        />
        <AISection cityLabel={`${selectedCity.name}, ${selectedCity.prov}`} forecastTitle={forecastSummary} forecastSubtitle={forecastDetails} />
        <ReportSection />
      </main>
      <Footer />

      <button
        onClick={() => scrollToSection("home")}
        className="fixed bottom-6 right-6 z-50 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 transition-transform hover:scale-105 active:scale-95"
        aria-label="Kembali ke atas"
      >
        ↑
      </button>
    </div>
  );
}
