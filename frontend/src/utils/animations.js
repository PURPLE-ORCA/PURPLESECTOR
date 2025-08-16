export const podiumContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Slow this down a little for more dramatic effect
      delayChildren: 0.1,   // Add a tiny delay before starting
    },
  },
};

export const podiumItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};
