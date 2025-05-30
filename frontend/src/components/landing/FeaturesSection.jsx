"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "../ui/card";
import { Calendar, Trophy, Globe } from "lucide-react";

function FeaturesSection() {
  const features = [
    { title: "Full Race Schedules", description: "Complete weekend timings for every Grand Prix, converted to your timezone (soon!).", icon: Calendar },
    { title: "Live Standings", description: "Up-to-date driver and constructor championship points.", icon: Trophy },
    { title: "Circuit Information", description: "Explore details and layouts of every track on the calendar.", icon: Globe },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-950 to-black relative">
       <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2f024f]/50 to-transparent"></div> {/* Changed red to purple */}
      <div className="container mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6">
            KEY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2f024f] to-[#4a037a]">FEATURES</span> {/* Changed red to purple */}
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div key={feature.title} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }} viewport={{ once: true }} whileHover={{ y: -10, scale: 1.03 }} className="group">
              <Card className="bg-gradient-to-br from-white/10 via-transparent to-white/5 backdrop-blur-md border-white/20 p-8 h-full hover:border-[#2f024f]/50 transition-all duration-300 flex flex-col"> {/* Changed red to purple */}
                <div className="mb-6">
                  <feature.icon className="w-12 h-12 md:w-16 md:h-16 text-[#2f024f] group-hover:scale-110 transition-transform" /> {/* Changed red to purple */}
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

export default FeaturesSection;
