// src/utils/constants.js
export const sessionOrder = [
  "fp1",
  "fp2",
  "sprintQualy",
  "fp3",
  "sprintRace",
  "qualy",
  "race",
];

export const sessionColors = {
  fp1: "bg-blue-600 dark:bg-blue-700",
  fp2: "bg-blue-700 dark:bg-blue-800",
  fp3: "bg-blue-800 dark:bg-blue-900",
  sprintQualy: "bg-amber-500 dark:bg-amber-600",
  sprintRace: "bg-amber-600 dark:bg-amber-700",
  qualy: "bg-purple-600 dark:bg-purple-700",
  race: "bg-red-600 dark:bg-red-700",
};

export const countryCodeMap = {
  Australia: "au",
  China: "cn",
  Japan: "jp",
  Bahrain: "bh",
  "Saudi Arabia": "sa",
  USA: "us", // Handle variations if API uses different terms
  "United States": "us",
  Italy: "it",
  Monaco: "mc",
  Spain: "es",
  Canada: "ca",
  Austria: "at",
  UK: "gb", // Use 'gb' for United Kingdom
  "Great Britain": "gb",
  Belgium: "be",
  Hungary: "hu",
  Netherlands: "nl",
  Azerbaijan: "az",
  Singapore: "sg",
  Mexico: "mx",
  Brazil: "br",
  Qatar: "qa",
  UAE: "ae", // Use 'ae' for United Arab Emirates
  "United Arab Emirates": "ae",
  France: "fr",
  Germany: "de",
};
