import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getRaceResults } from '../services/api';
import { Trophy, MapPin, ChevronRight } from 'lucide-react';
import PodiumDisplay from '@/components/standings/PodiumDisplay';
import DataTable from '../components/ui/DataTable';

function RaceResultsPage({ driverInfoMap, isLoadingDrivers }) {
  const { year, round } = useParams();
  const [raceData, setRaceData] = useState(null);
  const [isLoadingResults, setIsLoadingResults] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('results');

  useEffect(() => {
    if (year && round) {
      const fetchResults = async () => {
        setIsLoadingResults(true);
        setError(null);
        try {
          const data = await getRaceResults(year, round);
          if (
            data &&
            (Array.isArray(data.results) ||
              (data.races && Array.isArray(data.races.results)))
          ) {
            setRaceData(data);
          } else {
            setError(
              `Could not load race results for ${year} Round ${round}. API returned invalid data.`
            );
            setRaceData(null);
          }
        } catch (err) {
          console.error(
            `Unexpected error fetching race results for ${year} R${round}:`,
            err
          );
          setError('An error occurred while loading race results.');
          setRaceData(null);
        } finally {
          setIsLoadingResults(false);
        }
      };
      fetchResults();
    } else {
      setError('Year and round parameters are missing.');
      setIsLoadingResults(false);
    }
  }, [year, round]);

  if (isLoadingResults || isLoadingDrivers) {
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-400">
        Loading results...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center text-red-500 dark:text-red-400">
        {error}
      </div>
    );
  }
  if (!driverInfoMap || driverInfoMap.size === 0) {
    console.error('RaceResultsPage received empty/invalid driverInfoMap.');
    return (
      <div className="p-10 text-center text-red-500 dark:text-red-400">
        Error: Missing driver details map.
      </div>
    );
  }
  if (!raceData) {
    return (
      <div className="p-10 text-center text-gray-500 dark:text-gray-400">{`No race data found for ${year} Round ${round}.`}</div>
    );
  }

  const isF1ApiStructure =
    typeof raceData.races === 'object' && raceData.races !== null;
  const season = raceData.season;
  const currentRound = isF1ApiStructure ? raceData.races.round : raceData.round;
  const raceName = isF1ApiStructure
    ? raceData.races.raceName
    : raceData.raceName;
  const circuit = isF1ApiStructure ? raceData.races.circuit : raceData.circuit;
  const results = isF1ApiStructure ? raceData.races.results : raceData.results;

  if (!Array.isArray(results)) {
    return (
      <div className="p-10 text-center text-red-500 dark:text-red-400">
        Error: Invalid results data format.
      </div>
    );
  }

  const podiumDrivers = results.filter((r) => parseInt(r.position) <= 3);

  const headers = [
    { key: 'pos', label: 'Pos', className: 'text-center w-12' },
    { key: 'driver', label: 'Driver' },
    { key: 'team', label: 'Team' },
    { key: 'timeStatus', label: 'Time/Status' },
    { key: 'points', label: 'Points', className: 'text-center w-16' },
  ];

  const renderRow = (result) => {
    const defaultDriverImage = '/images/drivers/default.png';
    const defaultTeamLogo = '/images/teams/default.svg';

    const driverAcr = result.driver?.shortName || result.Driver?.code;
    const driverInfo =
      driverInfoMap && driverAcr ? driverInfoMap.get(driverAcr) : null;
    const headshotUrl = driverInfo?.headshot_url || defaultDriverImage;
    const driverFullName =
      driverInfo?.full_name ||
      `${result.Driver?.givenName || result.driver?.name || ''} ${result.Driver?.familyName || result.driver?.surname || ''}`.trim();

    const teamName =
      result.team?.teamName || result.Constructor?.name || 'N/A';
    const teamId = result.team?.teamId || result.Constructor?.constructorId;
    const teamLogoUrl = teamId ? `/images/teams/${teamId}.svg` : defaultTeamLogo;

    return (
      <>
        {/* Position */}
        <td className="px-4 py-3 text-center font-bold text-foreground">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${result.position === '1' ? 'bg-yellow-400 text-black' : result.position === '2' ? 'bg-gray-300 text-black dark:bg-gray-500 dark:text-white' : result.position === '3' ? 'bg-yellow-700 text-white' : 'text-foreground'}`}
          >
            {result.position}
          </div>
        </td>
        {/* Driver */}
        <td className="px-4 py-3">
          <div className="flex items-center">
            <img
              src={headshotUrl}
              alt={driverFullName}
              className="w-9 h-9 rounded-full mr-4 object-cover flex-shrink-0 bg-gray-200 dark:bg-gray-700"
              onError={(e) => {
                if (e.target.src !== defaultDriverImage) {
                  e.target.onerror = null;
                  e.target.src = defaultDriverImage;
                }
              }}
            />
            <div>
              <div className="font-semibold text-foreground">
                {driverFullName || 'Driver'}
              </div>
              <div className="text-xs text-muted-foreground">
                {driverAcr || 'N/A'}
              </div>
            </div>
          </div>
        </td>
        {/* Team */}
        <td className="px-4 py-3">
          <img
            src={teamLogoUrl}
            alt={`${teamName} Logo`}
            title={teamName}
            className="h-6 w-auto object-contain"
            onError={(e) => {
              if (e.target.src !== defaultTeamLogo) {
                e.target.onerror = null;
                e.target.src = defaultTeamLogo;
              }
            }}
          />
        </td>
        {/* Time/Status */}
        <td className="px-4 py-3 text-muted-foreground">
          {result.time || result.status || ''}
        </td>
        {/* Points */}
        <td className="px-4 py-3 text-center font-bold text-primary dark:text-purple-400">
          {result.points}
        </td>
      </>
    );
  };

  const variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

  return (
    <div className="px-2 py-2 sm:px-6 lg:px-8 text-foreground">
      {/* Race Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary dark:text-purple-400 mb-1">
              {raceName || "Race Results"}
            </h1>
            <h2 className="text-lg md:text-xl font-semibold text-muted-foreground mt-1">
              Round {currentRound}{" "}
              <span className="text-muted-foreground font-normal">
                | {season}
              </span>
            </h2>
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
              <div className="flex items-center text-muted-foreground">
                <MapPin size={16} className="mr-2 flex-shrink-0" />
                <span>
                  {circuit?.circuitName},{" "}
                  {circuit?.Location?.locality || circuit?.city}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8 ">
        <div className="flex space-x-4 border-b border-primary dark:border-purple-400">
          <button
            onClick={() => setSelectedTab("results")}
            className={`py-2 px-4 font-medium transition-colors relative ${selectedTab === "results" ? "text-primary dark:text-purple-400" : "text-muted-foreground hover:text-foreground"}`}
          >
            Results
            {selectedTab === "results" && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary dark:bg-purple-400"
              />
            )}
          </button>
          <button
            onClick={() => setSelectedTab("podium")}
            className={`py-2 px-4 font-medium transition-colors relative ${selectedTab === "podium" ? "text-primary dark:text-purple-400" : "text-muted-foreground hover:text-foreground"}`}
          >
            Podium
            {selectedTab === "podium" && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary dark:bg-purple-400"
              />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedTab === "results" ? (
          <motion.div
            key="results"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            <DataTable
              headers={headers}
              data={results}
              renderRow={renderRow}
              keyField="position"
            />
          </motion.div>
        ) : (
          <motion.div
            key="podium"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={variants}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white dark:bg-black rounded-xl overflow-hidden shadow-lg p-6 border border-border">
              <h3 className="text-2xl font-bold text-center mb-8 text-foreground flex items-center justify-center">
                <Trophy
                  className="text-primary dark:text-purple-400 mr-2"
                  size={24}
                />{" "}
                Race Podium
              </h3>
              {podiumDrivers.length >= 3 ? (
                <PodiumDisplay
                  top3={podiumDrivers}
                  driverInfoMap={driverInfoMap}
                />
              ) : (
                <div className="text-center text-muted-foreground py-10">
                  Not enough finishers for full podium display.
                </div>
              )}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => setSelectedTab("results")}
                  className="px-4 py-2 bg-white dark:bg-black text-white rounded-md transition-colors duration-300 flex items-center text-sm"
                >
                  <ChevronRight
                    size={16}
                    className="mr-1 transform rotate-180"
                  />
                  View Full Results Table
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RaceResultsPage;
