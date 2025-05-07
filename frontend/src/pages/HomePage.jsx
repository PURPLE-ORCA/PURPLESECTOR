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

  const renderNextSessionInfo = () => {
    // Use consistent card styling
    if (isLoadingNextSession)
      return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-6">
          <p className="text-gray-400">Loading next session...</p>
        </div>
      );
    if (errorNextSession)
      return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-6">
          <p className="text-red-500">Error: {errorNextSession}</p>
        </div>
      );
    if (!nextSession)
      return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md mb-6">
          <p className="text-gray-400">No upcoming session data available.</p>
        </div>
      );

    return (
      // Darker card background
      <div className="bg-red-800 p-6 rounded-lg shadow-lg mb-6">
        {" "}
        {/* Use shadow-lg maybe? */}
        {/* Use purple title */}
        <h3 className="text-xl font-semibold text-purple-brand mb-2">
          Next Up:
        </h3>
        {/* Standard light text, red accent for session name */}
        <p className="text-lg text-gray-100 mb-3">
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
    // Use consistent card styling
    if (isLoadingLatestResult)
      return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <p className="text-gray-400">Loading latest result...</p>
        </div>
      );
    if (errorLatestResult)
      return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <p className="text-red-500">Error: {errorLatestResult}</p>
        </div>
      );
    if (!latestResult || !latestResult.races?.results) {
      return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-md">
          <p className="text-gray-400">
            Latest race result data not available yet.
          </p>
        </div>
      );
    }

    const raceInfo = latestResult.races;
    const top3 = raceInfo.results.slice(0, 3);

    return (
      // Darker card background
      <div className="bg-red-800 p-6 rounded-lg shadow-lg">
        {/* Use purple title */}
        <h3 className="text-xl font-semibold text-purple-brand mb-2">
          Latest Result: {raceInfo.raceName} (Round {raceInfo.round})
        </h3>
        <ol className="list-decimal list-inside space-y-1.5 mt-3 mb-1">
          {top3.map((result) => (
            <li key={result.driver.driverId} className="text-gray-200">
              {/* Red accent for winner */}
              <span
                className={`font-medium ${result.position === 1 ? "text-red-accent" : ""}`}
              >
                {result.driver.name} {result.driver.surname}
              </span>
              {/* Muted team name */}
              <span className="text-sm text-gray-400 ml-2">
                ({result.team.teamName})
              </span>
              {/* Muted time */}
              <span className="text-xs text-gray-500 ml-3">{result.time}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  };
  return (
    <div>
      {/* Use purple for main page title? */}
      <h2 className="text-3xl font-semibold mb-4 text-purple-brand">
        Home Page
      </h2>
      {/* Use standard text color */}
      <p className="text-purple-600 mb-6">Welcome to Purple Sector!</p>

      {renderNextSessionInfo()}
      {renderLatestResultInfo()}
    </div>
  );
}
export default HomePage;