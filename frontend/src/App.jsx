// src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SchedulePage from "./pages/SchedulePage";
import DriverStandingsPage from "./services/DriverStandingsPage";
// Import other pages later

function App() {
  return (
    <div className="flex h-screen bg-black text-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 p-4 hidden md:block flex-shrink-0 overflow-y-auto">
        {" "}
        {/* Keep responsive hiding for now */}
        <h1 className="text-2xl font-bold text-purple-brand mb-6">
          Purple Sector
        </h1>
        <nav>
          <ul>
            <li className="mb-2">
              <Link
                to="/"
                className="block py-1 px-2 rounded hover:bg-gray-700 hover:text-red-accent transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/schedule"
                className="block py-1 px-2 rounded hover:bg-gray-700 hover:text-red-accent transition-colors"
              >
                Schedule
              </Link>
            </li>
            {/* Add Drivers Link */}
            <li className="mb-2">
              <Link
                to="/standings/drivers"
                className="block py-1 px-2 rounded hover:bg-gray-700 hover:text-red-accent transition-colors"
              >
                Drivers
              </Link>
            </li>
            {/* <li className="mb-2"><Link to="/standings/constructors" className="block py-1 px-2 rounded hover:bg-gray-700 hover:text-red-accent transition-colors">Constructors</Link></li> */}
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          {/* Add Driver Standings Route */}
          <Route path="/standings/drivers" element={<DriverStandingsPage />} />
          {/* Add other routes later */}
          {/* <Route path="/standings/constructors" element={<ConstructorStandingsPage />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
