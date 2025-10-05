// src/components/AddStaff.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddStaff = () => {
  const [formData, setFormData] = useState({
    staffId: '',
    staffName: '',
    mobileNumber: '',
    email: '',
    role: '',
    password: ''
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null); // For image preview
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null);
      setFilePreview(null);
      return;
    }

    // Allowed types: images + documents
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

    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setFile(selectedFile);

    // Generate preview only for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a photo or document');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });
    formDataToSend.append('documents', file); // Backend expects 'documents'

    try {
      const response = await fetch('https://admin-emp.onrender.com/api/create_staff', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Staff added successfully!');
        setTimeout(() => navigate('/staff'), 1500);
      } else {
        setError(data.message || 'Failed to add staff');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="mb-4 fw-bold" style={{ color: '#009788' }}>Add Staff</h2>

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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="password" className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label htmlFor="documents" className="form-label fw-semibold">
                Upload Photo or Document
              </label>
              <input
                type="file"
                className="form-control"
                id="documents"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                required
              />
              <div className="form-text">
                Accepted: JPG, PNG, PDF, DOC, DOCX (Max 5MB)
              </div>

              {/* Image Preview */}
              {filePreview && (
                <div className="mt-3">
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

            <button
              type="submit"
              className="btn text-white fw-semibold"
              style={{ backgroundColor: '#009788' }}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Staff'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;