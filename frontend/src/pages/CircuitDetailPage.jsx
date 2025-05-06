// src/pages/CircuitDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get circuitId from URL
import { getSpecificCircuitDetails } from "../services/api"; // API service function

function CircuitDetailPage() {
  const { circuitId } = useParams(); // Get the circuitId from the route parameters
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
  }, [circuitId]); // Re-fetch if circuitId changes

  if (isLoading) {
    return (
      <p className="text-center text-gray-400 mt-10">
        Loading Circuit Details...
      </p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">Error: {error}</p>;
  }

  if (!circuit) {
    return (
      <p className="text-center text-gray-500 mt-10">
        No details found for circuit ID: {circuitId}.
      </p>
    );
  }

  // Basic display of circuit details
  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4 text-purple-brand">
        {circuit.circuitName}
      </h2>
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <p className="text-lg text-gray-300 mb-2">
          Location: {circuit.Location?.locality}, {circuit.Location?.country}
        </p>
        <p className="text-md text-gray-400 mb-4">
          Coordinates: {circuit.Location?.lat}, {circuit.Location?.long}
        </p>
        {/* TODO: Potentially add a map image or embedded map later */}
        {circuit.url && (
          <a
            href={circuit.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline mt-2 inline-block"
          >
            View on Wikipedia
          </a>
        )}
        {/* Add more details here as available/needed */}
      </div>
    </div>
  );
}

export default CircuitDetailPage;
