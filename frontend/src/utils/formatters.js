// src/utils/formatters.js
export const formatDateOnly = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const utcDate = new Date(dateString + "T00:00:00Z");
    const gmt1Date = new Date(utcDate.getTime() + 60 * 60 * 1000);
    return gmt1Date.toLocaleString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return "Invalid Date";
  }
};

export const formatTimeOnly = (dateString, timeString) => {
  if (!dateString || !timeString) return "N/A";
  try {
    const utcDate = new Date(`${dateString}T${timeString}`);
    const gmt1Date = new Date(utcDate.getTime() + 60 * 60 * 1000);
    return gmt1Date.toLocaleString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "Invalid Time";
  }
};
