// src/components/Projects.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MdEdit, MdDelete, MdPayment, MdVisibility } from 'react-icons/md';
import * as XLSX from 'xlsx';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  
  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [paymentData, setPaymentData] = useState({
    balancepayment: '',
    secondpayment: '',
    paydate: '',
    paymentStatus: 'pending'
  });

  // Project details modal state
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [projectDetails, setProjectDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const modalRef = useRef(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowPaymentModal(false);
        setShowDetailsModal(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://31.97.206.144:5000/api/projects');
      const data = await res.json();
      if (data.success) {
        setProjects(data.data);
      } else {
        setError('Failed to load projects');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch project details
  const fetchProjectDetails = async (projectId) => {
    setDetailsLoading(true);
    try {
      const res = await fetch(`http://31.97.206.144:5000/api/project/${projectId}`);
      const data = await res.json();
      if (data.success) {
        setProjectDetails(data.data);
        setShowDetailsModal(true);
      } else {
        alert('Failed to load project details');
      }
    } catch (err) {
      alert('Network error while loading project details');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`http://31.97.206.144:5000/api/project/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setProjects(prev => prev.filter(p => p._id !== id));
      }
    } catch (err) {
      alert('Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (id, field, value) => {
    try {
      const endpoint = field === 'status' 
        ? `http://31.97.206.144:5000/api/${id}/status`
        : `http://31.97.206.144:5000/api/project/${id}`;
      
      const body = field === 'status' 
        ? { status: value }
        : { [field]: value };

      const res = await fetch(endpoint, {
        method: field === 'status' ? 'PATCH' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        setProjects(prev =>
          prev.map(p => p._id === id ? { ...p, [field]: value } : p)
        );
      }
    } catch (err) {
      alert(`Failed to update ${field}`);
    }
  };

  // Open payment modal with current project data
  const openPaymentModal = (project) => {
    setSelectedProject(project);
    setPaymentData({
      balancepayment: project.balancepayment?.toString() || '',
      secondpayment: project.secondpayment?.toString() || '0',
      paydate: project.paydate ? new Date(project.paydate).toISOString().split('T')[0] : '',
      paymentStatus: project.paymentStatus || 'pending'
    });
    setShowPaymentModal(true);
  };

  // Handle payment submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    try {
      // Validate payment values
      const balance = parseFloat(paymentData.balancepayment);
      const second = parseFloat(paymentData.secondpayment);
      
      if (isNaN(balance) || balance < 0) {
        alert('Please enter a valid balance payment amount');
        return;
      }

      const payload = {
        balancepayment: balance,
        secondpayment: isNaN(second) ? 0 : second,
        paydate: paymentData.paydate,
        paymentStatus: paymentData.paymentStatus
      };

      // Call payment API
      const res = await fetch(`http://31.97.206.144:5000/api/payment/${selectedProject._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        // Update project in state with new data
        setProjects(prev => 
          prev.map(p => 
            p._id === selectedProject._id 
              ? { ...p, ...data.data } 
              : p
          )
        );
        setShowPaymentModal(false);
        alert('Payment recorded successfully!');
      } else {
        throw new Error(data.message || 'Payment update failed');
      }
    } catch (err) {
      alert(`Payment failed: ${err.message}`);
    }
  };

  // Close details modal
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setProjectDetails(null);
  };

  // Excel Export
  const exportToExcel = () => {
    const worksheetData = filteredProjects.map(p => ({
      'Project Name': p.projectname,
      'Client': p.clientname,
      'Mobile': p.mobilenumber,
      'Email': p.email,
      'Category': p.selectcategory,
      'Start Date': new Date(p.startDate).toLocaleDateString(),
      'End Date': new Date(p.endDate).toLocaleDateString(),
      'Total Price': p.totalprice,
      'Advance': p.advance,
      'Second Payment': p.secondpayment,
      'Balance Payment': p.balancepayment,
      'Status': p.status,
      'Payment Status': p.paymentStatus
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Projects");
    
    // Auto-fit columns
    const range = XLSX.utils.decode_range(ws['!ref']);
    const colWidths = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const col = XLSX.utils.encode_col(C);
      let maxWidth = 10;
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cell = ws[`${col}${R + 1}`];
        if (cell && cell.v) {
          const cellWidth = cell.v.toString().length;
          maxWidth = Math.max(maxWidth, cellWidth);
        }
      }
      colWidths.push({ wch: Math.min(maxWidth + 2, 30) });
    }
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, 'projects.xlsx');
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.projectname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? p.selectcategory === categoryFilter : true;
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    const matchesPaymentStatus = paymentStatusFilter ? p.paymentStatus === paymentStatusFilter : true;
    return matchesSearch && matchesCategory && matchesStatus && matchesPaymentStatus;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <div className="container-fluid py-5 text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <h2 className="fw-bold" style={{ color: '#009788' }}>Projects List</h2>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-success" onClick={exportToExcel}>
            Export Excel
          </button>
          <Link to="/add-project" className="btn text-white fw-semibold" style={{ backgroundColor: '#009788' }}>
            Add Project
          </Link>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedProject && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered" ref={modalRef}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Record Payment - {selectedProject.projectname}</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowPaymentModal(false)}
                ></button>
              </div>
              <form onSubmit={handlePaymentSubmit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Balance Payment *</label>
                      <input
                        type="number"
                        className="form-control"
                        value={paymentData.balancepayment}
                        onChange={(e) => setPaymentData({...paymentData, balancepayment: e.target.value})}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Second Payment</label>
                      <input
                        type="number"
                        className="form-control"
                        value={paymentData.secondpayment}
                        onChange={(e) => setPaymentData({...paymentData, secondpayment: e.target.value})}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Payment Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={paymentData.paydate}
                        onChange={(e) => setPaymentData({...paymentData, paydate: e.target.value})}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Payment Status *</label>
                      <select
                        className="form-select"
                        value={paymentData.paymentStatus}
                        onChange={(e) => setPaymentData({...paymentData, paymentStatus: e.target.value})}
                        required
                      >
                        <option value="pending">Pending</option>
                        <option value="partially_paid">Partially Paid</option>
                        <option value="fully_paid">Fully Paid</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="alert alert-info small">
                    <strong>Note:</strong> Payment status will be auto-calculated by the system based on payment amounts, 
                    but you can override it manually if needed.
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowPaymentModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn text-white" 
                    style={{ backgroundColor: '#009788' }}
                  >
                    Record Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      {showDetailsModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-lg modal-dialog-centered" ref={modalRef}>
            <div className="modal-content">
              <div className="modal-header" style={{ backgroundColor: '#009788', color: 'white' }}>
                <h5 className="modal-title fw-bold">Project Details</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={closeDetailsModal}
                ></button>
              </div>
              <div className="modal-body">
                {detailsLoading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-teal" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading project details...</p>
                  </div>
                ) : projectDetails ? (
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="fw-semibold text-teal">Project Name:</label>
                        <p className="mb-0">{projectDetails.projectname}</p>
                      </div>
                      <div className="mb-3">
                        <label className="fw-semibold text-teal">Client Name:</label>
                        <p className="mb-0">{projectDetails.clientname}</p>
                      </div>
                      <div className="mb-3">
                        <label className="fw-semibold text-teal">Mobile Number:</label>
                        <p className="mb-0">{projectDetails.mobilenumber}</p>
                      </div>
                      <div className="mb-3">
                        <label className="fw-semibold text-teal">Email:</label>
                        <p className="mb-0">{projectDetails.email}</p>
                      </div>
                      <div className="mb-3">
                        <label className="fw-semibold text-teal">Category:</label>
                        <p className="mb-0 text-capitalize">{projectDetails.selectcategory}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-3">
                        <label className="fw-semibold text-teal">Start Date:</label>
                        <p className="mb-0">
                          {new Date(projectDetails.startDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="mb-3">
                        <label className="fw-semibold text-teal">End Date:</label>
                        <p className="mb-0">
                          {new Date(projectDetails.endDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="mb-3">
                        <label className="fw-semibold text-teal">Total Price:</label>
                        <p className="mb-0">₹{projectDetails.totalprice?.toLocaleString()}</p>
                      </div>
                      <div className="mb-3">
                        <label className="fw-semibold text-teal">Advance:</label>
                        <p className="mb-0">₹{projectDetails.advance?.toLocaleString()}</p>
                      </div>
                      <div className="mb-3">
                        <label className="fw-semibold text-teal">Balance Payment:</label>
                        <p className="mb-0">₹{projectDetails.balancepayment?.toLocaleString()}</p>
                      </div>
                      <div className="mb-3">
                        <label className="fw-semibold text-teal">Second Payment:</label>
                        <p className="mb-0">₹{projectDetails.secondpayment?.toLocaleString()}</p>
                      </div>
                      <div className="mb-3">
                        <label className="fw-semibold text-teal">Status:</label>
                        <p className="mb-0">
                          <span className={`badge ${
                            projectDetails.status === 'active' ? 'bg-success' :
                            projectDetails.status === 'completed' ? 'bg-primary' : 'bg-danger'
                          }`}>
                            {projectDetails.status?.toUpperCase()}
                          </span>
                        </p>
                      </div>
                      <div className="mb-3">
                        <label className="fw-semibold text-teal">Payment Status:</label>
                        <p className="mb-0">
                          <span className={`badge ${
                            projectDetails.paymentStatus === 'fully_paid' ? 'bg-success' :
                            projectDetails.paymentStatus === 'partially_paid' ? 'bg-warning text-dark' : 'bg-danger'
                          }`}>
                            {projectDetails.paymentStatus?.replace('_', ' ').toUpperCase()}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-danger">Failed to load project details</p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={closeDetailsModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Categories</option>
                <option value="mobile app">Mobile App</option>
                <option value="website">Website</option>
                <option value="digital market">Digital Marketing</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={paymentStatusFilter}
                onChange={(e) => { setPaymentStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">Payment Status</option>
                <option value="pending">Pending</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="fully_paid">Fully Paid</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom-2" style={{ borderColor: '#009788' }}>
          <h4 className="mb-0 fw-bold" style={{ color: '#009788' }}>All Projects</h4>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr style={{ backgroundColor: '#009788', color: 'white' }}>
                  <th className="py-3 px-4">S.no</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Total Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Payment Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProjects.map((p, index) => (
                  <tr key={p._id}>
                    <td className="py-3 px-4">{startIndex + index + 1}</td>
                    <td className="py-3 px-4">{p.projectname}</td>
                    <td className="py-3 px-4">{p.clientname}</td>
                    <td className="py-3 px-4">{p.mobilenumber}</td>
                    <td className="py-3 px-4">₹{p.totalprice.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <select
                        className="form-select form-select-sm"
                        value={p.status}
                        onChange={(e) => handleStatusChange(p._id, 'status', e.target.value)}
                        style={{ width: '120px' }}
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${
                        p.paymentStatus === 'fully_paid' ? 'bg-success' :
                        p.paymentStatus === 'partially_paid' ? 'bg-warning text-dark' : 'bg-danger'
                      }`}>
                        {p.paymentStatus.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="d-flex gap-3">
                        {/* View Details Icon */}
                        <span
                          onClick={() => fetchProjectDetails(p._id)}
                          title="View Details"
                          style={{ cursor: 'pointer' }}
                        >
                          <MdVisibility size={20} style={{ color: '#17a2b8' }} />
                        </span>
                        
                        {/* Payment Icon */}
                        <span
                          onClick={() => openPaymentModal(p)}
                          title="Record Payment"
                          style={{ cursor: 'pointer' }}
                        >
                          <MdPayment size={20} style={{ color: '#198754' }} />
                        </span>
                        
                        {/* Edit Icon */}
                        <Link to={`/edit-project/${p._id}`} title="Edit">
                          <MdEdit size={20} style={{ color: '#009788', cursor: 'pointer' }} />
                        </Link>
                        
                        {/* Delete Icon */}
                        <span
                          onClick={() => handleDelete(p._id)}
                          title="Delete"
                          style={{ 
                            cursor: deletingId === p._id ? 'not-allowed' : 'pointer', 
                            opacity: deletingId === p._id ? 0.6 : 1 
                          }}
                        >
                          {deletingId === p._id ? (
                            <div className="spinner-border spinner-border-sm text-danger" role="status">
                              <span className="visually-hidden">Deleting...</span>
                            </div>
                          ) : (
                            <MdDelete size={20} color="#dc3545" />
                          )}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}>
                      Prev
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}>
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

export default Projects;