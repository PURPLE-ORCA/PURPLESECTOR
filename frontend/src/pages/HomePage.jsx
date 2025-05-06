// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
// Import BOTH API functions needed
import { getNextSession, getLatestRaceResult } from "../services/api";
import Countdown from "../components/Countdown";

function HomePage() {
  // State for Next Session
  const [nextSession, setNextSession] = useState(null);
  const [isLoadingNextSession, setIsLoadingNextSession] = useState(true);
  const [errorNextSession, setErrorNextSession] = useState(null);

  // State for Latest Result
  const [latestResult, setLatestResult] = useState(null);
  const [isLoadingLatestResult, setIsLoadingLatestResult] = useState(true);
  const [errorLatestResult, setErrorLatestResult] = useState(null);

  // Fetch both pieces of data on mount
  useEffect(() => {
    const fetchData = async () => {
      // Fetch Next Session
      setIsLoadingNextSession(true);
      setErrorNextSession(null);
      try {
        const nextSessionData = await getNextSession();
        setNextSession(nextSessionData);
      } catch (err) {
        console.error("Unexpected error fetching next session:", err);
        setErrorNextSession("Failed to load next session data.");
      } finally {
        setIsLoadingNextSession(false);
      }

      // Fetch Latest Result
      setIsLoadingLatestResult(true);
      setErrorLatestResult(null);
      try {
        const latestResultData = await getLatestRaceResult();
        setLatestResult(latestResultData);
      } catch (err) {
        console.error("Unexpected error fetching latest result:", err);
        setErrorLatestResult("Failed to load latest result data.");
      } finally {
        setIsLoadingLatestResult(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once

  // --- Render Logic for Next Session ---
  const renderNextSessionInfo = () => {
    if (isLoadingNextSession)
      return <p className="text-gray-400">Loading next session...</p>;
    if (errorNextSession)
      return <p className="text-red-500">Error: {errorNextSession}</p>;
    if (!nextSession)
      return (
        <p className="text-gray-400">No upcoming session data available.</p>
      );

    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-6">
        {" "}
        {/* Added mb-6 */}
        <h3 className="text-xl font-semibold text-purple-brand mb-2">
          Next Up:
        </h3>
        <p className="text-lg">
          {nextSession.raceName} -{" "}
          <span className="font-medium text-red-accent">
            {nextSession.sessionName}
          </span>
        </p>
        <Countdown targetTimeUTC={nextSession.dateTimeUTC} />
      </div>
    );
  };

const renderLatestResultInfo = () => {
  if (isLoadingLatestResult)
    return <p className="text-gray-400">Loading latest result...</p>;
  if (errorLatestResult)
    return <p className="text-red-500">Error: {errorLatestResult}</p>;
  if (!latestResult || !latestResult.races?.results) {
    return (
      <p className="text-gray-400">
        Latest race result data not available yet.
      </p>
    );
  }

  const raceInfo = latestResult.races;
  const results = raceInfo.results;
  // Get top 3 - Assuming results are already sorted by position from API
  const top3 = results.slice(0, 3);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-purple-brand mb-2">
        Latest Result: {raceInfo.raceName} (Round {raceInfo.round})
      </h3>
      {/* Display Top 3 */}
      <ol className="list-decimal list-inside space-y-1 mt-2 mb-4">
        {top3.map((result) => (
          <li key={result.driver.driverId} className="text-gray-200">
            <span
              className={`font-medium ${result.position === 1 ? "text-red-accent" : ""}`}
            >
              {result.driver.name} {result.driver.surname}
            </span>
            <span className="text-sm text-gray-400 ml-2">
              ({result.team.teamName})
            </span>
            {/* Optional: Add Time/Gap */}
            <span className="text-xs text-gray-500 ml-2">{result.time}</span>
          </li>
        ))}
      </ol>

    </div>
  );
};

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4 text-purple-brand">
        Home Page
      </h2>
      <p className="text-gray-300 mb-6">Welcome to Purple Sector!</p>
      {renderNextSessionInfo()} {/* Render next session section */}
      {renderLatestResultInfo()} {/* Render latest result section */}
    </div>
  );
}

export default HomePage;
