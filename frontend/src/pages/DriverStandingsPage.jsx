// src/pages/DriverStandingsPage.jsx
import React, { useState, useEffect } from "react";
// Import the correct API function for f1api.dev
import { getCurrentDriverStandingsF1Api } from "../services/api"; // Use the function targeting f1api.dev

function DriverStandingsPage() {
  const [standingsData, setStandingsData] = useState(null); // Store the whole response object
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStandings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch 'current' standings using the f1api.dev service function
        const data = await getCurrentDriverStandingsF1Api(); // CHANGED HERE

        // Check for the correct data structure from f1api.dev
        if (data && data.drivers_championship) {
          setStandingsData(data); // Store the entire response object
        } else {
          // Handle cases where f1api.dev might return null/empty
          setError(`Could not load current driver standings from f1api.dev.`);
          setStandingsData(null);
        }
      } catch (err) {
        // Catch unexpected errors
        console.error(
          `Unexpected error fetching current driver standings (f1api):`,
          err
        );
        setError("An error occurred while loading driver standings.");
        setStandingsData(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStandings();
  }, []); // Fetch only once on mount

  if (isLoading) {
    return (
      <p className="text-center text-gray-400 mt-10">
        Loading Driver Standings...
      </p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">Error: {error}</p>;
  }

  // Update check for the f1api.dev structure
  if (
    !standingsData ||
    !standingsData.drivers_championship ||
    standingsData.drivers_championship.length === 0
  ) {
    return (
      <p className="text-center text-gray-500 mt-10">
        No current Driver Standings data available.
      </p>
    );
  }

  // Extract the array for mapping
  const driverStandings = standingsData.drivers_championship;

  return (
    <div>
      {/* Use season from the response object */}
      <h2 className="text-3xl font-semibold mb-6 text-purple-brand">
        Driver Standings {standingsData.season && `- ${standingsData.season}`}
        {/* Round might not be available in this endpoint, adjust if needed */}
        {/* {standingsData.round && <span className="text-xl text-gray-400"> (After Round {standingsData.round})</span>} */}
      </h2>
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Pos
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Driver
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Team
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Points
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Wins
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-600">
            {/* Map over the extracted driverStandings array */}
            {driverStandings.map((standing) => (
              // Use driverId for the key
              <tr
                key={standing.driver?.driverId || standing.position}
                className="hover:bg-gray-700 transition-colors duration-150"
              >
                <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-200">
                  {standing.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {/* Access nested driver details */}
                  {standing.driver?.name} {standing.driver?.surname}
                  {standing.driver?.shortName && (
                    <span className="ml-2 text-xs text-gray-400">
                      ({standing.driver.shortName})
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {/* Access nested team details */}
                  {standing.team?.teamName || "N/A"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-bold text-red-accent">
                  {standing.points}
                </td>
                {/* Handle null wins, display 0 */}
                <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-400">
                  {standing.wins ?? "0"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DriverStandingsPage;
