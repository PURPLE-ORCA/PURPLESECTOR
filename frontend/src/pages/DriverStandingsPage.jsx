// src/pages/DriverStandingsPage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react"; // Only import icons used here
import { getCurrentDriverStandingsF1Api } from "../services/api";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import ErrorDisplay from "../components/ui/ErrorDisplay";
import PodiumDisplay from "../components/standings/PodiumDisplay"; // Import new components
import DriverTable from "../components/standings/DriverTable";
import DriverCardCarousel from "../components/standings/DriverCardCarousel";

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

function DriverStandingsPage() {
  const [standingsData, setStandingsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // Default view

  useEffect(() => {
    // Fetch logic remains the same
    const fetchStandings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCurrentDriverStandingsF1Api();
        if (data?.drivers_championship) {
          setStandingsData(data);
        } else {
          setError(`Could not load current driver standings.`);
          setStandingsData(null);
        }
      } catch (err) {
        setError("An error occurred loading driver standings.");
        setStandingsData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStandings();
  }, []);

  const toggleViewMode = () =>
    setViewMode(viewMode === "table" ? "cards" : "table");

  // --- RENDER LOGIC ---

  if (isLoading)
    return <LoadingIndicator message="Loading Driver Standings..." />;
  if (error)
    return <ErrorDisplay title="Standings Unavailable" message={error} />;
  if (
    !standingsData?.drivers_championship ||
    standingsData.drivers_championship.length === 0
  ) {
    // Maybe a different 'no data' component later
    return (
      <div className="text-center p-10">
        No current standings data available.
      </div>
    );
  }

  const driverStandings = standingsData.drivers_championship;
  const top3 = driverStandings.slice(0, 3);

  return (
    // Removed outer bg/text classes, handled by App layout
    <div className="transition-colors px-2 py-2 rounded-xl">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-red-600 dark:text-[#950505] mb-1">
            Driver Standings
          </h2>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Calendar size={14} className="mr-1" />
            <span>{standingsData.season}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={toggleViewMode}
            className="px-3 py-1 rounded-md text-sm font-medium transition-colors bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            {viewMode === "table" ? "Card View" : "Table View"}
          </button>
          {/* Add Year Selector Placeholder later */}
        </div>
      </div>

      {/* Podium - Render only if enough data */}
      {top3.length >= 3 && <PodiumDisplay top3={top3} />}

      {/* View Mode Content Area */}
      <div className="mt-8 bg-gray-50 dark:bg-transparent rounded-xl shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === "table" ? (
            <DriverTable driverStandings={driverStandings} />
          ) : (
            <DriverCardCarousel driverStandings={driverStandings} />
          )}
        </AnimatePresence>
      </div>

      {/* Data Source Footer */}
      <p className="text-xs text-center text-gray-400 dark:text-gray-600 mt-6">
        Data provided by F1 API {/* Or be more specific if needed */}
      </p>
    </div>
  );
}

export default DriverStandingsPage;
