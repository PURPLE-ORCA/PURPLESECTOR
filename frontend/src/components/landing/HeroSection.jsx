"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Zap, ChevronRight } from "lucide-react";

function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);

  return (
    <section className="relative h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(47,2,79,0.1),transparent_70%)]" />
        <motion.div style={{ y }} className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.1%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse" />
        </motion.div>
      </div>
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
              <Badge className="mb-6 bg-[#2f024f]/20 text-[#2f024f] border-[#2f024f]/30 backdrop-blur-sm">
                <Zap className="w-4 h-4 mr-2" />
                PURPLE SECTOR
              </Badge>
            </motion.div>
            <motion.h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight"
              initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.7 }}>
              THE ULTIMATE
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2f024f] to-[#4a037a]">F1 EXPERIENCE</span>
            </motion.h1>
            <motion.p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl"
              initial={{ opacity: 0, x: -100 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.9 }}>
              Track every race, dive into stats, and never miss a moment. Your essential companion for the Formula 1 season.
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.1 }}>
              <Button asChild size="lg" className="bg-[#2f024f] hover:bg-[#4a037a] text-white px-8 py-3 text-base sm:text-lg font-semibold group">
                <a href="/home">
                  Enter App <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 5 }).map((_, i) => (
          // Adjusted for responsiveness
          <motion.div key={i} className="absolute h-0.5 bg-gradient-to-r from-transparent via-[#2f024f] to-transparent"
            style={{ top: `${20 + i * 15}%`, width: "min(200px, 50vw)" }}
            animate={{ x: ["-200px", "calc(100vw + 200px)"] }}
            transition={{ duration: 2 + i*0.5, delay: i * 0.2, repeat: Infinity, ease: "linear" }}/>
        ))}
      </div>
    </section>
  );
}

export default HeroSection;
