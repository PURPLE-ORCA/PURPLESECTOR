// src/pages/SchedulePage.jsx
import React, { useState, useEffect, useRef } from "react";
import { getSchedule } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { Icon } from "@iconify/react";
import {
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Assuming ShadCN Tabs


// --- Country Name to ISO Code Mapping ---
const countryCodeMap = {
  "Australia": "au",
  "China": "cn",
  "Japan": "jp",
  "Bahrain": "bh",
  "Saudi Arabia": "sa",
  "USA": "us", // Handle variations if API uses different terms
  "United States": "us",
  "Italy": "it",
  "Monaco": "mc",
  "Spain": "es",
  "Canada": "ca",
  "Austria": "at",
  "UK": "gb", // Use 'gb' for United Kingdom
  "Great Britain": "gb",
  "Belgium": "be",
  "Hungary": "hu",
  "Netherlands": "nl",
  "Azerbaijan": "az",
  "Singapore": "sg",
  "Mexico": "mx",
  "Brazil": "br",
  "Qatar": "qa",
  "UAE": "ae", // Use 'ae' for United Arab Emirates
  "United Arab Emirates": "ae",
  "France": "fr",
  "Germany": "de",
  // Add any others if necessary
};

const sessionOrder = [
  "fp1",
  "fp2",
  "sprintQualy",
  "fp3",
  "sprintRace",
  "qualy",
  "race",
];

const sessionColors = {
  fp1: "bg-blue-600 dark:bg-blue-700",
  fp2: "bg-blue-700 dark:bg-blue-800",
  fp3: "bg-blue-800 dark:bg-blue-900",
  sprintQualy: "bg-amber-500 dark:bg-amber-600",
  sprintRace: "bg-amber-600 dark:bg-amber-700",
  qualy: "bg-purple-600 dark:bg-purple-700",
  race: "bg-red-600 dark:bg-red-700",
};

const getCountryFlagIcon = (countryName) => {
  if (!countryName) {
    return (
      <Icon icon="mdi:flag-variant-outline" className="w-5 h-5 text-gray-500" />
    );
  }
  const countryCode = countryCodeMap[countryName.trim()];
  if (countryCode) {
    // Using flagpack: codes - adjust icon set if needed (e.g., 'circle-flags:', 'twemoji:')
    return (
      <Icon
        icon={`flagpack:${countryCode}`}
        className="w-9 h-8 rounded-sm shadow-sm"
      />
    );
  } else {
    console.warn(`Country code not found for: ${countryName}`);
    return <Icon icon="mdi:flag-checkered" className="w-6 h-5 text-gray-400" />;
  }
};

export default function SchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMonth, setActiveMonth] = useState(null);
  const [viewMode, setViewMode] = useState("calendar");
  const monthsRef = useRef([]);

  const [sliderRef, instanceRef] = useKeenSlider({
    slides: { perView: 1, spacing: 16 },
    slideChanged(slider) {
      if (
        monthsRef.current &&
        monthsRef.current.length > slider.track.details.abs
      ) {
        setActiveMonth(monthsRef.current[slider.track.details.abs]);
      }
    },
  });

  useEffect(() => {
    const fetchScheduleData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getSchedule();
        if (data && Array.isArray(data)) {
          setSchedule(data);

          const grouped = {};
          data.forEach((race) => {
            if (race.schedule?.race?.date) {
              const monthYear = getMonthAndYear(race.schedule.race.date);
              if (monthYear) {
                if (!grouped[monthYear]) grouped[monthYear] = [];
                grouped[monthYear].push(race);
              }
            }
          });

          const monthsList = Object.keys(grouped);
          monthsRef.current = monthsList;

          const now = new Date();
          const upcomingRaces = data.filter(
            (race) =>
              race.schedule?.race?.date &&
              new Date(
                `${race.schedule.race.date}T${race.schedule.race.time || "00:00:00Z"}`
              ) >= now
          );

          let initialMonth = monthsList.length > 0 ? monthsList[0] : null;
          if (upcomingRaces.length > 0) {
            const nextRaceDate = new Date(
              `${upcomingRaces[0].schedule.race.date}T${upcomingRaces[0].schedule.race.time || "00:00:00Z"}`
            );
            initialMonth = `${nextRaceDate.toLocaleString("default", { month: "long" })} ${nextRaceDate.getFullYear()}`;
          }

          if (initialMonth) {
            setActiveMonth(initialMonth);
            const initialIndex = monthsList.indexOf(initialMonth);
            if (instanceRef.current && initialIndex !== -1) {
              // Wrap moveToIdx in a check for slider readiness
              const checkAndMove = () => {
                if (instanceRef.current?.track?.details) {
                  // Check if slider details are available
                  instanceRef.current.moveToIdx(initialIndex, true, {
                    duration: 0,
                  }); // Move instantly
                } else {
                  setTimeout(checkAndMove, 50); // Retry shortly
                }
              };
              setTimeout(checkAndMove, 100); // Initial delay
            }
          } else if (monthsList.length > 0) {
            setActiveMonth(monthsList[0]); // Fallback if no upcoming
          }
        } else {
          setError("Could not load schedule data.");
          setSchedule([]);
        }
      } catch (err) {
        console.error("Error fetching schedule:", err);
        setError("An error occurred loading schedule.");
        setSchedule([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchScheduleData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Removed instanceRef from deps for now to avoid loop, consider specific trigger if needed

  const formatDateOnly = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const utcDate = new Date(dateString + "T00:00:00Z");
      const gmt1Date = new Date(utcDate.getTime() + 60 * 60 * 1000);
      return gmt1Date.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  const formatTimeOnly = (dateString, timeString) => {
    if (!dateString || !timeString) return "N/A";
    try {
      const utcDate = new Date(`${dateString}T${timeString}`);
      const gmt1Date = new Date(utcDate.getTime() + 60 * 60 * 1000);
      return gmt1Date.toLocaleString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "Invalid Time";
    }
  };

  const getSessionDisplayName = (key) => {
    const names = {
      fp1: "Practice 1",
      fp2: "Practice 2",
      fp3: "Practice 3",
      qualy: "Qualifying",
      race: "Race",
      sprintQualy: "Sprint Qualifying",
      sprintRace: "Sprint Race",
    };
    return names[key] || key;
  };

  const getMonthAndYear = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString + "T00:00:00Z"); // Ensure consistent parsing by adding time
      return `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
    } catch (e) {
      return null;
    }
  };

  const groupedRaces = schedule.reduce((acc, race) => {
    if (race.schedule?.race?.date) {
      const monthYear = getMonthAndYear(race.schedule.race.date);
      if (monthYear) {
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(race);
      }
    }
    return acc;
  }, {});

  const getCountryFlag = (country) => {
    const flags = {
      /* ... your flags object ... */
    };
    return flags[country] || "🏁";
  };

  const handleTabChange = (value) => setViewMode(value);

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

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-6 bg-gray-50 dark:bg-gray-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-red-600 text-center max-w-md shadow-lg"
        >
          <h3 className="text-xl font-bold text-red-500 mb-3">
            Schedule Unavailable
          </h3>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <button
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors duration-300"
            onClick={() => window.location.reload()}
          >
            {" "}
            Retry{" "}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto  px-2 sm:px-2 py-2 text-gray-900 dark:text-white" 
    >
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-red-600 via-[#37045F] to-red-700 text-transparent bg-clip-text">
          2025 FORMULA 1 SEASON
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Official Race Calendar{" "}
          <span className="text-xs">(Times shown in GMT+1)</span>
        </p>
      </motion.div>

      <div className="mb-8">
        <Tabs
          defaultValue="calendar"
          className="w-full"
          onValueChange={handleTabChange}
        >
          <TabsList className="grid w-full max-w-xs mx-auto grid-cols-2 mb-8 bg-gray-200 dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg p-1">
            <TabsTrigger
              value="calendar"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-600 dark:text-gray-400 rounded-md text-sm font-medium py-1.5"
            >
              <Icon
                icon="mdi:calendar-month-outline"
                className="w-5 h-5 mr-2"
              />
              Calendar
            </TabsTrigger>
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-600 dark:text-gray-400 rounded-md text-sm font-medium py-1.5"
            >
              <Icon icon="mdi:format-list-bulleted" className="w-5 h-5 mr-2" />
              Race List
            </TabsTrigger>
          </TabsList>

          {/* === Calendar View === */}
          <TabsContent value="calendar" className="mt-0">
            {Object.keys(groupedRaces).length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6 px-2">
                  <button
                    onClick={() => instanceRef.current?.prev()}
                    className="p-2 rounded-full bg-trasparent dark:bg-transparent transition-colors"
                    aria-label="Previous month"
                  >
                    {" "}
                    <Icon
                      icon="mdi:chevron-left"
                      className="w-8 h-8 text-red-500"
                    />{" "}
                  </button>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activeMonth ||
                      (monthsRef.current.length > 0
                        ? monthsRef.current[0]
                        : "Loading Month...")}
                  </h2>
                  <button
                    onClick={() => instanceRef.current?.next()}
                    className="p-2 rounded-full bg-trasparent dark:bg-trasparent transition-colors"
                    aria-label="Next month"
                  >
                    {" "}
                    <Icon
                      icon="mdi:chevron-right"
                      className="w-8 h-8 text-red-500"
                    />{" "}
                  </button>
                </div>

                <div ref={sliderRef} className="keen-slider -mx-2 sm:-mx-0">
                  {Object.entries(groupedRaces).map(([monthYear, races]) => (
                    <div
                      key={monthYear}
                      className="keen-slider__slide px-2 sm:px-0"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {races.map((race) => (
                          <motion.div
                            key={race.raceId || race.round}
                            whileHover={{
                              y: -5,
                              boxShadow:
                                "0 10px 15px -3px rgba(220, 38, 38, 0.3), 0 4px 6px -2px rgba(220, 38, 38, 0.2)",
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 15,
                            }}
                            // REMOVED onClick for expansion from the card
                            className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300"
                          >
                            {/* Race Header (Round, Flag, Name, Circuit) */}
                            <div className="bg-gradient-to-br from-red-600 via-[#950505] to-[#37045F] p-4">
                              <div className="flex justify-between items-center">
                                <span className="bg-black/50 dark:bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-white">
                                  ROUND {race.round}
                                </span>
                                {race.circuit?.country && (
                                  <span aria-label={race.circuit.country}>
                                    {getCountryFlagIcon(race.circuit.country)}
                                  </span>
                                )}
                              </div>
                              <h3 className="text-xl font-bold text-white mt-2 truncate">
                                {race.raceName}
                              </h3>
                              {race.circuit && (
                                <div className="flex items-center mt-1 text-xs text-gray-200">
                                  <Icon
                                    icon="mdi:map-marker-outline"
                                    className="w-4 h-4 mr-1.5 flex-shrink-0"
                                  />
                                  <span className="truncate">
                                    {race.circuit.circuitName}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Race Date and Time (Main Race) */}
                            <div className="p-4 bg-gray-50 dark:bg-black">
                              {race.schedule?.race ? (
                                <div className="flex justify-between items-center text-sm">
                                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                                    <Icon
                                      icon="mdi:calendar-check-outline"
                                      className="w-5 h-5 mr-2 text-red-500"
                                    />
                                    {formatDateOnly(race.schedule.race.date)}
                                  </div>
                                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                                    <Icon
                                      icon="mdi:flag-checkered"
                                      className="w-5 h-5 mr-2 text-red-500"
                                    />
                                    <span>
                                      {formatTimeOnly(
                                        race.schedule.race.date,
                                        race.schedule.race.time
                                      )}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-gray-600 dark:text-gray-400">
                                  Race date N/A
                                </p>
                              )}
                            </div>

                            {/* Session Details - ALWAYS VISIBLE NOW */}
                            {race.schedule && ( // Check if race.schedule exists
                              <div className="bg-gray-100 dark:bg-black border-t border-gray-200 dark:border-gray-700">
                                <div className="p-4 space-y-2">
                                  {Object.entries(race.schedule)
                                    .filter(
                                      ([, session]) =>
                                        session?.date && session?.time
                                    )
                                    .sort(
                                      ([keyA], [keyB]) =>
                                        sessionOrder.indexOf(keyA) -
                                        sessionOrder.indexOf(keyB)
                                    )
                                    .map(([key, session]) => (
                                      <div
                                        key={key}
                                        className={`p-3 rounded-md flex justify-between items-center text-white ${sessionColors[key] || "bg-gray-600 dark:bg-gray-700"}`}
                                      >
                                        <span className="font-semibold text-sm">
                                          {getSessionDisplayName(key)}
                                        </span>
                                        <span className="text-sm font-mono">
                                          {formatTimeOnly(
                                            session.date,
                                            session.time
                                          )}{" "}
                                          <span className="text-xs opacity-80">
                                            (GMT+1)
                                          </span>
                                        </span>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center p-10 bg-gray-100 dark:bg-gray-900 rounded-lg">
                <p className="text-gray-600 dark:text-gray-400">
                  No schedule data available.
                </p>
              </div>
            )}
          </TabsContent>

          {/* === List View === */}
          <TabsContent value="list" className="mt-0">
            <div className="space-y-4">
              {schedule.length > 0 ? (
                schedule.map((race) => (
                  <motion.div
                    key={race.raceId || race.round}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-black border-l-4 border-red-600 rounded-r-lg overflow-hidden shadow-lg hover:shadow-red-900/30"
                  >
                    <div className="p-5">
                      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                        <div>
                          <div className="flex items-center mb-1">
                            <span className="bg-red-600 px-3 py-1 rounded-full text-xs font-bold text-white mr-3">
                              ROUND {race.round}
                            </span>
                            {race.circuit?.country && (
                              <span
                                className="mr-2"
                                aria-label={race.circuit.country}
                              >
                                {getCountryFlagIcon(race.circuit.country)}
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-1 truncate">
                            {race.raceName}
                          </h3>
                          {race.circuit && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {race.circuit.circuitName}
                            </p>
                          )}
                        </div>
                      </div>
                      {race.schedule && typeof race.schedule === "object" && (
                        <div className="mt-6">
                          <h4 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-3">
                            Session Timeline
                          </h4>
                          <div className="relative border-l-2 border-gray-200 dark:border-gray-700 pl-6 space-y-3 py-1">
                            {Object.entries(race.schedule)
                              .filter(
                                ([, session]) => session?.date && session?.time
                              )
                              .sort(
                                ([keyA], [keyB]) =>
                                  sessionOrder.indexOf(keyA) -
                                  sessionOrder.indexOf(keyB)
                              )
                              .map(([key, session], index) => (
                                <motion.div
                                  key={key}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="relative flex items-center"
                                >
                                  <span className="absolute -left-[29px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 dark:border-black darK:bg-red-600 border-white bg-red-600"></span>
                                  <div
                                    className={`flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-md ${sessionColors[key] || "dark:bg-gray-800 bg-gray-200"} text-white`}
                                  >
                                    <div className="mb-1 sm:mb-0">
                                      <span className="px-2 py-0.5 rounded text-base font-semibold dark:bg-black/30 bg-white/30">
                                        {getSessionDisplayName(key)}
                                      </span>
                                      <p className="text-sm opacity-80 mt-0.5">
                                        {formatDateOnly(session.date)}
                                      </p>
                                    </div>
                                    <div className="flex items-center font-mono text-lg">
                                      <Icon
                                        icon="mdi:clock-outline"
                                        className="w-4 h-4 mr-1.5 opacity-80"
                                      />
                                      <span>
                                        {formatTimeOnly(
                                          session.date,
                                          session.time
                                        )}{" "}
                                        <span className="text-xs opacity-80">
                                          (GMT+1)
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center p-10 bg-gray-100 dark:bg-gray-900 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400">
                    No schedule data available.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
