// src/components/AddWorksheet.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddWorksheet = () => {
  const [formData, setFormData] = useState({
    empId: '',
    employName: '',
    sheet: 'frontend',
    projects: [{
      projectName: '',
      startDate: '',
      endDate: '',
      comment: '',
      hours: '',
      shift: 'morning'
    }]
  });
  const [staffOptions, setStaffOptions] = useState([]);
  const [projectOptions, setProjectOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  // Fetch staff and projects for dropdowns
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [staffRes, projectRes] = await Promise.all([
          fetch('https://admin-emp.onrender.com/api/get_all_staffs'),
          fetch('https://admin-emp.onrender.com/api/projects')
        ]);
        const staffData = await staffRes.json();
        const projectData = await projectRes.json();

        if (staffData.success) {
          setStaffOptions(staffData.data);
        }
        if (projectData.success) {
          setProjectOptions(projectData.data);
        }
      } catch (err) {
        console.error('Failed to fetch options');
      }
    };
    fetchOptions();
  }, []);

  const handleMainChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...formData.projects];
    newProjects[index][field] = value;
    setFormData({ ...formData, projects: newProjects });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [...formData.projects, {
        projectName: '',
        startDate: '',
        endDate: '',
        comment: '',
        hours: '',
        shift: 'morning'
      }]
    });
  };

  const removeProject = (index) => {
    if (formData.projects.length > 1) {
      const newProjects = formData.projects.filter((_, i) => i !== index);
      setFormData({ ...formData, projects: newProjects });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate at least one project
    if (formData.projects.some(p => !p.projectName || !p.startDate || !p.endDate || !p.hours)) {
      setError('Please fill all project fields');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('https://admin-emp.onrender.com/api/assign_project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Assignment created successfully!');
        setTimeout(() => navigate('/assigned-works'), 1500);
      } else {
        setError(data.message || 'Failed to create assignment');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <h2 className="mb-4 fw-bold" style={{ color: '#009788' }}>Add Worksheet</h2>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom-2" style={{ borderColor: '#009788' }}>
          <h4 className="mb-0 fw-bold" style={{ color: '#009788' }}>Worksheet Information</h4>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            {/* Employee Info */}
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Employee ID *</label>
                <select
                  className="form-select"
                  name="empId"
                  value={formData.empId}
                  onChange={(e) => {
                    handleMainChange(e);
                    const selected = staffOptions.find(s => s.staffId === e.target.value);
                    if (selected) {
                      setFormData(prev => ({ ...prev, employName: selected.staffName }));
                    }
                  }}
                  required
                >
                  <option value="">Select Employee ID</option>
                  {staffOptions.map(staff => (
                    <option key={staff._id} value={staff.staffId}>
                      {staff.staffId} - {staff.staffName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Employee Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="employName"
                  value={formData.employName}
                  onChange={handleMainChange}
                  required
                  readOnly
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">Sheet Type *</label>
              <select
                className="form-select"
                name="sheet"
                value={formData.sheet}
                onChange={handleMainChange}
                required
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="testing">Testing</option>
                <option value="design">Design</option>
                <option value="Full Stack">Full Stack</option>
                <option value="Digital Marketing">Digital Marketing</option>
              </select>
            </div>

            <hr className="my-4" />
            <h5 className="mb-3 fw-bold" style={{ color: '#009788' }}>Project Assignments</h5>

            {formData.projects.map((project, index) => (
              <div key={index} className="border rounded p-3 mb-3 position-relative">
                {formData.projects.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                    onClick={() => removeProject(index)}
                  >
                    Remove
                  </button>
                )}

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Project Name *</label>
                    <select
                      className="form-select"
                      value={project.projectName}
                      onChange={(e) => handleProjectChange(index, 'projectName', e.target.value)}
                      required
                    >
                      <option value="">Select Project</option>
                      {projectOptions.map(p => (
                        <option key={p._id} value={p.projectname}>
                          {p.projectname}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Shift *</label>
                    <select
                      className="form-select"
                      value={project.shift}
                      onChange={(e) => handleProjectChange(index, 'shift', e.target.value)}
                      required
                    >
                      <option value="morning">Morning</option>
                      <option value="Afternoon">Afternoon</option>
                      <option value="fullday">Full Day</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Start Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={project.startDate}
                      onChange={(e) => handleProjectChange(index, 'startDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">End Date *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={project.endDate}
                      onChange={(e) => handleProjectChange(index, 'endDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Hours *</label>
                    <input
                      type="number"
                      className="form-control"
                      value={project.hours}
                      onChange={(e) => handleProjectChange(index, 'hours', e.target.value)}
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Comment</label>
                  <textarea
                    className="form-control"
                    value={project.comment}
                    onChange={(e) => handleProjectChange(index, 'comment', e.target.value)}
                    rows="2"
                  ></textarea>
                </div>
              </div>
            ))}

            <div className="d-flex gap-2 mb-4">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={addProject}
              >
                + Add Another Project
              </button>
            </div>

            <button
              type="submit"
              className="btn text-white fw-semibold"
              style={{ backgroundColor: '#009788' }}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Submit Assignment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddWorksheet;