// src/components/standings/ConstructorCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { getTeamColorClass } from "../../utils/teamColors";
import { Building2 } from "lucide-react";
import { itemVariants } from "../../utils/animations"; // Import item variant

function ConstructorCard({ standing }) {
  if (!standing || !standing.team) {
    return <div className="keen-slider__slide">Invalid data</div>;
  }
  const team = standing.team;

  return (
    <motion.div
      variants={itemVariants} // Use imported variant (optional, could apply to carousel instead)
      // initial="hidden" // Only needed if parent doesn't handle stagger
      // animate="visible" // Only needed if parent doesn't handle stagger
      className="bg-white dark:bg-gray-900/50 rounded-xl shadow-lg overflow-hidden group transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-gray-200 dark:border-gray-800 h-full flex flex-col"
    >
      <div
        className={`h-2 w-full ${getTeamColorClass(team.teamName)} flex-shrink-0`}
      ></div>
      <div className="p-4 flex flex-col flex-grow ">
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
        <div className="text-center my-2 flex-grow flex flex-col justify-center items-center">
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <Building2 className="w-8 h-8 text-gray-500 dark:text-gray-400" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-base truncate">
            {team.teamName}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {team.country}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
export default ConstructorCard;
