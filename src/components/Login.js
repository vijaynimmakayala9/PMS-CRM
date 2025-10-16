import React, { useState } from 'react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) return;

    setLoading(true);
    try {
      const response = await fetch('http://31.97.206.144:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminName: 'SuperAdmin',
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Store admin details and password in sessionStorage
        const adminDetails = {
          adminName: data.data.adminName,
          email: data.data.email,
          adminId: data.data._id,
          password: formData.password // store typed password
        };
        sessionStorage.setItem('adminDetails', JSON.stringify(adminDetails));
        onLogin();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex min-vh-100">
      {/* Left Side: Login Form + Logo (Mobile) */}
      <div
        className="d-flex flex-column align-items-center justify-content-center p-3 p-md-5"
        style={{ flex: '1', backgroundColor: 'white' }}
      >
        {/* Logo for Mobile */}
        <div className="d-md-none mb-4 d-flex justify-content-center">
          <img
            src="/logo1.png"
            alt="Company Logo"
            style={{ width: '150px', height: 'auto', objectFit: 'contain' }}
          />
        </div>

        <div className="w-100 d-flex flex-column align-items-center" style={{ maxWidth: '400px' }}>
          <h2 className="fw-bold mb-4 text-center">Welcome Back!</h2>

          {error && <p className="text-danger text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="w-100">
            <div className="mb-4">
              <label htmlFor="email" className="form-label text-muted fw-normal">Email</label>
              <input
                type="email"
                className="form-control border-0 border-bottom rounded-0 py-2 px-0"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ fontSize: '1rem', fontWeight: '500', borderColor: '#ccc', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#009788'}
                onBlur={(e) => e.target.style.borderColor = '#ccc'}
              />
            </div>

            <div className="mb-4 position-relative">
              <label htmlFor="password" className="form-label text-muted fw-normal">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control border-0 border-bottom rounded-0 py-2 px-0"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ fontSize: '1rem', fontWeight: '500', borderColor: '#ccc', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#009788'}
                onBlur={(e) => e.target.style.borderColor = '#ccc'}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="position-absolute end-0 top-50 translate-middle-y me-2 cursor-pointer"
                style={{ color: '#666', fontSize: '1.1rem', pointerEvents: 'auto' }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setShowPassword(!showPassword)}
              >
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </span>
            </div>

            <button
              type="submit"
              className="btn w-100 py-3 fw-semibold mt-3"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #008080, #008080)',
                color: 'white',
                borderRadius: '8px',
                fontSize: '1.1rem',
                border: 'none',
                letterSpacing: '0.5px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#007a6e'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#009788'}
            >
              {loading ? 'Logging in...' : 'Proceed'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side: Decorative Background + Centered Logo (Desktop Only) */}
      <div
        className="d-none d-md-block position-relative"
        style={{ flex: '1', background: 'linear-gradient(135deg, #008080, #001A1A)', overflow: 'hidden' }}
      >
        {/* Abstract Circles */}
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', borderRadius: '50%', backgroundColor: '#FFA500', opacity: 0.8 }}></div>
        <div style={{ position: 'absolute', top: '100px', right: '20px', width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#40E0D0', opacity: 0.7 }}></div>
        <div style={{ position: 'absolute', bottom: '-30px', left: '-30px', width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#FFA500', opacity: 0.6 }}></div>
        <div style={{ position: 'absolute', bottom: '80px', left: '40px', width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#40E0D0', opacity: 0.5 }}></div>

        {/* Diagonal Lines */}
        {/* <div style={{ position: 'absolute', top: '20%', right: '10%', width: '60px', height: '4px', backgroundColor: 'white', transform: 'rotate(45deg)', opacity: 0.8 }}></div>
        <div style={{ position: 'absolute', top: '25%', right: '15%', width: '80px', height: '4px', backgroundColor: 'white', transform: 'rotate(45deg)', opacity: 0.6 }}></div> */}

        {/* Centered Logo */}
        <div className="position-absolute top-50 start-50 translate-middle" style={{ width: '180px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
          <img
            src="/logo.png"
            alt="Company Logo"
            style={{ width: '100%', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
