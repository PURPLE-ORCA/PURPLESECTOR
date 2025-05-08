// src/components/standings/DriverCardCarousel.jsx
import React from "react";
import { useKeenSlider } from "keen-slider/react";
import DriverCard from "./DriverCard";
import "keen-slider/keen-slider.min.css";

function DriverCardCarousel({ driverStandings, driverInfoMap }) {
  const [sliderRef] = useKeenSlider({
    slides: { perView: 1.2, spacing: 15 },
    breakpoints: {
      "(min-width: 480px)": { slides: { perView: 1.5, spacing: 15 } },
      "(min-width: 640px)": { slides: { perView: 2.5, spacing: 20 } },
      "(min-width: 1024px)": { slides: { perView: 3.5, spacing: 25 } }, // Added LG breakpoint
    },
  });

  if (!driverStandings || driverStandings.length === 0) {
    return (
      <p className="p-4 text-center text-gray-500 dark:text-gray-400">
        No standings data for cards.
      </p>
    );
  }
  // Check map validity here too
  if (!driverInfoMap || driverInfoMap.size === 0) {
    console.warn("DriverCardCarousel received empty/invalid driverInfoMap.");
    // Decide: render cards without headshots or show error? Let's allow rendering.
  }

  return (
    // Added padding for carousel visibility
    <div ref={sliderRef} className="keen-slider py-4">
      {" "}
      {/* Removed px, Added py */}
      {driverStandings.map((standing) => {
        // --- Find driver info here ---
        const driverAcr = standing.driver?.shortName;
        // Use the map passed as a prop (handle case where map might still be empty)
        const driverInfo =
          driverInfoMap && driverAcr ? driverInfoMap.get(driverAcr) : null;
        // --- End find driver info ---

        return (
          // Added h-full to ensure slides take height
          <div
            key={standing.driver?.driverId || standing.position}
            className="keen-slider__slide h-full px-1.5"
          >
            {" "}
            {/* Added horizontal padding */}
            {/* Pass BOTH standing AND the found driverInfo */}
            <DriverCard standing={standing} driverInfo={driverInfo} />
          </div>
        );
      })}
    </div>
  );
}
export default DriverCardCarousel;
