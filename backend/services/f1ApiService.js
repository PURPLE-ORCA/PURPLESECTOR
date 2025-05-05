import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Define the path for our cache file (no change here)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_FILE_PATH = path.join(__dirname, "..", "schedule-cache.json");

/**
 * Reads the cached schedule data from the local JSON file.
 * @returns {Promise<Array|null>} The cached schedule data as an array, or null if cache is empty/invalid.
 */
export async function getCachedSchedule() {
  try {
    // Check if the file exists first
    await fs.access(CACHE_FILE_PATH); // Throws error if file doesn't exist

    const fileContent = await fs.readFile(CACHE_FILE_PATH, "utf-8");
    const cachedData = JSON.parse(fileContent);

    // Basic validation
    if (!Array.isArray(cachedData)) {
      console.error("Cached schedule data is not a valid array.");
      return null;
    }

    // console.log('Successfully read schedule from cache.'); // Uncomment for debugging
    return cachedData;
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error("CRITICAL: Cache file schedule-cache.json not found!"); // Make error more visible
    } else if (error instanceof SyntaxError) {
      console.error(
        "CRITICAL: Error parsing cache file schedule-cache.json:",
        error
      );
    } else {
      console.error("Error reading schedule cache:", error.message);
    }
    return null; // Return null if cache doesn't exist or is invalid
  }
}

