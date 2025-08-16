import React, { useState, useEffect, useRef } from 'react'; // Added useRef
import { parseISO, differenceInMilliseconds } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Flag, AlertTriangle } from 'lucide-react'; // Assuming these are for your styling
import { Icon } from '@iconify/react'; // For the "Starting Soon" icon

function Countdown({ targetTimeUTC }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [timeStatus, setTimeStatus] = useState("loading"); // 'loading', 'future', 'soon', 'critical', 'passed', 'invalid'
  const intervalRef = useRef(null); // Use a ref for the interval ID

  useEffect(() => {
    // Clear any existing interval when targetTimeUTC changes or component unmounts
    const clearTimer = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (!targetTimeUTC) {
      setTimeStatus("invalid");
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      clearTimer();
      return;
    }

    let targetDate;
    try {
      targetDate = parseISO(targetTimeUTC);
      if (isNaN(targetDate)) throw new Error("Invalid date");
    } catch (error) {
      console.error("Error parsing targetTimeUTC:", targetTimeUTC, error);
      setTimeStatus("invalid");
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      clearTimer();
      return;
    }

    const calculateState = () => {
      const now = new Date();
      const difference = differenceInMilliseconds(targetDate, now);

      if (difference <= 0) { // Time has passed or is exactly now
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setTimeStatus("passed");
        clearTimer(); // Stop the interval
        return;
      }

      // Time is still in the future
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });

      const totalHours = difference / (1000 * 60 * 60);
      if (totalHours <= 1) { // Let's use 1 hour for critical, adjust as needed
        setTimeStatus("critical");
      } else if (totalHours <= 24) {
        setTimeStatus("soon");
      } else {
        setTimeStatus("future");
      }
    };

    calculateState(); // Initial calculation

    // Only set interval if not already passed or invalid
    if (timeStatus !== "passed" && timeStatus !== "invalid" && timeStatus !== "loading") {
        // Clear previous interval before setting a new one, if any
        clearTimer(); 
        intervalRef.current = setInterval(calculateState, 1000);
    }
    
    // Cleanup function
    return clearTimer;

  }, [targetTimeUTC, timeStatus]); // Re-run if targetTimeUTC changes or if status becomes 'passed' to ensure timer stops

  const formatTime = (value) => String(value).padStart(2, '0');
  
  // --- Styles and Animations (Keep your existing ones) ---
  const getContainerStyles = () => { return {}; };
  const containerVariants = {};
  const itemVariants = {};
  const digitVariants = {};
  const pulseAnimation = timeStatus === "critical" ? {} : {};
  const secondsProgress = (60 - timeLeft.seconds) / 60;
  const borderStyle = timeStatus === 'passed' ? {} : {};

  // --- Render Logic ---
  if (timeStatus === "loading") { // Optional initial loading state for the countdown itself
    return <div className="p-4 text-center text-gray-400 dark:text-gray-600">Initializing countdown...</div>;
  }

  if (timeStatus === "invalid") {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible"
        className={`rounded-xl shadow-lg overflow-hidden ${getContainerStyles()}`}>
        <div className="p-4 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" />
          <span className="font-medium">Invalid Target Time</span>
        </div>
      </motion.div>
    );
  }

  if (timeStatus === "passed") {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible"
        className={`rounded-xl shadow-lg overflow-hidden ${getContainerStyles()}`}>
        <motion.div
          className="p-4 flex items-center justify-center"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Flag className="w-5 h-5 mr-2" />
          <span className="text-lg font-bold">SESSION LIVE / FINISHED</span>
        </motion.div>
      </motion.div>
    );
  }
  
  // Render "Starting Soon" or "Full Countdown"
  return (
    <motion.div
      variants={containerVariants} initial="hidden" animate="visible"
      className={`rounded-xl shadow-lg overflow-hidden ${getContainerStyles()}`}
    >
      <div className="relative"> {/* Your main countdown structure */}
        {timeStatus === "critical" && ( <></> )}
        <div className="p-3 sm:p-4">
          <div className="flex items-center justify-center mb-2">
             <Icon icon="mdi:clock-fast" className="w-4 h-4 mr-1.5 text-[#950505] dark:text-[#ff6b6b]" />
            <span className="text-xs font-medium uppercase tracking-wider">
              {timeStatus === "critical" ? "Starting Very Soon!" : timeStatus === "soon" ? "Coming Up" : "Race Countdown"}
            </span>
          </div>
          <div className="flex justify-center space-x-2 sm:space-x-3">
            {/* Days (conditionally rendered) */}
            {(timeStatus === 'future' || timeLeft.days > 0) && ( // Show days if status is 'future' or days > 0
                 <motion.div variants={itemVariants} className="flex flex-col items-center">
                    <div className="relative flex flex-col items-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-black dark:bg-black flex items-center justify-center overflow-hidden relative">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={`days-${timeLeft.days}`} // Unique key
                            variants={digitVariants} initial="initial" animate="animate" exit="exit"
                            className="text-2xl sm:text-3xl font-mono font-bold text-white"
                            {...pulseAnimation}
                          >
                            {formatTime(timeLeft.days)}
                          </motion.span>
                        </AnimatePresence>
                        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
                      </div>
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#950505] dark:bg-[#ff6b6b]"></div>
                    </div>
                    <span className="block text-xs uppercase tracking-wider mt-1 opacity-80">Days</span>
                 </motion.div>
            )}
            {/* Hours */}
            <motion.div variants={itemVariants} className="flex flex-col items-center">
               <div className="relative flex flex-col items-center">
                 <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-black dark:bg-black flex items-center justify-center overflow-hidden relative">
                   <AnimatePresence mode="wait">
                     <motion.span
                       key={`hours-${timeLeft.hours}`} // Unique key
                       variants={digitVariants} initial="initial" animate="animate" exit="exit"
                       className="text-2xl sm:text-3xl font-mono font-bold text-white"
                       {...pulseAnimation}
                     >
                       {formatTime(timeLeft.hours)}
                     </motion.span>
                   </AnimatePresence>
                   <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
                 </div>
                 <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#950505] dark:bg-[#ff6b6b]"></div>
               </div>
               <span className="block text-xs uppercase tracking-wider mt-1 opacity-80">Hours</span>
            </motion.div>
            {/* Minutes */}
            <motion.div variants={itemVariants} className="flex flex-col items-center">
                <div className="relative flex flex-col items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-black dark:bg-black flex items-center justify-center overflow-hidden relative">
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={`minutes-${timeLeft.minutes}`} // Unique key
                                variants={digitVariants} initial="initial" animate="animate" exit="exit"
                                className="text-2xl sm:text-3xl font-mono font-bold text-white"
                                {...pulseAnimation}
                            >
                                {formatTime(timeLeft.minutes)}
                            </motion.span>
                        </AnimatePresence>
                        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-gray-900/20 to-transparent"></div>
                    </div>
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#950505] dark:bg-[#ff6b6b]"></div>
                </div>
                <span className="block text-xs uppercase tracking-wider mt-1 opacity-80">Minutes</span>
            </motion.div>
            {/* Seconds */}
            <motion.div variants={itemVariants} className="flex flex-col items-center">
                <div className="relative flex flex-col items-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full p-0.5" style={borderStyle}>
                            <div className="w-full h-full rounded-full bg-black dark:bg-black flex items-center justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={`seconds-${timeLeft.seconds}`} // Unique key
                                        variants={digitVariants} initial="initial" animate="animate" exit="exit"
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
                 {/* Add label for seconds if you want it consistent with others, otherwise the circle is just for seconds digits */}
                 <span className="block text-xs uppercase tracking-wider mt-1 opacity-80">Seconds</span>
            </motion.div>
          </div>
          {timeStatus === "critical" && ( <></> )}
        </div>
      </div>
    </motion.div>
  );
}
export default Countdown;
