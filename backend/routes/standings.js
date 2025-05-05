// routes/standings.js
import express from "express";
import {
  getDriverStandings,
  getConstructorStandings,
} from "../services/ergastService.js";

const router = express.Router();

// --- Driver Standings Routes ---

// GET /api/standings/drivers (for current season)
router.get("/drivers", async (req, res) => {
  const year = "current"; // Explicitly use 'current'
  try {
    const standings = await getDriverStandings(year);
    if (standings) {
      res.json(standings);
    } else {
      res
        .status(404)
        .json({ message: `Driver standings not found for year ${year}` });
    }
  } catch (error) {
    console.error(`Error in GET /api/standings/drivers:`, error);
    res
      .status(500)
      .json({ message: "Failed to retrieve current driver standings" });
  }
});

// GET /api/standings/drivers/:year (for specific season)
router.get("/drivers/:year", async (req, res) => {
  const year = req.params.year;
  // Basic validation for the year parameter
  if (!/^\d{4}$/.test(year) && year !== "current") {
    return res
      .status(400)
      .json({ message: 'Invalid year format. Use YYYY or "current".' });
  }
  try {
    const standings = await getDriverStandings(year);
    if (standings) {
      res.json(standings);
    } else {
      res
        .status(404)
        .json({ message: `Driver standings not found for year ${year}` });
    }
  } catch (error) {
    console.error(`Error in GET /api/standings/drivers/${year}:`, error);
    res.status(500).json({ message: "Failed to retrieve driver standings" });
  }
});

// --- Constructor Standings Routes ---

// GET /api/standings/constructors (for current season)
router.get("/constructors", async (req, res) => {
  const year = "current"; // Explicitly use 'current'
  try {
    const standings = await getConstructorStandings(year);
    if (standings) {
      res.json(standings);
    } else {
      res
        .status(404)
        .json({ message: `Constructor standings not found for year ${year}` });
    }
  } catch (error) {
    console.error(`Error in GET /api/standings/constructors:`, error);
    res
      .status(500)
      .json({ message: "Failed to retrieve current constructor standings" });
  }
});

// GET /api/standings/constructors/:year (for specific season)
router.get("/constructors/:year", async (req, res) => {
  const year = req.params.year;
  if (!/^\d{4}$/.test(year) && year !== "current") {
    return res
      .status(400)
      .json({ message: 'Invalid year format. Use YYYY or "current".' });
  }
  try {
    const standings = await getConstructorStandings(year);
    if (standings) {
      res.json(standings);
    } else {
      res
        .status(404)
        .json({ message: `Constructor standings not found for year ${year}` });
    }
  } catch (error) {
    console.error(`Error in GET /api/standings/constructors/${year}:`, error);
    res
      .status(500)
      .json({ message: "Failed to retrieve constructor standings" });
  }
});

export default router;
