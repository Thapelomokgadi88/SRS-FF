import React, { useState, useEffect } from 'react';
import { Search, Filter, GraduationCap, Clock, Award } from 'lucide-react';

const Programmes = () => {
  const [programmes, setProgrammes] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');

  const fetchProgrammes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (levelFilter) params.append('level', levelFilter);
      if (facultyFilter) params.append('facultyId', facultyFilter);

      const response = await fetch(`/api/programmes?${params}`);
      const data = await response.json();
      setProgrammes(data || []);
    } catch (error) {
      console.error('Error fetching programmes:', error);
      setProgrammes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await fetch('/api/faculties');
      const data = await response.json();
      setFaculties(data || []);
    } catch (error) {
      console.error('Error fetching faculties:', error);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  useEffect(() => {
    fetchProgrammes();
  }, [search, levelFilter, facultyFilter]);

  useEffect(() => {
    const handleRefresh = () => fetchProgrammes();
    window.addEventListener('refresh-programmes', handleRefresh);
    return () => window.removeEventListener('refresh-programmes', handleRefresh);
  }, []);

  const getLevelColor = (level) => {
    switch (level) {
      case 'certificate': return 'orange';
      case 'diploma': return 'blue';
      case 'degree': return 'green';
      case 'masters': return 'purple';
      case 'phd': return 'red';
      default: return 'gray';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'certificate': return '📜';
      case 'diploma': return '🎓';
      case 'degree': return '🏆';
      case 'masters': return '👨‍🎓';
      case 'phd': return '🔬';
      default: return '📚';
    }
  };

  if (loading) {
    return (
      <div className="programmes loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading programmes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="programmes">
      <div className="programmes-header">
        <h1>Programmes Management</h1>
        <div className="programmes-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search programmes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <Filter size={20} />
            <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
              <option value="">All Levels</option>
              <option value="certificate">Certificate</option>
              <option value="diploma">Diploma</option>
              <option value="degree">Degree</option>
              <option value="masters">Masters</option>
              <option value="phd">PhD</option>
            </select>
          </div>
          <div className="filter-box">
            <GraduationCap size={20} />
            <select value={facultyFilter} onChange={(e) => setFacultyFilter(e.target.value)}>
              <option value="">All Faculties</option>
              {faculties.map(faculty => (
                <option key={faculty._id} value={faculty._id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="programmes-stats">
        <div className="stat">
          <span className="stat-label">Total Programmes</span>
          <span className="stat-value">{programmes.length}</span>
        </div>
      </div>

      <div className="programmes-grid">
        {programmes.map(programme => (
          <div key={programme._id} className="programme-card">
            <div className="programme-header">
              <div className="programme-icon">
                <span className="level-emoji">{getLevelIcon(programme.level)}</span>
              </div>
              <div className="programme-info">
                <h3>{programme.name}</h3>
                <p className="programme-code">{programme.code}</p>
              </div>
              <div className={`level-badge ${getLevelColor(programme.level)}`}>
                {programme.level}
              </div>
            </div>
            
            <div className="programme-details">
              <div className="detail-item">
                <GraduationCap size={16} />
                <span>{programme.facultyId?.name || 'Unknown Faculty'}</span>
              </div>
              <div className="detail-item">
                <Award size={16} />
                <span>{programme.totalCredits} Credits</span>
              </div>
              <div className="detail-item">
                <Clock size={16} />
                <span>{programme.durationYears} Year{programme.durationYears > 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="programme-faculty">
              <strong>{programme.facultyId?.code}</strong>
            </div>
          </div>
        ))}
      </div>

      {programmes.length === 0 && !loading && (
        <div className="empty-state">
          <GraduationCap size={48} />
          <h3>No programmes found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Programmes;