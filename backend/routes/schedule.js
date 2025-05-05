import express from "express";
import { getRaceSchedule } from "../services/ergastService.js";

const router = express.Router();

// Handle GET requests to /api/schedule/
router.get("/", async (req, res) => {
  try {
    const schedule = await getRaceSchedule();
    res.json(schedule); // Send the array of races as JSON
  } catch (error) {
    console.error("Error in GET /api/schedule:", error);
    res.status(500).json({ message: "Failed to retrieve race schedule" });
  }
});

export default router;
