import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import HomePage from "./pages/HomePage";
import SchedulePage from "./pages/SchedulePage";
import DriverStandingsPage from "./pages/DriverStandingsPage";
import ConstructorStandingsPage from "./pages/ConstructorStandingsPage";
import RaceResultsPage from "./pages/RaceResultsPage";
import CircuitsPage from "./pages/CircuitsPage";
import CircuitDetailPage from "./pages/CircuitDetailPage";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const [pageTitle, setPageTitle] = useState("Home"); // Add state for title
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    // Basic title mapping based on path start
    if (path === "/") setPageTitle("Home");
    else if (path.startsWith("/schedule")) setPageTitle("Schedule");
    else if (path.startsWith("/standings/drivers"))
      setPageTitle("Driver Standings");
    else if (path.startsWith("/standings/constructors"))
      setPageTitle("Constructor Standings");
    else if (path.startsWith("/circuits")) setPageTitle("Circuits");
    else if (path.startsWith("/results"))
      setPageTitle("Race Results"); // Could be more specific later
    else setPageTitle("Purple Sector"); // Default
  }, [location.pathname]); 

  return (
    <div className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`flex flex-col flex-1 transition-all overflow-hidden duration-300 ease-in-out `}
      >
        <TopBar
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          title={pageTitle}
        />
        <main className="flex-1 p-6 overflow-y-auto bg-purple-brand">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route
              path="/standings/drivers"
              element={<DriverStandingsPage />}
            />
            <Route
              path="/standings/constructors"
              element={<ConstructorStandingsPage />}
            />
            <Route path="/results/:year/:round" element={<RaceResultsPage />} />
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
