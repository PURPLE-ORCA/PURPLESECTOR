"use client";

import React, { useEffect, useState } from "react";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import CountdownSection from "../components/landing/CountdownSection";
import DevAndTechSection from "../components/DevAndTechSection";
import { getNextSession } from "../services/api";

export default function LandingPage() {
  const [nextSessionData, setNextSessionData] = useState(null);
  const [isLoadingNextSession, setIsLoadingNextSession] = useState(true);

  useEffect(() => {
    const fetchNext = async () => {
      setIsLoadingNextSession(true);
      try {
        const data = await getNextSession();
        setNextSessionData(data);
        setIsLoadingNextSession(false);
      } catch (error) {
        console.error("LandingPage: Error fetching next session:", error);
        setIsLoadingNextSession(false);
      }
    };
    fetchNext();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <HeroSection />
      <FeaturesSection />
      <DevAndTechSection />
      <CountdownSection nextSessionData={nextSessionData} isLoadingNextSession={isLoadingNextSession} />
    </div>
  );
}
