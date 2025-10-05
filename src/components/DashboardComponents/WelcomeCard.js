import React, { useEffect, useState } from 'react';
import { FaProjectDiagram, FaMobileAlt, FaGlobe, FaBullhorn, FaUsers } from 'react-icons/fa';

const WelcomeCard = () => {
  const [counts, setCounts] = useState({
    totalProjects: 0,
    apps: 0,
    websites: 0,
    marketing: 0,
    staff: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch project counts
        const countsRes = await fetch('https://admin-emp.onrender.com/api/counts');
        const countsData = await countsRes.json();

        // Fetch staff count
        const staffRes = await fetch('https://admin-emp.onrender.com/api/get_all_staffs');
        const staffData = await staffRes.json();

        if (countsData.success && staffData.success) {
          setCounts({
            totalProjects: countsData.totalProjects || 0,
            apps: countsData.categoryCounts?.['mobile app'] || 0,
            websites: countsData.categoryCounts?.['website'] || 0,
            marketing: countsData.categoryCounts?.['digital market'] || 0,
            staff: staffData.count || 0,
          });
        }
      } catch (error) {
        console.error('Error fetching counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  // Each stat with icon + color
  const stats = [
    { number: counts.totalProjects, label: 'Projects', icon: <FaProjectDiagram />, color: '#007bff' }, // Blue
    { number: counts.apps, label: 'Apps', icon: <FaMobileAlt />, color: '#28a745' }, // Green
    { number: counts.websites, label: 'Websites', icon: <FaGlobe />, color: '#ffc107' }, // Yellow
    { number: counts.marketing, label: 'Marketing', icon: <FaBullhorn />, color: '#dc3545' }, // Red
    { number: counts.staff, label: 'Staff', icon: <FaUsers />, color: '#6f42c1' }, // Purple
  ];

  const circleStyle = (color) => ({
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    backgroundColor: color,
    boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
  });

  return (
    <div
      className="card border-0 shadow-sm h-100"
      style={{ background: 'linear-gradient(135deg, #008080, #008080)' }}
    >
      <div className="card-body text-white text-center py-5">
        <h4 className="mb-4">Welcome Back!</h4>

        {/* Avatar */}
        <div className="d-flex justify-content-center mb-4">
          <div
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: 'white',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '50px' }}>👤</span>
          </div>
        </div>

        <h5 className="mb-4">Ganapathi Varma</h5>

        {/* Stats Circles */}
        <div className="row g-3 px-3">
          {loading ? (
            <div className="text-center text-white-50">Loading...</div>
          ) : (
            stats.map((stat, index) => (
              <div key={index} className="col-6 d-flex justify-content-center">
                <div style={circleStyle(stat.color)}>
                  <div className="fs-3">{stat.icon}</div>
                  <div className="fw-bold fs-5">{stat.number}</div>
                  <small>{stat.label}</small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeCard;
