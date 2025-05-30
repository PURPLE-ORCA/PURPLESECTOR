// src/pages/RaceResultsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Use Link if needed
import { motion, AnimatePresence } from "framer-motion";
import { getRaceResults } from "../services/api"; // Fetches combined results
import {
  Trophy,
  Flag,
  AlertTriangle,
  Loader2,
  MapPin,
  Calendar,
  ChevronRight,
} from "lucide-react"; // Icons used
import LoadingIndicator from "../components/ui/LoadingIndicator";
import ErrorDisplay from "../components/ui/ErrorDisplay";
import PodiumDisplay from "@/components/standings/PodiumDisplay";
// Import utils if needed for colors/flags later
// import { getTeamColorClass } from "../utils/teamColors";
// import { getCountryFlagIconName } from "../utils/helpers";
// import { Icon } from '@iconify/react';

// Accept props from App.jsx
function RaceResultsPage({ driverInfoMap, isLoadingDrivers }) {
  const { year, round } = useParams();
  const [raceData, setRaceData] = useState(null);
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("results");

  useEffect(() => {
    if (year && round) {
      const fetchResults = async () => {
        setIsLoadingResults(true);
        setError(null);
        try {
          const data = await getRaceResults(year, round);
          // Check if data exists AND has a results array (key might differ)
          if (
            data &&
            (Array.isArray(data.results) ||
              (data.races && Array.isArray(data.races.results)))
          ) {
            setRaceData(data);
          } else {
            setError(
              `Could not load race results for ${year} Round ${round}. API returned invalid data.`
            );
            setRaceData(null);
          }
        } catch (err) {
          console.error(
            `Unexpected error fetching race results for ${year} R${round}:`,
            err
          );
          setError("An error occurred while loading race results.");
          setRaceData(null);
        } finally {
          setIsLoadingResults(false);
        }
      };
      fetchResults();
    } else {
      setError("Year and round parameters are missing.");
      setIsLoadingResults(false);
    }
  }, [year, round]);

  // --- Combined Loading Check ---
  if (isLoadingResults || isLoadingDrivers) {
    // Using a simpler inline loading state for brevity, replace with LoadingIndicator if preferred
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-400">
        Loading results...
      </div>
    );
  }

  // --- Error Checks ---
  if (error) {
    return (
      <div className="p-10 text-center text-red-500 dark:text-red-400">
        {error}
      </div>
    );
    // return <ErrorDisplay title="Results Unavailable" message={error} />; // Alternative
  }
  if (!driverInfoMap || driverInfoMap.size === 0) {
    console.error("RaceResultsPage received empty/invalid driverInfoMap.");
    return (
      <div className="p-10 text-center text-red-500 dark:text-red-400">
        Error: Missing driver details map.
      </div>
    );
    // return <ErrorDisplay title="Data Error" message="Failed to load driver details." />; // Alternative
  }
  if (!raceData) {
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-400">{`No race data found for ${year} Round ${round}.`}</div>
    );
    // return <ErrorDisplay title="Not Found" message={`No race data found for ${year} Round ${round}.`} />; // Alternative
  }

  // --- Data Extraction ---
  const isF1ApiStructure =
    typeof raceData.races === "object" && raceData.races !== null;
  const season = raceData.season;
  const currentRound = isF1ApiStructure ? raceData.races.round : raceData.round;
  const raceName = isF1ApiStructure
    ? raceData.races.raceName
    : raceData.raceName;
  const circuit = isF1ApiStructure ? raceData.races.circuit : raceData.circuit;
  const raceDate = isF1ApiStructure
    ? raceData.races.schedule?.race?.date
    : raceData.date;
  // const raceTime = isF1ApiStructure ? raceData.races.schedule?.race?.time : raceData.time; // Not currently used
  const results = isF1ApiStructure ? raceData.races.results : raceData.results;

  if (!Array.isArray(results)) {
    return (
      <div className="p-10 text-center text-red-500 dark:text-red-400">
        Error: Invalid results data format.
      </div>
    );
    // return <ErrorDisplay title="Data Error" message="Invalid results data format received." />; // Alternative
  }

  const podiumDrivers = results.filter((r) => parseInt(r.position) <= 3);
  const defaultDriverImage = "/images/drivers/default.png";
  const defaultTeamLogo = "/images/teams/default.svg";

  // --- Animation Variants ---
  const variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.03 } },
  }; // Adjusted stagger
  const rowVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0 },
  }; // Adjusted x

  return (
    <div className="px-2 py-2 sm:px-6 lg:px-8 text-gray-900 dark:text-white">
      {/* Race Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#2f024f] dark:text-[#4a037a] mb-1">
              {raceName || "Race Results"}
            </h1>
            <h2 className="text-lg md:text-xl font-semibold text-gray-700 dark:text-gray-300 mt-1">
              Round {currentRound}{" "}
              <span className="text-gray-500 dark:text-gray-500 font-normal">
                | {season}
              </span>
            </h2>
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin size={16} className="mr-2 flex-shrink-0" />
                <span>
                  {circuit?.circuitName},{" "}
                  {circuit?.Location?.locality || circuit?.city}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 ">
        <div className="flex space-x-4 border-b border-[#2f024f] dark:border-[#4a037a]">
          <button
            onClick={() => setSelectedTab("results")}
            className={`py-2 px-4 font-medium transition-colors relative ${selectedTab === "results" ? "text-[#2f024f] dark:text-[#4a037a]" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
          >
            Results
            {selectedTab === "results" && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#2f024f] dark:bg-[#4a037a]"
              />
            )}
          </button>
          <button
            onClick={() => setSelectedTab("podium")}
            className={`py-2 px-4 font-medium transition-colors relative ${selectedTab === "podium" ? "text-[#2f024f] dark:text-[#4a037a]" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
          >
            Podium
            {selectedTab === "podium" && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#2f024f] dark:bg-[#4a037a]"
              />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedTab === "results" ? (
          // --- Results Table Tab ---
          <motion.div
            key="results"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            <div className="overflow-hidden rounded-lg shadow-md bg-white dark:bg-black border border-[#2f024f] dark:border-[#4a037a]">
              <div className="overflow-x-auto">
                <motion.table
                  className="min-w-full divide-y divide-[#2f024f] dark:divide-[#4a037a]"
                  variants={tableVariants}
                >
                  <thead className="bg-gray-50 dark:bg-black">
                    <tr>
                      <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-12">
                        Pos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Driver
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Time/Status
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-16">
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-black divide-y divide-[#2f024f] dark:divide-[#4a037a]">
                    {results.map((result, index) => {
                      // Find driver info
                      const driverAcr =
                        result.driver?.shortName || result.Driver?.code;
                      const driverInfo =
                        driverInfoMap && driverAcr
                          ? driverInfoMap.get(driverAcr)
                          : null;
                      const headshotUrl =
                        driverInfo?.headshot_url || defaultDriverImage;
                      const driverFullName =
                        driverInfo?.full_name ||
                        `${result.Driver?.givenName || result.driver?.name || ""} ${result.Driver?.familyName || result.driver?.surname || ""}`.trim();
                      // Find team info
                      const teamName =
                        result.team?.teamName ||
                        result.Constructor?.name ||
                        "N/A";
                      const teamId =
                        result.team?.teamId ||
                        result.Constructor?.constructorId;
                      const teamLogoUrl = teamId
                        ? `/images/teams/${teamId}.svg`
                        : defaultTeamLogo;

                      return (
                        <motion.tr
                          key={
                            result.driver?.driverId ||
                            result.Driver?.driverId ||
                            result.position
                          }
                          variants={rowVariants}
                          className={`hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors duration-150`}
                        >
                          {/* Position */}
                          <td className="px-3 py-4 whitespace-nowrap text-center">
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${result.position === "1" ? "bg-yellow-400 text-black" : result.position === "2" ? "bg-gray-300 text-black dark:bg-gray-500 dark:text-white" : result.position === "3" ? "bg-yellow-700 text-white" : "text-gray-700 dark:text-gray-300"}`}
                            >
                              {result.position}
                            </div>
                          </td>
                          {/* Driver */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img
                                src={headshotUrl}
                                alt={driverFullName}
                                className="w-9 h-9 rounded-full mr-4 object-cover flex-shrink-0 bg-gray-200 dark:bg-gray-700"
                                onError={(e) => {
                                  if (e.target.src !== defaultDriverImage) {
                                    e.target.onerror = null;
                                    e.target.src = defaultDriverImage;
                                  }
                                }}
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {driverFullName || "Driver"}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {driverAcr || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          {/* Team */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <img
                              src={teamLogoUrl}
                              alt={`${teamName} Logo`}
                              title={teamName}
                              className="h-5 sm:h-6 w-auto object-contain"
                              onError={(e) => {
                                if (e.target.src !== defaultTeamLogo) {
                                  e.target.onerror = null;
                                  e.target.src = defaultTeamLogo;
                                }
                              }}
                            />
                          </td>
                          {/* Time/Status */}
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                            {result.time || result.status || ""}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-center">
                            <span
                              className={`text-base font-bold ${parseInt(result.points) > 0 ? "text-[#2f024f] dark:text-[#4a037a]" : "text-gray-500 dark:text-gray-400"}`}
                            >
                              {result.points}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </motion.table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="podium"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-black rounded-xl overflow-hidden shadow-lg p-6 border border-[#2f024f] dark:border-[#4a037a]">
              <h3 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white flex items-center justify-center">
                <Trophy
                  className="text-[#2f024f] dark:text-[#4a037a] mr-2"
                  size={24}
                />{" "}
                Race Podium
              </h3>
              {podiumDrivers.length >= 3 ? (
                <PodiumDisplay
                  top3={podiumDrivers}
                  driverInfoMap={driverInfoMap}
                />
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                  Not enough finishers for full podium display.
                </div>
              )}
              {/* Button to switch back */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setSelectedTab("results")}
                  className="px-4 py-2 bg-[#2f024f] hover:bg-[#4a037a] text-white rounded-md transition-colors duration-300 flex items-center text-sm"
                >
                  <ChevronRight
                    size={16}
                    className="mr-1 transform rotate-180"
                  />{" "}
                  View Full Results Table
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RaceResultsPage;
