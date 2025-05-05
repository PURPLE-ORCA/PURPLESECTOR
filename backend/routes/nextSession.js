// routes/nextSession.js
import express from "express";
// Import the function to read the schedule from cache
import { getCachedSchedule } from "../services/f1ApiService.js";
// Import date-fns functions
import { parseISO, compareAsc, isFuture } from "date-fns";

const router = express.Router();

// Function to find the very next upcoming session from the cached data
async function findNextSessionFromCache() {
  const schedule = await getCachedSchedule(); // Read the hardcoded schedule
  if (!schedule) {
    console.error(
      "Failed to load schedule data from cache for next session calculation."
    );
    return null; // Cannot proceed without schedule data
  }

  const now = new Date(); // Get the current time
  const allSessions = [];

  // Iterate through each race object in the cached array
  schedule.forEach((race) => {
    const raceName = race.race; // Assuming key is "race" for race name

    // Iterate through the sessions object for this race
    if (race.sessions && typeof race.sessions === "object") {
      for (const sessionName in race.sessions) {
        const sessionDateTimeString = race.sessions[sessionName];

        // Validate the session time string and parse it
        if (typeof sessionDateTimeString === "string") {
          try {
            const sessionTime = parseISO(sessionDateTimeString); // parseISO handles ISO 8601 UTC 'Z' format

            // Check if the session time is valid and in the future
            if (!isNaN(sessionTime) && isFuture(sessionTime)) {
              allSessions.push({
                raceName: raceName,
                // Add other race details if available and needed (like round, circuit)
                // round: race.round, // Example if round was in your JSON
                // circuit: race.circuitName, // Example if circuit was in your JSON
                sessionName: sessionName, // e.g., "FP1", "Qualifying", "Race"
                dateTimeUTC: sessionTime, // Store the actual Date object (UTC)
              });
            }
          } catch (parseError) {
            console.warn(
              `Error parsing date-time string "${sessionDateTimeString}" for ${raceName} ${sessionName}:`,
              parseError
            );
            // Skip this session if parsing fails
          }
        } else {
          console.warn(
            `Invalid session time format for ${raceName} ${sessionName}:`,
            sessionDateTimeString
          );
        }
      }
    } else {
      console.warn(`Missing or invalid sessions object for race: ${raceName}`);
    }
  });

  // Sort all future sessions chronologically
  allSessions.sort((a, b) => compareAsc(a.dateTimeUTC, b.dateTimeUTC));

  // The first one in the sorted list is the next upcoming session
  return allSessions.length > 0 ? allSessions[0] : null;
}

// Define the GET endpoint
router.get("/", async (req, res) => {
  try {
    const nextSession = await findNextSessionFromCache();
    if (nextSession) {
      // Convert Date object back to ISO string (UTC) for JSON response
      res.json({
        ...nextSession,
        dateTimeUTC: nextSession.dateTimeUTC.toISOString(),
      });
    } else {
      // Use 404 if genuinely no future sessions found in the (potentially old) cache
      // Or maybe a different status if the cache itself failed to load?
      // Let's stick with 404 for now, implying "nothing relevant found".
      res
        .status(404)
        .json({
          message: "No upcoming F1 sessions found in the schedule data.",
        });
    }
  } catch (error) {
    // Catch unexpected errors during processing
    console.error("Error in GET /api/next-session:", error);
    res.status(500).json({ message: "Failed to determine next session" });
  }
});

export default router;
