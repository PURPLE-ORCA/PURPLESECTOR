import React from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";

function Sidebar({ isOpen, toggleSidebar }) {
  const navItems = [
    { to: "/home", label: "Home", icon: "mdi:home" },
    { to: "/schedule", label: "Schedule", icon: "mdi:calendar-clock" },
    { to: "/standings/drivers", label: "Drivers", icon: "mdi:car-sports" },
    {
      to: "/standings/constructors",
      label: "Constructors",
      icon: "mdi:factory",
    },
    { to: "/circuits", label: "Circuits", icon: "mdi:map-marker-path" },
  ];

  const linkBaseClasses = `
    flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-200
    font-medium text-sm tracking-wide relative
  `;

  const linkInactiveClasses =
    "text-gray-300 hover:bg-[#4a037a]/40 hover:text-white";
  const linkActiveClass =
    "bg-[#4a037a]/60 text-white font-semibold shadow-lg border border-[#4a037a]/50";

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out
        bg-gradient-to-br from-[#2f024f] via-[#4a037a] to-[#2f024f]
        shadow-2xl
        ${
          isOpen
            ? "w-64 translate-x-0"
            : "w-16 -translate-x-full md:translate-x-0"
        }
        md:sticky md:z-10
        border-r border-[#4a037a]/30
      `}
      >
        <div className="flex flex-col h-full p-2">
          {/* Header */}
          <div className="mb-8 pt-4 px-2">
            <NavLink to="/home" className="block text-center group">
              {isOpen ? (
                <h1 className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors duration-200">
                  Purple Sector
                </h1>
              ) : (
                <Icon
                  icon="mdi:flag-checkered"
                  className="text-white text-3xl mx-auto group-hover:text-purple-200 transition-colors duration-200"
                />
              )}
            </NavLink>
          </div>

          {/* Navigation */}
          <nav className="flex-grow px-2">
            <ul className="space-y-2">
              {navItems.map(({ to, label, icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `${linkBaseClasses} ${
                        isActive ? linkActiveClass : linkInactiveClasses
                      } ${!isOpen ? "justify-center" : ""}`
                    }
                    title={!isOpen ? label : ""}
                    onClick={() => {
                      // Close sidebar on mobile when clicking a link
                      if (window.innerWidth < 768) {
                        toggleSidebar();
                      }
                    }}
                  >
                    <Icon
                      icon={icon}
                      className={`text-xl flex-shrink-0 ${!isOpen ? "mx-auto" : ""}`}
                    />
                    {isOpen && (
                      <span className="whitespace-nowrap overflow-hidden">
                        {label}
                      </span>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-6 px-2">
            <div
              className={`text-center ${isOpen ? "block" : "hidden md:block"}`}
            >
              <div className="text-xs text-gray-400 opacity-75">
                {isOpen ? "F1 Dashboard" : "F1"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
