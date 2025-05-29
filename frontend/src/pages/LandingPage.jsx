"use client"; // Keep this, it's a hint for client-side rendering focus for some tools

import React, { Suspense, useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "../components/ui/button"; // ShadCN Button
import { Card } from "../components/ui/card";     // ShadCN Card
import { Badge } from "../components/ui/badge";   // ShadCN Badge
import { Play, Calendar, Trophy, Zap, Users, Globe, ChevronRight } from "lucide-react"; // Keep Lucide icons
import { getNextSession } from "../services/api"; // Import getNextSession
import DevAndTechSection from "../components/DevAndTechSection";

// --- HeroSection Component (Copied and adapted) ---
// NOTE: The "Watch Live" and "View Schedule" buttons here are for the landing page.
// You might want them to link to your actual app pages or external F1 TV etc.
function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section className="relative h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,38,38,0.1),transparent_70%)]" />
        <motion.div style={{ y }} className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.1%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse" />
        </motion.div>
      </div>
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
              <Badge className="mb-6 bg-red-600/20 text-red-400 border-red-500/30 backdrop-blur-sm">
                <Zap className="w-4 h-4 mr-2" />
                PURPLE SECTOR
              </Badge>
            </motion.div>
            <motion.h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight" /* Adjusted size & leading */
              initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.7 }}>
              THE ULTIMATE
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#950505] to-[#37045F]">F1 EXPERIENCE</span> {/* Used brand colors */}
            </motion.h1>
            <motion.p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl" /* Adjusted size */
              initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.9 }}>
              Track every race, dive into stats, and never miss a moment. Your essential companion for the Formula 1 season.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.1 }}>
              {/* TODO: Update these Button actions later */}
              <Button asChild size="lg" className="bg-[#950505] hover:bg-red-700 text-white px-8 py-3 text-base sm:text-lg font-semibold group">
                <a href="/home"> {/* Or your main app route */}
                  Enter App <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>

            </motion.div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div key={i} className="absolute h-0.5 bg-gradient-to-r from-transparent via-[#950505] to-transparent"
            style={{ top: `${20 + i * 15}%`, width: "200px" }}
            animate={{ x: ["-200px", "calc(100vw + 200px)"] }}
            transition={{ duration: 2 + i*0.5, delay: i * 0.2, repeat: Infinity, ease: "linear" }}/>
        ))}
      </div>
    </section>
  );
}

// --- FeaturesSection Component (Copied and adapted) ---
// Update these features to match your app's actual features
function FeaturesSection() {
  const features = [
    { title: "Full Race Schedules", description: "Complete weekend timings for every Grand Prix, converted to your timezone (soon!).", icon: Calendar },
    { title: "Live Standings", description: "Up-to-date driver and constructor championship points.", icon: Trophy },
    { title: "Circuit Information", description: "Explore details and layouts of every track on the calendar.", icon: Globe },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-950 to-black relative">
       <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent"></div>
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            KEY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#950505] to-[#37045F]">FEATURES</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }} viewport={{ once: true }} whileHover={{ y: -10, scale: 1.03 }} className="group">
              <Card className="bg-gradient-to-br from-white/10 via-transparent to-white/5 backdrop-blur-md border-white/20 p-8 h-full hover:border-red-500/50 transition-all duration-300 flex flex-col">
                <div className="mb-6">
                  <feature.icon className="w-12 h-12 md:w-16 md:h-16 text-[#950505] group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed flex-grow">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- CountdownSection Component (Copied and adapted) ---
// This should use your ACTUAL next race data
// For now, it's a placeholder. We'll need to integrate API data.
function CountdownSection({ nextSessionData, isLoadingNextSession }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!nextSessionData || isLoadingNextSession) return;

    const targetDate = new Date(nextSessionData.dateTimeUTC);
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [nextSessionData, isLoadingNextSession]);

  if (isLoadingNextSession) {
    return <div className="py-20 text-center text-gray-400">Loading next race countdown...</div>;
  }
  if (!nextSessionData) {
    return <div className="py-20 text-center text-gray-400">Next race data unavailable.</div>;
  }

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-red-600/20 via-transparent to-purple-800/20"
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear",
            repeatType: "mirror",
          }}
        />
      </div>
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            NEXT{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#950505] to-[#37045F]">
              {nextSessionData.sessionName.toUpperCase()}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mb-10">
            {nextSessionData.raceName}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {Object.entries(timeLeft).map(([unit, value]) => (
              <motion.div
                key={unit}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg p-4 sm:p-6"
              >
                <Card>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-black text-black dark:text-white mb-1 sm:mb-2">
                    {value.toString().padStart(2, "0")}
                  </div>
                  <div className=" text-black dark:text-white uppercase text-xs sm:text-sm font-semibold">
                    {unit}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-12"
          >
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#950505] to-[#37045F] hover:opacity-90 text-white px-10 py-3 text-lg font-semibold group"
            >
              <a href="/home">
                {" "}
                {/* Link to your main app */}
                Go To Dashboard
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}


// --- Main Landing Page Component ---
export default function LandingPage() {
  // Fetch next session data for the countdown section
  const [nextSessionData, setNextSessionData] = useState(null);
  const [isLoadingNextSession, setIsLoadingNextSession] = useState(true);

  useEffect(() => {
    // This assumes getNextSession is a service function you have
    // that fetches { raceName, sessionName, dateTimeUTC }
    // If getNextSession is in src/services/api.js:
    // import { getNextSession } from '../../services/api'; // Adjust path as needed
    const fetchNext = async () => {
      setIsLoadingNextSession(true);
      try {
        // For landing page, we directly use the function. Ensure getNextSession is defined
        // and imported correctly. If getNextSession is not in scope, you need to import it.
        // Example: const data = await yourAppsGetNextSessionFunction();
        // setNextSessionData(data);
        console.log("LandingPage: Fetching next session data...");
        // Placeholder: Replace with your actual getNextSession from services/api.js
        // For now, we'll simulate it after a delay if not available
        // const tempNextSession = await getNextSession(); // This line will error if not imported
        // setNextSessionData(tempNextSession);

        // SIMULATED - REPLACE WITH ACTUAL API CALL
        // This part needs to be connected to your existing `getNextSession` from `src/services/api.js`
        // For now, I'll set a placeholder. If Purple Sector's API service is complex to import here,
        // you might make a new, simpler fetch directly to your backend's /api/next-session endpoint
        // import axios from 'axios';
        // const response = await axios.get('http://localhost:3001/api/next-session');
        // setNextSessionData(response.data);
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
    // Ensure this div has your project's dark/light mode class if needed, or use Tailwind dark: prefixes
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Removed Navigation component */}
      <HeroSection />
      <FeaturesSection />
      <CountdownSection nextSessionData={nextSessionData} isLoadingNextSession={isLoadingNextSession} />
      <DevAndTechSection />
    </div>
  );
}
