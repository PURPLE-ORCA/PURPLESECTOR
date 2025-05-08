import React from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

function ErrorDisplay({ title = "Error Loading Data", message }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 border-l-4 border-red-500 bg-red-100 dark:bg-red-900/30 rounded-r-lg" // Adjusted styling
    >
      <div className="flex items-center">
        <AlertCircle className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" />
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
          {title}
        </h3>
      </div>
      {message && (
        <p className="mt-2 text-red-600 dark:text-red-300 text-sm">{message}</p>
      )}
    </motion.div>
  );
}
export default ErrorDisplay;
