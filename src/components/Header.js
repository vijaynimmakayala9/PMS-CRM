import React from 'react';

const Header = ({ onToggleSidebar }) => {
  return (
    <header className="bg-white shadow-sm py-3 px-4 d-flex justify-content-between align-items-center sticky-top">
      <div className="d-flex align-items-center">
        <button
          className="btn btn-outline-primary me-3"
          onClick={onToggleSidebar}
          style={{ borderColor: '#009788', color: '#009788' }}
        >
          ☰
        </button>
        <h2 className="mb-0 fw-bold" style={{ color: '#009788' }}>Webcode Back!</h2>
      </div>
      <div className="d-flex align-items-center">
        <span className="me-3 text-muted">Welcome, Admin</span>
        <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
             style={{ width: '40px', height: '40px', backgroundColor: '#009788' }}>
          A
        </div>
      </div>
    </header>
  );
};

export default Header;