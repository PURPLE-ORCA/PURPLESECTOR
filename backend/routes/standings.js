// routes/standings.js
import express from "express";
// Import functions from BOTH services
import {
  getDriverStandings as getDriverStandingsErgast,
  getConstructorStandings as getConstructorStandingsErgast,
} from "../services/ergastService.js";
import {
  getCurrentDriverStandingsF1Api,
  getCurrentConstructorStandingsF1Api,
} from "../services/f1ApiService.js"; // Renamed imports for clarity

const router = express.Router();

// --- Driver Standings Routes ---

// GET /api/standings/drivers (for CURRENT season - uses f1api.dev)
router.get("/drivers", async (req, res) => {
  try {
    const standingsData = await getCurrentDriverStandingsF1Api(); // Use f1api.dev service
    if (standingsData) {
      // Extract the relevant part for consistency if needed, or send the whole object
      // The f1api.dev response includes season, total etc. which might be useful
      res.json(standingsData);
    } else {
      res
        .status(404)
        .json({
          message: `Current driver standings not available from f1api.dev`,
        });
    }
  } catch (error) {
    // Catch errors thrown by the service function
    console.error(`Error in GET /api/standings/drivers (f1api.dev):`, error);
    res
      .status(500)
      .json({ message: "Failed to retrieve current driver standings" });
  }
});

// GET /api/standings/drivers/:year (for HISTORICAL season - uses Ergast)
router.get("/drivers/:year", async (req, res) => {
  const year = req.params.year;
  if (!/^\d{4}$/.test(year)) {
    // No 'current' allowed here, only specific years
    return res
      .status(400)
      .json({
        message: "Invalid year format for historical standings. Use YYYY.",
      });
  }
  try {
    // Call Ergast service for specific year
    const standingsList = await getDriverStandingsErgast(year);
    if (standingsList) {
      // Ergast service already extracts the list, wrap it if needed or send directly
      // Let's send it directly as the ergastService was returning DriverStandings array
      res.json({
        // Mimic f1api structure slightly if needed, or define your own
        season: year, // Add season for context
        drivers_championship: standingsList, // The array from Ergast
      });
    } else {
      res
        .status(404)
        .json({
          message: `Driver standings not found for year ${year} via Ergast`,
        });
    }
  } catch (error) {
    console.error(
      `Error in GET /api/standings/drivers/${year} (Ergast):`,
      error
    );
    res.status(500).json({ message: "Failed to retrieve driver standings" });
  }
});

// --- Constructor Standings Routes ---

// GET /api/standings/constructors (for CURRENT season - uses f1api.dev)
router.get("/constructors", async (req, res) => {
  try {
    const standingsData = await getCurrentConstructorStandingsF1Api(); // Use f1api.dev service
    if (standingsData) {
      res.json(standingsData);
    } else {
      res
        .status(404)
        .json({
          message: `Current constructor standings not available from f1api.dev`,
        });
    }
  } catch (error) {
    console.error(
      `Error in GET /api/standings/constructors (f1api.dev):`,
      error
    );
    res
      .status(500)
      .json({ message: "Failed to retrieve current constructor standings" });
  }
});

// GET /api/standings/constructors/:year (for HISTORICAL season - uses Ergast)
router.get("/constructors/:year", async (req, res) => {
  const year = req.params.year;
  if (!/^\d{4}$/.test(year)) {
    return res
      .status(400)
      .json({
        message: "Invalid year format for historical standings. Use YYYY.",
      });
  }
  try {
    const standingsList = await getConstructorStandingsErgast(year); // Use Ergast service
    if (standingsList) {
      res.json({
        season: year,
        constructors_championship: standingsList,
      });
    } else {
      res
        .status(404)
        .json({
          message: `Constructor standings not found for year ${year} via Ergast`,
        });
    }
  } catch (error) {
    console.error(
      `Error in GET /api/standings/constructors/${year} (Ergast):`,
      error
    );
    res
      .status(500)
      .json({ message: "Failed to retrieve constructor standings" });
  }
});

export default router;
