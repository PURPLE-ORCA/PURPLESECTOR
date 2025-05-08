// src/components/home/LatestResultCard.jsx
import React from "react";
import LoadingIndicator from "../ui/LoadingIndicator";
import ErrorDisplay from "../ui/ErrorDisplay";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, ChevronRight } from "lucide-react";

const itemVariants = {
  /* ... same variants as above or import ... */
};

// Define podium medal colors outside component
const medalColors = [
  { bg: "bg-amber-400", text: "text-amber-900" }, // Gold
  { bg: "bg-slate-400", text: "text-slate-900" }, // Silver - Adjusted color
  { bg: "bg-yellow-700", text: "text-yellow-100" }, // Bronze - Adjusted color
];

function LatestResultCard({ resultData, isLoading, error }) {
  const renderContent = () => {
    if (isLoading)
      return <LoadingIndicator message="Loading latest result..." />;
    if (error)
      return (
        <ErrorDisplay title="Error Loading Latest Result" message={error} />
      );
    if (!resultData?.races?.results || resultData.races.results.length === 0) {
      return (
        <div className="p-6 text-center">
          <Trophy className="h-10 w-10 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            No race results available yet.
          </p>
        </div>
      );
    }

    const raceInfo = resultData.races;
    const top3Finishers = raceInfo.results.slice(0, 3);
    const season = resultData.season;
    const round = raceInfo.round;

    return (
      <>
        <div className="h-2 bg-gradient-to-r from-[#37045F] to-[#950505] absolute top-0 left-0 right-0"></div>
        <div className="p-6 relative pt-8">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-[#950505] dark:bg-[#b30000] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Latest Results
              </h3>
              <p className="text-[#950505] dark:text-[#ff6b6b] font-medium text-sm truncate">
                {raceInfo.raceName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3Finishers.map((result, index) => (
              <motion.div
                key={result.driver.driverId}
                whileHover={{
                  y: -5,
                  transition: { type: "spring", stiffness: 300 },
                }}
                className="bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-hidden shadow-sm relative border border-gray-200 dark:border-gray-700" // Added border
              >
                {/* Medal color bar */}
                <div
                  className={`absolute top-0 left-0 w-full h-1.5 ${medalColors[index]?.bg || "bg-gray-500"}`}
                ></div>
                <div className="p-4 pt-6">
                  {" "}
                  {/* Added pt-6 */}
                  <div className="flex items-center justify-between mb-3">
                    {/* Position Badge */}
                    <div
                      className={`flex items-center justify-center w-7 h-7 rounded-full ${medalColors[index]?.bg || "bg-gray-500"} ${medalColors[index]?.text || "text-white"} font-bold text-base`}
                    >
                      {result.position}
                    </div>
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {result.time || result.status || ""}
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    {" "}
                    {/* Added mt-2 */}
                    {/* Placeholder for driver image */}
                    <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-xl font-bold text-[#950505] dark:text-[#ff6b6b]">
                        {result.driver.code ||
                          result.driver.surname.substring(0, 3).toUpperCase()}
                      </span>
                    </div>
                    <h4 className="font-semibold text-black dark:text-white text-sm truncate">
                      {" "}
                      {/* Smaller font */}
                      {result.driver.name} {result.driver.surname}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {" "}
                      {/* Smaller font */}
                      {result.team.teamName}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center">
            {season && round ? (
              <Link
                to={`/results/${season}/${round}`}
                className="flex items-center text-[#950505] dark:text-[#ff6b6b] font-medium text-sm hover:underline" // Added text-sm
              >
                <span>View Full Results</span>
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            ) : (
              <span className="text-sm text-gray-500">
                Full results link unavailable
              </span>
            )}
          </div>
        </div>
      </>
    );
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-black rounded-xl shadow-lg overflow-hidden relative" // Use shadow-lg, add relative
    >
      {renderContent()}
    </motion.div>
  );
}

export default LatestResultCard;
