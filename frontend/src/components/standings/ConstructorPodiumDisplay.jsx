// src/components/standings/ConstructorPodiumDisplay.jsx
import React from "react";
import { motion } from "framer-motion";
import { getTeamColorClass } from "../../utils/teamColors";
import { containerVariants, itemVariants } from "../../utils/animations"; // Import variants

function ConstructorPodiumDisplay({ top3 }) {
  if (!top3 || top3.length < 3) return null;

  const podiumOrder = [top3[1], top3[0], top3[2]];
  const heights = ["h-[170px]", "h-[220px]", "h-[150px]"];
  const positions = [2, 1, 3];
  const trophyColor = "text-yellow-500";
  const defaultLogoPath = "/images/teams/default.svg";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mb-12 md:flex justify-center items-end gap-4 pt-8" // Removed 'hidden' class
    >
      {podiumOrder.map((standing, index) => {
        const teamId = standing.teamId;

        const teamLogoUrl = teamId
          ? `/images/teams/${teamId}.svg`
          : defaultLogoPath;
        const constructorTrophyPath = "/images/trophy.png";

        return (
          <motion.div
            key={teamId || positions[index]}
            variants={itemVariants}
            className={`relative bg-white dark:bg-black h-full rounded-t-lg flex flex-col items-center pt-4 pb-6 shadow-lg 
                          ${index === 1 ? "w-1/4 z-10" : "w-1/5"} ${heights[index]}`} // Adjusted dark bg slightly
          >
            {/* Team color bar */}
            <div
              className={`absolute top-0 left-0 right-0 ${index === 1 ? "h-2" : "h-1"} ${getTeamColorClass(standing.team?.teamName)}`}
            ></div>

            <div
              className={`text-4xl font-bold mb-2 ${index !== 1 && "text-gray-400 dark:text-gray-500"}`}
            >
              {" "}
              {/* Apply gray color only to P2/P3 */}
              {/* Use IMG for P1, number for P2/P3 */}
              {index === 1 ? (
                <img
                  src={constructorTrophyPath}
                  alt="Constructor Trophy"
                  className="h-28 w-auto inline mb-1" // Adjust height (h-8) as needed
                />
              ) : (
                positions[index] // Display number for P2/P3
              )}
            </div>

            {/* Team Logo */}
            <div className="mb-2 h-12 w-16 flex items-center justify-center">
              <img
                src={teamLogoUrl}
                alt={`${standing.team?.teamName || "Team"} Logo`}
                className="max-h-full max-w-full object-contain" // Ensure logo fits
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultLogoPath;
                }} // Fallback on error
              />
            </div>

            {/* Team Info */}
            <div className="text-center px-2">
              <div
                className={`font-semibold ${index === 1 ? "text-lg" : ""} text-gray-900 dark:text-white truncate`}
              >
                {standing.team?.teamName}
              </div>
            </div>

            {/* Wins */}
            {index === 1 && standing.wins > 0 && (
              <div className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                {standing.wins} Wins
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
export default ConstructorPodiumDisplay;
