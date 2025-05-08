// src/components/schedule/CalendarView.jsx
import React, { useState, useEffect, useRef } from "react";
import { useKeenSlider } from "keen-slider/react";
import RaceCard from "./RaceCard"; // We'll create this
import { Icon } from "@iconify/react";
import "keen-slider/keen-slider.min.css";
import { getMonthAndYear } from "../../utils/helpers"; // Assuming getMonthAndYear is here now

function CalendarView({ groupedRaces }) {
const monthsList = Object.keys(groupedRaces);
const calculateInitialMonth = () => {
  const now = new Date();
  let month = monthsList[0]; // Default to first available
  for (const m of monthsList) {
    const hasUpcoming = groupedRaces[m].some(
      (race) =>
        race.schedule?.race?.date &&
        new Date(
          `${race.schedule.race.date}T${race.schedule.race.time || "00:00:00Z"}`
        ) >= now
    );
    if (hasUpcoming) {
      month = m;
      break;
    }
  }
  return month;
};
const initialMonth = calculateInitialMonth();
const initialIndex = monthsList.indexOf(initialMonth);

const [activeMonth, setActiveMonth] = useState(initialMonth); // Initialize state directly

const [sliderRef, instanceRef] = useKeenSlider({
  // Initial slide set here
  initial: initialIndex >= 0 ? initialIndex : 0,
  slides: { perView: 1, spacing: 16 },
  slideChanged(slider) {
    // Get keys directly from props
    const currentMonthKeys = Object.keys(groupedRaces);
    const currentAbsIndex = slider.track.details.abs;
    if (currentMonthKeys.length > currentAbsIndex) {
      setActiveMonth(currentMonthKeys[currentAbsIndex]);
    }
  },
});
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6 px-2">
        <button
          onClick={() => instanceRef.current?.prev()}
          className="..."
          aria-label="Previous month"
        >
          {" "}
          <Icon icon="mdi:chevron-left" className="w-8 h-8 text-red-500" />{" "}
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          {activeMonth || "Loading Month..."}
        </h2>
        <button
          onClick={() => instanceRef.current?.next()}
          className="..."
          aria-label="Next month"
        >
          {" "}
          <Icon
            icon="mdi:chevron-right"
            className="w-8 h-8 text-red-500"
          />{" "}
        </button>
      </div>

      <div ref={sliderRef} className="keen-slider -mx-2 sm:-mx-0">
        {Object.entries(groupedRaces).map(([monthYear, races]) => (
          <div key={monthYear} className="keen-slider__slide px-2 sm:px-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {races.map((race) => (
                <RaceCard key={race.raceId || race.round} race={race} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarView;
