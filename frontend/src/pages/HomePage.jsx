// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { getNextSession, getLatestRaceResult } from "../services/api";
import Countdown from "../components/Countdown";
import { motion } from "framer-motion";
import {
  Flag,
  Calendar,
  Trophy,
  AlertCircle,
  Loader2,
  ChevronRight,
  MapPin,
} from "lucide-react";

function HomePage() {
  // State for Next Session
  const [nextSession, setNextSession] = useState(null);
  const [isLoadingNextSession, setIsLoadingNextSession] = useState(true);
  const [errorNextSession, setErrorNextSession] = useState(null);

  // State for Latest Result
  const [latestResult, setLatestResult] = useState(null);
  const [isLoadingLatestResult, setIsLoadingLatestResult] = useState(true);
  const [errorLatestResult, setErrorLatestResult] = useState(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  // Fetch both pieces of data on mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch Next Session
      setIsLoadingNextSession(true);
      setErrorNextSession(null);
      try {
        const nextSessionData = await getNextSession();
        setNextSession(nextSessionData);
      } catch (err) {
        console.error("Unexpected error fetching next session:", err);
        setErrorNextSession("Failed to load next session data.");
      } finally {
        setIsLoadingNextSession(false);
      }

      // Fetch Latest Result
      setIsLoadingLatestResult(true);
      setErrorLatestResult(null);
      try {
        const latestResultData = await getLatestRaceResult();
        setLatestResult(latestResultData);
      } catch (err) {
        console.error("Unexpected error fetching latest result:", err);
        setErrorLatestResult("Failed to load latest result data.");
      } finally {
        setIsLoadingLatestResult(false);
      }
    };

    fetchData();
  }, []);

  const renderNextSessionInfo = () => {
    if (isLoadingNextSession) {
      return (
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-black rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="mr-3"
            >
              <Loader2 className="h-6 w-6 text-[#950505] dark:text-[#ff6b6b]" />
            </motion.div>
            <p className="text-black dark:text-white">
              Loading next session...
            </p>
          </div>
        </motion.div>
      );
    }

    if (errorNextSession) {
      return (
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-black rounded-xl shadow-md overflow-hidden border-l-4 border-red-500"
        >
          <div className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Error Loading Next Session
              </h3>
            </div>
            <p className="mt-2 text-black dark:text-white">
              {errorNextSession}
            </p>
          </div>
        </motion.div>
      );
    }

    if (!nextSession) {
      return (
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-black rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 text-center">
            <Calendar className="h-10 w-10 text-black mx-auto mb-3" />
            <p className="text-black dark:text-white">
              No upcoming sessions scheduled.
            </p>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-black rounded-xl shadow-md overflow-hidden"
      >
        <div className="h-2 bg-gradient-to-r from-[#950505] to-[#37045F]"></div>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-[#950505] dark:bg-[#b30000] rounded-full flex items-center justify-center mr-4">
              <Flag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black dark:text-white">
                Next Race
              </h3>
              <p className="text-[#950505] dark:text-[#ff6b6b] font-medium">
                {nextSession.sessionName}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <div className="text-black dark:text-white text-sm mb-1">
                Grand Prix
              </div>
              <div className="text-2xl font-bold text-black dark:text-white flex items-center">
                {nextSession.raceName}
              </div>
            </div>

            <div className="flex items-center  rounded-lg px-4 py-2">
              <Countdown targetTimeUTC={nextSession.dateTimeUTC} />
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderLatestResultInfo = () => {
    if (isLoadingLatestResult) {
      return (
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-black rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="mr-3"
            >
              <Loader2 className="h-6 w-6 text-[#950505] dark:text-[#ff6b6b]" />
            </motion.div>
            <p className="text-black dark:text-white">
              Loading latest result...
            </p>
          </div>
        </motion.div>
      );
    }

    if (errorLatestResult) {
      return (
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-black rounded-xl shadow-md overflow-hidden border-l-4 border-red-500"
        >
          <div className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Error Loading Latest Result
              </h3>
            </div>
            <p className="mt-2 text-black dark:text-white">
              {errorLatestResult}
            </p>
          </div>
        </motion.div>
      );
    }

    if (
      !latestResult ||
      !latestResult.races?.results ||
      latestResult.races.results.length === 0
    ) {
      return (
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-black rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6 text-center">
            <Trophy className="h-10 w-10 text-black mx-auto mb-3" />
            <p className="text-black dark:text-white">
              No race results available yet.
            </p>
          </div>
        </motion.div>
      );
    }

    const raceInfo = latestResult.races;
    const top3Finishers = raceInfo.results.slice(0, 3);

    // Define podium medal colors
    const medalColors = [
      {
        bg: "bg-amber-400",
        text: "text-amber-900",
        border: "border-amber-500",
      },
      { bg: "bg-[#37045F]", text: "text-black", border: "border-black" },
      {
        bg: "bg-amber-700",
        text: "text-amber-100",
        border: "border-amber-800",
      },
    ];

    return (
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-black rounded-xl shadow-md overflow-hidden"
      >
        <div className="h-2 bg-gradient-to-r from-[#37045F] to-[#950505]"></div>
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-[#950505] dark:bg-[#b30000] rounded-full flex items-center justify-center mr-4">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-black dark:text-white">
                Latest Results
              </h3>
              <p className="text-[#950505] dark:text-[#ff6b6b] font-medium">
                {raceInfo.raceName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3Finishers.map((result, index) => (
              <motion.div
                key={result.driver.driverId}
                whileHover={{
                  y: -5,
                  transition: { type: "spring", stiffness: 300 },
                }}
                className="bg-white dark:bg-black/10 rounded-lg overflow-hidden shadow-sm relative"
              >
                <div
                  className={`absolute top-0 left-0 w-full h-1 ${medalColors[index].bg}`}
                ></div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`flex items-center text-white dark:text-white justify-center w-8 h-8 rounded-full ${medalColors[index].bg} ${medalColors[index].text} font-bold text-lg`}
                    >
                      {result.position}
                    </div>
                    <div className="text-xs font-medium text-black dark:text-white">
                      {result.time ? result.time : "DNF"}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-black flex items-center justify-center">
                      <span className="text-2xl font-bold text-[#950505] dark:text-[#ff6b6b]">
                        {result.driver.code ||
                          result.driver.surname.substring(0, 3).toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-bold text-black dark:text-white">
                      {result.driver.name} {result.driver.surname}
                    </h4>
                    <p className="text-sm text-black dark:text-white">
                      {result.team.teamName}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-black dark:border-black flex items-center justify-center">
            <button className="flex items-center text-[#950505] dark:text-[#ff6b6b] font-medium hover:underline">
              <span>View Full Results</span>
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 pb-4 border-b border-black dark:border-black"
      >
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            F1 Dashboard
          </h1>
          <p className="text-black dark:text-white mt-1">
            Stay updated with the latest Formula 1 events and results
          </p>
        </div>
        <div className="mt-4 md:mt-0 text-sm">
          <span className="px-3 py-1 rounded-full bg-[#950505] dark:bg-[#b30000] text-white font-medium">
            Season 2025
          </span>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-8"
      >
        {renderNextSessionInfo()}
        {renderLatestResultInfo()}
      </motion.div>
    </div>
  );
}

export default HomePage;
