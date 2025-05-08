import { Icon } from "@iconify/react";
import { countryCodeMap } from "./constants";

export const getSessionDisplayName = (key) => {
  const names = {
    fp1: "Practice 1",
    fp2: "Practice 2",
    fp3: "Practice 3",
    qualy: "Qualifying",
    race: "Race",
    sprintQualy: "Sprint Qualifying",
    sprintRace: "Sprint Race",
  };
  return names[key] || key;
};

export const getMonthAndYear = (dateString) => {
  if (!dateString) return null;
  try {
    const date = new Date(dateString + "T00:00:00Z"); // Ensure consistent parsing by adding time
    return `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
  } catch (e) {
    return null;
  }
};

export const getCountryFlagIconName = (countryName) => {
  if (!countryName) {
    return "mdi:flag-variant-outline"; // Return fallback icon name
  }
  const countryCode = countryCodeMap[countryName.trim()];
  if (countryCode) {
    return `flagpack:${countryCode}`; // Return the correct icon name string
  } else {
    console.warn(`Country code not found for: ${countryName}`);
    return "mdi:flag-checkered"; // Return fallback icon name
  }
};