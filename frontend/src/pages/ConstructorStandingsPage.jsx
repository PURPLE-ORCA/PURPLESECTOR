// src/pages/ConstructorStandingsPage.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import { getConstructorStandings } from "../services/api"; // Uses the correct API call
import LoadingIndicator from "../components/ui/LoadingIndicator";
import ErrorDisplay from "../components/ui/ErrorDisplay";
import ConstructorPodiumDisplay from "../components/standings/ConstructorPodiumDisplay";
import ConstructorTable from "../components/standings/ConstructorTable";
import ConstructorCardCarousel from "../components/standings/ConstructorCardCarousel";

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

function ConstructorStandingsPage() {
  const [standingsData, setStandingsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    const fetchStandings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch 'current' using the function targeting f1api.dev via backend
        const data = await getConstructorStandings();
        if (data?.constructors_championship) {
          setStandingsData(data);
        } else {
          setError(`Could not load current constructor standings.`);
          setStandingsData(null);
        }
      } catch (err) {
        setError("An error occurred loading standings.");
        setStandingsData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStandings();
  }, []);

  const toggleViewMode = () =>
    setViewMode(viewMode === "table" ? "cards" : "table");

  if (isLoading)
    return <LoadingIndicator message="Loading Constructor Standings..." />;
  if (error)
    return <ErrorDisplay title="Standings Unavailable" message={error} />;
  if (
    !standingsData?.constructors_championship ||
    standingsData.constructors_championship.length === 0
  ) {
    return (
      <div className="text-center p-10">
        No current standings data available.
      </div>
    );
  }

  const constructorStandings = standingsData.constructors_championship;
  const top3 = constructorStandings.slice(0, 3);

  return (
    <div className="transition-colors text-gray-900 dark:text-white px-2 py-2 rounded-xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#2f024f] dark:text-[#4a037a] mb-1">
            Constructor Standings
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
        </div>
      </div>

      {/* Podium */}
      {top3.length >= 3 && <ConstructorPodiumDisplay top3={top3} />}

      {/* View Content */}
      <div className="mt-8 bg-gray-50 dark:bg-transparent rounded-xl shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === "table" ? (
            <ConstructorTable constructorStandings={constructorStandings} />
          ) : (
            <ConstructorCardCarousel
              constructorStandings={constructorStandings}
            />
          )}
        </AnimatePresence>
      </div>
      <p className="text-xs text-center text-gray-400 dark:text-gray-600 mt-6">
        Data provided by F1 API
      </p>
    </div>
  );
}
export default ConstructorStandingsPage;
