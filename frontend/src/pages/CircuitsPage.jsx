// src/pages/CircuitsPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'; 
import { getCircuits } from "../services/api"; // Import the service

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
  }, [yearToFetch]); // Dependency array includes year

  if (isLoading) {
    return (
      <p className="text-center text-gray-400 mt-10">Loading Circuits...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">Error: {error}</p>;
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-purple-brand">
        F1 Circuits (
        {yearToFetch === "current" ? "Current Season" : yearToFetch})
      </h2>

      {circuits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {circuits.map((circuit) => (
            // Wrap the card content in a Link component
            <Link
              to={`/circuits/${circuit.circuitId}`} // Link to the detail page route
              key={circuit.circuitId}
              className="block bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-700 transition-all duration-200" // Added 'block' and hover:bg
            >
              <h3 className="text-lg font-semibold text-red-accent mb-2">
                {circuit.circuitName}
              </h3>
              <p className="text-sm text-gray-300 mb-1">
                {circuit.Location?.locality}, {circuit.Location?.country}
              </p>
              <p className="text-xs text-gray-500">
                Lat: {circuit.Location?.lat}, Long: {circuit.Location?.long}
              </p>
              {circuit.url && (
                <span // Changed to span to prevent nested 'a' tags (Link renders 'a')
                  // Optional: Keep wiki link if desired, maybe style differently
                  // href={circuit.url}
                  // target="_blank"
                  // rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:underline mt-2 inline-block"
                >
                  {/* More Info (Wiki) */}
                </span>
              )}
              <span className="text-xs text-blue-400 hover:underline mt-2 block">
                View Details →
              </span>
            </Link> // End Link component
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No circuit data found for {yearToFetch}.
        </p>
      )}
    </div>
  );
}

export default CircuitsPage;
