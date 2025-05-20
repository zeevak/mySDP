import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StaffHeader from '../../Components/Staff_Header';
import StaffFooter from '../../Components/Staff_Footer';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    customers: 0,
    inventory: 0
  });

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch dashboard data from API
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        // Fetch dashboard stats
        const statsResponse = await axios.get('http://localhost:5001/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Dashboard stats response:', statsResponse.data);

        if (statsResponse.data) {
          setStats({
            customers: statsResponse.data.customers || 0,
            inventory: statsResponse.data.inventory || 0
          });
        }

        // Fetch recent activities
        const activityResponse = await axios.get('http://localhost:5001/api/dashboard/activity', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (activityResponse.data) {
          setActivities(activityResponse.data);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <StaffHeader />

      <main className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Staff Dashboard</h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">Total Customers</h3>
                  <p className="text-3xl font-bold text-gray-800">{stats.customers}</p>
                  <div className="mt-2">
                    <Link to="/staff/customers" className="text-green-600 text-sm hover:text-green-800">
                      View all customers →
                    </Link>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">Inventory Items</h3>
                  <p className="text-3xl font-bold text-gray-800">{stats.inventory}</p>
                  <div className="mt-2">
                    <Link to="/staff/inventory" className="text-green-600 text-sm hover:text-green-800">
                      Manage inventory →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Link
                    to="/staff/add-customer"
                    className="bg-green-100 hover:bg-green-200 text-green-800 py-3 px-4 rounded-md transition duration-200 text-left"
                  >
                    <span className="font-medium">Add New Customer</span>
                  </Link>
                  <Link
                    to="/staff/add-land"
                    className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 py-3 px-4 rounded-md transition duration-200 text-left"
                  >
                    <span className="font-medium">Add New Land</span>
                  </Link>
                  <Link
                    to="/staff/submit-proposal"
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-3 px-4 rounded-md transition duration-200 text-left"
                  >
                    <span className="font-medium">Submit Proposal</span>
                  </Link>
                  <Link
                    to="/staff/start-project"
                    className="bg-purple-100 hover:bg-purple-200 text-purple-800 py-3 px-4 rounded-md transition duration-200 text-left"
                  >
                    <span className="font-medium">Start Project</span>
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {activities && activities.length > 0 ? (
                    activities.map((activity, index) => {
                      // Determine border color based on activity type
                      let borderColor = 'border-gray-500';
                      if (activity.type === 'Customer') borderColor = 'border-green-500';
                      else if (activity.type === 'Project') borderColor = 'border-blue-500';
                      else if (activity.type === 'Message') borderColor = 'border-yellow-500';
                      else if (activity.type === 'Request') borderColor = 'border-purple-500';

                      // Format date
                      const date = new Date(activity.timestamp);
                      const formattedDate = new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true
                      }).format(date);

                      return (
                        <div key={index} className={`border-l-4 ${borderColor} pl-4 py-1`}>
                          <p className="text-sm text-gray-600">{formattedDate}</p>
                          <p className="font-medium">{activity.description}: {activity.user}</p>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No recent activities to display
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <StaffFooter />
    </div>
  );
};

export default StaffDashboard;