// src/components/standings/DriverTable.jsx
import React from 'react';
import DataTable from '../ui/DataTable'; // Import our new component

function DriverTable({ driverStandings, driverInfoMap }) {
  const headers = [
    { key: 'pos', label: 'Pos', className: 'text-center w-12' },
    { key: 'driver', label: 'Driver' },
    { key: 'team', label: 'Team' },
    { key: 'points', label: 'Points', className: 'text-right' },
    { key: 'wins', label: 'Wins', className: 'text-right w-16' },
  ];

  const renderRow = (standing) => {
    // All your existing data-fetching logic for headshots, logos etc. stays here
    const driverAcr = standing.driver?.shortName;
    const driverInfo = driverInfoMap?.get(driverAcr);
    const headshotUrl = driverInfo?.headshot_url || '/images/drivers/default.png';
    const driverFullName = driverInfo?.full_name || `${standing.driver?.name} ${standing.driver?.surname}`.trim();
    const teamLogoUrl = standing.team?.teamId ? `/images/teams/${standing.team.teamId}.svg` : '/images/teams/default.svg';

    return (
      <>
        {/* Pos */}
        <td className="px-4 py-3 text-center font-bold text-foreground">
          {standing.position}
        </td>
        {/* Driver */}
        <td className="px-4 py-3">
          <div className="flex items-center">
            <img src={headshotUrl} alt={driverFullName} className="w-8 h-8 rounded-full mr-3 object-cover" />
            <div>
              <div className="font-semibold text-foreground">{driverFullName}</div>
              <div className="text-xs text-muted-foreground">{driverAcr}</div>
            </div>
          </div>
        </td>
        {/* Team */}
        <td className="px-4 py-3">
          <img src={teamLogoUrl} alt={standing.team?.teamName} title={standing.team?.teamName} className="h-6 w-auto object-contain" />
        </td>
        {/* Points - ON-BRAND PURPLE! */}
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
      data={driverStandings}
      renderRow={renderRow}
      keyField="position"
    />
  );
}
export default DriverTable;
