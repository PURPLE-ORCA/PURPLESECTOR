// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage"; 
function App() {
  return (
    <div className="flex h-screen bg-black text-gray-100">
      <div className="w-64 bg-gray-900 p-4 hidden md:block">
        {" "}
        <h1 className="text-2xl font-bold text-purple-brand mb-6">
          Purple Sector
        </h1>
        <nav>
          <ul>
            <li className="mb-2">
              <a href="/" className="hover:text-red-accent">
                Home
              </a>
            </li>
            <li className="mb-2">
              <a href="/schedule" className="hover:text-red-accent">
                Schedule
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <main className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
