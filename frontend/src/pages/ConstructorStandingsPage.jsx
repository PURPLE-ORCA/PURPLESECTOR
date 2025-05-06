// src/pages/ConstructorStandingsPage.jsx
import React, { useState, useEffect } from "react";
import { getConstructorStandings } from "../services/api"; // Use the existing API service

function ConstructorStandingsPage() {
  const [standings, setStandings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStandings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch 'current' constructor standings (uses f1api.dev via backend)
        const data = await getConstructorStandings("current");

        // f1api.dev structure has 'constructors_championship' array
        if (data && data.constructors_championship) {
          setStandings(data); // Store the whole response object
        } else {
          setError(`Could not load current constructor standings.`);
          setStandings(null);
        }
      } catch (err) {
        console.error(
          `Unexpected error fetching current constructor standings:`,
          err
        );
        setError("An error occurred while loading constructor standings.");
        setStandings(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStandings();
  }, []);

  if (isLoading) {
    return (
      <p className="text-center text-gray-400 mt-10">
        Loading Constructor Standings...
      </p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">Error: {error}</p>;
  }

  // Adjust check for the correct array key from f1api.dev response
  if (
    !standings ||
    !standings.constructors_championship ||
    standings.constructors_championship.length === 0
  ) {
    return (
      <p className="text-center text-gray-500 mt-10">
        No current Constructor Standings data available.
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-purple-brand">
        Constructor Standings {standings.season && `- ${standings.season}`}
        {/* Round info might not be in this specific f1api.dev endpoint, omit if unavailable */}
        {/* {standings.round && <span className="text-xl text-gray-400"> (After Round {standings.round})</span>} */}
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
                Team
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Nationality
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
            {/* Map over the 'constructors_championship' array */}
            {standings.constructors_championship.map((teamStanding) => (
              // Use teamId for the key
              <tr
                key={teamStanding.team?.teamId || teamStanding.position}
                className="hover:bg-gray-700 transition-colors duration-150"
              >
                <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-200">
                  {teamStanding.position}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {/* Access nested team details */}
                  {teamStanding.team?.teamName || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {teamStanding.team?.country || "N/A"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-bold text-red-accent">
                  {teamStanding.points}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-400">
                  {teamStanding.wins ?? "0"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ConstructorStandingsPage;
