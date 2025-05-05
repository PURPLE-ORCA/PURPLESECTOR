import axios from "axios";

const ERGAST_API_BASE_URL = "https://ergast.com/api/f1";

async function fetchFromErgast(endpoint) {
  const url = `${ERGAST_API_BASE_URL}/${endpoint}.json`;
  try {
    // console.log(`Fetching from Ergast: ${url}`);
    const response = await axios.get(url);
    if (
      response.data &&
      response.data.MRData &&
      response.data.MRData.RaceTable
    ) {
      return response.data.MRData.RaceTable.Races; // Return the array of Races
    } else {
      console.error(
        "Unexpected response structure from Ergast:",
        response.data
      );
      throw new Error("Failed to fetch valid data from Ergast API");
    }
  } catch (error) {
    console.error(`Error fetching data from ${url}:`, error.message);
    throw new Error("Failed to fetch data from Ergast API");
  }
}

// Function specifically for getting the current season's schedule
export async function getRaceSchedule() {
  // 'current' automatically gets the latest season schedule from Ergast
  return fetchFromErgast("current");
}