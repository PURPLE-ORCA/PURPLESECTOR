import express from "express";
import {
  getRaceResults,
  getSpecificRaceInfo,
} from "../services/ergastService.js"; // Import both functions

const router = express.Router();

// Route for specific Race Results
// GET /api/results/2023/1 -> gets results for 2023 season, round 1
router.get("/:year/:round", async (req, res) => {
  const { year, round } = req.params;

  // Basic validation for year and round
  if (!/^\d{4}$/.test(year)) {
    return res.status(400).json({ message: "Invalid year format. Use YYYY." });
  }
  if (!/^\d+$/.test(round) || parseInt(round, 10) < 1) {
    return res
      .status(400)
      .json({ message: "Invalid round number. Use a positive integer." });
  }

  try {
    // Fetch both results and general race info concurrently
    const [results, raceInfo] = await Promise.all([
      getRaceResults(year, round),
      getSpecificRaceInfo(year, round), // Fetch general info too
    ]);

    if (results && raceInfo) {
      // Combine them into a single response object for convenience
      res.json({
        season: raceInfo.season,
        round: raceInfo.round,
        raceName: raceInfo.raceName,
        circuit: raceInfo.Circuit, // Includes circuit details
        date: raceInfo.date,
        time: raceInfo.time, // Race start time (UTC)
        results: results, // The array of driver results
      });
    } else {
      // Ergast might return empty if year/round is invalid
      res
        .status(404)
        .json({ message: `Race results not found for ${year} round ${round}` });
    }
  } catch (error) {
    console.error(`Error in GET /api/results/${year}/${round}:`, error);
    res.status(500).json({ message: "Failed to retrieve race results" });
  }
});

export default router;
