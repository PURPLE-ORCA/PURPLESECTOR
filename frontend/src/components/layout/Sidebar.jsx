import React from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "@iconify/react";

function Sidebar({ isOpen }) {
const sidebarClasses = `
    transition-all duration-300 ease-in-out 
   ${isOpen ? "w-60 p-4" : "w-0 p-0 sm:w-16 sm:p-2"}
    bg-[#950505] dark:bg-[#950505]
    overflow-hidden flex-shrink-0 
    flex flex-col z-10  rounded-t-2xl ml-2 mt-2
    h-screen sticky top-0
    dark:bg-[linear-gradient(to_bottom_right,_rgba(149,5,5,0.25),_rgba(55,4,95,0.2),_rgba(0,0,0,0.7))]
    dark:border-[#950505]/40
    dark:shadow-[0_0_20px_rgba(55,4,95,0.5)]
`;

  const linkBaseClasses = `
    flex items-center gap-3 py-2 px-3 rounded-lg transition-all duration-150
    font-medium text-sm tracking-wide
  `;
  const linkInactiveClasses =
    "text-gray-300 hover:bg-[#37045F]/40 hover:text-white";
  const linkActiveClass =
    "bg-[#950505]/90 text-white font-semibold shadow-inner";

  const navItems = [
    { to: "/", label: "Home", icon: "mdi:home" },
    { to: "/schedule", label: "Schedule", icon: "mdi:calendar-clock" },
    { to: "/standings/drivers", label: "Drivers", icon: "mdi:car-sports" },
    {
      to: "/standings/constructors",
      label: "Constructors",
      icon: "mdi:factory",
    },
    { to: "/circuits", label: "Circuits", icon: "mdi:map-marker-path" },
  ];

  return (
    <div className={sidebarClasses}>
      <div className="flex flex-col h-full">
        <div className="mb-10 pt-4">
          <NavLink to="/" className="block text-center">
            {isOpen ? (
              <h1 className="text-3xl font-bold text-gray-100 hover:text-[#37045F] transition-colors">
                Purple Sector
              </h1>
            ) : (
              <Icon
                icon="mdi:flag-checkered"
                className="text-white text-3xl mx-auto"
              />
            )}
          </NavLink>
        </div>

        <nav className="flex-grow">
          <ul className="space-y-2">
            {navItems.map(({ to, label, icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `${linkBaseClasses} ${
                      isActive ? linkActiveClass : linkInactiveClasses
                    }`
                  }
                  title={!isOpen ? label : ""}
                >
                  <Icon icon={icon} className="text-xl" />
                  {isOpen && <span>{label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto pt-6">
          {/* Add settings or logout icon here later */}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
