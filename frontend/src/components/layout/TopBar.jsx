import React from 'react';
import ThemeToggler from '../ThemeToggler'; // Assuming ThemeToggler is in components/
import { PrimaryNav } from './PrimaryNav';
import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';

function TopBar() {
  return (
    <header className="sticky top-0 z-30 w-full p-2 bg-transparent">
      <div className="container mx-auto flex items-center justify-between h-16">
        <NavLink to="/home" className="group">
           <Icon
              icon="mdi:flag-checkered"
              className="text-black dark:text-white text-3xl group-hover:text-purple-500 transition-colors duration-200"
            />
        </NavLink>

        <div className="absolute left-1/2 -translate-x-1/2">
          <PrimaryNav />
        </div>

        <div className="flex items-center">
          <ThemeToggler />
        </div>
      </div>
    </header>
  );
}

export default TopBar;
