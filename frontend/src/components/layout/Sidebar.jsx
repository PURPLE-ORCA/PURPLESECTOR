// src/components/layout/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const sidebarClasses = `
     w-42 bg-[#950505] p-4 flex-shrink-0 overflow-y-auto flex flex-col h-full
    border-r border-red-800
    md:flex
  `;

  const linkBaseClasses =
    "block py-2 px-3 rounded transition-colors duration-150 font-medium";
  // Text on black needs to be light
  const linkInactiveClasses =
    "text-gray-300 hover:bg-red-accent hover:text-white"; // Hover with red accent
  const linkActiveClass = "bg-red-accent text-white font-semibold";

  return (
    <div className={sidebarClasses}>
      <div className="mb-10 pt-4">
        <NavLink to="/" className="block">
          {/* Use purple for the main brand title */}
          <h1 className="text-3xl font-bold text-gray-100 text-center hover:text-red-accent transition-colors">
            Purple Sector
          </h1>
        </NavLink>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-1">
          {/* Apply NavLink classes */}
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${linkBaseClasses} ${isActive ? linkActiveClass : linkInactiveClasses}`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/schedule"
              className={({ isActive }) =>
                `${linkBaseClasses} ${isActive ? linkActiveClass : linkInactiveClasses}`
              }
            >
              Schedule
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/standings/drivers"
              className={({ isActive }) =>
                `${linkBaseClasses} ${isActive ? linkActiveClass : linkInactiveClasses}`
              }
            >
              Drivers
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/standings/constructors"
              className={({ isActive }) =>
                `${linkBaseClasses} ${isActive ? linkActiveClass : linkInactiveClasses}`
              }
            >
              Constructors
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/circuits"
              className={({ isActive }) =>
                `${linkBaseClasses} ${isActive ? linkActiveClass : linkInactiveClasses}`
              }
            >
              Circuits
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="mt-auto pb-4">
        <button className="w-full text-left py-2 px-3 rounded text-sm text-gray-500 hover:bg-gray-700 hover:text-gray-300">
          {" "}
          {/* Dimmer settings text */}
          Settings (placeholder)
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
