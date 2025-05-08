// src/components/standings/ConstructorPodiumDisplay.jsx
import React from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { getTeamColorClass } from "../../utils/teamColors";
import { containerVariants, itemVariants } from "../../utils/animations"; // Import variants

function ConstructorPodiumDisplay({ top3 }) {
  if (!top3 || top3.length < 3) return null;

  const podiumOrder = [top3[1], top3[0], top3[2]];
  const heights = ["h-[170px]", "h-[220px]", "h-[150px]"];
  const positions = [2, 1, 3];
  const trophyColor = "text-yellow-500";

  return (
    <motion.div
      variants={containerVariants} // Use imported variant
      initial="hidden"
      animate="visible"
      className="mb-12 hidden md:flex justify-center items-end gap-4 pt-8"
    >
      {podiumOrder.map((standing, index) => (
        <motion.div
          key={standing.team?.teamId || positions[index]}
          variants={itemVariants} // Use imported variant
          className={`relative bg-gray-100 dark:bg-gray-900/50 rounded-t-lg flex flex-col items-center pt-4 pb-6 shadow-lg 
                     ${index === 1 ? "w-1/4 z-10" : "w-1/5"} ${heights[index]}`}
        >
          <div
            className={`absolute top-0 left-0 right-0 ${index === 1 ? "h-2" : "h-1"} ${getTeamColorClass(standing.team?.teamName)}`}
          ></div>
          <div
            className={`text-4xl font-bold mb-2 ${index === 1 ? trophyColor : "text-gray-400 dark:text-gray-500"}`}
          >
            {index === 1 && <Trophy size={24} className="inline mr-2" />}
            {positions[index]}
          </div>
          <div className="text-center px-2">
            <div
              className={`font-semibold ${index === 1 ? "text-lg" : ""} text-gray-900 dark:text-white truncate`}
            >
              {standing.team?.teamName}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
              {standing.team?.country}
            </div>
          </div>
          <div
            className={`mt-auto px-3 py-1 rounded text-white font-mono text-sm font-medium ${index === 1 ? "bg-red-600 dark:bg-[#950505]" : "bg-gray-600 dark:bg-gray-700"}`}
          >
            {standing.points} PTS
          </div>
          {index === 1 && standing.wins > 0 && (
            <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
              {standing.wins} Wins
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
export default ConstructorPodiumDisplay;
