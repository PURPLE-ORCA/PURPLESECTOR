// src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { getNextSession } from "../services/api"; // Import the service function
import Countdown from "../components/Countdown";

function HomePage() {
  const [nextSession, setNextSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define an async function inside useEffect to call the API
    const fetchNextSessionData = async () => {
      setIsLoading(true);
      setError(null); // Reset error state on new fetch
      try {
        const data = await getNextSession();
        setNextSession(data); // Set the fetched data (or null if none found)
      } catch (err) {
        // This catch is more for unexpected errors during the async call itself,
        // the service function handles API errors mostly.
        console.error("Unexpected error fetching session:", err);
        setError("Failed to load session data."); // Set a generic error message
      } finally {
        setIsLoading(false); // Set loading to false once fetch is complete (success or fail)
      }
    };

    fetchNextSessionData(); // Call the async function

    // Optional: Set up polling or refresh mechanism later if needed
    // const intervalId = setInterval(fetchNextSessionData, 60000); // e.g., refresh every minute
    // return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []); // Empty dependency array means this runs once when the component mounts

  // --- Render Logic ---
  const renderSessionInfo = () => {
    if (isLoading) {
      return <p className="text-gray-400">Loading next session...</p>;
    }

    if (error) {
      return <p className="text-red-500">Error: {error}</p>;
    }

    if (!nextSession) {
      // This handles both the case where the API returned null (404)
      // or if there was another error preventing data from being set.
      return (
        <p className="text-gray-400">
          No upcoming session data available currently.
        </p>
      );
    }

    // If we have data, display it!
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-purple-brand mb-2">
          Next Up:
        </h3>
        <p className="text-lg">
          {nextSession.raceName} -{" "}
          <span className="font-medium text-red-accent">
            {nextSession.sessionName}
          </span>
        </p>
        <p className="text-sm text-gray-400">
          UTC Time: {nextSession.dateTimeUTC}
        </p>
        <Countdown targetTimeUTC={nextSession.dateTimeUTC} />
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4 text-purple-brand">
        Home Page
      </h2>
      <p className="text-gray-300 mb-6">Welcome to Purple Sector!</p>
      {renderSessionInfo()} {/* Call the render function */}
    </div>
  );
}

export default HomePage;
