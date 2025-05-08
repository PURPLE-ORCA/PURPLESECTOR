// src/components/standings/DriverCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { getTeamColorClass } from "../../utils/teamColors";

// Animation variant (can be defined here)
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
};

function DriverCard({ standing }) {
  if (!standing || !standing.driver || !standing.team) {
    return <div className="keen-slider__slide">Invalid data</div>; // Handle potential missing data
  }

  const driver = standing.driver;
  const team = standing.team;

  return (
    // Use motion.div if you want individual card animation on load (requires variants passed from parent or defined here)
    <motion.div
      variants={itemVariants} // Use variants if defined/passed
      className="bg-white dark:bg-gray-900/50 rounded-xl shadow-lg overflow-hidden group transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-200 dark:border-gray-800 h-full flex flex-col" // Added h-full flex flex-col
    >
      {/* Team color bar */}
      <div
        className={`h-2 w-full ${getTeamColorClass(team.teamName)} flex-shrink-0`}
      ></div>

      <div className="p-4 flex flex-col flex-grow">
        {" "}
        {/* Added flex-grow */}
        <div className="flex justify-between items-start mb-3">
          <div
            className={`text-2xl font-bold ${standing.position <= 3 ? "text-red-600 dark:text-[#950505]" : "text-gray-800 dark:text-white"}`}
          >
            {standing.position}
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900 dark:text-white">
              {standing.points} pts
            </div>
            {standing.wins > 0 && ( // Only show wins if > 0
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {standing.wins} wins
              </div>
            )}
          </div>
        </div>
        {/* Driver Image Placeholder */}
        <div className="text-center my-2 flex-grow flex flex-col justify-center items-center">
          {" "}
          {/* Centering content */}
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-xl font-bold text-[#950505] dark:text-[#ff6b6b]">
              {driver.code ||
                driver.surname?.substring(0, 3).toUpperCase() ||
                "?"}
            </span>
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-base truncate">
            {driver.name} {driver.surname}
          </h4>
        </div>
        {/* Team Name Badge */}
        <div className="mt-auto text-center pt-2">
          {" "}
          {/* Push to bottom */}
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            {team.teamName || "N/A"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default DriverCard;
