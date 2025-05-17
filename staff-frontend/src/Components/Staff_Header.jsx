import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Staff_Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // You could decode JWT here to get username or fetch from API
      setUsername(localStorage.getItem('username') || 'User');
    } else {
      setIsLoggedIn(false);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Don't show navigation options on login page
  const isLoginPage = location.pathname === '/login';

  return (
    <header className="bg-green-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to={isLoggedIn ? '/dashboard' : '/login'} className="flex items-center">
              <img src="/logo.png" alt="Susaru Agro" className="h-8 mr-3" />
              <span className="text-xl font-semibold">Susaru Agro</span>
            </Link>
          </div>

          {!isLoginPage && (
            <>
              <nav className={`md:flex ${isMenuOpen ? 'block absolute top-16 left-0 right-0 bg-green-800 shadow-md z-50 p-4' : 'hidden'} md:relative md:top-0 md:bg-transparent md:shadow-none md:p-0`}>
                {isLoggedIn && (
                  <ul className="md:flex space-y-2 md:space-y-0 md:space-x-6">
                    <li>
                      <Link 
                        to="/dashboard" 
                        className={`block px-3 py-2 rounded-md ${location.pathname === '/dashboard' ? 'bg-green-700' : 'hover:bg-green-700'} transition duration-200`}
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/customers" 
                        className={`block px-3 py-2 rounded-md ${location.pathname.includes('/customers') ? 'bg-green-700' : 'hover:bg-green-700'} transition duration-200`}
                      >
                        Customers
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/inventory" 
                        className={`block px-3 py-2 rounded-md ${location.pathname.includes('/inventory') ? 'bg-green-700' : 'hover:bg-green-700'} transition duration-200`}
                      >
                        Inventory
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/projects" 
                        className={`block px-3 py-2 rounded-md ${location.pathname.includes('/projects') ? 'bg-green-700' : 'hover:bg-green-700'} transition duration-200`}
                      >
                        Projects
                      </Link>
                    </li>
                  </ul>
                )}
              </nav>

              <div className="flex items-center">
                {isLoggedIn ? (
                  <div className="flex items-center">
                    <span className="hidden md:inline-block mr-4 text-green-100">{username}</span>
                    <button 
                      onClick={handleLogout}
                      className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-md transition duration-200"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/login"
                    className="bg-white text-green-800 hover:bg-gray-100 px-4 py-2 rounded-md transition duration-200"
                  >
                    Login
                  </Link>
                )}
                
                <button 
                  onClick={toggleMenu}
                  className="ml-4 md:hidden focus:outline-none"
                >
                  <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Staff_Header;
