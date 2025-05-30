// src/pages/DriverStandingsPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar } from "lucide-react";
import { getCurrentDriverStandingsF1Api } from "../services/api";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import ErrorDisplay from "../components/ui/ErrorDisplay";
import PodiumDisplay from "../components/standings/PodiumDisplay";
import DriverTable from "../components/standings/DriverTable";
import DriverCardCarousel from "../components/standings/DriverCardCarousel";

// Assuming variants are defined/imported elsewhere or remove if not needed
// import { containerVariants, itemVariants } from '../../utils/animations';

function DriverStandingsPage({ driverInfoMap, isLoadingDrivers }) {
  // Receive props from App.jsx
  const [standingsData, setStandingsData] = useState(null);
  const [isLoadingStandings, setIsLoadingStandings] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("table");

  useEffect(() => {
    const fetchStandings = async () => {
      setIsLoadingStandings(true);
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
        setError("An error occurred loading standings.");
        setStandingsData(null);
      } finally {
        setIsLoadingStandings(false);
      }
    };
    fetchStandings();
  }, []);

  const toggleViewMode = () =>
    setViewMode(viewMode === "table" ? "cards" : "table");

  // --- Render Logic ---

  if (isLoadingStandings || isLoadingDrivers) {
    return <LoadingIndicator message="Loading Driver Standings..." />;
  }

  if (error) {
    return <ErrorDisplay title="Standings Unavailable" message={error} />;
  }

  // Check driverInfoMap validity AFTER loading is done
  if (!driverInfoMap || (driverInfoMap.size === 0 && !isLoadingDrivers)) {
    console.error(
      "DriverStandingsPage rendered with empty/invalid driverInfoMap after loading finished."
    );
    // Decide if this is a hard error or if components can handle null map
    // For now, show an error because children expect the map
    return (
      <ErrorDisplay
        title="Data Error"
        message="Failed to load necessary driver details map."
      />
    );
  }

  if (
    !standingsData?.drivers_championship ||
    standingsData.drivers_championship.length === 0
  ) {
    return (
      <div className="text-center p-10 text-gray-600 dark:text-gray-400">
        No current standings data available.
      </div>
    );
  }

  const driverStandings = standingsData.drivers_championship;
  const top3 = driverStandings.slice(0, 3);

  return (
    <div className="transition-colors text-gray-900 dark:text-white px-2 py-2 rounded-xl">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-[#2f024f] dark:text-[#4a037a] mb-1">
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
            className="px-3 py-1 rounded-md text-sm font-medium transition-colors bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200" // Basic styling
          >
            {viewMode === "table" ? "Card View" : "Table View"}
          </button>
        </div>
      </div>

      {/* Podium - Pass driverInfoMap */}
      {top3.length >= 3 && (
        <PodiumDisplay top3={top3} driverInfoMap={driverInfoMap} />
      )}

      {/* View Content Area - Pass driverInfoMap */}
      <div className="mt-8 bg-gray-50 dark:bg-black rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <AnimatePresence mode="wait">
          {viewMode === "table" ? (
            <DriverTable
              driverStandings={driverStandings}
              driverInfoMap={driverInfoMap}
            />
          ) : (
            <DriverCardCarousel
              driverStandings={driverStandings}
              driverInfoMap={driverInfoMap}
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
export default DriverStandingsPage;
