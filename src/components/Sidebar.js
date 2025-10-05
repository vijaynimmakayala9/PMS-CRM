// Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdPeople, MdFolder, MdAssignment, MdLock, MdSchedule, MdLogout, MdExpandMore, MdExpandLess } from 'react-icons/md';

const Sidebar = ({ isOpen, onLogout }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});

  const toggleSubmenu = (path) => {
    setOpenMenus((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminDetails');
    if (onLogout) onLogout(); // Notify parent to update state
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
    {
      path: 'staff',
      label: 'Staff',
      icon: <MdPeople />,
      submenu: [
        { path: '/add-staff', label: 'Add Staff' },
        { path: '/staff', label: 'Staff Members' },
      ],
    },
    {
      path: 'projects',
      label: 'Projects',
      icon: <MdFolder />,
      submenu: [
        { path: '/add-project', label: 'Add Project' },
        { path: '/projects', label: 'Projects List' },
      ],
    },
    {
      path: 'assigned-works',
      label: 'Assigned Works',
      icon: <MdAssignment />,
      submenu: [
        { path: '/add-worksheet', label: 'Add Worksheet' },
        { path: '/assigned-works', label: 'Assigned Works' },
      ],
    },
  ];

  const bottomMenuItems = [
    { path: '#', label: 'Change Password', icon: <MdLock /> },
    { path: '#', label: 'Attendance', icon: <MdSchedule /> },
  ];

  const sidebarStyle = {
    width: '260px',
    backgroundColor: '#008080',
    color: 'white',
    position: 'fixed',
    height: '100vh',
    transition: 'all 0.3s ease',
    zIndex: 1000,
    left: isOpen ? '0' : '-260px',
    display: 'flex',
    flexDirection: 'column',
  };

  const linkStyle = {
    transition: 'all 0.2s ease',
    borderLeft: '4px solid transparent',
  };

  const activeLinkStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderLeft: '4px solid white',
    borderRadius: '0 8px 8px 0',
    marginRight: '8px',
  };

  return (
    <div style={sidebarStyle}>
      <div
        className="p-4 text-center"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}
      >
        <h5 className="mb-0 fw-bold">Admin Panel</h5>
      </div>

      <div
        className="py-3"
        style={{
          flex: 1,
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {menuItems.map((item) => (
          <div key={item.path}>
            {item.submenu ? (
              <>
                <div
                  className="d-flex align-items-center justify-content-between px-4 py-3 text-white"
                  style={{ ...linkStyle, cursor: 'pointer' }}
                  onClick={() => toggleSubmenu(item.path)}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  <div className="d-flex align-items-center">
                    <span className="me-3 fs-5">{item.icon}</span>
                    <span className="fw-medium">{item.label}</span>
                  </div>
                  <span className="fs-5">
                    {openMenus[item.path] ? <MdExpandLess /> : <MdExpandMore />}
                  </span>
                </div>
                {openMenus[item.path] && (
                  <div className="ms-5">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className="d-block px-3 py-2 text-white text-decoration-none"
                        style={{
                          fontSize: '0.9rem',
                          transition: 'all 0.2s ease',
                          borderRadius: '6px',
                          margin: '2px 8px',
                          ...(location.pathname === subItem.path
                            ? { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                            : {}),
                        }}
                        onMouseEnter={(e) => {
                          if (location.pathname !== subItem.path)
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          if (location.pathname !== subItem.path)
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        • {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link
                to={item.path}
                className="d-flex align-items-center px-4 py-3 text-white text-decoration-none"
                style={{
                  ...linkStyle,
                  ...(location.pathname === item.path ? activeLinkStyle : {}),
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path)
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path)
                    e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span className="me-3 fs-5">{item.icon}</span>
                <span className="fw-medium">{item.label}</span>
              </Link>
            )}
          </div>
        ))}

        {/* Bottom Menu */}
        {bottomMenuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="d-flex align-items-center px-4 py-3 text-white text-decoration-none"
            style={{
              ...linkStyle,
              ...(location.pathname === item.path ? activeLinkStyle : {}),
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== item.path)
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== item.path)
                e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span className="me-3 fs-5">{item.icon}</span>
            <span className="fw-medium">{item.label}</span>
          </Link>
        ))}

        {/* Logout Button */}
        <div
          className="d-flex align-items-center px-4 py-3 text-white text-decoration-none"
          style={{ ...linkStyle, cursor: 'pointer' }}
          onClick={handleLogout}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'transparent')
          }
        >
          <span className="me-3 fs-5">
            <MdLogout />
          </span>
          <span className="fw-medium">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;