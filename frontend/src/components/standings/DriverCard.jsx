// src/components/standings/DriverCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { getTeamColorClass } from "../../utils/teamColors";
// Removed unused itemVariants import unless you add animations here
// import { itemVariants } from '../../utils/animations';

function DriverCard({ standing, driverInfo }) {
  // Basic check for essential standing data
  if (!standing || !standing.driver || !standing.team) {
    return (
      <div className="h-full bg-gray-200 dark:bg-gray-800 rounded-xl p-4 text-xs text-red-500">
        Invalid standing data
      </div>
    );
  }

  const driver = standing.driver;
  const team = standing.team;
  const defaultDriverImage = "/images/drivers/default.png"; // Fallback image path

  // Use info from driverInfo if available, otherwise fallback to standing data
  const headshotUrl = driverInfo?.headshot_url || defaultDriverImage;
  const driverFullName =
    driverInfo?.full_name ||
    `${driver.name || ""} ${driver.surname || ""}`.trim();
  const driverCode = driverInfo?.name_acronym || driver.shortName; // Acronym

  return (
    <motion.div // Keep motion for potential future animations or hover effects
      // variants={itemVariants}
      whileHover={{
        y: -4,
        transition: { type: "spring", stiffness: 300, damping: 15 },
      }} // Example hover
      className="bg-white dark:bg-black backdrop-blur-sm rounded-xl shadow-lg overflow-hidden group transform transition-all duration-300  h-full flex flex-col" // Ensure h-full
    >
      {/* Team color bar */}
      <div
        className={`h-2 w-full ${getTeamColorClass(team.teamName)} flex-shrink-0`}
      ></div>

      <div className="p-4 flex flex-col flex-grow ">
        {/* Top section: Position and Points/Wins */}
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
            {standing.wins > 0 && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {standing.wins} wins
              </div>
            )}
          </div>
        </div>

        {/* Center section: Headshot and Info */}
        <div className="text-center my-2 flex-grow flex flex-col justify-center items-center">
          {/* Driver Headshot Image */}
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
            <img
              src={headshotUrl}
              alt={driverFullName || "Driver"}
              className="h-full w-full object-cover" // Use object-cover
              loading="lazy"
              onError={(e) => {
                if (e.target.src !== defaultDriverImage) {
                  e.target.onerror = null;
                  e.target.src = defaultDriverImage;
                }
              }}
            />
          </div>
          {/* Driver Name */}
          <h4 className="font-semibold text-gray-900 dark:text-white text-base truncate w-full">
            {driverFullName || "Driver Name"}
          </h4>
          {/* Driver Code (Optional) */}
          {driverCode && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {driverCode}
            </p>
          )}
        </div>

        {/* Team Name Badge */}
        <div className="mt-auto text-center pt-2">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTeamColorClass(team.teamName)}`}>
            {team.teamName || "N/A"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
export default DriverCard;
