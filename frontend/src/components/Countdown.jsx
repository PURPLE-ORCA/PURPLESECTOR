// src/components/Countdown.jsx
import React, { useState, useEffect } from "react";
import { parseISO, differenceInMilliseconds } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Flag, AlertTriangle } from "lucide-react";

function Countdown({ targetTimeUTC }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isPassed, setIsPassed] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [timeStatus, setTimeStatus] = useState("future"); // 'future', 'soon', 'critical', 'passed', 'invalid'

  useEffect(() => {
    // Ensure targetTimeUTC is valid before proceeding
    if (!targetTimeUTC) {
      setIsInvalid(true);
      setTimeStatus("invalid");
      return;
    }

    let targetDate;
    try {
      targetDate = parseISO(targetTimeUTC);
      // Check if parseISO returned a valid Date object
      if (isNaN(targetDate)) {
        throw new Error("Invalid date format");
      }
    } catch (error) {
      console.error("Error parsing targetTimeUTC:", targetTimeUTC, error);
      setIsInvalid(true);
      setTimeStatus("invalid");
      return; // Stop effect if date is invalid
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = differenceInMilliseconds(targetDate, now);

      let newTimeLeft = {};
      let passed = false;
      let status = "future";

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };

        // Determine status based on remaining time
        const totalHours = newTimeLeft.days * 24 + newTimeLeft.hours;
        // Adjusted threshold for "Starting Soon" to 5 hours as per feedback
        if (totalHours <= 5) {
          status = "critical"; // Less than 5 hours (Starting Soon)
        } else if (totalHours <= 24) {
          status = "soon"; // Less than 24 hours (Coming Up)
        }
      } else {
        // Time is up or has passed
        passed = true;
        status = "passed";
        newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      setTimeLeft(newTimeLeft);
      setIsPassed(passed);
      setTimeStatus(status);

      // Return true if time is up to clear interval
      return passed;
    };

    // Initial calculation
    const timeIsUpInitially = calculateTimeLeft();

    // Set up the interval only if the time hasn't already passed
    let intervalId = null;
    if (!timeIsUpInitially) {
      intervalId = setInterval(() => {
        const timeIsUp = calculateTimeLeft();
        if (timeIsUp && intervalId) {
          clearInterval(intervalId); // Clear interval when time is up
        }
      }, 1000); // Update every second
    }

    // Cleanup function to clear the interval when the component unmounts
    // or when the targetTimeUTC prop changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [targetTimeUTC]); // Rerun effect if targetTimeUTC changes

  // Format the output string, padding with leading zeros
  const formatTime = (value) => String(value).padStart(2, "0");

  // Define state-based styles
  const getContainerStyles = () => {
    switch (timeStatus) {
      case "passed":
        return "bg-gradient-to-r from-[#950505] to-[#37045F] dark:from-[#b30000] dark:to-[#4f067f] text-white";
      case "critical":
        return "bg-gradient-to-r from-[#950505] to-[#ff0000] dark:from-[#b30000] dark:to-[#ff0000] text-white";
      case "soon":
        return "bg-gradient-to-r from-[#950505] to-[#ff7b00] dark:from-[#b30000] dark:to-[#ff7b00] text-white";
      case "invalid":
        return "bg-gray-100 dark:bg-black text-gray-500 dark:text-gray-400";
      default:
        return "bg-white dark:bg-black text-gray-900 dark:text-white";
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", damping: 12 },
    },
  };

  const digitVariants = {
    initial: { opacity: 0, y: -10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 },
  };

  // Pulse animation for digits
  const pulseAnimation =
    timeStatus === "critical"
      ? {
          scale: [1, 1.05, 1],
          transition: {
            repeat: Infinity,
            duration: 1,
            ease: "easeInOut",
          },
        }
      : {};

  // Determine border width based on seconds (creates a progress effect)
  const secondsProgress = (60 - timeLeft.seconds) / 60;
  const borderStyle = isPassed
    ? {}
    : {
        background: `conic-gradient(from 0deg, ${timeStatus === "critical" ? "#ff0000" : "#950505"} ${secondsProgress * 360}deg, transparent ${secondsProgress * 360}deg)`,
      };

  // Determine if we need to render timer digits
  const renderDigits = !isPassed && !isInvalid;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`rounded-xl shadow-lg overflow-hidden ${getContainerStyles()}`}
    >
      {isInvalid ? (
        <div className="p-4 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
          <span className="font-medium">Invalid countdown time</span>
        </div>
      ) : isPassed ? (
        <motion.div
          className="p-4 flex items-center justify-center"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Flag className="w-5 h-5 mr-2" />
          <span className="text-lg font-bold">RACE UNDERWAY</span>
        </motion.div>
      ) : (
        <div className="relative">
          {/* Pulse indicator at top */}
          {timeStatus === "critical" && (
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-red-500"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1 }}
            />
          )}

          <div className="p-3 sm:p-4">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-4 h-4 mr-2 text-[#950505] dark:text-[#ff6b6b]" />
              <span className="text-xs font-medium uppercase tracking-wider">
                {timeStatus === "critical"
                  ? "Starting Soon"
                  : timeStatus === "soon"
                    ? "Coming Up"
                    : "Race Countdown"}
              </span>
            </div>

            <div className="flex justify-center space-x-2 sm:space-x-3">
              {/* Days */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center"
              >
                <div className="relative flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-black dark:bg-black flex items-center justify-center overflow-hidden relative">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={timeLeft.days}
                        variants={digitVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="text-2xl sm:text-3xl font-mono font-bold text-white"
                        {...pulseAnimation}
                      >
                        {formatTime(timeLeft.days)}
                      </motion.span>
                    </AnimatePresence>

                    {/* Number reflections */}
                    <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
                  </div>
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#950505] dark:bg-[#ff6b6b]"></div>
                </div>
                <span className="block text-xs uppercase tracking-wider mt-1 opacity-80">
                  Days
                </span>
              </motion.div>

              {/* Hours */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center"
              >
                <div className="relative flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-black dark:bg-black flex items-center justify-center overflow-hidden relative">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={timeLeft.hours}
                        variants={digitVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="text-2xl sm:text-3xl font-mono font-bold text-white"
                        {...pulseAnimation}
                      >
                        {formatTime(timeLeft.hours)}
                      </motion.span>
                    </AnimatePresence>

                    {/* Number reflections */}
                    <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
                  </div>
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#950505] dark:bg-[#ff6b6b]"></div>
                </div>
                <span className="block text-xs uppercase tracking-wider mt-1 opacity-80">
                  Hours
                </span>
              </motion.div>

              {/* Minutes */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center"
              >
                <div className="relative flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-black dark:bg-black flex items-center justify-center overflow-hidden relative">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={timeLeft.minutes}
                        variants={digitVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="text-2xl sm:text-3xl font-mono font-bold text-white"
                        {...pulseAnimation}
                      >
                        {formatTime(timeLeft.minutes)}
                      </motion.span>
                    </AnimatePresence>

                    {/* Number reflections */}
                    <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
                  </div>
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#950505] dark:bg-[#ff6b6b]"></div>
                </div>
                <span className="block text-xs uppercase tracking-wider mt-1 opacity-80">
                  Minutes
                </span>
              </motion.div>

              {/* Seconds with circular background */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center"
              >
                <div className="relative flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                    {/* Circular progress */}
                    <div
                      className="absolute inset-0 rounded-full p-0.5"
                      style={borderStyle}
                    >
                      <div className="w-full h-full rounded-full bg-black dark:bg-black flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={timeLeft.seconds}
                            variants={digitVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="text-2xl sm:text-3xl font-mono font-bold text-white"
                            {...pulseAnimation}
                          >
                            {formatTime(timeLeft.seconds)}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Status indicator */}
            {timeStatus === "critical" && (
              <motion.div
                className="mt-3 text-center"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <span className="text-xs font-semibold bg-red-500/20 text-white px-3 py-1 rounded-full">
                  Starting very soon!
                </span>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Countdown;
