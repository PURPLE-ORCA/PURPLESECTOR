import express from "express";
import {
  getRaceResults as getRaceResultsErgast,
  getSpecificRaceInfo as getRaceInfoErgast,
} from "../services/ergastService.js";
import { getLatestRaceResultF1Api, getSpecificRaceResultF1Api } from '../services/f1ApiService.js'; // Import BOTH f1Api results functions


const router = express.Router();


// GET /api/results/latest
router.get('/latest', async (req, res) => {
    try {
        const latestResultData = await getLatestRaceResultF1Api();
        if (latestResultData) {
            res.json(latestResultData);
        } else {
            res.status(404).json({ message: 'Latest race results not available.' });
        }
    } catch (error) {
        // Catch errors from the service function if it re-throws unexpected ones
        console.error(`Error in GET /api/results/latest:`, error);
        res.status(500).json({ message: 'Failed to retrieve latest race results' });
    }
});

router.get("/:year/:round", async (req, res) => {
  // ... params and validation ...
  const { year, round } = req.params;
  const currentApiYear = new Date().getFullYear().toString();
  const isCurrentApiYear = year === currentApiYear || year === "current";
  if (!/^\d{4}$/.test(year) && year !== "current") {
    /* ... error ... */
  }
  if (!/^\d+$/.test(round) || parseInt(round, 10) < 1) {
    /* ... error ... */
  }

  try {
    let raceData;
    let source;

    if (isCurrentApiYear) {
      source = "f1api.dev";
      console.log(`Fetching results for ${year} R${round} from ${source}`);
      // Pass the actual year, not 'current', as the API expects YYYY/RR/race
      const actualYear = year === "current" ? currentApiYear : year;
      const specificResultData = await getSpecificRaceResultF1Api(
        actualYear,
        round
      );

      // *** UPDATED DATA PROCESSING to match f1ApiService validation ***
      if (
        specificResultData &&
        typeof specificResultData.races === "object" &&
        specificResultData.races !== null &&
        Array.isArray(specificResultData.races.results)
      ) {
        const raceInfo = specificResultData.races; // Use the 'races' OBJECT directly
        raceData = {
          season: specificResultData.season,
          round: raceInfo.round,
          raceName: raceInfo.raceName,
          circuit: raceInfo.circuit,
          date: raceInfo.schedule?.race?.date,
          time: raceInfo.schedule?.race?.time,
          results: raceInfo.results, // Results array is directly inside 'races' object
        };
      } else {
        console.log(
          `No valid results structure found on ${source} for ${actualYear} R${round}.`
        );
      }
    } else {
      // --- Fetch from Ergast (remains the same) ---
      source = "Ergast";
      console.log(`Fetching results for ${year} R${round} from ${source}`);
      const [results, raceInfo] = await Promise.all([
        getRaceResultsErgast(year, round),
        getRaceInfoErgast(year, round),
      ]);
      if (results && raceInfo) {
        raceData = {
          /* ... build Ergast response ... */
        };
      } else {
        console.log(`No results found on ${source} for ${year} R${round}.`);
      }
    }

    // --- Send Response ---
    if (raceData) {
      res.json(raceData);
    } else {
      res
        .status(404)
        .json({
          message: `Race results not found for ${year} round ${round} from available sources.`,
        });
    }
  } catch (error) {
    console.error(`Error in GET /api/results/${year}/${round}:`, error);
    res.status(500).json({ message: "Failed to retrieve race results" });
  }
});
export default router;
