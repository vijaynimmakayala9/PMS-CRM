// src/components/EditStaff.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const EditStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    staffId: '',
    staffName: '',
    mobileNumber: '',
    email: '',
    role: '',
    password: ''
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [existingDocument, setExistingDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStaff();
  }, [id]);

  const fetchStaff = async () => {
    try {
      const res = await fetch(`https://admin-emp.onrender.com/api/staff/${id}`);
      const data = await res.json();
      if (data.success) {
        const staff = data.data;
        setFormData({
          staffId: staff.staffId || '',
          staffName: staff.staffName || '',
          mobileNumber: staff.mobileNumber || '',
          email: staff.email || '',
          role: staff.role || '',
          password: '' // Don't pre-fill password
        });
        if (staff.documents && staff.documents.length > 0) {
          setExistingDocument(staff.documents[0]);
        }
      } else {
        setError('Failed to load staff data');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a valid image (JPG/PNG) or document (PDF/DOC/DOCX)');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setFile(selectedFile);

    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setFilePreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
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
      formDataToSend.append('documents', file);
    }

    try {
      const response = await fetch(`https://admin-emp.onrender.com/api/update_staff/${id}`, {
        method: 'PUT',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Staff updated successfully!');
        setTimeout(() => navigate('/staff'), 1500);
      } else {
        setError(data.message || 'Failed to update staff');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container-fluid py-5 text-center">Loading...</div>;
  if (error) return <div className="container-fluid py-5"><div className="alert alert-danger">{error}</div></div>;

  return (
    <div className="container-fluid">
      <h2 className="mb-4 fw-bold" style={{ color: '#009788' }}>Edit Staff</h2>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom-2" style={{ borderColor: '#009788' }}>
          <h4 className="mb-0 fw-bold" style={{ color: '#009788' }}>Staff Information</h4>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="staffId" className="form-label fw-semibold">Staff ID</label>
                <input
                  type="text"
                  className="form-control"
                  id="staffId"
                  name="staffId"
                  value={formData.staffId}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="staffName" className="form-label fw-semibold">Staff Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="staffName"
                  name="staffName"
                  value={formData.staffName}
                  onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="mobileNumber" className="form-label fw-semibold">Mobile Number</label>
                <input
                  type="tel"
                  className="form-control"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label fw-semibold">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="role" className="form-label fw-semibold">Role</label>
                <select
                  className="form-select"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="">Select Role</option>
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
              <div className="col-md-6 mb-3">
                <label htmlFor="password" className="form-label fw-semibold">Password (Leave blank to keep current)</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {/* Document Preview & Upload */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Current Document</label>
              {existingDocument ? (
                <div className="mb-2">
                  {existingDocument.endsWith('.pdf') || existingDocument.includes('.doc') ? (
                    <a href={existingDocument} target="_blank" rel="noopener noreferrer" className="text-primary">
                      📄 View Document
                    </a>
                  ) : (
                    <img
                      src={existingDocument}
                      alt="Staff Document"
                      style={{
                        width: '120px',
                        height: '120px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                    />
                  )}
                </div>
              ) : (
                <p className="text-muted">No document uploaded</p>
              )}

              <label htmlFor="documents" className="form-label fw-semibold mt-2">Replace Document (Optional)</label>
              <input
                type="file"
                className="form-control"
                id="documents"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
              />
              <div className="form-text">Accepted: JPG, PNG, PDF, DOC, DOCX (Max 5MB)</div>

              {filePreview && (
                <div className="mt-2">
                  <img
                    src={filePreview}
                    alt="Preview"
                    style={{
                      width: '120px',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      border: '1px solid #ddd'
                    }}
                  />
                </div>
              )}
            </div>

            <div className="d-flex gap-3">
              <button
                type="submit"
                className="btn text-white fw-semibold"
                style={{ backgroundColor: '#009788' }}
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Update Staff'}
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => navigate('/staff')}
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

export default EditStaff;