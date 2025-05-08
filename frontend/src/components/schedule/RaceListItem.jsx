// src/components/schedule/RaceListItem.jsx
import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { sessionOrder, sessionColors } from "../../utils/constants"; // Import constants
import {
  getCountryFlagIconName,
  getSessionDisplayName,
} from "../../utils/helpers"; 
import { formatDateOnly, formatTimeOnly } from "../../utils/formatters"; // Import formatters

// Animation variant for individual list items (optional)
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function RaceListItem({ race }) {
  // Make sure race and schedule exist before trying to render details
  if (!race || !race.schedule) {
    // Optionally return a placeholder or null if data is incomplete
    return null;
  }

  // Filter and sort sessions once
  const validSessions = Object.entries(race.schedule)
    .filter(([, session]) => session?.date && session?.time)
    .sort(
      ([keyA], [keyB]) =>
        sessionOrder.indexOf(keyA) - sessionOrder.indexOf(keyB)
    );

  const flagIconName = getCountryFlagIconName(race.circuit?.country); // Get the icon name string

  return (
    <motion.div
      variants={itemVariants} // Apply item animation
      className="bg-white dark:bg-black border-l-4 border-red-600 rounded-r-lg overflow-hidden shadow-lg hover:shadow-red-900/30 transition-shadow duration-200"
    >
      <div className="p-5">
        {/* Race Header Section */}
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
          <div>
            <div className="flex items-center mb-1">
              <span className="bg-red-600 px-3 py-1 rounded-full text-xs font-bold text-white mr-3">
                ROUND {race.round}
              </span>
              {race.circuit?.country && (
                <span className="mr-2" aria-label={race.circuit.country}>
                  {/* Use the Icon component HERE with the obtained name */}
                  <Icon
                    icon={flagIconName}
                    className="w-6 h-5 rounded-sm shadow-sm"
                  />
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
          {/* Race Date/Time Display */}
          {race.schedule?.race && (
            <div className="bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-lg mt-3 md:mt-0 text-center md:text-left flex-shrink-0">
              {" "}
              {/* Added flex-shrink-0 */}
              <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center justify-center md:justify-start">
                <Icon
                  icon="mdi:calendar-check-outline"
                  className="w-4 h-4 mr-2 text-red-500"
                />
                {formatDateOnly(race.schedule.race.date)}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center justify-center md:justify-start mt-1">
                <Icon
                  icon="mdi:flag-checkered"
                  className="w-4 h-4 mr-2 text-red-500"
                />
                Race:{" "}
                {formatTimeOnly(
                  race.schedule.race.date,
                  race.schedule.race.time
                )}{" "}
                <span className="text-xs">(GMT+1)</span>
              </p>
            </div>
          )}
        </div>

        {/* Session Timeline Section */}
        {validSessions.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold uppercase text-gray-500 dark:text-gray-400 mb-3">
              Session Timeline
            </h4>
            {/* Timeline container */}
            <div className="relative border-l-2 border-gray-200 dark:border-gray-700 pl-6 space-y-3 py-1">
              {validSessions.map(([key, session], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative flex items-center" // Removed motion from here, added to parent
                >
                  {/* Timeline Dot */}
                  <span
                    className={`absolute -left-[29px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 ${sessionColors[key] || "bg-gray-500"} dark:border-black border-white`}
                  ></span>{" "}
                  {/* Use session color for dot bg? Needs adjustment */}
                  {/* Session Details Box */}
                  <div
                    className={`flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-md text-white ${sessionColors[key] || "dark:bg-gray-800 bg-gray-200"}`}
                  >
                    <div className="mb-1 sm:mb-0">
                      {/* Session Name Badge */}
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-semibold dark:bg-black/30 bg-white/30 dark:text-gray-100 text-gray-800"
                      >
                        {getSessionDisplayName(key)}
                      </span>
                      {/* Session Date */}
                      <p
                        className="text-xs opacity-80 mt-0.5 dark:text-gray-300 text-gray-700"
                      >
                        {formatDateOnly(session.date)}
                      </p>
                    </div>
                    {/* Session Time */}
                    <div
                      className="flex items-center font-mono text-sm dark:text-gray-100 text-gray-800"
                    >
                      <Icon
                        icon="mdi:clock-outline"
                        className="w-4 h-4 mr-1.5 opacity-80"
                      />
                      <span>
                        {formatTimeOnly(session.date, session.time)}{" "}
                        <span className="text-xs opacity-80">(GMT+1)</span>
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
  );
}

export default RaceListItem;
