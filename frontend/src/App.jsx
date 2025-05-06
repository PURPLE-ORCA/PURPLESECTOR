import React from "react";
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
  return (
    <div className="flex h-screen bg-black text-gray-100">
      {" "}
      {/* Was bg-gray-900 */}
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />

        {/* Page Content Area - Let's make this our PURPLE BRAND */}
        <main className="flex-1 p-6 overflow-y-auto bg-purple-brand">
          {" "}
          {/* Was bg-gray-800 */}
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
