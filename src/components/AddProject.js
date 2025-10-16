// src/components/AddProject.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProject = () => {
  const [formData, setFormData] = useState({
    projectname: '',
    clientname: '',
    mobilenumber: '',
    email: '',
    selectcategory: 'website',
    startDate: '',
    endDate: '',
    totalprice: '',
    advance: '',
    paydate: '',
    balancepayment: '',
    secondpayment: 0,
    status: 'active',
    paymentStatus: 'pending'
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== '') formDataToSend.append(key, value);
    });
    if (file) {
      formDataToSend.append('uploadfile', file);
    }

    try {
      const res = await fetch('http://31.97.206.144:5000/api/projects', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Project created successfully!');
        setTimeout(() => navigate('/projects'), 1500);
      } else {
        setError(data.message || 'Failed to create project');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="mb-4 fw-bold" style={{ color: '#009788' }}>Create Project</h2>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom-2" style={{ borderColor: '#009788' }}>
          <h4 className="mb-0 fw-bold" style={{ color: '#009788' }}>Project Details</h4>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* Basic Info */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Project Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="projectname"
                  value={formData.projectname}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Client Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="clientname"
                  value={formData.clientname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Mobile *</label>
                <input
                  type="tel"
                  className="form-control"
                  name="mobilenumber"
                  value={formData.mobilenumber}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Category & Dates */}
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Category *</label>
                <select
                  className="form-select"
                  name="selectcategory"
                  value={formData.selectcategory}
                  onChange={handleChange}
                  required
                >
                  <option value="mobile app">Mobile App</option>
                  <option value="website">Website</option>
                  <option value="digital market">Digital Marketing</option>
                </select>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">Start Date *</label>
                <input
                  type="date"
                  className="form-control"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label fw-semibold">End Date *</label>
                <input
                  type="date"
                  className="form-control"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Payments */}
            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Total Price *</label>
                <input
                  type="number"
                  className="form-control"
                  name="totalprice"
                  value={formData.totalprice}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Advance *</label>
                <input
                  type="number"
                  className="form-control"
                  name="advance"
                  value={formData.advance}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Second Payment</label>
                <input
                  type="number"
                  className="form-control"
                  name="secondpayment"
                  value={formData.secondpayment}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label fw-semibold">Balance Payment *</label>
                <input
                  type="number"
                  className="form-control"
                  name="balancepayment"
                  value={formData.balancepayment}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Payment Date *</label>
                <input
                  type="date"
                  className="form-control"
                  name="paydate"
                  value={formData.paydate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Upload File (Optional)</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*,.pdf,.doc,.docx"
              />
            </div>

            <button
              type="submit"
              className="btn text-white fw-semibold"
              style={{ backgroundColor: '#009788' }}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProject;