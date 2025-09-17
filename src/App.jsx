import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Dashboard from './components/Dashboard';
import Students from './components/Students';
import Programmes from './components/Programmes';
import Modules from './components/Modules';
import Analytics from './components/Analytics';
import Navigation from './components/Navigation';
import './App.css';

const socket = io('http://localhost:3001');

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('analytics-update', (data) => {
      console.log('Analytics update received:', data);
      setAnalyticsData(data);
    });

    socket.on('students-change', (change) => {
      console.log('Students data changed:', change);
      // Trigger refresh of student data if on students view
      if (currentView === 'students') {
        window.dispatchEvent(new CustomEvent('refresh-students'));
      }
    });

    socket.on('programmes-change', (change) => {
      console.log('Programmes data changed:', change);
      if (currentView === 'programmes') {
        window.dispatchEvent(new CustomEvent('refresh-programmes'));
      }
    });

    socket.on('modules-change', (change) => {
      console.log('Modules data changed:', change);
      if (currentView === 'modules') {
        window.dispatchEvent(new CustomEvent('refresh-modules'));
      }
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('analytics-update');
      socket.off('students-change');
      socket.off('programmes-change');
      socket.off('modules-change');
    };
  }, [currentView]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard analyticsData={analyticsData} isConnected={isConnected} />;
      case 'students':
        return <Students />;
      case 'programmes':
        return <Programmes />;
      case 'modules':
        return <Modules />;
      case 'analytics':
        return <Analytics analyticsData={analyticsData} isConnected={isConnected} />;
      default:
        return <Dashboard analyticsData={analyticsData} isConnected={isConnected} />;
    }
  };

  return (
    <div className="app">
      <Navigation 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        isConnected={isConnected}
      />
      <main className="main-content">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;