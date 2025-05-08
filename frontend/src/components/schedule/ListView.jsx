// src/components/schedule/ListView.jsx
import React from "react";
import { motion } from "framer-motion";
import RaceListItem from "./RaceListItem"; // Import the item component

// Animation variants for the container (optional)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger animation for list items
    },
  },
};

function ListView({ schedule }) {
  if (!schedule || schedule.length === 0) {
    // Handle no data case if needed, though parent likely does
    return null;
  }

  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {schedule.map((race) => (
        <RaceListItem key={race.raceId || race.round} race={race} />
      ))}
    </motion.div>
  );
}

export default ListView;
