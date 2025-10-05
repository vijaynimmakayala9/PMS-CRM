// App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './components/Dashboard';
import Staff from './components/Staff';
import AddStaff from './components/AddStaff';
import Projects from './components/Projects';
import AddProject from './components/AddProject';
import AssignedWorks from './components/AssignedWorks';
import AddWorksheet from './components/AddWorksheet';
import EditStaff from './components/EditStaff';
import EditProject from './components/EditProject';
import EditWorksheet from './components/EditWorksheet';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check on mount if user is logged in
  useEffect(() => {
    const adminDetails = sessionStorage.getItem('adminDetails');
    if (adminDetails) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminDetails');
    setIsLoggedIn(false);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />}
      />

      <Route
        path="/"
        element={<DashboardLayout isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="staff" element={<Staff />} />
        <Route path="staff/:id" element={<EditStaff />} />
        <Route path="add-staff" element={<AddStaff />} />
        <Route path="add-project" element={<AddProject />} />
        <Route path="edit-project/:id" element={<EditProject />} />
        <Route path="projects" element={<Projects />} />
        <Route path="assigned-works" element={<AssignedWorks />} />
        <Route path="add-worksheet" element={<AddWorksheet />} />
        <Route path="edit-worksheet/:id" element={<EditWorksheet />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;