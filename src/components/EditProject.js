// src/components/EditProject.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [existingFile, setExistingFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await fetch(`http://31.97.206.144:5000/api/project/${id}`);
      const data = await res.json();
      if (data.success) {
        const p = data.data;
        setFormData({
          projectname: p.projectname || '',
          clientname: p.clientname || '',
          mobilenumber: p.mobilenumber || '',
          email: p.email || '',
          selectcategory: p.selectcategory || 'website',
          startDate: p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : '',
          endDate: p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : '',
          totalprice: p.totalprice || '',
          advance: p.advance || '',
          paydate: p.paydate ? new Date(p.paydate).toISOString().split('T')[0] : '',
          balancepayment: p.balancepayment || '',
          secondpayment: p.secondpayment || 0,
          status: p.status || 'active',
          paymentStatus: p.paymentStatus || 'pending'
        });
        if (p.uploadfile?.url) setExistingFile(p.uploadfile.url);
      }
    } catch (err) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
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
      const res = await fetch(`http://31.97.206.144:5000/api/project/${id}`, {
        method: 'PUT',
        body: formDataToSend
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Project updated!');
        setTimeout(() => navigate('/projects'), 1500);
      } else {
        setError(data.message || 'Update failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container-fluid py-5 text-center">Loading...</div>;

  return (
    <div className="container-fluid">
      <h2 className="mb-4 fw-bold" style={{ color: '#009788' }}>Edit Project</h2>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom-2" style={{ borderColor: '#009788' }}>
          <h4 className="mb-0 fw-bold" style={{ color: '#009788' }}>Project Details</h4>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* ... Same fields as AddProject ... */}
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

            {/* File */}
            <div className="mb-3">
              <label className="form-label fw-semibold">Current File</label>
              {existingFile ? (
                <a href={existingFile} target="_blank" rel="noopener noreferrer" className="text-primary">
                  📎 View File
                </a>
              ) : (
                <span className="text-muted">No file</span>
              )}
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Replace File (Optional)</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*,.pdf,.doc,.docx"
              />
            </div>

            <div className="d-flex gap-3">
              <button
                type="submit"
                className="btn text-white fw-semibold"
                style={{ backgroundColor: '#009788' }}
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Update Project'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/projects')}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProject;