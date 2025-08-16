import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import TopBar from "./components/layout/TopBar";
import HomePage from "./pages/HomePage";
import SchedulePage from "./pages/SchedulePage";
import DriverStandingsPage from "./pages/DriverStandingsPage";
import ConstructorStandingsPage from "./pages/ConstructorStandingsPage";
import RaceResultsPage from "./pages/RaceResultsPage";
import CircuitsPage from "./pages/CircuitsPage";
import CircuitDetailPage from "./pages/CircuitDetailPage";
import { getDriverInfo } from "./services/api";

function App() {
  const [driverInfoList, setDriverInfoList] = useState([]);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(true);


  // Fetch driver data
  useEffect(() => {
    const fetchDrivers = async () => {
      setIsLoadingDrivers(true);
      const drivers = await getDriverInfo();
      setDriverInfoList(drivers || []);
      setIsLoadingDrivers(false);
    };
    fetchDrivers();
  }, []);

  // Create driver info map
  const driverInfoMap = React.useMemo(() => {
    const map = new Map();
    driverInfoList.forEach((driver) => {
      if (driver.name_acronym) {
        map.set(driver.name_acronym, driver);
      }
    });
    return map;
  }, [driverInfoList]);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-black text-black dark:text-white">
      <TopBar />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                driverInfoMap={driverInfoMap}
                isLoadingDrivers={isLoadingDrivers}
              />
            }
          />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route
            path="/standings/drivers"
            element={
              <DriverStandingsPage
                driverInfoMap={driverInfoMap}
                isLoadingDrivers={isLoadingDrivers}
              />
            }
          />
          <Route
            path="/standings/constructors"
            element={<ConstructorStandingsPage />}
          />
          <Route
            path="/results/:year/:round"
            element={
              <RaceResultsPage
                driverInfoMap={driverInfoMap}
                isLoadingDrivers={isLoadingDrivers}
              />
            }
          />
          <Route path="/circuits" element={<CircuitsPage />} />
          <Route
            path="/circuits/:circuitId"
            element={<CircuitDetailPage />}
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
