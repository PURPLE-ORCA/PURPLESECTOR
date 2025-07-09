// src/components/standings/PodiumDisplay.jsx
import React from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react"; // Keep Trophy for P1 indicator
import { getTeamColorClass } from "../../utils/teamColors"; // Assuming this utility exists
import { podiumContainerVariants, podiumItemVariants } from "../../utils/animations";
// --- Podium Display Component ---
function PodiumDisplay({ top3, driverInfoMap, isLoadingDrivers }) {
  // Basic validation
  if (!top3 || top3.length < 3) {
    // Return null or a placeholder if data is insufficient
    return null;
  }
  if (!driverInfoMap || driverInfoMap.size === 0) {
    console.warn("PodiumDisplay received empty or invalid driverInfoMap");
  }

  // Reorder for visual display: P2, P1, P3
  const podiumOrder = [top3[1], top3[0], top3[2]];
  const heights = ["h-[170px]", "h-[220px]", "h-[150px]"];
  const positions = [2, 1, 3];
  const trophyColor = "text-yellow-500";
  const defaultDriverImage = "/images/drivers/default.png"; // Define path to your fallback image

  return (
    <motion.div
      variants={podiumContainerVariants}
      initial="hidden"
      animate="visible"
      className="md:flex justify-center items-end gap-4 pt-8"
    >
      {podiumOrder.map((standing, index) => {
        const teamName = standing.team?.teamName;
        const driverId = standing.driver?.driverId;
        const driverAcr = standing.driver?.shortName;
        const driverInfo =
          driverInfoMap && driverAcr ? driverInfoMap.get(driverAcr) : null;
        const headshotUrl =
          !isLoadingDrivers && driverInfo?.headshot_url
            ? driverInfo.headshot_url
            : defaultDriverImage;
        const driverFullName =
          !isLoadingDrivers && driverInfo?.full_name
            ? driverInfo.full_name
            : `${standing.driver?.name || ""} ${standing.driver?.surname || ""}`.trim();
        const driverTrophyPath = "/images/drivers-trophy.png";

        return (
          <motion.div
            key={standing.driver?.driverId || positions[index]}
            variants={podiumItemVariants}
            className={`
              relative bg-card rounded-t-lg 
              flex flex-col items-center pt-4 pb-18  shadow-lg 
              ${index === 1 ? "w-1/4 z-10" : "w-1/5"} ${heights[index]}
              transition-colors duration-200 h-full
            `}
          >
            {/* Team color bar */}
            <motion.div
              className={`absolute top-0 left-0 right-0 ${index === 1 ? 'h-2' : 'h-1'} ${getTeamColorClass(teamName)}`}
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            ></motion.div>

            {/* Position Number */}
            <div
              className={`text-4xl font-bold mb-2 ${index === 1 ? trophyColor : "text-gray-400 dark:text-gray-500"}`}
            >
              {index === 1 ?(
                <img
                  src={driverTrophyPath}
                  alt="Driver Trophy"
                  className="h-28 w-auto inline mb-1"
                />
              ) : (
                positions[index]
              )}
            </div>

            {/* Driver Headshot */}
            <div className="my-2 h-16 w-16 flex items-center justify-center rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              {isLoadingDrivers ? (
                <div className="h-full w-full bg-gray-300 dark:bg-gray-600 animate-pulse"></div>
              ) : (
                <img
                  src={headshotUrl}
                  alt={driverFullName || "Driver"}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    /* ... fallback ... */
                  }}
                />
              )}
            </div>

            {/* Driver & Team Info */}
            <div className="text-center px-2 mt-1 mb-4">
              <div
                className={`font-semibold ${index === 1 ? "text-base md:text-lg" : "text-sm md:text-base"} text-gray-900 dark:text-white truncate w-full`}
              >
                {isLoadingDrivers
                  ? "Loading..."
                  : driverFullName || "Driver Name"}
              </div>
            </div>

            {/* Points */}
            <div
              className={`
                 mt-auto px-3 py-1 rounded 
                 text-white font-mono text-sm font-medium 
                 ${index === 1 ? "bg-primary text-primary-foreground dark:bg-sidebar-primary dark:text-sidebar-primary-foreground" : "bg-muted text-muted-foreground"}
               `}
            >
              {standing.points} PTS
            </div>

            {/* Wins (Only shown for P1 for visual clarity) */}
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

export default PodiumDisplay;
