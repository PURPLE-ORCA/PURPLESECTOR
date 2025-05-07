// src/pages/CircuitsPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCircuits } from "../services/api";
import { motion } from "framer-motion";
import {
  MapPin,
  Info,
  ChevronRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

function CircuitsPage() {
  const [circuits, setCircuits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const yearToFetch = "current";

  useEffect(() => {
    const fetchCircuits = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCircuits(yearToFetch);
        if (data && Array.isArray(data)) {
          setCircuits(data);
        } else {
          setError(`Could not load circuit data for ${yearToFetch}.`);
          setCircuits([]);
        }
      } catch (err) {
        console.error(
          `Unexpected error fetching circuits for ${yearToFetch}:`,
          err
        );
        setError("An error occurred while loading circuit data.");
        setCircuits([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCircuits();
  }, [yearToFetch]);

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Item animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
    hover: {
      y: -5,
      scale: 1.02,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-white dark:bg-black text-gray-900 dark:text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="mb-4"
        >
          <Loader2 size={40} className="text-red-600" />
        </motion.div>
        <p className="text-lg font-medium">Loading Driver Standings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mx-auto max-w-2xl mt-10"
      >
        <div className="flex items-center">
          <AlertCircle className="w-6 h-6 text-[#950505] dark:text-red-400 mr-3" />
          <h3 className="text-lg font-semibold text-[#950505] dark:text-red-400">
            Error Loading Circuits
          </h3>
        </div>
        <p className="mt-2 text-black dark:text-black">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-[#950505] hover:bg-[#b30000] dark:bg-red-700 dark:hover:bg-red-600 text-white rounded-md transition-colors duration-200 flex items-center"
        >
          <span>Try Again</span>
        </button>
      </motion.div>
    );
  }

  return (
    <div className="px-2 py-2 sm:px-6 lg:px-8 ">
      <div className="flex items-center mb-8 border-b border-black dark:border-black pb-4">
        <div>
          <h1 className="text-3xl font-bold text-red-600 mb-1">F1 Circuits</h1>
          <p className="text-black dark:text-white mt-1 flex items-center">
            <span className="font-medium">
              {yearToFetch === "current" ? "Current Season" : yearToFetch}
            </span>
            <span className="inline-block w-2 h-2 rounded-full bg-[#950505] dark:bg-[#ff6b6b] mx-2"></span>
            <span>{circuits.length} tracks</span>
          </p>
        </div>
      </div>

      {circuits.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {circuits.map((circuit) => (
            <motion.div
              key={circuit.circuitId}
              variants={itemVariants}
              whileHover="hover"
              className="h-full"
            >
              <Link
                to={`/circuits/${circuit.circuitId}`}
                className="block h-full bg-white dark:bg-black rounded-xl shadow-md overflow-hidden transition-all duration-300 border border-black dark:border-black"
              >
                <div className="h-16 bg-gradient-to-r from-[#950505] to-[#37045F] relative">
                  <div className="absolute -bottom-6 left-4">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-black shadow-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-[#950505] dark:text-[#ff6b6b]" />
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-8">
                  <h3 className="text-xl font-bold text-black dark:text-white mb-2 line-clamp-1">
                    {circuit.circuitName}
                  </h3>

                  <div className="flex items-center text-sm text-black dark:text-white mb-3">
                    <span className="font-medium">
                      {circuit.Location?.locality}
                    </span>
                    <span className="mx-1">•</span>
                    <span>{circuit.Location?.country}</span>
                  </div>

                  <div className="text-xs text-white dark:text-white bg-black dark:bg-black/50 rounded-lg p-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span>Latitude</span>
                      <span className="font-mono">{circuit.Location?.lat}</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span>Longitude</span>
                      <span className="font-mono">
                        {circuit.Location?.long}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-">
                    <span className="text-sm font-medium text-[#950505] dark:text-[#ff6b6b]">
                      View Details
                    </span>
                    <ChevronRight className="w-5 h-5 text-[#950505] dark:text-[#ff6b6b]" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-black dark:bg-black/50 rounded-xl p-8 text-center max-w-lg mx-auto"
        >
          <Info className="w-12 h-12 text-black dark:text-black mx-auto mb-4" />
          <p className="text-black dark:text-black text-lg">
            No circuit data found for {yearToFetch}.
          </p>
          <p className="text-black dark:text-black mt-2">
            Try refreshing or check back later.
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default CircuitsPage;
