// src/components/standings/DriverTable.jsx
import React from "react";
import { motion } from "framer-motion";
import { getTeamColorClass } from "../../utils/teamColors"; // Keep if using color bar
import { itemVariants } from "../../utils/animations"; // Assuming variants are imported

// Accept driverInfoMap prop
function DriverTable({ driverStandings, driverInfoMap }) {
  if (!driverStandings || driverStandings.length === 0) {
    return (
      <p className="p-4 text-center text-gray-500 dark:text-gray-400">
        No standings data for table.
      </p>
    );
  }
  // Add check for driverInfoMap, although parent should handle loading state
  if (!driverInfoMap || driverInfoMap.size === 0) {
    console.warn("DriverTable received empty or invalid driverInfoMap.");
  }

  const defaultLogoPath = "/images/teams/default.svg"; // Fallback for team logos
  const defaultDriverImage = "/images/drivers/default.png"; // Fallback for driver headshots

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border[#950505] dark:border-[#950505] bg-gray-100 dark:bg-black">
            <th className="py-3 px-4 text-center font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-12">
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
            <th className="py-3 px-4 text-right font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider w-16">
              Wins
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#950505] dark:divide-[#950505]">
          {driverStandings.map((standing, index) => {
            // --- Find driver info using Acronym ---
            const driverAcr = standing.driver?.shortName;
            const driverInfo =
              driverInfoMap && driverAcr ? driverInfoMap.get(driverAcr) : null;
            const headshotUrl = driverInfo?.headshot_url || defaultDriverImage;
            const driverFullName =
              driverInfo?.full_name ||
              `${standing.driver?.name || ""} ${standing.driver?.surname || ""}`.trim();

            // --- Get team info ---
            const teamId = standing.team?.teamId;
            const teamName = standing.team?.teamName || "N/A";
            const teamLogoUrl = teamId
              ? `/images/teams/${teamId}.svg`
              : defaultLogoPath;

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
                  className={`py-3 px-4 font-medium whitespace-nowrap text-center text-gray-700 dark:text-gray-300 ${standing.position <= 3 ? "font-bold text-red-600 dark:text-[#950505]" : ""}`}
                >
                  {standing.position}
                </td>

                {/* Driver (Headshot + Name + Acronym) */}
                <td className="py-3 px-6 whitespace-nowrap">
                  <div className="flex items-center">
                    {/* Headshot */}
                    <img
                      src={headshotUrl}
                      alt={driverFullName}
                      className="w-8 h-8 rounded-full mr-3 object-cover flex-shrink-0 bg-gray-200 dark:bg-gray-700" // Added placeholder bg
                      onError={(e) => {
                        if (e.target.src !== defaultDriverImage) {
                          e.target.onerror = null;
                          e.target.src = defaultDriverImage;
                        }
                      }}
                    />
                    {/* Name and Acronym */}
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {driverFullName || "Driver Name"}
                      </div>
                      {driverAcr && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {driverAcr}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Team Logo */}
                <td className="py-3 px-6 whitespace-nowrap">
                  <img
                    src={teamLogoUrl}
                    alt={`${teamName} Logo`}
                    title={teamName} // Tooltip with name
                    className="h-5 sm:h-6 w-auto object-contain" // Slightly smaller height
                    onError={(e) => {
                      if (e.target.src !== defaultLogoPath) {
                        e.target.onerror = null;
                        e.target.src = defaultLogoPath;
                      }
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
