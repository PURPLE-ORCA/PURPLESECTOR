import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="flex h-screen bg-white dark:bg-black text-black dark:text-white">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar toggleSidebar={toggleSidebar} />
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
