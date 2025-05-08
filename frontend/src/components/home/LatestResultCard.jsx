// src/components/home/LatestResultCard.jsx
import React from "react";
import LoadingIndicator from "../ui/LoadingIndicator";
import ErrorDisplay from "../ui/ErrorDisplay";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, ChevronRight } from "lucide-react";
// Assuming itemVariants might be used or defined elsewhere, keeping import commented for now
// import { itemVariants } from "@/utils/animations";

// Define podium medal colors outside component
const medalColors = [
  {
    bg: "bg-amber-400 dark:bg-yellow-500",
    text: "text-amber-900 dark:text-yellow-900",
  }, // Gold
  {
    bg: "bg-slate-300 dark:bg-slate-500",
    text: "text-slate-900 dark:text-slate-100",
  }, // Silver - Adjusted color
  {
    bg: "bg-yellow-600 dark:bg-yellow-700",
    text: "text-yellow-100 dark:text-yellow-100",
  }, // Bronze - Adjusted color
];

function LatestResultCard({ resultData, isLoading, error, driverInfoMap }) {
  const renderContent = () => {
    if (isLoading)
      return <LoadingIndicator message="Loading latest result..." />;
    if (error)
      return (
        <ErrorDisplay title="Error Loading Latest Result" message={error} />
      );
    // Check map validity AFTER loading is done but before using it extensively
    if (!isLoading && (!driverInfoMap || driverInfoMap.size === 0)) {
      console.warn("LatestResultCard received empty driverInfoMap.");
      // Render without headshots or show an error specific to driver info?
      // Let's proceed, images will use default.
    }

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
    const defaultDriverImage = "/images/drivers/default.png";

    return (
      <>
        {/* Gradient bar */}
        <div className="h-2 bg-gradient-to-r from-[#37045F] to-[#950505] absolute top-0 left-0 right-0"></div>

        <div className="p-6 relative pt-8">
          {" "}
          {/* Padding top for gradient */}
          {/* Card Header */}
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
          {/* Top 3 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3Finishers.map((result, index) => {
              // Start map
              // --- Find Driver Info ---
              const driverAcr = result.driver?.shortName;
              // Use map safely, checking if it exists first
              const driverInfo =
                driverInfoMap && driverAcr
                  ? driverInfoMap.get(driverAcr)
                  : null;
              const headshotUrl =
                driverInfo?.headshot_url || defaultDriverImage;
              const driverFullName =
                driverInfo?.full_name ||
                `${result.driver?.name || ""} ${result.driver?.surname || ""}`.trim();
              // --- End Find ---

              return (
                <motion.div
                  key={result.driver.driverId} // Use unique ID
                  whileHover={{
                    y: -5,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                  className="bg-gray-50 dark:bg-black rounded-lg overflow-hidden shadow-sm relative" // Card styling
                >
                  {/* Medal color bar */}
                  <div
                    className={`absolute top-0 left-0 w-full h-1.5 ${medalColors[index]?.bg || "bg-gray-500"}`}
                  ></div>

                  <div className="p-4 pt-6">
                    {/* Position & Time */}
                    <div className="flex items-center justify-between mb-3">
                      <div
                        className={`flex items-center justify-center w-7 h-7 rounded-full ${medalColors[index]?.bg || "bg-gray-500"} ${medalColors[index]?.text || "text-white"} font-bold text-base`}
                      >
                        {result.position}
                      </div>
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {result.time || result.status || ""}{" "}
                        {/* Show time/status */}
                      </div>
                    </div>

                    {/* Headshot & Name */}
                    <div className="text-center mt-2">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-md">
                        <img
                          src={headshotUrl}
                          alt={driverFullName || "Driver"}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            if (e.target.src !== defaultDriverImage) {
                              e.target.onerror = null;
                              e.target.src = defaultDriverImage;
                            }
                          }}
                        />
                      </div>
                      <h4 className="font-semibold text-black dark:text-white text-sm truncate">
                        {driverFullName || "Driver Name"}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {result.team.teamName}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ); // End return
            })}{" "}
            {/* End map */}
          </div>
          {/* Link to Full Results */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center">
            {season && round ? (
              <Link
                to={`/results/${season}/${round}`}
                className="flex items-center text-[#950505] dark:text-[#ff6b6b] font-medium text-sm hover:underline"
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
      // variants={itemVariants} // Apply item variant if needed
      className="bg-white dark:bg-black rounded-xl shadow-lg overflow-hidden relative" // Main card styling
    >
      {renderContent()}
    </motion.div>
  );
}

export default LatestResultCard;
