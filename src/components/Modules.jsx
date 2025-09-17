import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Award, Calendar } from 'lucide-react';

const Modules = () => {
  const [modules, setModules] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [programmeFilter, setProgrammeFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('');

  const fetchModules = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (programmeFilter) params.append('programmeId', programmeFilter);
      if (yearFilter) params.append('yearLevel', yearFilter);
      if (semesterFilter) params.append('semester', semesterFilter);

      const response = await fetch(`/api/modules?${params}`);
      const data = await response.json();
      setModules(data || []);
    } catch (error) {
      console.error('Error fetching modules:', error);
      setModules([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgrammes = async () => {
    try {
      const response = await fetch('/api/programmes');
      const data = await response.json();
      setProgrammes(data || []);
    } catch (error) {
      console.error('Error fetching programmes:', error);
    }
  };

  useEffect(() => {
    fetchProgrammes();
  }, []);

  useEffect(() => {
    fetchModules();
  }, [search, programmeFilter, yearFilter, semesterFilter]);

  useEffect(() => {
    const handleRefresh = () => fetchModules();
    window.addEventListener('refresh-modules', handleRefresh);
    return () => window.removeEventListener('refresh-modules', handleRefresh);
  }, []);

  const getYearColor = (year) => {
    const colors = ['blue', 'green', 'orange', 'purple', 'red'];
    return colors[year - 1] || 'gray';
  };

  const getSemesterLabel = (semester) => {
    return semester === 1 ? 'Semester 1' : 'Semester 2';
  };

  if (loading) {
    return (
      <div className="modules loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modules">
      <div className="modules-header">
        <h1>Modules Management</h1>
        <div className="modules-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search modules..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <Filter size={20} />
            <select value={programmeFilter} onChange={(e) => setProgrammeFilter(e.target.value)}>
              <option value="">All Programmes</option>
              {programmes.map(programme => (
                <option key={programme._id} value={programme._id}>
                  {programme.name}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-box">
            <Calendar size={20} />
            <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
              <option value="">All Years</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
              <option value="5">Year 5</option>
              <option value="6">Year 6</option>
            </select>
          </div>
          <div className="filter-box">
            <BookOpen size={20} />
            <select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)}>
              <option value="">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>
          </div>
        </div>
      </div>

      <div className="modules-stats">
        <div className="stat">
          <span className="stat-label">Total Modules</span>
          <span className="stat-value">{modules.length}</span>
        </div>
      </div>

      <div className="modules-grid">
        {modules.map(module => (
          <div key={module._id} className="module-card">
            <div className="module-header">
              <div className="module-icon">
                <BookOpen size={24} />
              </div>
              <div className="module-info">
                <h3>{module.title}</h3>
                <p className="module-code">{module.code}</p>
              </div>
              <div className={`year-badge ${getYearColor(module.yearLevel)}`}>
                Year {module.yearLevel}
              </div>
            </div>
            
            <div className="module-description">
              <p>{module.description}</p>
            </div>

            <div className="module-details">
              <div className="detail-item">
                <Award size={16} />
                <span>{module.credits} Credits</span>
              </div>
              <div className="detail-item">
                <Calendar size={16} />
                <span>{getSemesterLabel(module.semesterOffered)}</span>
              </div>
            </div>

            {module.programmeId && (
              <div className="module-programme">
                <strong>{module.programmeId.name}</strong>
                <span className="programme-code">{module.programmeId.code}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {modules.length === 0 && !loading && (
        <div className="empty-state">
          <BookOpen size={48} />
          <h3>No modules found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Modules;