import axios from "axios";

// Define the base URL of your backend server
// Make sure your backend server is running on port 3001
const API_BASE_URL = "http://localhost:3001/api";

/**
 * Fetches the details of the next upcoming F1 session.
 * @returns {Promise<object|null>} The next session data or null on error.
 */
export const getNextSession = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/next-session`);
    return response.data; // The backend sends the session object directly
  } catch (error) {
    console.error(
      "Error fetching next session:",
      error.response?.data?.message || error.message
    );
    // Handle different types of errors (network error, 404 from backend, etc.)
    if (error.response && error.response.status === 404) {
      console.log("Backend reported no upcoming sessions found.");
      // Return null or a specific indicator that none were found
      return null;
    }
    // For other errors, maybe throw or return null
    return null;
  }
};

/**
 * Fetches the full F1 schedule.
 * @returns {Promise<Array|null>} The schedule array or null on error.
 */
export const getSchedule = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/schedule`);
    return response.data; // Backend sends the schedule array
  } catch (error) {
    console.error(
      "Error fetching schedule:",
      error.response?.data?.message || error.message
    );
    if (error.response && error.response.status === 404) {
      console.error("Backend cache seems empty. Cannot fetch schedule.");
    }
    return null;
  }
};

// --- Function for CURRENT Driver Standings (using f1api.dev via backend) ---
/**
 * Fetches CURRENT Driver Standings from the backend (which uses f1api.dev).
 * @returns {Promise<object|null>} Standings data object or null on error.
 */
export const getCurrentDriverStandingsF1Api = async () => { // Correct function name
  try {
    // Hits GET /api/standings/drivers on the backend
    const response = await axios.get(`${API_BASE_URL}/standings/drivers`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching CURRENT driver standings:`, error.response?.data?.message || error.message);
    return null;
  }
};

// --- Function for CURRENT Constructor Standings (using f1api.dev via backend) ---
/**
 * Fetches CURRENT Constructor Standings from the backend (which uses f1api.dev).
 * @returns {Promise<object|null>} Standings data object or null on error.
 */
export const getConstructorStandings = async (/* year = 'current' - Removed year param for consistency */) => { // Renamed for consistency maybe? Or keep old name if preferred
  try {
     // Hits GET /api/standings/constructors on the backend
    const response = await axios.get(`${API_BASE_URL}/standings/constructors`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching CURRENT constructor standings:`, error.response?.data?.message || error.message);
    return null;
  }
};

/**
 * Fetches the LATEST race results from the backend.
 * @returns {Promise<object|null>} Object containing latest race data (incl. results) or null.
 */
export const getLatestRaceResult = async () => {
    try {
        // Hits GET /api/results/latest on the backend
        const response = await axios.get(`${API_BASE_URL}/results/latest`);
        // The backend should return the object fetched from f1api.dev/current/last/race
        // which contains season, round, races object { results: [...] }
        if (response.data && response.data.races && response.data.races.results) {
             return response.data; // Return the whole structure
        } else {
            console.warn("Latest race result endpoint returned unexpected data:", response.data);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching latest race results:`, error.response?.data?.message || error.message);
        if (error.response && error.response.status === 404) {
            console.log('Backend reported no latest race results available.');
        }
        return null;
    }
};

// --- Function for HISTORICAL Driver Standings (using Ergast via backend) ---
/**
 * Fetches HISTORICAL Driver Standings for a specific year via backend (using Ergast).
 * @param {string|number} year The specific season year (e.g., 2023).
 * @returns {Promise<object|null>} Standings data object or null on error.
 */
export const getHistoricalDriverStandings = async (year) => { // Renamed to avoid conflict
  if (!year || year === 'current') {
      console.error("Must provide a specific year for historical standings");
      return null;
  }
  try {
    // Hits GET /api/standings/drivers/:year on the backend
    const response = await axios.get(`${API_BASE_URL}/standings/drivers/${year}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching driver standings for ${year}:`, error.response?.data?.message || error.message);
    return null;
  }
};

// --- Function for HISTORICAL Constructor Standings (using Ergast via backend) ---
/**
 * Fetches HISTORICAL Constructor Standings for a specific year via backend (using Ergast).
 * @param {string|number} year The specific season year (e.g., 2023).
 * @returns {Promise<object|null>} Standings data object or null on error.
 */
export const getHistoricalConstructorStandings = async (year) => { // Renamed to avoid conflict
  if (!year || year === 'current') {
      console.error("Must provide a specific year for historical standings");
      return null;
  }
  try {
    // Hits GET /api/standings/constructors/:year on the backend
    const response = await axios.get(`${API_BASE_URL}/standings/constructors/${year}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching constructor standings for ${year}:`, error.response?.data?.message || error.message);
    return null;
  }
};

/**
 * Fetches combined Race Info and Results for a specific race via backend (using Ergast).
 * @param {string|number} year The season year.
 * @param {string|number} round The round number.
 * @returns {Promise<object|null>} Object containing race info and results array, or null on error.
 */
export const getRaceResults = async (year, round) => {
  if (!year || !round) {
      console.error("Year and round are required to fetch race results.");
      return null;
  }
  try {
    // Hits GET /api/results/:year/:round on the backend
    const response = await axios.get(`${API_BASE_URL}/results/${year}/${round}`);
    return response.data; // Backend sends the combined object
  } catch (error) {
    console.error(`Error fetching race results for ${year} R${round}:`, error.response?.data?.message || error.message);
    return null;
  }
};

/**
 * Fetches the list of circuits for a given year (or current).
 * @param {string|number} year The season year or 'current'. Defaults to 'current'.
 * @returns {Promise<Array|null>} Array of circuit objects or null on error.
 */
export const getCircuits = async (year = 'current') => {
  try {
    // Backend uses /api/circuits or /api/circuits/:year
    const endpoint = year === 'current' ? '/circuits' : `/circuits/${year}`;
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data; // Backend sends the array of circuits
  } catch (error) {
    console.error(`Error fetching circuits for ${year}:`, error.response?.data?.message || error.message);
    return null;
  }
};

/**
 * Fetches details for a specific circuit by its ID.
 * @param {string} circuitId The Ergast circuit ID.
 * @returns {Promise<object|null>} Circuit object or null on error.
 */
export const getSpecificCircuitDetails = async (circuitId) => {
    if (!circuitId) return null;
    try {
        // Backend uses /api/circuits/details/:circuitId
        const response = await axios.get(`${API_BASE_URL}/circuits/details/${circuitId}`);
        return response.data; // Backend sends the single circuit object
    } catch (error) {
        console.error(`Error fetching details for circuit ${circuitId}:`, error.response?.data?.message || error.message);
        return null;
    }
};

/**
 * Fetches the cached list of driver information from the backend.
 * @returns {Promise<Array|null>} Array of driver info objects or null on error.
 */
export const getDriverInfo = async () => {
    try {
        // Hits GET /api/drivers/info on the backend
        const response = await axios.get(`${API_BASE_URL}/drivers/info`);
        // Backend should return the array from the cache
        if (Array.isArray(response.data)) {
            return response.data;
        } else {
            console.warn("Driver info endpoint returned non-array:", response.data);
            return null;
        }
    } catch (error) {
        console.error(`Error fetching driver info:`, error.response?.data?.message || error.message);
         if (error.response && error.response.status === 404) {
            console.error('Driver info cache seems empty on backend.');
         }
        return null;
    }
};