import express from "express";
import {
  getCircuitInfo,
  getSpecificCircuitInfo,
} from "../services/ergastService.js";

const router = express.Router();

// Route for getting circuits for the CURRENT season
// GET /api/circuits
router.get("/", async (req, res) => {
  const year = "current"; // Explicitly use 'current'
  try {
    const circuits = await getCircuitInfo(year);
    if (circuits) {
      res.json(circuits);
    } else {
      res
        .status(404)
        .json({ message: `Circuit info not found for current season` });
    }
  } catch (error) {
    console.error(`Error in GET /api/circuits (current):`, error);
    res
      .status(500)
      .json({ message: "Failed to retrieve current circuit information" });
  }
});

// Route for getting circuits for a SPECIFIC year
// GET /api/circuits/2023
router.get("/:year", async (req, res) => {
  const { year } = req.params;
  if (!/^\d{4}$/.test(year)) {
    // Only allow 4-digit years here
    return res.status(400).json({ message: "Invalid year format. Use YYYY." });
  }

  try {
    const circuits = await getCircuitInfo(year);
    if (circuits) {
      res.json(circuits);
    } else {
      res
        .status(404)
        .json({ message: `Circuit info not found for year ${year}` });
    }
  } catch (error) {
    console.error(`Error in GET /api/circuits/${year}:`, error);
    res.status(500).json({ message: "Failed to retrieve circuit information" });
  }
});

// Route for getting specific circuit details by ID (No change needed here)
// GET /api/circuits/details/monaco
router.get("/details/:circuitId", async (req, res) => {
  const { circuitId } = req.params;
  if (!circuitId) {
    return res
      .status(400)
      .json({ message: "Circuit ID parameter is required." });
  }
  try {
    const circuit = await getSpecificCircuitInfo(circuitId);
    if (circuit) {
      res.json(circuit);
    } else {
      res
        .status(404)
        .json({ message: `Circuit details not found for ID: ${circuitId}` });
    }
  } catch (error) {
    console.error(`Error in GET /api/circuits/details/${circuitId}:`, error);
    res
      .status(500)
      .json({ message: "Failed to retrieve specific circuit details" });
  }
});

export default router;
