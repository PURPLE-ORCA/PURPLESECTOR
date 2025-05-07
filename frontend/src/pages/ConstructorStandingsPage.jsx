import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import {
  ChevronUp,
  ChevronDown,
  Trophy,
  Flag,
  Calendar,
  AlertTriangle,
  Loader2,
  Building2,
} from "lucide-react";
import { getConstructorStandings } from "../services/api";

// Team color mapping based on real F1 teams - reused from the driver standings component
const teamColors = {
  "Red Bull Racing": "bg-gradient-to-r from-blue-800 to-yellow-500",
  Mercedes: "bg-gradient-to-r from-teal-400 to-gray-200",
  Ferrari: "bg-gradient-to-r from-red-600 to-red-700",
  McLaren: "bg-gradient-to-r from-orange-500 to-yellow-400",
  "Aston Martin": "bg-gradient-to-r from-green-600 to-green-700",
  Alpine: "bg-gradient-to-r from-blue-500 to-pink-400",
  AlphaTauri: "bg-gradient-to-r from-blue-900 to-white",
  "Alfa Romeo": "bg-gradient-to-r from-red-700 to-white",
  Williams: "bg-gradient-to-r from-blue-600 to-sky-400",
  "Haas F1 Team": "bg-gradient-to-r from-gray-200 to-red-600",
  // Default for any other team
  default: "bg-gradient-to-r from-gray-700 to-gray-500",
};

// Get team color class
const getTeamColorClass = (teamName) => {
  return teamColors[teamName] || teamColors.default;
};

function ConstructorStandingsPage() {
  const [standings, setStandings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // table or cards

  // For mobile carousel view
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 1.2,
      spacing: 15,
    },
    breakpoints: {
      "(min-width: 640px)": {
        slides: {
          perView: 2.5,
          spacing: 20,
        },
      },
      "(min-width: 1024px)": {
        slides: {
          perView: 3.5,
          spacing: 30,
        },
      },
    },
  });

  useEffect(() => {
    const fetchStandings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch 'current' constructor standings
        const data = await getConstructorStandings("current");

        if (data && data.constructors_championship) {
          setStandings(data);
        } else {
          setError(`Could not load current constructor standings.`);
          setStandings(null);
        }
      } catch (err) {
        console.error(
          `Unexpected error fetching current constructor standings:`,
          err
        );
        setError("An error occurred while loading constructor standings.");
        setStandings(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStandings();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const toggleViewMode = () =>
    setViewMode(viewMode === "table" ? "cards" : "table");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-black text-gray-900 dark:text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="mb-4"
        >
          <Loader2 size={40} className="text-[#950505]" />
        </motion.div>
        <p className="text-lg font-medium">Loading Constructor Standings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-black text-gray-900 dark:text-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <AlertTriangle size={48} className="text-[#950505] mb-4" />
          <h3 className="text-xl font-bold mb-2">Connection Error</h3>
          <p className="text-center text-lg mb-4">{error}</p>
          <button
            className="px-6 py-2 bg-[#950505] text-white rounded-md hover:bg-red-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  if (
    !standings ||
    !standings.constructors_championship ||
    standings.constructors_championship.length === 0
  ) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-black text-gray-900 dark:text-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <Flag size={48} className="text-gray-400 mb-4" />
          <p className="text-center text-xl">
            No current Constructor Standings data available.
          </p>
        </motion.div>
      </div>
    );
  }

  const constructorStandings = standings.constructors_championship;

  // Add top 3 podium component
  const renderPodium = () => {
    const top3 = constructorStandings.slice(0, 3);
    if (top3.length < 3) return null;

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mb-12 hidden md:flex justify-center items-end gap-4 pt-8"
      >
        {/* 2nd Place */}
        <motion.div
          variants={itemVariants}
          className="w-1/5 relative bg-gray-100 dark:bg-transparent rounded-t-lg flex flex-col items-center pt-4 pb-12 shadow-lg"
          style={{ height: "170px" }}
        >
          <div
            className={`absolute top-0 left-0 right-0 h-1 ${getTeamColorClass(top3[1].team?.teamName)}`}
          ></div>
          <div className="text-3xl font-bold text-gray-400 mb-2">2</div>
          <div className="text-center">
            <div className="font-semibold">{top3[1].team?.teamName}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {top3[1].team?.country}
            </div>
          </div>
          <div className="mt-2 px-3 py-1 rounded bg-gray-700 text-white font-mono">
            {top3[1].points} PTS
          </div>
        </motion.div>

        {/* 1st Place */}
        <motion.div
          variants={itemVariants}
          className="w-1/4 relative bg-gray-100 dark:bg-transparent rounded-t-lg flex flex-col items-center pt-6 pb-16 shadow-xl z-10"
          style={{ height: "220px" }}
        >
          <div
            className={`absolute top-0 left-0 right-0 h-2 ${getTeamColorClass(top3[0].team?.teamName)}`}
          ></div>
          <div className="text-4xl font-bold text-yellow-500 mb-3 flex items-center">
            <Trophy size={24} className="text-yellow-500 mr-2" />1
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{top3[0].team?.teamName}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {top3[0].team?.country}
            </div>
          </div>
          <div className="mt-4 px-4 py-2 rounded-md bg-[#950505] text-white font-mono font-bold">
            {top3[0].points} PTS
          </div>
          <div className="text-xs mt-2">{top3[0].wins} Wins</div>
        </motion.div>

        {/* 3rd Place */}
        <motion.div
          variants={itemVariants}
          className="w-1/5 relative bg-gray-100 dark:bg-transparent rounded-t-lg flex flex-col items-center pt-4 pb-12 shadow-lg"
          style={{ height: "150px" }}
        >
          <div
            className={`absolute top-0 left-0 right-0 h-1 ${getTeamColorClass(top3[2].team?.teamName)}`}
          ></div>
          <div className="text-3xl font-bold text-amber-700 mb-2">3</div>
          <div className="text-center">
            <div className="font-semibold">{top3[2].team?.teamName}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {top3[2].team?.country}
            </div>
          </div>
          <div className="mt-2 px-3 py-1 rounded bg-gray-700 text-white font-mono">
            {top3[2].points} PTS
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // Card view for mobile
  const renderCards = () => {
    return (
      <div ref={sliderRef} className="keen-slider mt-6">
        {constructorStandings.map((standing) => (
          <div
            key={standing.team?.teamId || standing.position}
            className="keen-slider__slide bg-white dark:bg-transparent rounded-xl shadow-lg overflow-hidden group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            <div
              className={`h-2 w-full ${getTeamColorClass(standing.team?.teamName)}`}
            ></div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div
                  className={`text-2xl font-bold ${standing.position <= 3 ? "text-[#950505]" : "text-gray-800 dark:text-white"}`}
                >
                  {standing.position}
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">{standing.points} pts</div>
                  <div className="text-sm text-gray-400">
                    {standing.wins} wins
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="text-lg font-bold">
                  {standing.team?.teamName}
                </div>
                <div className="text-sm text-gray-400">
                  {standing.team?.country}
                </div>
              </div>

              <div className="flex items-center mt-2">
                <Building2 size={16} className="text-gray-400 mr-2" />
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Constructor
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Table view
  const renderTable = () => {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="overflow-x-auto"
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 dark:border-gray-700">
              <th className="py-4 px-4 text-left">POS</th>
              <th className="py-4 px-6 text-left">CONSTRUCTOR</th>
              <th className="py-4 px-6 text-left">NATIONALITY</th>
              <th className="py-4 px-4 text-right">POINTS</th>
              <th className="py-4 px-4 text-right">WINS</th>
            </tr>
          </thead>
          <tbody>
            {constructorStandings.map((standing, index) => (
              <tr
                key={standing.team?.teamId || standing.position}
                className="border-b border-gray-200 dark:border-gray-800 hover:bg-red-50 dark:hover:bg-[#950505]/10 transition-colors duration-200"
              >
                <td
                  className={`py-4 px-4 font-medium ${standing.position <= 3 ? "text-[#950505] font-bold" : ""}`}
                >
                  <div className="flex items-center">
                    {index > 0 &&
                      standing.position <
                        constructorStandings[index - 1].position && (
                        <ChevronUp size={16} className="text-green-500 mr-1" />
                      )}
                    {index > 0 &&
                      standing.position >
                        constructorStandings[index - 1].position && (
                        <ChevronDown size={16} className="text-red-500 mr-1" />
                      )}
                    {standing.position}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div
                      className={`w-1 h-10 rounded-full mr-3 ${getTeamColorClass(standing.team?.teamName)}`}
                    ></div>
                    <div>
                      <div className="font-semibold">
                        {standing.team?.teamName || "N/A"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6 text-gray-400">
                  {standing.team?.country || "N/A"}
                </td>
                <td className="py-4 px-4 font-bold text-right text-[#950505]">
                  {standing.points}
                </td>
                <td className="py-4 px-4 text-right">{standing.wins ?? "0"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    );
  };

  return (
    <div className="transition-color text-gray-900 dark:text-white px-4 py-8 rounded-xl shadow-lg">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-red-600 mb-1">
            Constructor Standings
          </h2>
          <div className="flex items-center text-sm">
            <Calendar size={14} className="mr-1" />
            <span>{standings.season}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={toggleViewMode}
            className="px-3 py-1 rounded-md text-sm font-medium transition-colors bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            {viewMode === "table" ? "Card View" : "Table View"}
          </button>
        </div>
      </div>

      {renderPodium()}

      <div className="bg-gray-50 dark:bg-transparent rounded-xl shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === "table" ? renderTable() : renderCards()}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default ConstructorStandingsPage;
