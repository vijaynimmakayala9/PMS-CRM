import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  MdDashboard,
  MdPeople,
  MdFolder,
  MdAssignment,
  MdLock,
  MdSchedule,
  MdLogout,
  MdExpandMore,
  MdExpandLess,
  MdAddCircleOutline,
  MdListAlt,
  MdClose
} from 'react-icons/md';

const Sidebar = ({ isOpen, onLogout, isMobile, onClose }) => {
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
    if (onLogout) onLogout();
  };

  // Close sidebar when a link is clicked on mobile
  const handleLinkClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
    {
      path: 'staff',
      label: 'Staff',
      icon: <MdPeople />,
      submenu: [
        { path: '/add-staff', label: 'Add Staff', icon: <MdAddCircleOutline /> },
        { path: '/staff', label: 'Staff Members', icon: <MdListAlt /> },
      ],
    },
    {
      path: 'projects',
      label: 'Projects',
      icon: <MdFolder />,
      submenu: [
        { path: '/add-project', label: 'Add Project', icon: <MdAddCircleOutline /> },
        { path: '/projects', label: 'Projects List', icon: <MdListAlt /> },
      ],
    },
    {
      path: 'assigned-works',
      label: 'Assigned Works',
      icon: <MdAssignment />,
      submenu: [
        { path: '/add-worksheet', label: 'Add Worksheet', icon: <MdAddCircleOutline /> },
        { path: '/assigned-works', label: 'Assigned Works', icon: <MdListAlt /> },
      ],
    },
    {
      path: 'attendance',
      label: 'Attendance',
      icon: <MdSchedule />,
      submenu: [
        { path: '/add-attendance', label: 'Add Attendance', icon: <MdAddCircleOutline /> },
        { path: '/attendance', label: 'Show Attendance', icon: <MdListAlt /> },
      ],
    },
    {
      path: 'invoice',
      label: 'Invoice',
      icon: <MdFolder />,
      submenu: [
        { path: '/create-invoice', label: 'Create Invoice', icon: <MdAddCircleOutline /> },
        { path: '/invoices', label: 'Show Invoice', icon: <MdListAlt /> },
      ],
    },
    {
      path: 'payslip',
      label: 'Payslip',
      icon: <MdAssignment />,
      submenu: [
        { path: '/create-payslip', label: 'Create Payslip', icon: <MdAddCircleOutline /> },
        { path: '/payslips', label: 'Show Payslips', icon: <MdListAlt /> },
      ],
    },
  ];

  const bottomMenuItems = [
    { path: '#', label: 'Change Password', icon: <MdLock /> },
  ];

  const sidebarStyle = {
    width: isMobile ? '280px' : '260px',
    backgroundColor: '#008080',
    color: 'white',
    position: isMobile ? 'fixed' : 'fixed',
    height: '100vh',
    transition: 'transform 0.3s ease, left 0.3s ease',
    zIndex: 1000,
    left: isMobile ? (isOpen ? '0' : '-280px') : (isOpen ? '0' : '-260px'),
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
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
      {/* Header with close button for mobile */}
      <div
        className="p-4 text-center position-relative"
        style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}
      >
        {isMobile && (
          <button
            className="btn btn-sm position-absolute"
            style={{ right: '15px', top: '15px', color: 'white' }}
            onClick={onClose}
          >
            <MdClose size={20} />
          </button>
        )}
        <h5 className="mb-0 fw-bold">Admin Panel</h5>
      </div>

      <div
        className="py-3"
        style={{
          flex: 1,
          overflowY: 'auto',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          '&::-webkit-scrollbar': { display: 'none' }
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
                    !isMobile && (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')
                  }
                  onMouseLeave={(e) =>
                    !isMobile && (e.currentTarget.style.backgroundColor = 'transparent')
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
                  <div className="ms-4 ms-md-5">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className="d-flex align-items-center px-3 py-2 text-white text-decoration-none"
                        style={{
                          fontSize: '0.9rem',
                          transition: 'all 0.2s ease',
                          borderRadius: '6px',
                          margin: '2px 8px',
                          ...(location.pathname === subItem.path
                            ? { backgroundColor: 'rgba(255, 255, 255, 0.2)' }
                            : {}),
                        }}
                        onClick={handleLinkClick}
                        onMouseEnter={(e) => {
                          if (!isMobile && location.pathname !== subItem.path)
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isMobile && location.pathname !== subItem.path)
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <span className="me-2 fs-6">{subItem.icon}</span> 
                        <span>{subItem.label}</span>
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
                onClick={handleLinkClick}
                onMouseEnter={(e) => {
                  if (!isMobile && location.pathname !== item.path)
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  if (!isMobile && location.pathname !== item.path)
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
            onClick={handleLinkClick}
            onMouseEnter={(e) => {
              if (!isMobile && location.pathname !== item.path)
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              if (!isMobile && location.pathname !== item.path)
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
            !isMobile && (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)')
          }
          onMouseLeave={(e) =>
            !isMobile && (e.currentTarget.style.backgroundColor = 'transparent')
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