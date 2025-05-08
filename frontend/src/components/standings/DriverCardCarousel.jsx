// src/components/standings/DriverCardCarousel.jsx
import React from "react";
import { useKeenSlider } from "keen-slider/react";
import DriverCard from "./DriverCard"; // Import the single card component
import "keen-slider/keen-slider.min.css"; // Ensure CSS is imported

function DriverCardCarousel({ driverStandings }) {
  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 1.2, // Show parts of next/prev cards
      spacing: 15,
    },
    breakpoints: {
      // Adjust perView based on screen size
      "(min-width: 480px)": { slides: { perView: 1.5, spacing: 15 } },
      "(min-width: 640px)": { slides: { perView: 2.5, spacing: 20 } },
      // Removed LG/XL breakpoints as this view might be mobile-first
    },
  });

  if (!driverStandings || driverStandings.length === 0) {
    return <p className="p-4 text-center">No standings data for cards.</p>;
  }

  return (
    // Added padding for carousel visibility
    <div ref={sliderRef} className="keen-slider mt-6 px-4 py-4">
      {driverStandings.map((standing) => (
        <div
          key={standing.driver?.driverId || standing.position}
          className="keen-slider__slide"
        >
          {/* Render the individual card component */}
          <DriverCard standing={standing} />
        </div>
      ))}
    </div>
  );
}

export default DriverCardCarousel;
