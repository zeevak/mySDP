import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Set base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:5000';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token) {
      // User is already logged in, redirect to appropriate dashboard
      if (role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/staff/dashboard');
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log('Login attempt with:', credentials.username);

    try {
      console.log('Sending request to API...');
      
      // Set proper headers and timeout
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 100000 // 10 seconds timeout
      };
      
      const response = await axios.post('/api/staff/login', credentials, config);
      console.log('API Response:', response.data);
      
      if (response.data && response.data.success) {
        // Store the token and role
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
        
        // Also store user data if needed
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        console.log('Authentication successful, role:', response.data.role);

        // Redirect based on role
        if (response.data.role === 'Admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/staff/dashboard');
        }
      } else {
        // Handle unexpected success response format
        console.log('Unexpected response format:', response.data);
        setError('Unexpected response from server. Please try again.');
      }
    } catch (err) {
      console.error('Authentication Error:', err);
      
      // Comprehensive error handling
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. Please try again.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Network error. Please check your connection and try again.');
      } else if (err.response) {
        // The server responded with a status code outside the 2xx range
        console.log('Server error status:', err.response.status);
        console.log('Server error data:', err.response.data);
        
        if (err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError(`Server error (${err.response.status}). Please try again.`);
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.log('No response received:', err.request);
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request
        console.log('Request setup error:', err.message);
        setError('Error setting up request: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-green-700 p-6 text-center">
            <img 
              src="../src/assets/susaruLogo.png" 
              alt="Susaru Agro Plantation" 
              className="h-20 mx-auto mb-4"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/200x80?text=Susaru+Agro";
              }}
            />
            <h1 className="text-2xl font-bold text-white">Staff Portal</h1>
            <p className="text-green-100 mt-1">Access the Susaru Agro management system</p>
          </div>

          {/* Login Form */}
          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm rounded">
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={credentials.username}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : 'Sign in'}
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Having trouble logging in? <a href="mailto:support@susaruagro.com" className="font-medium text-green-600 hover:text-green-500">Contact support</a>
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-white">
          <p>© {new Date().getFullYear()} Susaru Agro Plantation. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
