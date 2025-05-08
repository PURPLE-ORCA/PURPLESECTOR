// backend/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Routers
import scheduleRouter from "./routes/schedule.js";
import nextSessionRouter from "./routes/nextSession.js";
import standingsRouter from "./routes/standings.js";
import resultsRouter from "./routes/results.js";
import circuitsRouter from "./routes/circuits.js";
import { fetchAndCacheDriverInfo, getCachedDriverInfo } from './services/f1ApiService.js'; 

// Import the service function for caching
import { fetchAndCacheSeasonSchedule } from "./services/f1ApiService.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors());
// app.use(express.json()); // If needed later

// --- API Routes ---
app.get("/api/ping", (req, res) => res.json({ message: "pong" })); // Simplified ping
app.use("/api/schedule", scheduleRouter);
app.use("/api/next-session", nextSessionRouter);
app.use("/api/standings", standingsRouter);
app.use("/api/results", resultsRouter);
app.use("/api/circuits", circuitsRouter);

// --- ADD BACK: Manual Cache Refresh Endpoint ---
// Handles both 'current' and specific year (e.g., 2025)
app.get("/api/admin/refresh-schedule/:year", async (req, res) => {
  const year = req.params.year;
  // Allow 'current' or a 4-digit year
  if (year !== "current" && !/^\d{4}$/.test(year)) {
    return res
      .status(400)
      .json({ message: 'Please provide "current" or a valid 4-digit year.' });
  }

  console.log(
    `Received request to refresh schedule cache for year/ref: ${year}`
  );
  try {
    // Call the updated service function using f1api.dev/races endpoint
    await fetchAndCacheSeasonSchedule(year);
    res
      .status(200)
      .json({ message: `Successfully refreshed schedule cache for ${year}.` });
  } catch (error) {
    // Log the actual error from the service
    console.error(`Error during cache refresh for ${year}:`, error);
    res
      .status(500)
      .json({
        message: `Failed to refresh schedule cache for ${year}: ${error.message}`,
      });
  }
});

// --- NEW Driver Info Route ---
app.get('/api/drivers/info', async (req, res) => {
    // Serve data directly from cache
    try {
        const driverInfo = await getCachedDriverInfo();
        if (driverInfo) {
            res.json(driverInfo);
        } else {
            res.status(404).json({ message: 'Driver info cache is empty. Please refresh cache.' });
        }
    } catch (error) { // Should not happen if getCached handles errors
        console.error("Error reading driver cache in route:", error);
        res.status(500).json({ message: 'Failed to retrieve driver info' });
    }
});

// --- NEW Driver Info Cache Refresh Trigger ---
app.get('/api/admin/refresh-drivers', async (req, res) => {
    console.log(`Received request to refresh driver info cache`);
    try {
        await fetchAndCacheDriverInfo(); // Call the caching function
        res.status(200).json({ message: `Successfully refreshed driver info cache.` });
    } catch (error) {
        res.status(500).json({ message: `Failed to refresh driver info cache: ${error.message}` });
    }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
