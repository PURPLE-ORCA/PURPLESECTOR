import axios from "axios";

const ERGAST_API_BASE_URL = process.env.ERGAST_API_BASE_URL || "https://ergast.com/api/f1";

async function fetchFromErgast(
  endpoint,
  responsePath = "StandingsTable.StandingsLists[0]"
) {
  const url = `${ERGAST_API_BASE_URL}/${endpoint}.json`;
  try {
    const response = await axios.get(url);

    // Navigate the response structure based on the provided path
    let data = response.data?.MRData;
    const pathParts = responsePath.split(".");
    for (const part of pathParts) {
      if (data == null) break; // Stop if path is invalid midway
      const arrayMatch = part.match(/^(.*)\[(\d+)\]$/); // Check for array index like StandingsLists[0]
      if (arrayMatch) {
        data = data[arrayMatch[1]]?.[parseInt(arrayMatch[2], 10)];
      } else {
        data = data[part];
      }
    }

    if (data) {
      return data;
    } else {
      console.error(
        `Unexpected response structure or missing data at path '${responsePath}' from Ergast endpoint: ${endpoint}`,
        response.data
      );
      throw new Error("Failed to fetch valid data from Ergast API");
    }
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error.message);
    // Don't throw generic 'standings' error anymore
    throw new Error(
      `Failed to fetch data for endpoint ${endpoint} from Ergast API`
    );
  }
}

/**
 * Fetches Driver Standings for a given year or 'current'.
 * @param {string|number} year The season year or 'current'.
 * @returns {Promise<object|null>} StandingsList object or null on error.
 */
export async function getDriverStandings(year = "current") {
  // Endpoint example: /current/driverStandings.json or /2023/driverStandings.json
  return fetchFromErgast(`${year}/driverStandings`);
}

/**
 * Fetches Constructor Standings for a given year or 'current'.
 * @param {string|number} year The season year or 'current'.
 * @returns {Promise<object|null>} StandingsList object or null on error.
 */
export async function getConstructorStandings(year = "current") {
  // Endpoint example: /current/constructorStandings.json or /2023/constructorStandings.json
  return fetchFromErgast(`${year}/constructorStandings`);
}

/**
 * Fetches Race Results for a specific race (year and round).
 * @param {string|number} year The season year.
 * @param {string|number} round The round number.
 * @returns {Promise<Array|null>} Array of Result objects or null on error.
 */
export async function getRaceResults(year, round) {
  // Ergast uses 'results' endpoint. We expect RaceTable.Races[0].Results
  // Note: Ergast often returns an array of Races even for specific round, usually only contains one race.
  // We are interested in the Results array within that first Race.
  return fetchFromErgast(`${year}/${round}/results`, 'RaceTable.Races[0].Results');
}

/**
 * Fetches basic info for a specific race (year and round).
 * @param {string|number} year The season year.
 * @param {string|number} round The round number.
 * @returns {Promise<object|null>} The first Race object or null on error.
 */
export async function getSpecificRaceInfo(year, round) {
    // Fetches general race info, not just results
    return fetchFromErgast(`${year}/${round}`, 'RaceTable.Races[0]');
}

/**
 * Fetches Circuit Information for a given year or 'current'.
 * @param {string|number} year The season year or 'current'.
 * @returns {Promise<Array|null>} Array of Circuit objects or null on error.
 */
export async function getCircuitInfo(year = 'current') {
  // The /circuits endpoint lists circuits used in a given season.
  // Response path is CircuitTable.Circuits
  return fetchFromErgast(`${year}/circuits`, 'CircuitTable.Circuits');
}

// --- Optional: Get specific circuit details ---
/**
 * Fetches details for a specific circuit by its ID.
 * @param {string} circuitId The Ergast circuit ID (e.g., 'monaco', 'silverstone').
 * @returns {Promise<object|null>} Circuit object or null on error.
 */
export async function getSpecificCircuitInfo(circuitId) {
    // Note: Ergast might still return an array, even for a specific ID.
    return fetchFromErgast(`circuits/${circuitId}`, 'CircuitTable.Circuits[0]');
}