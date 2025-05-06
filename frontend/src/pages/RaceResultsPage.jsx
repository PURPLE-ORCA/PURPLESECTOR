// src/pages/RaceResultsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Import useParams to get URL params
import { getRaceResults } from "../services/api";

function RaceResultsPage() {
  // Get year and round from the URL
  const { year, round } = useParams();
  const [raceData, setRaceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if year and round are present
    if (year && round) {
      const fetchResults = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await getRaceResults(year, round);
          if (data && data.results) {
            // Check if data and results array exist
            setRaceData(data);
          } else {
            setError(`Could not load race results for ${year} Round ${round}.`);
            setRaceData(null);
          }
        } catch (err) {
          console.error(
            `Unexpected error fetching race results for ${year} R${round}:`,
            err
          );
          setError("An error occurred while loading race results.");
          setRaceData(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchResults();
    } else {
      // Handle case where params might be missing somehow (shouldn't happen with route setup)
      setError("Year and round parameters are missing.");
      setIsLoading(false);
    }
    // Re-fetch if year or round changes (e.g., if navigating between results pages later)
  }, [year, round]);

  // Helper to format race date/time (could be moved to a utils file)
  const formatRaceDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return "N/A";
    try {
      const dateTimeString = `${dateStr}T${timeStr}`;
      const date = new Date(dateTimeString);
      return date.toLocaleString("en-GB", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "UTC",
      });
    } catch (e) {
      return "Invalid Date";
    }
  };

  if (isLoading) {
    return (
      <p className="text-center text-gray-400 mt-10">Loading Race Results...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">Error: {error}</p>;
  }

  if (!raceData) {
    return (
      <p className="text-center text-gray-500 mt-10">
        No race results data found for {year} Round {round}.
      </p>
    );
  }

  // Extract results array for easier mapping
  const results = raceData.results;

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-2 text-purple-brand">
        {raceData.season} {raceData.raceName} Results
      </h2>
      <p className="text-lg text-gray-400 mb-1">Round {raceData.round}</p>
      <p className="text-sm text-gray-400 mb-1">
        {raceData.circuit?.circuitName}, {raceData.circuit?.Location?.locality}
      </p>
      <p className="text-sm text-gray-500 mb-6">
        {formatRaceDateTime(raceData.date, raceData.time)} (UTC)
      </p>

      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700">
            <tr>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Pos
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                No
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
                Laps
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Time/Status
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
              >
                Points
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-600">
            {results.map((result) => (
              <tr
                key={result.Driver.driverId}
                className="hover:bg-gray-700 transition-colors duration-150"
              >
                <td className="px-3 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-200">
                  {result.position}
                </td>
                <td className="px-3 py-4 whitespace-nowrap text-center text-sm text-gray-400">
                  {result.number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-200">
                  {result.Driver.givenName} {result.Driver.familyName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                  {result.Constructor.name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center text-sm text-gray-400">
                  {result.laps}
                </td>
                {/* Display time or status */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-300">
                  {result.Time?.time || result.status}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-center text-sm font-bold text-red-accent">
                  {result.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RaceResultsPage;
