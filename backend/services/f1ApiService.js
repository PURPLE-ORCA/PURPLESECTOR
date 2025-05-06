// services/f1ApiService.js
import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const F1_API_BASE_URL = "https://f1api.dev/api";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_FILE_PATH = path.join(__dirname, "..", "schedule-cache.json");

/**
 * Fetches the full schedule for a given year from f1api.dev (using /races endpoint)
 * and caches it to a local JSON file.
 * @param {string|number} year The year of the season to fetch ('current' or YYYY).
 */
/**
 * Fetches the full schedule for a given year from f1api.dev
 * and caches it to a local JSON file.
 * @param {string|number} year The year of the season to fetch ('current' or YYYY).
 */
export async function fetchAndCacheSeasonSchedule(year = 'current') {
  // **** TRY THE SIMPLER ENDPOINT PATH ****
  // Use /current or /YYYY endpoint directly, based on the Races endpoint list
  const endpoint = year === 'current' ? 'current' : `${year}`; // Changed this line
  const url = `${F1_API_BASE_URL}/${endpoint}`;
  console.log(`Attempting to fetch schedule for ${year} from NEW URL: ${url}`); // Updated log

  try {
    const response = await axios.get(url);

    // Validate response structure - check if it has the 'races' array
    // The sample data for /current showed a root object with a 'races' key
    if (!response.data || !Array.isArray(response.data.races)) {
       throw new Error(`Invalid data structure received from ${url}. Expected root object with a 'races' array.`);
    }

    const scheduleData = response.data.races; // Extract the races array

    await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(scheduleData, null, 2), 'utf-8');
    console.log(`Successfully fetched and cached schedule for ${year} to ${CACHE_FILE_PATH}`);
    return scheduleData;

  } catch (error) {
    console.error(`Error fetching or caching schedule for ${year} from ${url}:`, error.response?.statusText || error.message);
    // Log the data received on error if available
    if (error.response?.data) {
        console.error("API Response Data on Error:", error.response.data);
    }
    throw error;
  }
}


/**
 * Reads the cached schedule data from the local JSON file.
 */
export async function getCachedSchedule() {
  // ... (no changes needed here)
  try {
    await fs.access(CACHE_FILE_PATH);
    const fileContent = await fs.readFile(CACHE_FILE_PATH, "utf-8");
    const cachedData = JSON.parse(fileContent);
    if (!Array.isArray(cachedData)) {
      console.error("Cached schedule data is not a valid array.");
      return null;
    }
    return cachedData;
  } catch (error) {
    // ... error handling ...
    return null;
  }
}

// --- NEW: Current Standings Functions using f1api.dev ---

/**
 * Fetches CURRENT Driver Standings from f1api.dev.
 * NOTE: Consider caching this result as well in a real app. Fetching live for now.
 * @returns {Promise<object|null>} Standings object or null on error.
 */
export async function getCurrentDriverStandingsF1Api() {
  const url = `${F1_API_BASE_URL}/current/drivers-championship`;
  try {
    console.log(`Fetching current driver standings from ${url}`);
    const response = await axios.get(url);
    // Validate response - expecting an object with a drivers_championship array
    if (response.data && Array.isArray(response.data.drivers_championship)) {
      // Return the whole response object which includes season info etc.
      return response.data;
    } else {
      console.error(
        "Unexpected response structure from f1api.dev drivers championship:",
        response.data
      );
      throw new Error("Invalid data structure for driver standings.");
    }
  } catch (error) {
    console.error(
      `Error fetching current driver standings from f1api.dev:`,
      error.response?.statusText || error.message
    );
    return null; // Return null on error
  }
}

/**
 * Fetches CURRENT Constructor Standings from f1api.dev.
 * NOTE: Consider caching this result as well in a real app. Fetching live for now.
 * @returns {Promise<object|null>} Standings object or null on error.
 */
export async function getCurrentConstructorStandingsF1Api() {
  const url = `${F1_API_BASE_URL}/current/constructors-championship`;
  try {
    console.log(`Fetching current constructor standings from ${url}`);
    const response = await axios.get(url);
    // Validate response - expecting an object with a constructors_championship array
    if (
      response.data &&
      Array.isArray(response.data.constructors_championship)
    ) {
      return response.data;
    } else {
      console.error(
        "Unexpected response structure from f1api.dev constructors championship:",
        response.data
      );
      throw new Error("Invalid data structure for constructor standings.");
    }
  } catch (error) {
    console.error(
      `Error fetching current constructor standings from f1api.dev:`,
      error.response?.statusText || error.message
    );
    return null; // Return null on error
  }
}

/**
 * Fetches the LATEST Race Results from f1api.dev. Fetches live.
 * @returns {Promise<object|null>} Object containing latest race result data or null on error.
 */
export async function getLatestRaceResultF1Api() {
    const url = `${F1_API_BASE_URL}/current/last/race`;
    try {
        console.log(`Fetching latest race result from ${url}`);
        const response = await axios.get(url);

        // *** UPDATED VALIDATION ***
        // Check if the main data object exists, if 'races' key exists and is an object,
        // and if the nested 'results' array exists and is not empty.
        if (response.data && typeof response.data.races === 'object' && response.data.races !== null && Array.isArray(response.data.races.results) && response.data.races.results.length > 0) {
            // Return the whole response object, the route handler can parse it
            return response.data;
        } else {
            console.warn('Unexpected or empty response structure from f1api.dev latest race:', response.data);
            return null; // Return null if structure is wrong or no results yet
        }
    } catch (error) {
        console.error(`Error fetching latest race result from f1api.dev:`, error.response?.statusText || error.message);
        return null; // Return null on error
    }
}