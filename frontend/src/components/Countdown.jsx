// src/components/Countdown.jsx
import React, { useState, useEffect } from "react";
import { parseISO, differenceInMilliseconds } from "date-fns"; // Use date-fns for reliable parsing

function Countdown({ targetTimeUTC }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isPassed, setIsPassed] = useState(false);

  useEffect(() => {
    // Ensure targetTimeUTC is valid before proceeding
    if (!targetTimeUTC) {
      // console.warn("Countdown target time is not provided.");
      setIsPassed(true); // Treat missing time as passed/invalid
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
      setIsPassed(true); // Treat invalid date as passed
      return; // Stop effect if date is invalid
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = differenceInMilliseconds(targetDate, now);

      let newTimeLeft = {};
      let passed = false;

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      } else {
        // Time is up or has passed
        passed = true;
        newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      setTimeLeft(newTimeLeft);
      setIsPassed(passed);

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

  return (
    <div className="text-center p-4 bg-gray-700 rounded-lg shadow-inner mt-4">
      {isPassed ? (
        <span className="text-2xl font-bold text-red-accent animate-pulse">
          Session Live / Passed!
        </span>
      ) : (
        <div className="flex justify-center space-x-4 text-gray-100">
          <div>
            <span className="text-4xl font-mono font-bold">
              {formatTime(timeLeft.days)}
            </span>
            <span className="block text-xs uppercase text-gray-400">Days</span>
          </div>
          <div>
            <span className="text-4xl font-mono font-bold">
              {formatTime(timeLeft.hours)}
            </span>
            <span className="block text-xs uppercase text-gray-400">Hours</span>
          </div>
          <div>
            <span className="text-4xl font-mono font-bold">
              {formatTime(timeLeft.minutes)}
            </span>
            <span className="block text-xs uppercase text-gray-400">
              Minutes
            </span>
          </div>
          <div>
            <span className="text-4xl font-mono font-bold">
              {formatTime(timeLeft.seconds)}
            </span>
            <span className="block text-xs uppercase text-gray-400">
              Seconds
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Countdown;
