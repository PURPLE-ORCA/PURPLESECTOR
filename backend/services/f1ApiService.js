// services/f1ApiService.js
import axios from "axios";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const F1_API_BASE_URL = process.env.F1_API_BASE_URL || "https://f1api.dev/api";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_FILE_PATH = path.join(__dirname, "..", "schedule-cache.json");

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
    return null;
  }
}

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
export async function getLatestRaceResultF1Api() { // Ensure this function exists and is exported
    const url = `${F1_API_BASE_URL}/current/last/race`;
    try {
        console.log(`Fetching latest race result from ${url}`);
        const response = await axios.get(url);
        // Using the validation matching the specific results one below now
        if (response.data && typeof response.data.races === 'object' && response.data.races !== null && Array.isArray(response.data.races.results) && response.data.races.results.length > 0) {
            return response.data;
        } else {
            console.warn('Unexpected or empty response structure from f1api.dev latest race:', response.data);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching latest race result from f1api.dev:`, error.response?.statusText || error.message);
        return null;
    }
}
/**
 * Fetches results for a SPECIFIC race from f1api.dev.
 * @param {string|number} year The season year.
 * @param {string|number} round The round number.
 * @returns {Promise<object|null>} Object containing data for the specific race or null on error.
 */
export async function getSpecificRaceResultF1Api(year, round) {
    const url = `${F1_API_BASE_URL}/${year}/${round}/race`;
    try {
        console.log(`Fetching specific race result from ${url}`);
        const response = await axios.get(url);

        // *** UPDATED VALIDATION TO MATCH LATEST RESULT STRUCTURE ***
        // Check if the main data object exists, if 'races' key exists and is an object,
        // and if the nested 'results' array exists and is not empty.
        if (response.data && typeof response.data.races === 'object' && response.data.races !== null && Array.isArray(response.data.races.results) && response.data.races.results.length > 0) {
             // Return the whole response object
             return response.data;
        } else {
            // Log the actual structure if it's unexpected
            console.warn(`Unexpected or empty response structure from ${url}:`, JSON.stringify(response.data, null, 2)); // Log full structure
            return null; // Structure is wrong or no results
        }
    } catch (error) {
        // If axios throws (e.g., network error, or maybe f1api returns 404 directly?)
        console.error(`Error fetching specific race result (${year} R${round}) from f1api.dev:`, error.response?.statusText || error.message);
         if (error.response?.data) { // Log response data on error if available
            console.error("API Response Data on Error:", error.response.data);
         }
        return null; // Return null on error
    }
}

const OPENF1_API_BASE_URL = process.env.OPENF1_API_BASE_URL || "https://api.openf1.org/v1"; // Base URL for OpenF1
const DRIVER_INFO_CACHE_FILE = path.join(
  __dirname,
  "..",
  "driver-info-cache.json"
); // Cache file path

/**
 * @param {object} options - Optional query parameters for OpenF1 (e.g., { session_key: 'latest' })
 * @returns {Promise<Array|null>} Array of driver objects or null on error.
 */
export async function fetchAndCacheDriverInfo(options = {}) {
  // Construct URL - Check OpenF1 docs for best way to get current/relevant drivers
  // Using /drivers endpoint without params might give ALL historical drivers?
  // Let's assume /drivers?session_key=latest gives current drivers (NEED TO VERIFY THIS)
  const queryParams = new URLSearchParams({
    session_key: "latest",
    ...options,
  }).toString();
  const url = `${OPENF1_API_BASE_URL}/drivers?${queryParams}`;

  console.log(`Attempting to fetch driver info from OpenF1: ${url}`);

  try {
    const response = await axios.get(url);

    // Validate response structure - OpenF1 usually returns an array directly
    if (!Array.isArray(response.data)) {
      throw new Error(
        `Invalid data structure received from ${url}. Expected an array.`
      );
    }
    if (response.data.length === 0) {
      console.warn(`OpenF1 returned empty array for drivers at ${url}`);
      // Still cache empty array? Or throw error? Caching empty seems okay.
    }

    const driverData = response.data;

    // --- Cache the data ---
    // Create a map for easier lookup by driver_number or name_acronym later?
    // Or just cache the array? Let's cache the array for now.
    await fs.writeFile(
      DRIVER_INFO_CACHE_FILE,
      JSON.stringify(driverData, null, 2),
      "utf-8"
    );
    console.log(
      `Successfully fetched and cached driver info to ${DRIVER_INFO_CACHE_FILE}`
    );
    return driverData;
  } catch (error) {
    console.error(
      `Error fetching or caching driver info from ${url}:`,
      error.response?.statusText || error.message
    );
    if (error.response?.data) {
      console.error("API Response Data:", error.response.data);
    }
    // Don't crash server, maybe return null or rethrow if critical
    throw error; // Rethrow for the refresh endpoint to report failure
  }
}

/**
 * Reads the cached driver info data from the local JSON file.
 * @returns {Promise<Array|null>} The cached driver info array, or null if cache is empty/invalid.
 */
export async function getCachedDriverInfo() {
  try {
    await fs.access(DRIVER_INFO_CACHE_FILE);
    const fileContent = await fs.readFile(DRIVER_INFO_CACHE_FILE, "utf-8");
    const cachedData = JSON.parse(fileContent);
    if (!Array.isArray(cachedData)) {
      console.error("Cached driver info data is not a valid array.");
      return null;
    }
    return cachedData;
  } catch (error) {
    if (error.code === "ENOENT") {
      console.log("Driver info cache file not found.");
    } else if (error instanceof SyntaxError) {
      console.error("Error parsing driver info cache file JSON:", error);
    } else {
      console.error("Error reading driver info cache:", error.message);
    }
    return null;
  }
}