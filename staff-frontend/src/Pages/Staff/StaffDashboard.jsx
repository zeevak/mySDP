import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StaffHeader from '../../Components/Staff_Header';
import StaffFooter from '../../Components/Staff_Footer';

const StaffDashboard = () => {
  const [stats, setStats] = useState({
    customers: 0,
    inventory: 0,
    orders: 0,
    revenue: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate fetching dashboard data
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // const response = await axios.get('/api/staff/dashboard', {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        // });

        // Simulate API response
        setTimeout(() => {
          setStats({
            customers: 124,
            inventory: 57,
            orders: 32,
            revenue: 15750
          });
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
        console.error(err);
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">Recent Orders</h3>
                  <p className="text-3xl font-bold text-gray-800">{stats.orders}</p>
                  <div className="mt-2">
                    <Link to="/staff/orders" className="text-green-600 text-sm hover:text-green-800">
                      View all orders →
                    </Link>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-gray-500 text-sm font-medium mb-2">Monthly Revenue</h3>
                  <p className="text-3xl font-bold text-gray-800">${stats.revenue.toLocaleString()}</p>
                  <div className="mt-2">
                    <span className="text-green-600 text-sm">
                      +12% from last month
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="bg-green-100 hover:bg-green-200 text-green-800 py-3 px-4 rounded-md transition duration-200 text-left">
                    <span className="font-medium">Add New Customer</span>
                  </button>
                  <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-3 px-4 rounded-md transition duration-200 text-left">
                    <span className="font-medium">Update Inventory</span>
                  </button>
                  <button className="bg-purple-100 hover:bg-purple-200 text-purple-800 py-3 px-4 rounded-md transition duration-200 text-left">
                    <span className="font-medium">Process Order</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4 py-1">
                    <p className="text-sm text-gray-600">Today, 10:30 AM</p>
                    <p className="font-medium">New customer registered: John Smith</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4 py-1">
                    <p className="text-sm text-gray-600">Yesterday, 3:45 PM</p>
                    <p className="font-medium">Inventory updated: Tea stock +200kg</p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4 py-1">
                    <p className="text-sm text-gray-600">Yesterday, 11:20 AM</p>
                    <p className="font-medium">Order #1234 status changed to "Shipped"</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4 py-1">
                    <p className="text-sm text-gray-600">Aug 15, 2023, 9:15 AM</p>
                    <p className="font-medium">New payment received: $1,250.00</p>
                  </div>
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