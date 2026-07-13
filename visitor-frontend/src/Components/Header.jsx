import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import logoImage from '../assets/susaruLogo.png';
import { authService } from '../services/authService';

const menuItems = [
  { name: 'Home', path: '/' },
  {
    name: 'Products',
    path: '/products',
    dropdown: [
      { name: 'Agarwood', path: '/products/agarwood' },
      { name: 'Rubber', path: '/products/rubber' },
      { name: 'Sandalwood', path: '/products/sandalwood' },
      { name: 'Tea', path: '/products/tea' },
      { name: 'Vanilla', path: '/products/vanilla' },
    ],
  },
  { name: 'Projects', path: '/projects' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isDropdownClicked, setIsDropdownClicked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authService.getCurrentUser();
          setIsAuthenticated(true);
          setUserData(response.data);
        } catch {
          // Token is invalid, remove it
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUserData(null);
        }
      } else {
        setIsAuthenticated(false);
        setUserData(null);
      }
    };

    checkAuthStatus();
  }, [location.pathname]); // Re-check when route changes

  // Close dropdowns on route change
  useEffect(() => {
    setOpenDropdown(null);
    setIsMenuOpen(false);
    setIsDropdownClicked(false);
  }, [location.pathname]);

  // Handle clicks outside of the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setIsDropdownClicked(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUserData(null);
    navigate('/');
  };

  // Helper to determine if a menu item is active
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Toggle dropdown when clicked
  const handleDropdownClick = (idx) => {
    if (openDropdown === idx) {
      setOpenDropdown(null);
      setIsDropdownClicked(false);
    } else {
      setOpenDropdown(idx);
      setIsDropdownClicked(true);
    }
  };

  return (
    <nav ref={navRef} className={`bg-white border-b border-green-100 ${scrolled ? 'shadow-md' : ''} transition-all duration-300 sticky top-0 z-50`}>
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <NavLink to="/" className="flex items-center space-x-3">
          <img src={logoImage} className="h-10" alt="Susaru Agro Logo"
               onError={(e) => {
                 e.target.onerror = null;
                 e.target.src = "https://via.placeholder.com/40x40?text=Logo";
               }}
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-green-800">Susaru Agro</span>
        </NavLink>
        <div className="flex items-center md:order-2">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-green-700 font-medium">
                Welcome, {userData?.firstName || userData?.data?.firstName || 'Customer'}
              </span>
              <button 
                onClick={handleLogout}
                className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/customer/login" className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2">
              Customer Login
            </NavLink>
          )}
          <NavLink to="/try-agarwood" className="text-green-700 border border-green-700 hover:bg-green-50 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center hidden md:inline-block">
            Try Agarwood
          </NavLink>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ml-2"
            aria-controls="navbar-default"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
          </button>
        </div>
        <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto md:order-1`} id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-green-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white">
            {menuItems.map((item, idx) => (
              <li key={item.name} className="relative group">
                {!item.dropdown ? (
                  <NavLink
                    to={item.path}
                    className={({ isActive: navIsActive }) =>
                      `block py-2 px-3 rounded md:p-0 transition-colors duration-200 ${
                        isActive(item.path) || navIsActive
                          ? 'text-green-700 font-semibold'
                          : 'text-black hover:text-green-700'
                      }`
                    }
                    end={item.path === '/'}
                  >
                    {item.name}
                  </NavLink>
                ) : (
                  <>
                    <button
                      type="button"
                      className={`flex items-center py-2 px-3 rounded md:p-0 transition-colors duration-200 ${
                        isActive(item.path)
                          ? 'text-green-700 font-semibold'
                          : 'text-black hover:text-green-700'
                      }`}
                      onClick={() => handleDropdownClick(idx)}
                      onMouseEnter={() => !isDropdownClicked && setOpenDropdown(idx)}
                      onMouseLeave={() => !isDropdownClicked && setOpenDropdown(null)}
                    >
                      {item.name}
                      <svg className="w-2.5 h-2.5 ml-1" aria-hidden="true" fill="none" viewBox="0 0 10 6">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                      </svg>
                    </button>
                    {/* Dropdown */}
                    <div
                      className={`${
                        openDropdown === idx ? 'block' : 'hidden'
                      } absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50`}
                      onMouseEnter={() => !isDropdownClicked && setOpenDropdown(idx)}
                      onMouseLeave={() => !isDropdownClicked && setOpenDropdown(null)}
                    >
                      {item.dropdown.map((sub) => (
                        <NavLink
                          key={sub.name}
                          to={sub.path}
                          className={({ isActive: navIsActive }) =>
                            `block px-4 py-2 text-sm rounded transition-colors duration-200 ${
                              isActive(sub.path) || navIsActive
                                ? 'text-green-700 font-semibold bg-green-50'
                                : 'text-gray-700 hover:bg-green-50'
                            }`
                          }
                          onClick={() => {
                            setOpenDropdown(null);
                            setIsDropdownClicked(false);
                          }}
                        >
                          {sub.name}
                        </NavLink>
                      ))}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
