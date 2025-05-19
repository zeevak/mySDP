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
  const [showMessagesPopup, setShowMessagesPopup] = useState(false);
  const [messages, setMessages] = useState([]);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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

  // Fetch messages when popup is opened
  useEffect(() => {
    if (showMessagesPopup) {
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:5001/api/message', {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.data && response.data.data) {
            setMessages(response.data.data);
          } else {
            setMessages([]);
          }
        } catch (err) {
          console.error('Failed to load messages:', err);
        }
      };

      fetchMessages();
    }
  }, [showMessagesPopup]);

  // Toggle message expansion and mark as read
  const toggleMessage = async (messageId) => {
    try {
      // If message is already expanded, collapse it
      if (expandedMessageId === messageId) {
        setExpandedMessageId(null);
        return;
      }

      // Expand the message
      setExpandedMessageId(messageId);

      // Find the message
      const message = messages.find(msg => msg.message_id === messageId);

      // If message is unread, mark it as read
      if (message && !message.is_read) {
        const token = localStorage.getItem('token');
        await axios.get(`http://localhost:5001/api/message/${messageId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Update the message in the local state
        setMessages(messages.map(msg =>
          msg.message_id === messageId ? { ...msg, is_read: true } : msg
        ));

        // Update unread count in stats
        setStats(prevStats => ({
          ...prevStats,
          messages: prevStats.messages > 0 ? prevStats.messages - 1 : 0
        }));
      }
    } catch (err) {
      console.error('Error toggling message:', err);
    }
  };

  // Handle delete message
  const handleDeleteClick = (e, messageId) => {
    e.stopPropagation(); // Prevent toggling the message
    setMessageToDelete(messageId);
    setShowDeleteConfirm(true);
  };

  // Confirm delete message
  const confirmDelete = async () => {
    if (!messageToDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/message/${messageToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Check if the deleted message was unread
      const deletedMessage = messages.find(msg => msg.message_id === messageToDelete);
      if (deletedMessage && !deletedMessage.is_read) {
        setStats(prevStats => ({
          ...prevStats,
          messages: prevStats.messages > 0 ? prevStats.messages - 1 : 0
        }));
      }

      // Update messages list
      setMessages(messages.filter(msg => msg.message_id !== messageToDelete));

      // Reset state
      setShowDeleteConfirm(false);
      setMessageToDelete(null);
      setSuccessMessage('Message deleted successfully');

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setMessageToDelete(null);
  };

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
                    <button
                      onClick={() => setShowMessagesPopup(true)}
                      className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition"
                    >
                      View All
                    </button>
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

      {/* Messages Popup */}
      {showMessagesPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Messages</h3>
              <button
                onClick={() => setShowMessagesPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {successMessage && (
              <div className="mx-6 mt-4 bg-green-50 text-green-700 p-3 rounded-md">
                {successMessage}
              </div>
            )}

            <div className="p-6 overflow-y-auto flex-grow">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No messages found</p>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.message_id}
                      className={`bg-white rounded-lg border overflow-hidden transition-all duration-300 ${
                        !message.is_read ? 'border-l-4 border-green-500' : 'border-gray-200'
                      }`}
                    >
                      {/* Message Header - Always visible */}
                      <div
                        className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                        onClick={() => toggleMessage(message.message_id)}
                      >
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {message.f_name} {message.l_name}
                            {!message.is_read && (
                              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                New
                              </span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {message.email} • {formatDate(message.created_at)}
                          </p>
                        </div>
                        <div className="text-gray-400">
                          {expandedMessageId === message.message_id ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>

                      {/* Message Content - Visible only when expanded */}
                      {expandedMessageId === message.message_id && (
                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700">Interested in:</span>
                            <span className="ml-2 text-sm text-gray-600">{message.interested_in || 'Not specified'}</span>
                          </div>
                          <div className="mb-3">
                            <span className="text-sm font-medium text-gray-700">Phone:</span>
                            <span className="ml-2 text-sm text-gray-600">{message.phone_no || 'Not provided'}</span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Message:</span>
                            <p className="mt-2 text-gray-600 whitespace-pre-wrap">{message.message_text}</p>
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button
                              className="text-sm text-red-500 hover:text-red-700"
                              onClick={(e) => handleDeleteClick(e, message.message_id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t">
              <button
                onClick={() => setShowMessagesPopup(false)}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 rounded-md text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
