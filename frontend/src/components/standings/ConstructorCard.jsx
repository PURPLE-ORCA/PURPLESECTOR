import React from "react";
import { motion } from "framer-motion";
import { getTeamColorClass } from "../../utils/teamColors";
import { podiumItemVariants } from "../../utils/animations";
function ConstructorCard({ standing }) {
  if (!standing || !standing.team) {
    return (
      <div className="keen-slider__slide p-4 text-xs text-red-500">
        Invalid standing data
      </div>
    );
  }

  const team = standing.team;
  const teamId = standing.teamId;
  const defaultLogoPath = "/images/teams/default.svg";
  const teamLogoUrl = teamId ? `/images/teams/${teamId}.svg` : defaultLogoPath;
  const carImageUrl = teamId
    ? `/images/cars/${teamId}.jpg`
    : "/images/cars/default.jpg";

  return (
    <motion.div
      variants={podiumItemVariants}
      className="relative rounded-xl overflow-hidden shadow-lg h-full flex flex-col justify-between border border-gray-200 dark:border-gray-800 group transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Background Image with blur */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-md brightness-50 transition duration-300 group-hover:blur-none group-hover:brightness-75"
        style={{ backgroundImage: `url(${carImageUrl})` }}
      ></div>

      {/* Overlay content */}
      <div className="relative z-10 p-4 h-full flex flex-col justify-between text-white">
        {/* Team color bar */}
        <div
          className={`h-2 w-full ${getTeamColorClass(team.teamName)} mb-4`}
        />

        {/* Position and Points */}
        <div className="flex justify-between items-start">
          <div
            className={`text-2xl font-bold ${standing.position <= 3 ? "text-red-400" : "text-white"}`}
          >
            {standing.position}
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">{standing.points} pts</div>
            {standing.wins > 0 && (
              <div className="text-xs text-gray-300">{standing.wins} wins</div>
            )}
          </div>
        </div>

        {/* Team Logo and Info */}
        <div className="flex-grow flex flex-col justify-center items-center mt-4 mb-2">
          <div className="w-20 h-16 mb-3">
            <img
              src={teamLogoUrl}
              alt={`${team.teamName || "Team"} Logo`}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultLogoPath;
              }}
            />
          </div>
          <h4 className="font-semibold text-base truncate w-full text-center">
            {team.teamName}
          </h4>
          <p className="text-xs text-gray-300">{team.country}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default ConstructorCard;
