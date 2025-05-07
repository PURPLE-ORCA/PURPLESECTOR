import React from "react";
import ThemeToggler from "../ThemeToggler";
import { Icon } from "@iconify/react"; // Iconify import

function TopBar({ toggleSidebar, isSidebarOpen, title = "Purple Sector" }) {
  const pageTitle = "Dashboard";

  return (
    <header className="bg-[#950505] border-b border-red-800 shadow-md">
      <div className="mx-auto px-2 sm:px-2 lg:px-2 py-0">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-red-accent"
            >
              <Icon icon="mdi:menu" width="24" height="24" />
            </button>
            <h1 className="text-xl font-semibold text-gray-100">{title}</h1>
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggler />
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
