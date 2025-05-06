// src/pages/SchedulePage.jsx
import React, { useState, useEffect } from "react";
import { getSchedule } from "../services/api"; // Service function remains the same

// Define expected session keys in rough chronological order for sorting display
const sessionOrder = [
  "fp1",
  "fp2",
  "sprintQualy",
  "fp3",
  "sprintRace",
  "qualy",
  "race",
];

function SchedulePage() {
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScheduleData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getSchedule(); // Fetches the cached data
        if (data && Array.isArray(data)) {
          setSchedule(data);
        } else {
          setError("Could not load schedule data from cache.");
          setSchedule([]);
        }
      } catch (err) {
        console.error("Unexpected error fetching schedule:", err);
        setError("An error occurred while loading the schedule.");
        setSchedule([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScheduleData();
  }, []);

  // Updated helper to format session times from the new structure
  const formatSessionTime = (session) => {
    // Check if session exists and has date + time
    if (!session || !session.date || !session.time) return "N/A";
    try {
      const dateTimeString = `${session.date}T${session.time}`; // Combine date and time
      const date = new Date(dateTimeString); // Use Date constructor directly for ISO strings
      // Format: e.g., "14 Mar 2025, 01:30" (adjust formatting as desired)
      return date.toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC", // Explicitly state it's UTC
      });
    } catch (e) {
      console.error("Error formatting date:", session, e);
      return "Invalid Date";
    }
  };

  // Helper to get a user-friendly name for session keys
  const getSessionDisplayName = (key) => {
    switch (key) {
      case "fp1":
        return "FP1";
      case "fp2":
        return "FP2";
      case "fp3":
        return "FP3";
      case "qualy":
        return "Qualifying";
      case "race":
        return "Race";
      case "sprintQualy":
        return "Sprint Qualifying";
      case "sprintRace":
        return "Sprint";
      default:
        return key; // Fallback
    }
  };

  if (isLoading) {
    return (
      <p className="text-center text-gray-400 mt-10">Loading schedule...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">Error: {error}</p>;
  }

  return (
    <div>
      {/* Title could potentially show the season year if available */}
      <h2 className="text-3xl font-semibold mb-6 text-purple-brand">
        F1 Schedule
      </h2>
      <div className="space-y-6">
        {schedule.length > 0 ? (
          schedule.map(
            (
              race // Use race.raceId for a more stable key if possible
            ) => (
              <div
                key={race.raceId || race.round}
                className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-200"
              >
                {/* Use race.raceName */}
                <h3 className="text-xl font-semibold text-red-accent mb-3">
                  Round {race.round}: {race.raceName}
                </h3>
                {/* Display Circuit info if available */}
                {race.circuit && (
                  <p className="text-sm text-gray-400 mb-3">
                    {race.circuit.circuitName} - {race.circuit.city},{" "}
                    {race.circuit.country}
                  </p>
                )}

                {/* Iterate through race.schedule object */}
                {race.schedule && typeof race.schedule === "object" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    {/* Sort session keys based on predefined order */}
                    {Object.entries(race.schedule)
                      .filter(
                        ([key, session]) =>
                          session && session.date && session.time
                      ) // Only show sessions with data
                      .sort(
                        ([keyA], [keyB]) =>
                          sessionOrder.indexOf(keyA) -
                          sessionOrder.indexOf(keyB)
                      ) // Sort by predefined order
                      .map(([key, session]) => (
                        <div key={key} className="bg-gray-700 p-2 rounded">
                          {/* Use helper for display name */}
                          <p className="font-medium text-gray-200">
                            {getSessionDisplayName(key)}
                          </p>
                          <p className="text-gray-400">
                            {formatSessionTime(session)}{" "}
                            <span className="text-xs">(UTC)</span>
                          </p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    Session details not available.
                  </p>
                )}
              </div>
            )
          )
        ) : (
          <p className="text-center text-gray-500">No schedule data found.</p>
        )}
      </div>
    </div>
  );
}

export default SchedulePage;
