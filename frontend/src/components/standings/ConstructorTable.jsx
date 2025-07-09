// src/components/standings/ConstructorTable.jsx
import React from 'react';
import DataTable from '../ui/DataTable'; // Import our new component

function ConstructorTable({ constructorStandings }) {
  const headers = [
    { key: 'pos', label: 'Pos', className: 'text-center w-12' },
    { key: 'constructor', label: 'Constructor' },
    { key: 'nationality', label: 'Nationality' },
    { key: 'points', label: 'Points', className: 'text-right' },
    { key: 'wins', label: 'Wins', className: 'text-right w-16' },
  ];

  const renderRow = (standing) => {
    const teamId = standing.teamId;
    const teamLogoUrl = teamId ? `/images/teams/${teamId}.svg` : '/images/teams/default.svg';

    return (
      <>
        {/* Position */}
        <td className="px-4 py-3 text-center font-bold text-foreground">
          {standing.position}
        </td>
        {/* Constructor Name + Logo */}
        <td className="px-4 py-3">
          <div className="flex items-center">
            <img
              src={teamLogoUrl}
              alt={`${standing.team?.teamName || 'Team'} Logo`}
              className="w-8 h-8 mr-3 object-contain flex-shrink-0"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/teams/default.svg';
              }}
            />
            <span className="font-semibold text-foreground truncate">
              {standing.team?.teamName || 'N/A'}
            </span>
          </div>
        </td>
        {/* Nationality */}
        <td className="px-4 py-3 text-muted-foreground">
          {standing.team?.country || 'N/A'}
        </td>
        {/* Points */}
        <td className="px-4 py-3 font-bold text-right text-primary dark:text-purple-400">
          {standing.points}
        </td>
        {/* Wins */}
        <td className="px-4 py-3 text-right text-muted-foreground">
          {standing.wins ?? '0'}
        </td>
      </>
    );
  };

  return (
    <DataTable
      headers={headers}
      data={constructorStandings}
      renderRow={renderRow}
      keyField="teamId"
    />
  );
}

export default ConstructorTable;
