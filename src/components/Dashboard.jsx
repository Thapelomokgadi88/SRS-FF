import React from 'react';
import { Users, GraduationCap, BookOpen, TrendingUp, Activity } from 'lucide-react';

const Dashboard = ({ analyticsData, isConnected }) => {
  if (!analyticsData) {
    return (
      <div className="dashboard loading">
        <div className="loading-spinner">
          <Activity className="animate-spin" size={32} />
          <p>Loading real-time analytics...</p>
        </div>
      </div>
    );
  }

  const { overview, distributions, insights } = analyticsData;

  const statCards = [
    {
      title: 'Total Students',
      value: overview.totalStudents?.toLocaleString() || '0',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Programmes',
      value: overview.totalProgrammes?.toLocaleString() || '0',
      icon: GraduationCap,
      color: 'green'
    },
    {
      title: 'Modules',
      value: overview.totalModules?.toLocaleString() || '0',
      icon: BookOpen,
      color: 'purple'
    },
    {
      title: 'Enrolments',
      value: overview.totalEnrolments?.toLocaleString() || '0',
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Student Records Dashboard</h1>
        <div className={`live-indicator ${isConnected ? 'live' : 'offline'}`}>
          <div className="pulse-dot"></div>
          <span>{isConnected ? 'Live Data' : 'Offline'}</span>
        </div>
      </div>

      <div className="stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-icon">
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <h3>{stat.value}</h3>
                <p>{stat.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Student Status Distribution</h3>
          <div className="status-list">
            {distributions.studentsByStatus?.map((item, index) => (
              <div key={index} className="status-item">
                <span className="status-label">{item.status}</span>
                <span className="status-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Students by Faculty</h3>
          <div className="faculty-list">
            {distributions.studentsByFaculty?.slice(0, 5).map((item, index) => (
              <div key={index} className="faculty-item">
                <span className="faculty-name">{item.faculty}</span>
                <span className="faculty-count">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card full-width">
          <h3>AI-Powered Insights</h3>
          <div className="insights-content">
            <pre className="insights-text">{insights}</pre>
          </div>
        </div>
      </div>

      <div className="last-updated">
        Last updated: {new Date(analyticsData.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default Dashboard;