import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  BarChart3,
  Wifi,
  WifiOff
} from 'lucide-react';

const Navigation = ({ currentView, setCurrentView, isConnected }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'programmes', label: 'Programmes', icon: GraduationCap },
    { id: 'modules', label: 'Modules', icon: BookOpen },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <nav className="navigation">
      <div className="nav-header">
        <h1 className="nav-title">SRS Portal</h1>
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? <Wifi size={16} /> : <WifiOff size={16} />}
          <span>{isConnected ? 'Live' : 'Offline'}</span>
        </div>
      </div>
      
      <ul className="nav-list">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <li key={item.id}>
              <button
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => setCurrentView(item.id)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;