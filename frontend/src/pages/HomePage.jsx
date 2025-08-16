import React, { useState, useEffect } from "react";
import { getNextSession, getLatestRaceResult } from "../services/api";
import NextSessionCard from "../components/home/NextSessionCard"; 
import LatestResultCard from "../components/home/LatestResultCard"; 
import { motion } from "framer-motion";
import { podiumContainerVariants } from "@/utils/animations";
function HomePage({ driverInfoMap, isLoadingDrivers }) {
  const [nextSession, setNextSession] = useState(null);
  const [isLoadingNextSession, setIsLoadingNextSession] = useState(true);
  const [errorNextSession, setErrorNextSession] = useState(null);

  const [latestResult, setLatestResult] = useState(null);
  const [isLoadingLatestResult, setIsLoadingLatestResult] = useState(true);
  const [errorLatestResult, setErrorLatestResult] = useState(null);

  useEffect(() => {
    // Fetching logic remains the same
    const fetchData = async () => {
      // Fetch Next Session
      setIsLoadingNextSession(true);
      setErrorNextSession(null);
      try {
        setNextSession(await getNextSession());
      } catch (err) {
        setErrorNextSession("Failed to load next session data.");
      } finally {
        setIsLoadingNextSession(false);
      }

      // Fetch Latest Result
      setIsLoadingLatestResult(true);
      setErrorLatestResult(null);
      try {
        setLatestResult(await getLatestRaceResult());
      } catch (err) {
        setErrorLatestResult("Failed to load latest result data.");
      } finally {
        setIsLoadingLatestResult(false);
      }
    };
    fetchData();
  }, []);

  return (
    // Use max-w-7xl and consistent padding as before
    <div className="px-2 py-2 sm:px-6 lg:px-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 pb-4"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-1">F1 Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Stay updated with the latest Formula 1 events and results
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-sm">
          <span className="px-3 py-1 rounded-full bg-[#2f024f] dark:bg-[#4a037a] text-white font-medium">
            Season 2025
          </span>
        </div>
      </motion.div>

      {/* Use containerVariants for staggered animation */}
      <motion.div
        variants={podiumContainerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-8"
      >
        {/* Pass props to the new components */}
        <NextSessionCard
          session={nextSession}
          isLoading={isLoadingNextSession}
          error={errorNextSession}
        />
        <LatestResultCard
          resultData={latestResult}
          isLoading={isLoadingLatestResult || isLoadingDrivers} 
          error={errorLatestResult}
          driverInfoMap={driverInfoMap}
        />
      </motion.div>
    </div>
  );
}

export default HomePage;
