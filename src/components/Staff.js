// src/components/Staff.jsx (Updated)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdEdit, MdDelete } from 'react-icons/md';

const Staff = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const res = await fetch('https://admin-emp.onrender.com/api/get_all_staffs');
      const data = await res.json();
      if (data.success) {
        setStaffList(data.data);
      } else {
        setError('Failed to load staff');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;

    setDeletingId(id);
    try {
      const res = await fetch(`https://admin-emp.onrender.com/api/delete_staff/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();

      if (data.success) {
        setStaffList(prev => prev.filter(staff => staff._id !== id));
      } else {
        alert('Failed to delete staff: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Network error. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter logic
  const filteredStaff = staffList.filter(staff => {
    const matchesSearch = 
      staff.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.staffId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? staff.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStaff = filteredStaff.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div className="container-fluid py-5 text-center">Loading staff...</div>;
  if (error) return <div className="container-fluid py-5"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="fw-bold" style={{ color: '#009788' }}>Staff Details</h2>
        <Link to="/add-staff" className="btn text-white fw-semibold" style={{ backgroundColor: '#009788' }}>
          Add Staff
        </Link>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">All Roles</option>
                <option value="CEO">CEO</option>
                <option value="HR">HR</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Designer">Designer</option>
                <option value="Tester">Tester</option>
                <option value="Digital marketing">Digital marketing</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom-2" style={{ borderColor: '#009788' }}>
          <h4 className="mb-0 fw-bold" style={{ color: '#009788' }}>Staff Members</h4>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ backgroundColor: '#009788', color: 'white' }}>
                  <th className="py-3 px-4">S.no</th>
                  <th className="py-3 px-4">Staff ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStaff.length > 0 ? (
                  paginatedStaff.map((staff, index) => (
                    <tr key={staff._id}>
                      <td className="py-3 px-4">{startIndex + index + 1}</td>
                      <td className="py-3 px-4">{staff.staffId}</td>
                      <td className="py-3 px-4">{staff.staffName}</td>
                      <td className="py-3 px-4">{staff.mobileNumber}</td>
                      <td className="py-3 px-4">{staff.email}</td>
                      <td className="py-3 px-4">{staff.role}</td>
                      <td className="py-3 px-4">
                        <div className="d-flex gap-3">
                          <Link to={`/staff/${staff._id}`} title="Edit">
                            <MdEdit size={20} style={{ color: '#009788', cursor: 'pointer' }} />
                          </Link>
                          <span
                            onClick={() => handleDelete(staff._id)}
                            title="Delete"
                            style={{ cursor: 'pointer', opacity: deletingId === staff._id ? 0.6 : 1 }}
                          >
                            {deletingId === staff._id ? 'Deleting...' : <MdDelete size={20} color="#dc3545" />}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">No staff found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <nav>
                <ul className="pagination mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    >
                      Prev
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Staff;