import React from "react";
import ThemeToggler from "../ThemeToggler";
import { Icon } from "@iconify/react"; // Iconify import

function TopBar({ toggleSidebar }) {
  const pageTitle = "Dashboard"; // Still placeholder

  return (
    <header className="bg-[#950505] border-b border-red-800 shadow-md">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleSidebar}
              className="text-white hover:text-red-accent"
            >
              <Icon icon="mdi:menu" width="24" height="24" />
            </button>
            <h1 className="text-xl font-semibold text-gray-100">{pageTitle}</h1>
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
