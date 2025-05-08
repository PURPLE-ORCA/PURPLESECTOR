// src/components/standings/DriverTable.jsx
import React from "react";
import { motion } from "framer-motion";
// Removed Chevron imports
import { getTeamColorClass } from "../../utils/teamColors";
import { itemVariants } from "../../utils/animations";

function DriverTable({ driverStandings }) {
  if (!driverStandings || driverStandings.length === 0) {
    return <p className="p-4 text-center">No standings data for table.</p>;
  }

  const defaultLogoPath = "/images/teams/default.svg"; // Define fallback path

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <th className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Pos
            </th>
            <th className="py-3 px-6 text-left font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Driver
            </th>
            <th className="py-3 px-6 text-left font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Team
            </th>
            <th className="py-3 px-4 text-right font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Points
            </th>
            <th className="py-3 px-4 text-right font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Wins
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {driverStandings.map((standing, index) => {
            // Construct logo URL (using direct teamId from driver standing data)
            const teamId = standing.team?.teamId; // Get teamId from nested team object
            const teamLogoUrl = teamId
              ? `/images/teams/${teamId}.svg`
              : defaultLogoPath;
            const teamName = standing.team?.teamName || "N/A"; // Get team name for alt text

            return (
              <motion.tr
                key={standing.driver?.driverId || standing.position}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.03 }}
                className="hover:bg-gray-100 dark:hover:bg-gray-900/40 transition-colors duration-150"
              >
                {/* Position */}
                <td
                  className={`py-3 px-4 font-medium whitespace-nowrap text-center text-gray-700 dark:text-gray-300 ${standing.position <= 3 ? "font-bold" : ""}`}
                >
                  {standing.position}
                </td>
                {/* Driver */}
                <td className="py-3 px-6 whitespace-nowrap">
                  <div className="flex items-center">
                    {/* Optional: Use team color bar OR driver flag here */}
                    <div
                      className={`w-1 h-6 rounded-full mr-3 ${getTeamColorClass(teamName)}`}
                    ></div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {standing.driver?.name} {standing.driver?.surname}
                      </div>
                      {standing.driver?.shortName && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {standing.driver.shortName}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                {/* Team Logo */}
                <td className="py-3 px-6 whitespace-nowrap">
                  {/* Add the img tag here */}
                  <img
                    src={teamLogoUrl}
                    alt={`${teamName} Logo`}
                    title={teamName} // Add title attribute for hover tooltip
                    className="h-6 w-auto object-contain" // Adjust height (h-6), width auto
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultLogoPath;
                    }}
                  />
                </td>
                {/* Points */}
                <td className="py-3 px-4 font-bold text-right whitespace-nowrap text-red-600 dark:text-[#950505]">
                  {standing.points}
                </td>
                {/* Wins */}
                <td className="py-3 px-4 text-right whitespace-nowrap text-gray-500 dark:text-gray-400">
                  {standing.wins ?? "0"}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default DriverTable;
