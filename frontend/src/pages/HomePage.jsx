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
      <div className="bg-[#950505] p-6 rounded-lg shadow-lg mb-6">
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

  // src/pages/HomePage.jsx
  // ... (imports and other parts of the component)

  const renderLatestResultInfo = () => {
    const cardBaseClasses =
      "bg-[#950505] dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg"; // Responsive padding
    const loadingErrorClasses = "text-white dark:text-gray-400";
    const titleClasses =
      "text-lg sm:text-xl font-semibold text-white dark:text-[#37045F] mb-3 sm:mb-4 text-center sm:text-left";
    const driverNameClasses =
      "block font-bold text-sm sm:text-md text-white dark:text-gray-100";
    const teamNameClasses = "block text-xs text-gray-200 dark:text-gray-400";
    const positionClasses =
      "absolute -top-2 -left-2 bg-black text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#950505] dark:border-gray-800"; // For podium position numbers

    if (isLoadingLatestResult)
      return (
        <div className={cardBaseClasses}>
          <p className={loadingErrorClasses}>Loading latest result...</p>
        </div>
      );
    if (errorLatestResult)
      return (
        <div className={cardBaseClasses}>
          <p className="text-yellow-300 dark:text-red-500">
            Error: {errorLatestResult}
          </p>
        </div>
      );
    if (
      !latestResult ||
      !latestResult.races?.results ||
      latestResult.races.results.length === 0
    ) {
      return (
        <div className={cardBaseClasses}>
          <p className={loadingErrorClasses}>
            Latest race result data not available yet.
          </p>
        </div>
      );
    }

    const raceInfo = latestResult.races;
    // Results are already sorted by finishing position from the API
    const top3Finishers = raceInfo.results.slice(0, 3);

    return (
      <div className={cardBaseClasses}>
        <h3 className={titleClasses}>Latest Result: {raceInfo.raceName}</h3>
        {/* Attempting a horizontal-ish layout for top 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          {top3Finishers.map((result) => (
            <div
              key={result.driver.driverId}
              className="bg-black dark:bg-gray-900 p-3 rounded-md relative text-center sm:text-left shadow-md"
            >
              {" "}
              {/* Individual card for each of top 3 */}
              {/* Position Badge */}
              <span className={positionClasses}>{result.position}</span>
              {/* Driver and Team Info */}
              <div className="mt-3 sm:mt-0">
                {" "}
                {/* Adjust margin for badge */}
                <span className={driverNameClasses}>
                  {result.driver.name} {result.driver.surname}
                </span>
                <span className={teamNameClasses}>{result.team.teamName}</span>
              </div>
              {/* Image placeholder for later */}
              {/* <div className="h-24 bg-gray-700 dark:bg-gray-600 mt-2 rounded flex items-center justify-center text-gray-500">IMG</div> */}
            </div>
          ))}
        </div>
        {/* Small note for finishing order */}
        <p className="text-xs text-gray-200 dark:text-gray-500 mt-3 text-center sm:text-right">
          (Top 3 finishers)
        </p>
      </div>
    );
  };

  // ... (rest of the component)

  return (
    <div>
      {/* Use purple for main page title? */}
      <h2 className="text-4xl font-semibold mb-4 text-black dark:text-white">
        Home Page
      </h2>
      {renderNextSessionInfo()}
      {renderLatestResultInfo()}
    </div>
  );
}
export default HomePage;