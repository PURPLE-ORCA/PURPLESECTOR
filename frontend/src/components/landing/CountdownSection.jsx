"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";

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
        {/* Changed red/purple to purple shades */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#2f024f]/20 via-transparent to-[#4a037a]/20"
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2f024f] to-[#4a037a]">
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
            {/* Changed red to purple */}
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-[#2f024f] to-[#4a037a] hover:opacity-90 text-white px-10 py-3 text-base sm:text-lg font-semibold group"
            >
              <a href="/home">
                {" "}
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

export default CountdownSection;
