// src/components/home/NextSessionCard.jsx
import React from "react";
import Countdown from "../Countdown";
import LoadingIndicator from "../ui/LoadingIndicator";
import ErrorDisplay from "../ui/ErrorDisplay";
import { motion } from "framer-motion";
import { Flag, Calendar } from "lucide-react";

const itemVariants = {
  // Define itemVariants here or import from shared location
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", damping: 12, stiffness: 100 },
  },
};

function NextSessionCard({ session, isLoading, error }) {
  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator message="Loading next session..." />;
    }
    if (error) {
      return (
        <ErrorDisplay title="Error Loading Next Session" message={error} />
      );
    }
    if (!session) {
      return (
        <div className="p-6 text-center">
          <Calendar className="h-10 w-10 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">
            No upcoming sessions scheduled.
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="h-2 dark:bg-neutral-950 absolute top-0 left-0 right-0"></div>
        <div className="p-6 relative pt-8">
          <div className="flex items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-black dark:text-red-700">
                Next Up
              </h3>
            </div>
          </div>
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between">
            <div className="mb-4 xl:mb-0 flex-1 mr-4">
              {" "}
              {/* Added flex-1 and mr-4 */}
              <div className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">
                Grand Prix
              </div>
              <div className="text-xl md:text-4xl font-bold text-black dark:text-white">
                {session.raceName}
              </div>
              <p className="text-text-red-700 dark:text-red-700 font-medium text-md">
                {session.sessionName}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Countdown targetTimeUTC={session.dateTimeUTC} />
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-neutral-950 rounded-xl shadow-lg overflow-hidden relative" 
    >
      {renderContent()}
    </motion.div>
  );
}

export default NextSessionCard;
