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


/**
 * Fetches Driver Standings for a given year (or current).
 * @param {string|number} year The season year or 'current'. Defaults to 'current'.
 * @returns {Promise<object|null>} StandingsList object or null on error.
 */
export const getDriverStandings = async (year = 'current') => {
  try {
    // Backend route is /api/standings/drivers/:year or /api/standings/drivers
    const endpoint = year === 'current' ? '/standings/drivers' : `/standings/drivers/${year}`;
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data; // Backend sends the StandingsList object
  } catch (error) {
    console.error(`Error fetching driver standings for ${year}:`, error.response?.data?.message || error.message);
    return null;
  }
};

/**
 * Fetches Constructor Standings for a given year (or current).
 * @param {string|number} year The season year or 'current'. Defaults to 'current'.
 * @returns {Promise<object|null>} StandingsList object or null on error.
 */
export const getConstructorStandings = async (year = 'current') => {
  try {
    const endpoint = year === 'current' ? '/standings/constructors' : `/standings/constructors/${year}`;
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data; // Backend sends the StandingsList object
  } catch (error) {
    console.error(`Error fetching constructor standings for ${year}:`, error.response?.data?.message || error.message);
    return null;
  }
};

// Add functions for other endpoints later as needed
// export const getDriverStandings = async (year = 'current') => { ... }
// export const getConstructorStandings = async (year = 'current') => { ... }
// export const getRaceResults = async (year, round) => { ... }
// export const getCircuits = async (year = 'current') => { ... }
