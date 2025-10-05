import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectsTable = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('https://admin-emp.onrender.com/api/projects');
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setProjects(data.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="d-flex justify-content-between align-items-center p-4 pb-3">
          <h4 className="mb-0 fw-bold">Latest Projects</h4>
          <button className="btn text-white px-4" style={{ backgroundColor: '#009788' }} onClick={()=>navigate('/add-project')}>
            New
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead style={{ backgroundColor: '#f8f9fa' }}>
              <tr>
                <th className="py-3 px-4 border-0">S.no</th>
                <th className="py-3 px-4 border-0">Project ID</th>
                <th className="py-3 px-4 border-0">Project Name</th>
                <th className="py-3 px-4 border-0">Client Name</th>
                <th className="py-3 px-4 border-0">Mobile No</th>
                <th className="py-3 px-4 border-0">Status</th>
                <th className="py-3 px-4 border-0">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    Loading projects...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No projects found
                  </td>
                </tr>
              ) : (
                projects.map((project, index) => (
                  <tr
                    key={project._id}
                    style={
                      project.status?.toLowerCase() === 'process'
                        ? { backgroundColor: '#009788', color: 'white' }
                        : {}
                    }
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{project._id.slice(-6).toUpperCase()}</td>
                    <td className="py-3 px-4">{project.projectname}</td>
                    <td className="py-3 px-4">{project.clientname}</td>
                    <td className="py-3 px-4">{project.mobilenumber}</td>
                    <td className="py-3 px-4">
                      {project.status?.toLowerCase() === 'process' ? (
                        <span>{project.status}</span>
                      ) : (
                        <span className="badge bg-success text-capitalize">
                          {project.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="d-flex gap-3">
                        <span
                          style={{ cursor: 'pointer', fontSize: '20px' }}
                          title="View"
                        >
                          👁️
                        </span>
                        <span
                          style={{
                            cursor: 'pointer',
                            fontSize: '20px',
                            color:
                              project.status?.toLowerCase() === 'process'
                                ? 'white'
                                : '#dc3545',
                          }}
                          title="Delete"
                        >
                          🗑️
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectsTable;
