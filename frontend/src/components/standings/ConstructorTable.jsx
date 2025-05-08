// src/components/standings/ConstructorTable.jsx
import React from "react";
import { motion } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { getTeamColorClass } from "../../utils/teamColors";
import { itemVariants } from "../../utils/animations"; // Import item variant

function ConstructorTable({ constructorStandings }) {
  if (!constructorStandings || constructorStandings.length === 0) {
    return <p className="p-4 text-center">No standings data for table.</p>;
  }

  return (
    <div className="overflow-x-auto">
      {" "}
      {/* Removed outer motion.div if rows are animated */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
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
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {constructorStandings.map((standing, index) => (
            <motion.tr // Animate each table row
              key={standing.team?.teamId || standing.position}
              variants={itemVariants} // Use imported variant
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.03 }}
              className="hover:bg-gray-100 dark:hover:bg-gray-900/40 transition-colors duration-150"
            >
              <td
                className={`py-3 px-4 font-medium whitespace-nowrap text-gray-700 dark:text-gray-300 ${standing.position <= 3 ? "font-bold" : ""}`}
              >
                <div className="flex items-center justify-center">
                  {" "}
                  {standing.position}{" "}
                </div>
              </td>
              <td className="py-3 px-6 whitespace-nowrap">
                <div className="flex items-center">
                  <div
                    className={`w-1 h-6 rounded-full mr-3 ${getTeamColorClass(standing.team?.teamName)}`}
                  ></div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {standing.team?.teamName || "N/A"}
                  </div>
                </div>
              </td>
              <td className="py-3 px-6 whitespace-nowrap text-gray-500 dark:text-gray-400">
                {standing.team?.country || "N/A"}
              </td>
              <td className="py-3 px-4 font-bold text-right whitespace-nowrap text-red-600 dark:text-[#950505]">
                {standing.points}
              </td>
              <td className="py-3 px-4 text-right whitespace-nowrap text-gray-500 dark:text-gray-400">
                {standing.wins ?? "0"}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default ConstructorTable;
