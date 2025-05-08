// src/utils/teamColors.js
const teamColors = {
  "Red Bull Racing": "bg-gradient-to-r from-blue-800 to-yellow-500",
  Mercedes: "bg-gradient-to-r from-teal-400 to-gray-200",
  "Mercedes Formula 1 Team": "bg-gradient-to-r from-teal-400 to-gray-200", // Alias
  Ferrari: "bg-gradient-to-r from-red-600 to-red-700",
  "Scuderia Ferrari": "bg-gradient-to-r from-red-600 to-red-700", // Alias
  McLaren: "bg-gradient-to-r from-orange-500 to-yellow-400",
  "McLaren Formula 1 Team": "bg-gradient-to-r from-orange-500 to-yellow-400", // Alias
  "Aston Martin": "bg-gradient-to-r from-green-600 to-green-700",
  "Aston Martin F1 Team": "bg-gradient-to-r from-green-600 to-green-700", // Alias
  Alpine: "bg-gradient-to-r from-blue-500 to-pink-400",
  "Alpine F1 Team": "bg-gradient-to-r from-blue-500 to-pink-400", // Alias
  AlphaTauri: "bg-gradient-to-r from-blue-900 to-white", // Old name, keep if needed for historical
  "RB F1 Team": "bg-gradient-to-r from-blue-700 to-slate-300", // New name for AlphaTauri/RB
  "Alfa Romeo": "bg-gradient-to-r from-red-700 to-white", // Old name, keep if needed
  Sauber: "bg-gradient-to-r from-emerald-600 to-black", // New name/livery for Sauber
  "Sauber F1 Team": "bg-gradient-to-r from-emerald-600 to-black", // Alias
  Williams: "bg-gradient-to-r from-blue-600 to-sky-400",
  "Williams Racing": "bg-gradient-to-r from-blue-600 to-sky-400", // Alias
  "Haas F1 Team": "bg-gradient-to-r from-gray-200 to-red-600",
  // Default for any other team
  default: "bg-gradient-to-r from-gray-700 to-gray-500",
};

export const getTeamColorClass = (teamName) => {
  if (!teamName) return teamColors.default;
  // Attempt to match directly, then try removing "F1 Team", then "Racing"
  return (
    teamColors[teamName] ||
    teamColors[teamName.replace(" F1 Team", "")] ||
    teamColors[teamName.replace(" Racing", "")] ||
    teamColors.default
  );
};
