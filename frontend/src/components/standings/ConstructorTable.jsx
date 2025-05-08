// src/components/standings/ConstructorTable.jsx
import React from "react";
import { motion } from "framer-motion";
// Removed Chevron imports as they were commented out
// import { ChevronUp, ChevronDown } from 'lucide-react';
import { getTeamColorClass } from "../../utils/teamColors"; // Keep color helper if needed elsewhere, or remove
import { itemVariants } from "../../utils/animations";

function ConstructorTable({ constructorStandings }) {
  if (!constructorStandings || constructorStandings.length === 0) {
    return <p className="p-4 text-center">No standings data for table.</p>;
  }

  const defaultLogoPath = "/images/teams/default.svg"; // Define fallback path

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#950505] dark:border-[#950505] bg-gray-50 dark:bg-black">
            <th className="py-3 px-4 text-left font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Pos
            </th>
            <th className="py-3 px-6 text-left font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Constructor
            </th>
            <th className="py-3 px-6 text-left font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Nationality
            </th>
            <th className="py-3 px-4 text-right font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Points
            </th>
            <th className="py-3 px-4 text-right font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
              Wins
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#950505] dark:divide-[#950505]">
          {constructorStandings.map((standing, index) => {
            // Construct logo URL (using direct teamId)
            const teamId = standing.teamId; // Access directly now we know it exists
            const teamLogoUrl = teamId
              ? `/images/teams/${teamId}.svg`
              : defaultLogoPath;

            return (
              <motion.tr
                key={teamId || standing.position} // Use teamId as key
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.03 }}
                className="hover:bg-gray-100 dark:hover:bg-gray-900/40 transition-colors duration-150"
              >
                {/* Position */}
                <td
                  className={`py-3 px-4 font-medium whitespace-nowrap text-gray-700 dark:text-gray-300 ${standing.position <= 3 ? "font-bold" : ""}`}
                >
                  <div className="flex items-center justify-center">
                    {standing.position}
                  </div>
                </td>
                {/* Constructor Name + Logo */}
                <td className="py-3 px-6 whitespace-nowrap">
                  <div className="flex items-center">
                    {/* Team Logo */}
                    <img
                      src={teamLogoUrl}
                      alt={`${standing.team?.teamName || "Team"} Logo`}
                      className="w-8 h-8 mr-3 object-contain flex-shrink-0" // Added size, margin, flex-shrink
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultLogoPath;
                      }}
                    />
                    {/* Team Name */}
                    <span className="font-semibold text-gray-900 dark:text-white truncate">
                      {" "}
                      {/* Added truncate */}
                      {standing.team?.teamName || "N/A"}
                    </span>
                  </div>
                </td>
                {/* Nationality */}
                <td className="py-3 px-6 whitespace-nowrap text-gray-500 dark:text-gray-400">
                  {standing.team?.country || "N/A"}
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

export default ConstructorTable;
