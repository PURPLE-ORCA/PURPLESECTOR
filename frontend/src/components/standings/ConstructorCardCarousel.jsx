// src/components/standings/ConstructorCardCarousel.jsx
import React from "react";
import { useKeenSlider } from "keen-slider/react";
import ConstructorCard from "./ConstructorCard";
import "keen-slider/keen-slider.min.css";

function ConstructorCardCarousel({ constructorStandings }) {
  const [sliderRef] = useKeenSlider({
    slides: { perView: 1.2, spacing: 15 },
    breakpoints: {
      /* ... */
    },
  });

  if (!constructorStandings || constructorStandings.length === 0) {
    return <p className="p-4 text-center">No standings data for cards.</p>;
  }

  return (
    <div ref={sliderRef} className="keen-slider mt-6 px-4 py-4">
      {constructorStandings.map((standing) => (
        <div
          key={standing.team?.teamId || standing.position}
          className="keen-slider__slide h-full"
        >
          <ConstructorCard standing={standing} />
        </div>
      ))}
    </div>
  );
}
export default ConstructorCardCarousel;
