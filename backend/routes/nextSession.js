// routes/nextSession.js
import express from "express";
import { getCachedSchedule } from "../services/f1ApiService.js";
import { parseISO, compareAsc, isFuture } from "date-fns";

const router = express.Router();

// Updated function to find the next session from the f1api.dev structure
async function findNextSessionFromCache() {
  const schedule = await getCachedSchedule(); // Read the cached schedule (new structure)
  if (!schedule) {
    console.error(
      "Failed to load schedule data from cache for next session calculation."
    );
    return null;
  }

  const now = new Date();
  const allSessions = [];

  // Iterate through each race object
  schedule.forEach((race) => {
    const raceName = race.raceName;
    const round = race.round;

    // Check if race.schedule exists and is an object
    if (race.schedule && typeof race.schedule === "object") {
      // Iterate through the defined session keys (fp1, fp2, fp3, qualy, race, sprintQualy, sprintRace)
      for (const sessionKey in race.schedule) {
        const sessionDetails = race.schedule[sessionKey];

        // Check if the session entry has both date and time
        if (sessionDetails && sessionDetails.date && sessionDetails.time) {
          // Combine date and time into a full ISO string
          const dateTimeString = `${sessionDetails.date}T${sessionDetails.time}`; // Assumes time includes 'Z'

          try {
            const sessionTime = parseISO(dateTimeString);

            // Check if valid and in the future
            if (!isNaN(sessionTime) && isFuture(sessionTime)) {
              allSessions.push({
                raceName: raceName,
                round: round,
                // circuit: race.circuit?.circuitName, // Optional: Add circuit if needed
                sessionName: sessionKey, // e.g., "fp1", "qualy", "race"
                dateTimeUTC: sessionTime, // Store Date object
              });
            }
          } catch (parseError) {
            console.warn(
              `Error parsing date-time string "${dateTimeString}" for ${raceName} ${sessionKey}:`,
              parseError
            );
          }
        }
        // else: Silently ignore sessions without both date and time (like potentially empty fp2/fp3 on sprint weekends in this API)
      }
    } else {
      console.warn(`Missing or invalid schedule object for race: ${raceName}`);
    }
  });

  // Sort all future sessions chronologically
  allSessions.sort((a, b) => compareAsc(a.dateTimeUTC, b.dateTimeUTC));

  // Return the first one (or null)
  return allSessions.length > 0 ? allSessions[0] : null;
}

// --- The GET route handler remains the same ---
router.get("/", async (req, res) => {
  try {
    const nextSession = await findNextSessionFromCache();
    if (nextSession) {
      res.json({
        ...nextSession,
        dateTimeUTC: nextSession.dateTimeUTC.toISOString(),
      });
    } else {
      res
        .status(404)
        .json({
          message: "No upcoming F1 sessions found in the schedule data.",
        });
    }
  } catch (error) {
    console.error("Error in GET /api/next-session:", error);
    res.status(500).json({ message: "Failed to determine next session" });
  }
});

export default router;
