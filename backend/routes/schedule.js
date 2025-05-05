// routes/schedule.js
import express from "express";
// Import the function to read from cache
import { getCachedSchedule } from "../services/f1ApiService.js";
// Keep Ergast service if needed later for other things, or remove if unused
// import { getRaceSchedule as getErgastSchedule } from '../services/ergastService.js';

const router = express.Router();

// Handle GET requests to /api/schedule/
router.get("/", async (req, res) => {
  try {
    // Attempt to get the schedule data from our local cache
    const schedule = await getCachedSchedule();

    if (schedule) {
      res.json(schedule); // Send the cached data
    } else {
      // If cache is empty or invalid, send an appropriate response
      // We don't want to trigger a fetch here automatically for every user request
      res
        .status(404)
        .json({
          message:
            "Schedule data not available in cache. Please refresh cache.",
        });
    }
  } catch (error) {
    // Catch potential errors from reading the cache (though getCachedSchedule handles most)
    console.error("Error in GET /api/schedule:", error);
    res.status(500).json({ message: "Failed to retrieve schedule data" });
  }
});

export default router;
