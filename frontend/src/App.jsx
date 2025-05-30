import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import SchedulePage from "./pages/SchedulePage";
import DriverStandingsPage from "./pages/DriverStandingsPage";
import ConstructorStandingsPage from "./pages/ConstructorStandingsPage";
import RaceResultsPage from "./pages/RaceResultsPage";
import CircuitsPage from "./pages/CircuitsPage";
import CircuitDetailPage from "./pages/CircuitDetailPage";
import { getDriverInfo } from "./services/api";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState("Home");
  const [driverInfoList, setDriverInfoList] = useState([]);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(true);

  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  // Toggle sidebar function
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

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

  // Update page title based on route
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setPageTitle("Landing Page");
    else if (path.startsWith("/home")) setPageTitle("Home");
    else if (path.startsWith("/schedule")) setPageTitle("Schedule");
    else if (path.startsWith("/standings/drivers"))
      setPageTitle("Driver Standings");
    else if (path.startsWith("/standings/constructors"))
      setPageTitle("Constructor Standings");
    else if (path.startsWith("/circuits")) setPageTitle("Circuits");
    else if (path.startsWith("/results")) setPageTitle("Race Results");
    else setPageTitle("Purple Sector");
  }, [location.pathname]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false); // Reset to collapsed on desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {!isLandingPage && (
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}

      <div
        className={`flex flex-col flex-1 transition-all duration-300 ease-in-out ${
          isLandingPage ? "" : "md:ml-16" // Always account for collapsed sidebar on desktop
        }`}
      >
        {!isLandingPage && (
          <TopBar
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            title={pageTitle}
          />
        )}

        <main
          className={`flex-1 overflow-y-auto ${
            isLandingPage ? "" : "p-4 md:p-6 bg-purple-brand"
          }`}
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/home"
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
    </div>
  );
}

export default App;
