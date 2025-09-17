import React, { useState, useEffect } from 'react';
import { Search, Filter, User, Mail, Phone, Calendar } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 });

  const fetchStudents = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20'
      });
      
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/students?${params}`);
      const data = await response.json();
      
      setStudents(data.students || []);
      setPagination(data.pagination || { current: 1, pages: 1, total: 0 });
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, statusFilter]);

  useEffect(() => {
    const handleRefresh = () => fetchStudents(pagination.current);
    window.addEventListener('refresh-students', handleRefresh);
    return () => window.removeEventListener('refresh-students', handleRefresh);
  }, [pagination.current]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'graduated': return 'blue';
      case 'suspended': return 'red';
      case 'withdrawn': return 'gray';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="students loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="students">
      <div className="students-header">
        <h1>Students Management</h1>
        <div className="students-controls">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={handleSearch}
            />
          </div>
          <div className="filter-box">
            <Filter size={20} />
            <select value={statusFilter} onChange={handleStatusFilter}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="graduated">Graduated</option>
              <option value="suspended">Suspended</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
        </div>
      </div>

      <div className="students-stats">
        <div className="stat">
          <span className="stat-label">Total Students</span>
          <span className="stat-value">{pagination.total}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Showing</span>
          <span className="stat-value">{students.length}</span>
        </div>
      </div>

      <div className="students-grid">
        {students.map(student => (
          <div key={student._id} className="student-card">
            <div className="student-header">
              <div className="student-avatar">
                <User size={24} />
              </div>
              <div className="student-info">
                <h3>{student.firstName} {student.lastName}</h3>
                <p className="student-number">{student.studentNo}</p>
              </div>
              <div className={`status-badge ${getStatusColor(student.status)}`}>
                {student.status}
              </div>
            </div>
            
            <div className="student-details">
              <div className="detail-item">
                <Mail size={16} />
                <span>{student.email}</span>
              </div>
              {student.mobile && (
                <div className="detail-item">
                  <Phone size={16} />
                  <span>{student.mobile}</span>
                </div>
              )}
              <div className="detail-item">
                <Calendar size={16} />
                <span>Intake: {student.intakeYear}</span>
              </div>
            </div>

            {student.programmeId && (
              <div className="student-programme">
                <strong>{student.programmeId.name}</strong>
                <span className="programme-level">{student.programmeId.level}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {pagination.pages > 1 && (
        <div className="pagination">
          <button
            disabled={pagination.current === 1}
            onClick={() => fetchStudents(pagination.current - 1)}
          >
            Previous
          </button>
          <span>
            Page {pagination.current} of {pagination.pages}
          </span>
          <button
            disabled={pagination.current === pagination.pages}
            onClick={() => fetchStudents(pagination.current + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Students;