import express from "express";
import dotenv from "dotenv";
import scheduleRouter from "./routes/schedule.js";
import nextSessionRouter from './routes/nextSession.js'; // Corrected import name

// Load environment variables from .env file
dotenv.config();

const app = express();

// Use the PORT environment variable or default to 3001
const PORT = process.env.PORT || 3001;

// A test route
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.use("/api/schedule", scheduleRouter);
app.use('/api/next-session', nextSessionRouter); 

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
