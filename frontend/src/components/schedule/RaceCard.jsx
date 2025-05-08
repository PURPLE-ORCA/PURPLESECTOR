// src/components/schedule/RaceCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { sessionOrder, sessionColors } from "../../utils/constants";
import {
  getCountryFlagIconName,
  getSessionDisplayName,
} from "../../utils/helpers"; 
import { formatDateOnly, formatTimeOnly } from "../../utils/formatters";

function RaceCard({ race }) {
  const flagIconName = getCountryFlagIconName(race.circuit?.country); // Get the icon name string
  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow:
          "0 10px 15px -3px rgba(220, 38, 38, 0.3), 0 4px 6px -2px rgba(220, 38, 38, 0.2)",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 h-full flex flex-col" // Added h-full flex flex-col
    >
      {/* Race Header */}
      <div className="bg-gradient-to-br from-red-600 via-[#950505] to-[#37045F] p-4">
        <div className="flex justify-between items-center">
          <span className="bg-black/50 dark:bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-white">
            ROUND {race.round}
          </span>
          {race.circuit?.country && (
            <span aria-label={race.circuit.country}>
              {/* Use the Icon component here with the obtained name */}
              <Icon
                icon={flagIconName}
                className="w-6 h-5 rounded-sm shadow-sm"
              />
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
            <span className="truncate">{race.circuit.circuitName}</span>
          </div>
        )}
      </div>

      {/* Race Date/Time */}
      <div className="p-4 bg-gray-50 dark:bg-gray-900">
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
          <p className="text-gray-600 dark:text-gray-400">Race date N/A</p>
        )}
      </div>

      {/* Session Details */}
      {race.schedule && (
        <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-grow">
          {" "}
          {/* Added flex-grow */}
          <div className="p-4 space-y-2">
            {Object.entries(race.schedule)
              .filter(([, session]) => session?.date && session?.time)
              .sort(
                ([keyA], [keyB]) =>
                  sessionOrder.indexOf(keyA) - sessionOrder.indexOf(keyB)
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
                    {formatTimeOnly(session.date, session.time)}{" "}
                    <span className="text-xs opacity-80">(GMT+1)</span>
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default RaceCard;
