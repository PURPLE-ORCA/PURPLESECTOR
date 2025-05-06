// src/pages/DriverStandingsPage.jsx
import React, { useState, useEffect } from "react";
import { getDriverStandings } from "../services/api";

function DriverStandingsPage() {
  const [standings, setStandings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // const currentYear = new Date().getFullYear(); // No longer needed directly for fetch

  useEffect(() => {
    const fetchStandings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch 'current' standings from Ergast instead of specific future year
        const data = await getDriverStandings("current"); // CHANGED HERE

        if (data && data.DriverStandings) {
          setStandings(data); // Set the StandingsList object
        } else {
          // Handle cases where Ergast might return null/empty for 'current' (unlikely but possible)
          setError(`Could not load current driver standings.`);
          setStandings(null);
        }
      } catch (err) {
        console.error(
          `Unexpected error fetching current driver standings:`,
          err
        );
        setError("An error occurred while loading driver standings.");
        setStandings(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStandings();
  }, []); // Fetch only once on mount

  // ... (rest of the component rendering logic remains the same) ...

  if (isLoading) {
    /* ... */
  }
  if (error) {
    /* ... */
  }
  if (
    !standings ||
    !standings.DriverStandings ||
    standings.DriverStandings.length === 0
  ) {
    // Update message slightly for clarity
    return (
      <p className="text-center text-gray-500 mt-10">
        No current Driver Standings data available from Ergast.
      </p>
    );
  }

  return (
    <div>
      {/* Update title to reflect possibility of showing last completed season */}
      <h2 className="text-3xl font-semibold mb-6 text-purple-brand">
        Driver Standings {standings.season && `- ${standings.season}`}
        {standings.round && (
          <span className="text-xl text-gray-400">
            {" "}
            (After Round {standings.round})
          </span>
        )}
      </h2>
      {/* ... Table rendering ... */}
      <table className="min-w-full divide-y divide-gray-700">
        {/* ... thead ... */}
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
        {/* ... tbody ... */}
        <tbody className="bg-gray-800 divide-y divide-gray-600">
          {standings.DriverStandings.map((driverStanding) => (
            <tr
              key={driverStanding.Driver.driverId}
              className="hover:bg-gray-700 transition-colors duration-150"
            >
              <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-200">
                {driverStanding.position}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                {driverStanding.Driver.givenName}{" "}
                {driverStanding.Driver.familyName}
                <span className="ml-2 text-xs text-gray-400">
                  ({driverStanding.Driver.code})
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                {driverStanding.Constructors[0]?.name || "N/A"}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-bold text-red-accent">
                {driverStanding.points}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-400">
                {driverStanding.wins}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DriverStandingsPage;
