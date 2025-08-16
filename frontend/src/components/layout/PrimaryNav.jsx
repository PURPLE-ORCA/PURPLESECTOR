import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { AnimatedBackground } from '@/components/core/animated-background';
import { navItems } from '@/config/nav';

export function PrimaryNav() {
  const location = useLocation();
  const activeTab = navItems.find(item => location.pathname.startsWith(item.to))?.to || navItems[0].to;

  return (
    <div className="flex items-center justify-center p-1.5 rounded-full border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-black/20 shadow-inner">
      <AnimatedBackground
        defaultValue={activeTab}
        className="rounded-full bg-white dark:bg-purple-900/40"
        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            data-id={item.to}
            title={item.label}
            className="group inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
          >
            <Icon
              icon={item.icon}
              className="h-5 w-5 text-gray-500 dark:text-gray-400 transition-colors group-data-[checked=true]:text-black dark:group-data-[checked=true]:text-white"
            />
          </NavLink>
        ))}
      </AnimatedBackground>
    </div>
  );
}
