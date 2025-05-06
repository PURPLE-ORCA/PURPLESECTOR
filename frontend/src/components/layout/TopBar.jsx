// src/components/layout/TopBar.jsx
import React from "react";

function TopBar() {
  const pageTitle = "Dashboard"; // Placeholder

  return (
    // TopBar background - could be black or a contrasting dark shade. Let's try black.
    <header className="bg-black border-b border-red-accent shadow-md">
      {" "}
      {/* Was bg-gray-850, border-gray-700 */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Page title needs to be light against black */}
            <h1 className="text-xl font-semibold text-gray-100 ml-2">
              {pageTitle}
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button on black background */}
            <button
              title="Toggle Theme (coming soon)"
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-purple-brand focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-white" // ring-offset-black
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </button>
            <button className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition">
              {/* User avatar on black background - maybe a purple or red ring? */}
              <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-purple-brand">
                <svg
                  className="h-full w-full text-gray-200"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
export default TopBar;