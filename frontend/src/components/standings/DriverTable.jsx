// src/components/standings/DriverTable.jsx
import React from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { getTeamColorClass } from "../../utils/teamColors"; // Import color helper

// Animation variants (can be defined here or passed as props)
const containerVariants = {
  /* ... */
};
const itemVariants = {
  /* ... */
};

function DriverTable({ driverStandings }) {
  if (!driverStandings || driverStandings.length === 0) {
    return <p className="p-4 text-center">No standings data for table.</p>;
  }

  return (
    <motion.div
      // If using containerVariants, apply here, otherwise animate rows individually
      // variants={containerVariants} initial="hidden" animate="visible"
      className="overflow-x-auto" // Keep overflow management
    >
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
          {driverStandings.map((standing, index) => (
            <motion.tr
              key={standing.driver?.driverId || standing.position}
              variants={itemVariants} // Animate each row
              initial="hidden" // Add initial/animate if container variant isn't used
              animate="visible"
              transition={{ delay: index * 0.03 }} // Slight stagger for rows
              className="hover:bg-gray-100 dark:hover:bg-gray-900/40 transition-colors duration-150"
            >
              {/* Position */}
              <td
                className={`py-3 px-4 font-medium whitespace-nowrap text-gray-700 dark:text-gray-300 ${standing.position <= 3 ? "font-bold" : ""}`}
              >
                <div className="flex items-center justify-center">
                  {" "}
                  {/* Center content */}
                  {/* Position change indicators (optional) */}
                  {/* {index > 0 && standing.position < driverStandings[index - 1].position && <ChevronUp size={14} className="text-green-500 mr-1" />} */}
                  {/* {index > 0 && standing.position > driverStandings[index - 1].position && <ChevronDown size={14} className="text-red-500 mr-1" />} */}
                  {standing.position}
                </div>
              </td>
              {/* Driver */}
              <td className="py-3 px-6 whitespace-nowrap">
                <div className="flex items-center">
                  <div
                    className={`w-1 h-6 rounded-full mr-3 ${getTeamColorClass(standing.team?.teamName)}`}
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
              {/* Team */}
              <td className="py-3 px-6 whitespace-nowrap text-gray-500 dark:text-gray-400">
                {standing.team?.teamName || "N/A"}
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
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

export default DriverTable;
