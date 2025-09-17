import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, GraduationCap, Activity, Brain } from 'lucide-react';

const Analytics = ({ analyticsData, isConnected }) => {
  const [selectedChart, setSelectedChart] = useState('overview');

  if (!analyticsData) {
    return (
      <div className="analytics loading">
        <div className="loading-spinner">
          <Activity className="animate-spin" size={32} />
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  const { overview, distributions, trends, insights } = analyticsData;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const chartOptions = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'status', label: 'Student Status', icon: Users },
    { id: 'faculty', label: 'Faculty Distribution', icon: GraduationCap },
    { id: 'trends', label: 'Enrollment Trends', icon: Activity }
  ];

  const renderChart = () => {
    switch (selectedChart) {
      case 'overview':
        const overviewData = [
          { name: 'Students', value: overview.totalStudents },
          { name: 'Programmes', value: overview.totalProgrammes },
          { name: 'Modules', value: overview.totalModules },
          { name: 'Enrolments', value: overview.totalEnrolments }
        ];
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={overviewData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'status':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={distributions.studentsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, count }) => `${status}: ${count}`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
              >
                {distributions.studentsByStatus?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'faculty':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={distributions.studentsByFaculty?.slice(0, 8)} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="faculty" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="count" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'trends':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trends.recentEnrolments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#FF8042" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h1>Real-time Analytics</h1>
        <div className={`live-indicator ${isConnected ? 'live' : 'offline'}`}>
          <div className="pulse-dot"></div>
          <span>{isConnected ? 'Live Data' : 'Offline'}</span>
        </div>
      </div>

      <div className="analytics-controls">
        {chartOptions.map(option => {
          const Icon = option.icon;
          return (
            <button
              key={option.id}
              className={`chart-option ${selectedChart === option.id ? 'active' : ''}`}
              onClick={() => setSelectedChart(option.id)}
            >
              <Icon size={20} />
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>

      <div className="analytics-content">
        <div className="chart-container">
          <h3>
            {chartOptions.find(opt => opt.id === selectedChart)?.label} Chart
          </h3>
          {renderChart()}
        </div>

        <div className="insights-panel">
          <div className="insights-header">
            <Brain size={24} />
            <h3>AI-Powered Insights</h3>
          </div>
          <div className="insights-content">
            <pre className="insights-text">{insights}</pre>
          </div>
          <div className="insights-footer">
            <small>Generated by AI • Updated every 30 seconds</small>
          </div>
        </div>
      </div>

      <div className="analytics-summary">
        <div className="summary-grid">
          <div className="summary-card">
            <h4>Top Programme</h4>
            <p>{trends.topProgrammes?.[0]?.programme || 'N/A'}</p>
            <span>{trends.topProgrammes?.[0]?.count || 0} students</span>
          </div>
          <div className="summary-card">
            <h4>Most Popular Faculty</h4>
            <p>{distributions.studentsByFaculty?.[0]?.faculty || 'N/A'}</p>
            <span>{distributions.studentsByFaculty?.[0]?.count || 0} students</span>
          </div>
          <div className="summary-card">
            <h4>Active Students</h4>
            <p>{distributions.studentsByStatus?.find(s => s.status === 'active')?.count || 0}</p>
            <span>Currently enrolled</span>
          </div>
          <div className="summary-card">
            <h4>Data Freshness</h4>
            <p>{isConnected ? 'Live' : 'Cached'}</p>
            <span>Last update: {new Date(analyticsData.timestamp).toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;