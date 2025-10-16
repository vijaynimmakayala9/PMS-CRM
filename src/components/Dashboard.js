// Dashboard.jsx
import React from 'react';
import WelcomeCard from './DashboardComponents/WelcomeCard';
import ChartCard from './DashboardComponents/ChartCard';
import ProjectsTable from './DashboardComponents/ProjectTable';
import ProjectStatsCard from './DashboardComponents/ProjectStats';

const Dashboard = () => {
  return (
    <div className="p-4">
      <h2 className="fw-bold mb-4">Dashboard</h2>

      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <WelcomeCard />
        </div>
        <div className="col-lg-8">
          <ProjectStatsCard/>
          
        </div>
      </div>
<ChartCard />
      <ProjectsTable />
    </div>
  );
};

export default Dashboard;