import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getRaceResults } from "../services/api";
import {
  ChevronRight,
  Calendar,
  MapPin,
  Clock,
  Trophy,
  Flag,
  AlertTriangle,
  Loader2,
} from "lucide-react";

function RaceResultsPage() {
  const { year, round } = useParams();
  const [raceData, setRaceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("results");

  useEffect(() => {
    if (year && round) {
      const fetchResults = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getRaceResults(year, round);

          if (
            data &&
            (Array.isArray(data.results) ||
              (data.races && Array.isArray(data.races.results)))
          ) {
            setRaceData(data);
          } else {
            setError(`Could not load race results for ${year} Round ${round}.`);
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
          setIsLoading(false);
        }
      };
      fetchResults();
    } else {
      setError("Year and round parameters are missing.");
      setIsLoading(false);
    }
  }, [year, round]);

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8 mt-10 rounded-lg bg-gray-100 dark:bg-gray-800"
      >
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Error Loading Results
        </h3>
        <p className="text-center text-gray-600 dark:text-gray-300 mt-2">
          {error}
        </p>
        <Link
          to="/races"
          className="mt-6 px-6 py-2 bg-[#950505] hover:bg-[#7D0404] text-white rounded-md transition-colors duration-300 flex items-center"
        >
          <ChevronRight size={16} className="mr-1" /> Back to Races
        </Link>
      </motion.div>
    );
  }

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-black text-gray-900 dark:text-white">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="mb-4"
          >
            <Loader2 size={40} className="text-red-600" />
          </motion.div>
          <p className="text-lg font-medium">Loading Driver Standings...</p>
        </div>
      );
    }

  if (!raceData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-8 mt-10 rounded-lg bg-gray-100 dark:bg-gray-800"
      >
        <Flag size={48} className="text-gray-500 mb-4" />
        <p className="text-center text-gray-700 dark:text-gray-300">
          No race results data found for {year} Round {round}.
        </p>
        <Link
          to="/races"
          className="mt-6 px-6 py-2 bg-[#950505] hover:bg-[#7D0404] text-white rounded-md transition-colors duration-300 flex items-center"
        >
          <ChevronRight size={16} className="mr-1" /> View All Races
        </Link>
      </motion.div>
    );
  }

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
  const raceTime = isF1ApiStructure
    ? raceData.races.schedule?.race?.time
    : raceData.time;
  const results = isF1ApiStructure ? raceData.races.results : raceData.results;

  if (!Array.isArray(results)) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-10 rounded-lg bg-gray-100 dark:bg-gray-800">
        <AlertTriangle size={48} className="text-red-500 mb-4" />
        <p className="text-center text-red-500">
          Error: Invalid results data format.
        </p>
      </div>
    );
  }

  const podiumDrivers = results.filter(
    (driver) => parseInt(driver.position) <= 3
  );

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const tableVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="px-2 py-2 sm:px-6 lg:px-8">
      <div
        className="mb-8"
      >
        {/* Race Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              <span className="text-3xl font-bold text-red-600 mb-1">
                {raceName}
              </span>{" "}
            </h1>
            <h2 className="text-xl font-semibold text-[#37045F] dark:text-[#a98eda] mt-1">
              Round {currentRound}
            </h2>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
              <div className="flex items-center">
                <MapPin
                  size={18}
                  className="text-gray-500 dark:text-gray-400 mr-2"
                />
                <span className="text-gray-700 dark:text-gray-300">
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
        <div className="flex space-x-4">
          <button
            onClick={() => setSelectedTab("results")}
            className={`py-2 px-4 font-medium transition-colors relative ${
              selectedTab === "results"
                ? "text-[#950505] dark:text-[#ff6b6b]"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Race Results
            {selectedTab === "results" && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#950505] dark:bg-[#ff6b6b]"
              />
            )}
          </button>
          <button
            onClick={() => setSelectedTab("podium")}
            className={`py-2 px-4 font-medium transition-colors relative ${
              selectedTab === "podium"
                ? "text-[#950505] dark:text-[#ff6b6b]"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Podium
            {selectedTab === "podium" && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#950505] dark:bg-[#ff6b6b]"
              />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedTab === "results" ? (
          <motion.div
            key="results"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            <div className="overflow-hidden rounded-xl shadow-lg bg-white dark:bg-transparent border border-[#950505] dark:border-[#950505]">
              <div className="overflow-x-auto">
                <motion.table
                  className="min-w-full divide-y divide-[#950505] dark:divide-[#950505]"
                  variants={tableVariants}
                >
                  <thead className="bg-gray-50 dark:bg-transparent">
                    <tr>
                      <th
                        scope="col"
                        className="px-3 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Pos
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Driver
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Team
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Time/Status
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-4 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Points
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-transparent divide-y divide-[#950505] dark:divide-[#950505]">
                    {results.map((result, index) => (
                      <motion.tr
                        key={
                          result.driver?.driverId ||
                          result.Driver?.driverId ||
                          result.position
                        }
                        variants={rowVariants}
                        className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 ${
                          parseInt(result.position) <= 3
                            ? "bg-gradient-to-r dark:bg-gradient-to-r " +
                              (result.position === "1"
                                ? "from-yellow-50 to-transparent dark:from-yellow-900/20 dark:to-transparent"
                                : result.position === "2"
                                  ? "from-gray-50 to-transparent dark:from-gray-700/20 dark:to-transparent"
                                  : "from-amber-50 to-transparent dark:from-amber-900/20 dark:to-transparent")
                            : ""
                        }`}
                      >
                        <td className="px-3 py-4 whitespace-nowrap">
                          <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                              result.position === "1"
                                ? "bg-yellow-500 text-white"
                                : result.position === "2"
                                  ? "bg-gray-300 text-gray-800 dark:bg-gray-500 dark:text-white"
                                  : result.position === "3"
                                    ? "bg-amber-700 text-white"
                                    : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {result.position}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {result.driver
                                  ? `${result.driver.name} ${result.driver.surname}`
                                  : `${result.Driver.givenName} ${result.Driver.familyName}`}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                Driver #
                                {result.driver?.number ||
                                  result.Driver?.permanentNumber ||
                                  "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 text-sm inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
                            {result.team?.teamName ||
                              result.Constructor?.name ||
                              "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {result.time || result.Time?.time || result.status}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <span
                            className={`text-sm font-bold ${
                              parseInt(result.points) > 0
                                ? "text-[#950505] dark:text-[#ff6b6b]"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          >
                            {result.points}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
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
            <div className="bg-white dark:bg-black rounded-xl overflow-hidden shadow-lg p-6">
              <h3 className="text-2xl font-bold text-center mb-8 text-gray-800 dark:text-white flex items-center justify-center">
                <Trophy
                  className="text-[#950505] dark:text-[#ff6b6b] mr-2"
                  size={24}
                />
                Race Podium
              </h3>

              <div className="flex flex-col sm:flex-row items-end justify-center gap-4 sm:gap-6 mb-8">
                {podiumDrivers.map((driver) => {
                  const position = parseInt(driver.position);
                  const driverName = driver.driver
                    ? `${driver.driver.name} ${driver.driver.surname}`
                    : `${driver.Driver.givenName} ${driver.Driver.familyName}`;
                  const team =
                    driver.team?.teamName || driver.Constructor?.name || "N/A";

                  // Determine podium position styling
                  const podiumHeight =
                    position === 1 ? "h-40" : position === 2 ? "h-32" : "h-24";
                  const bgColor =
                    position === 1
                      ? "bg-gradient-to-b from-yellow-400 to-yellow-500 dark:from-yellow-500 dark:to-yellow-600"
                      : position === 2
                        ? "bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-400 dark:to-gray-500"
                        : "bg-gradient-to-b from-amber-600 to-amber-700 dark:from-amber-600 dark:to-amber-700";

                  return (
                    <motion.div
                      key={position}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: position * 0.2, duration: 0.5 }}
                      className={`flex flex-col items-center ${position === 1 ? "order-2 sm:order-2" : position === 2 ? "order-1 sm:order-1" : "order-3 sm:order-3"}`}
                    >
                      <div className="mb-3 rounded-full bg-white dark:bg-gray-800 p-1 shadow-lg">
                        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-2xl font-bold">
                          {driverName
                            .split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </div>
                      </div>

                      <div
                        className={`${podiumHeight} w-24 sm:w-32 ${bgColor} rounded-t-lg shadow-lg flex items-end justify-center`}
                      >
                        <div className="text-4xl font-bold text-white pb-2">
                          {position}
                        </div>
                      </div>

                      <div className="mt-3 text-center">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {driverName}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {team}
                        </p>
                        <p className="text-sm font-medium text-[#950505] dark:text-[#ff6b6b]">
                          {driver.points} pts
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setSelectedTab("results")}
                  className="px-4 py-2 bg-[#950505] hover:bg-[#7D0404] text-white rounded-md transition-colors duration-300 flex items-center"
                >
                  <ChevronRight size={16} className="mr-1" /> View Full Results
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
