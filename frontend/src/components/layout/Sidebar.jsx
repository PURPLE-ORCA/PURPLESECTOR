import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar({ isOpen }) {
  const sidebarClasses = `
    transition-all duration-300
    ${isOpen ? "w-60" : "w-0"}
    bg-[#950505] p-4 flex-shrink-0 overflow-y-auto flex flex-col h-full
    border-r border-red-800
  `;

  const linkBaseClasses =
    "block py-2 px-3 rounded transition-colors duration-150 font-medium whitespace-nowrap";
  const linkInactiveClasses =
    "text-gray-300 hover:bg-red-accent hover:text-white";
  const linkActiveClass = "bg-red-accent text-white font-semibold";

  return (
    <div className={sidebarClasses}>
      {/* Hide content when collapsed */}
      <div className={`${isOpen ? "block" : "hidden"}`}>
        <div className="mb-10 pt-4">
          <NavLink to="/" className="block">
            <h1 className="text-3xl font-bold text-gray-100 text-center hover:text-red-accent transition-colors">
              Purple Sector
            </h1>
          </NavLink>
        </div>

        <nav className="flex-grow">
          <ul className="space-y-1">
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
          {/* <button className="w-full text-left py-2 px-3 rounded text-sm text-gray-500 hover:bg-gray-700 hover:text-gray-300">
            Settings (placeholder)
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
