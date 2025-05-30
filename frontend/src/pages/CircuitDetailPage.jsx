// src/pages/CircuitDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSpecificCircuitDetails } from "../services/api";
import LoadingIndicator from "../components/ui/LoadingIndicator";
import ErrorDisplay from "../components/ui/ErrorDisplay";
import { motion } from "framer-motion";

function CircuitDetailPage() {
  const { circuitId } = useParams();
  const [circuit, setCircuit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!circuitId) {
      setError("No Circuit ID provided.");
      setIsLoading(false);
      return;
    }

    const fetchCircuitData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getSpecificCircuitDetails(circuitId);
        if (data) {
          setCircuit(data);
        } else {
          setError(`Could not load details for circuit: ${circuitId}`);
          setCircuit(null);
        }
      } catch (err) {
        console.error(`Unexpected error fetching circuit ${circuitId}:`, err);
        setError("An error occurred while loading circuit details.");
        setCircuit(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCircuitData();
  }, [circuitId]);

  if (isLoading) {
    return <LoadingIndicator message="Loading Circuit Details..." />;
  }

  if (error) {
    return <ErrorDisplay title="Circuit Details Unavailable" message={error} />;
  }

  if (!circuit) {
    return (
      <div className="text-center p-10 text-gray-500 dark:text-gray-400">
        No details found for circuit ID: {circuitId}.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-900 dark:text-white"
    >
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#2f024f] dark:text-[#4a037a]">
        {circuit.circuitName}
      </h2>
      <div className="bg-gray-50 dark:bg-black p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
          Location: {circuit.Location?.locality}, {circuit.Location?.country}
        </p>
        <p className="text-md text-gray-600 dark:text-gray-400 mb-4">
          Coordinates: {circuit.Location?.lat}, {circuit.Location?.long}
        </p>
        {circuit.url && (
          <a
            href={circuit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2f024f] hover:underline mt-2 inline-block dark:text-[#4a037a]"
          >
            View on Wikipedia
          </a>
        )}
      </div>
    </motion.div>
  );
}

export default CircuitDetailPage;
