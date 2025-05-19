import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StaffHeader from '../../Components/Staff_Header';
import StaffFooter from '../../Components/Staff_Footer';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    staff: 0,
    projects: 0,
    inventory: 0,
    messages: 0,
    requests: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        // Fetch dashboard statistics
        const statsResponse = await axios.get('http://localhost:5001/api/admin/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Stats response:', statsResponse.data);

        // Fetch recent activity
        const activityResponse = await axios.get('http://localhost:5001/api/admin/dashboard/activity', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Activity response:', activityResponse.data);

        setStats(statsResponse.data);
        setRecentActivity(activityResponse.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <StaffHeader />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome to Susaru Agro Plantation management system</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">System Overview</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Customers</p>
                    <p className="text-2xl font-bold text-green-700">{stats.customers}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Staff</p>
                    <p className="text-2xl font-bold text-blue-700">{stats.staff}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Projects</p>
                    <p className="text-2xl font-bold text-purple-700">{stats.projects}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Inventory Items</p>
                    <p className="text-2xl font-bold text-yellow-700">{stats.inventory}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Communication</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Unread Messages</p>
                      <p className="text-2xl font-bold text-gray-700">{stats.messages}</p>
                    </div>
                    <Link
                      to="/staff/messages"
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Customer Requests</p>
                      <p className="text-2xl font-bold text-gray-700">{stats.requests}</p>
                    </div>
                    <Link
                      to="/staff/requests"
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition"
                    >
                      View All
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/admin/staff"
                    className="bg-blue-600 text-white p-3 rounded-lg text-center hover:bg-blue-700 transition"
                  >
                    Manage Staff
                  </Link>
                  <Link
                    to="/staff/customers"
                    className="bg-green-600 text-white p-3 rounded-lg text-center hover:bg-green-700 transition"
                  >
                    Manage Customers
                  </Link>
                  <Link
                    to="/staff/inventory"
                    className="bg-yellow-600 text-white p-3 rounded-lg text-center hover:bg-yellow-700 transition"
                  >
                    Inventory
                  </Link>
                  <Link
                    to="/staff/projects"
                    className="bg-purple-600 text-white p-3 rounded-lg text-center hover:bg-purple-700 transition"
                  >
                    Projects
                  </Link>
                  <Link
                    to="/admin/reports"
                    className="bg-indigo-600 text-white p-3 rounded-lg text-center hover:bg-indigo-700 transition col-span-2"
                  >
                    Monthly Reports
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Recent Activity</h2>
                <Link
                  to="/admin/activity"
                  className="text-green-600 hover:text-green-800 text-sm"
                >
                  View All
                </Link>
              </div>

              {recentActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent activity to display</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Activity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentActivity.map((activity, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{activity.description}</div>
                            <div className="text-xs text-gray-500">{activity.type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{activity.user}</div>
                            <div className="text-xs text-gray-500">{activity.role}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(activity.timestamp)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <StaffFooter />
    </div>
  );
};

export default AdminDashboard;
