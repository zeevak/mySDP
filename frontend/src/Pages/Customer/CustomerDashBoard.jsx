import React, { useState, useEffect } from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { authService } from '../../services/authService';

const CustomerDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await authService.getCurrentUser();
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center bg-green-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-green-50 py-8">
        <div className="max-w-screen-xl mx-auto px-4">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white p-6 rounded-lg shadow-md mb-8">
            <h1 className="text-2xl font-bold">Welcome back, {userData?.firstName || userData?.data?.firstName || 'Valued Customer'}</h1>
            <p className="mt-2">Manage your plantation investments and track your returns</p>
          </div>

          {/* Dashboard Navigation */}
          <div className="bg-white rounded-lg shadow-md mb-8">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                  activeTab === 'overview'
                    ? 'text-green-700 border-b-2 border-green-700'
                    : 'text-gray-500 hover:text-green-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('investments')}
                className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                  activeTab === 'investments'
                    ? 'text-green-700 border-b-2 border-green-700'
                    : 'text-gray-500 hover:text-green-700'
                }`}
              >
                My Investments
              </button>
              <button
                onClick={() => setActiveTab('returns')}
                className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                  activeTab === 'returns'
                    ? 'text-green-700 border-b-2 border-green-700'
                    : 'text-gray-500 hover:text-green-700'
                }`}
              >
                Returns & Profits
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                  activeTab === 'documents'
                    ? 'text-green-700 border-b-2 border-green-700'
                    : 'text-gray-500 hover:text-green-700'
                }`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                  activeTab === 'profile'
                    ? 'text-green-700 border-b-2 border-green-700'
                    : 'text-gray-500 hover:text-green-700'
                }`}
              >
                Profile
              </button>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="md:col-span-2 space-y-6">
              {activeTab === 'overview' && (
                <>
                  {/* Investment Summary */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-green-800 mb-4">Investment Summary</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">Total Invested</p>
                        <p className="text-2xl font-bold text-green-800">$24,500</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">Current Value</p>
                        <p className="text-2xl font-bold text-green-800">$28,350</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">Total Returns</p>
                        <p className="text-2xl font-bold text-green-800">$3,850</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-md">
                        <p className="text-sm text-gray-500">ROI</p>
                        <p className="text-2xl font-bold text-green-800">15.7%</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold text-green-800 mb-4">Recent Activity</h2>
                    <div className="space-y-4">
                      <div className="border-b border-gray-100 pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Quarterly Dividend Paid</p>
                            <p className="text-sm text-gray-500">Tea Estate Investment</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">+$750.00</p>
                            <p className="text-sm text-gray-500">Apr 15, 2025</p>
                          </div>
                        </div>
                      </div>
                      <div className="border-b border-gray-100 pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Investment Confirmation</p>
                            <p className="text-sm text-gray-500">Vanilla Cultivation Project</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-600">$10,000.00</p>
                            <p className="text-sm text-gray-500">Mar 28, 2025</p>
                          </div>
                        </div>
                      </div>
                      <div className="border-b border-gray-100 pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Quarterly Dividend Paid</p>
                            <p className="text-sm text-gray-500">Tea Estate Investment</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">+$750.00</p>
                            <p className="text-sm text-gray-500">Jan 15, 2025</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="mt-4 text-green-700 text-sm font-medium hover:underline">View All Activity</button>
                  </div>
                </>
              )}

              {activeTab === 'investments' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold text-green-800 mb-4">My Investments</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">Tea Estate Partnership</div>
                            <div className="text-sm text-gray-500">Nuwara Eliya Region</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Oct 12, 2024</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$14,500.00</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">Vanilla Cultivation</div>
                            <div className="text-sm text-gray-500">Matale Region</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mar 28, 2025</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$10,000.00</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Processing</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'returns' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold text-green-800 mb-4">Returns & Profits</h2>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Quarterly Returns</h3>
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Returns chart will be displayed here</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Payment History</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Investment</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 15, 2025</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dividend</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tea Estate Partnership</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">$750.00</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 15, 2025</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dividend</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tea Estate Partnership</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">$750.00</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Oct 15, 2024</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dividend</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tea Estate Partnership</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">$750.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold text-green-800 mb-4">Documents</h2>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Investment Certificate - Tea Estate</p>
                        <p className="text-sm text-gray-500">Issued: Oct 15, 2024</p>
                      </div>
                      <button className="text-green-700 hover:text-green-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Quarterly Statement - Q1 2025</p>
                        <p className="text-sm text-gray-500">Issued: Apr 05, 2025</p>
                      </div>
                      <button className="text-green-700 hover:text-green-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">Tax Document - 2024</p>
                        <p className="text-sm text-gray-500">Issued: Feb 10, 2025</p>
                      </div>
                      <button className="text-green-700 hover:text-green-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold text-green-800 mb-4">Profile Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Details</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Title</label>
                          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.title || 'Mr/Ms'} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Full Name</label>
                          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.fullName || 'John Doe'} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Name with Initials</label>
                          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.nameWithInitials || 'J. Doe'} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">NIC Number</label>
                          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.nicNumber || 'XXXXXXXXXX'} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Email Address</label>
                          <input type="email" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.email || 'john.doe@example.com'} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                          <input type="tel" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.phoneNumber1 || '+94 71 234 5678'} readOnly />
                        </div>
                      </div>
                      <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">Edit Profile</button>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-4">Address & Security</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.addressLine1 || ''} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.addressLine2 || ''} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">City</label>
                          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.city || ''} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">District</label>
                          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.district || ''} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Province</label>
                          <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value={userData?.data?.province || ''} readOnly />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Password</label>
                          <input type="password" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500" value="********" readOnly />
                        </div>
                      </div>
                      <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">Change Password</button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-green-800 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <a href="/customer/new-investment" className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">New Investment</a>
                  <a href="/customer/contact-advisor" className="block w-full text-center px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition duration-300">Contact Advisor</a>
                  <a href="/customer/documents/upload" className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-300">Upload Document</a>
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-green-800 mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-3">
                    <p className="font-medium">Quarterly Dividend Payment</p>
                    <p className="text-sm text-gray-500">July 15, 2025</p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-3">
                    <p className="font-medium">Plantation Visit Opportunity</p>
                    <p className="text-sm text-gray-500">May 20, 2025</p>
                    <a href="#" className="text-xs text-green-700 hover:underline">Register Interest</a>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-3">
                    <p className="font-medium">Annual Investor Meeting</p>
                    <p className="text-sm text-gray-500">August 10, 2025</p>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-green-800 mb-4">Need Help?</h2>
                <p className="text-gray-600 mb-4">Our customer support team is available to assist you with any questions.</p>
                <div className="space-y-3">
                  <a href="tel:+94812345678" className="flex items-center text-gray-700 hover:text-green-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +94 81 234 5678
                  </a>
                  <a href="mailto:support@susaruagro.com" className="flex items-center text-gray-700 hover:text-green-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    support@susaruagro.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerDashboard;
