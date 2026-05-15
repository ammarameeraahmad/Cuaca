"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import WeatherSectionNew from "../components/WeatherSectionNew";
import PestSection from "../components/PestSection";
import AISection from "../components/AISection";
import ReportSection from "../components/ReportSection";
import Footer from "../components/Footer";
import { ADM4_CITIES, type ADM4Location, DEFAULT_ADM4 } from "../data/adm4-cities";
import { useBMKG } from "../hooks/useBMKG";

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<ADM4Location>(() => {
    const found = ADM4_CITIES.find((city) => city.adm4 === DEFAULT_ADM4);
    return found || ADM4_CITIES[0];
  });
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
        <WeatherSectionNew
          selectedCity={selectedCity}
          onSelectCity={setSelectedCity}
          loading={loading}
          error={error}
          data={data}
          forecast={forecast}
          source={source}
            onNavigate={scrollToSection}
        />
        <PestSection />
        <AISection cityLabel={selectedCity.name} forecastTitle={forecastSummary} forecastSubtitle={forecastDetails} />
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
