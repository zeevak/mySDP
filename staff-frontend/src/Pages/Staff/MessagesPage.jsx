import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import StaffHeader from '../../Components/Staff_Header';
import StaffFooter from '../../Components/Staff_Footer';

const MessagesPage = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam === 'messages' ? 'messages' : 'requests');

  useEffect(() => {
    const currentTab = searchParams.get('tab');
    if (currentTab === 'messages') {
      setActiveTab('messages');
    } else if (currentTab === 'requests') {
      setActiveTab('requests');
    }
  }, [searchParams]);
  
  // Visitor messages state
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Customer Requests state
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);

  // General state
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // { id, type: 'message' | 'request' }

  // Fetch visitor messages
  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/message', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.data) {
        setMessages(response.data.data);
        const unread = response.data.data.filter(msg => !msg.is_read);
        setUnreadCount(unread.length);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Fetch customer requests
  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/requests', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.data) {
        setRequests(response.data.data);
        const pending = response.data.data.filter(r => r.status?.toLowerCase() === 'pending');
        setPendingRequestsCount(pending.length);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error('Fetch requests error:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchRequests();
  }, []);

  // Update request status (Staff action)
  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/requests/${requestId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage(`Request status updated to "${newStatus}"`);
      fetchRequests();

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status.');
    }
  };

  // Toggle visitor message expand
  const toggleMessage = async (messageId) => {
    try {
      if (expandedMessageId === messageId) {
        setExpandedMessageId(null);
        return;
      }

      setExpandedMessageId(messageId);
      const message = messages.find(msg => msg.message_id === messageId);

      if (message && !message.is_read) {
        const token = localStorage.getItem('token');
        await axios.get(`/api/message/${messageId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setMessages(messages.map(msg =>
          msg.message_id === messageId ? { ...msg, is_read: true } : msg
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error toggling message:', err);
    }
  };

  // Delete click trigger
  const handleDeleteClick = (e, id, type) => {
    e.stopPropagation();
    setItemToDelete({ id, type });
    setShowDeleteConfirm(true);
  };

  // Confirm Delete
  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      const token = localStorage.getItem('token');
      if (itemToDelete.type === 'message') {
        await axios.delete(`/api/message/${itemToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(messages.filter(m => m.message_id !== itemToDelete.id));
        setSuccessMessage('Message deleted successfully');
      } else {
        await axios.delete(`/api/requests/${itemToDelete.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRequests(requests.filter(r => r.request_id !== itemToDelete.id));
        setSuccessMessage('Customer request deleted successfully');
      }

      setShowDeleteConfirm(false);
      setItemToDelete(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete item');
    }
  };

  const getCategoryBadge = (type) => {
    switch (type?.toLowerCase()) {
      case 'complaint':
        return <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-rose-100 text-rose-800">⚠️ Complaint</span>;
      case 'suggestion':
        return <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-amber-100 text-amber-800">💡 Suggestion</span>;
      case 'general note':
        return <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-emerald-100 text-emerald-800">📝 General Note</span>;
      default:
        return <span className="px-2.5 py-0.5 text-xs font-bold rounded bg-blue-100 text-blue-800">❓ Inquiry</span>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">Resolved ✓</span>;
      case 'in progress':
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-800">In Progress ⏳</span>;
      default:
        return <span className="px-3 py-1 text-xs font-bold rounded-full bg-amber-100 text-amber-800">Pending ⏱️</span>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <StaffHeader />

      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Customer Support & Messages</h1>
              <p className="text-sm text-gray-500 mt-1">Manage customer requests and public website inquiries.</p>
            </div>

            {/* Tab Toggle */}
            <div className="flex bg-gray-200 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                  activeTab === 'requests' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Customer Requests ({pendingRequestsCount} Pending)
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                  activeTab === 'messages' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Visitor Inquiries ({unreadCount} Unread)
              </button>
            </div>
          </div>

          {/* Feedback Alerts */}
          {error && <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 text-sm">{error}</div>}
          {successMessage && <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-sm font-medium">{successMessage}</div>}

          {/* TAB 1: CUSTOMER REQUESTS */}
          {activeTab === 'requests' && (
            <div>
              {loadingRequests ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : requests.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                  <span className="text-3xl block mb-2">📥</span>
                  <p className="text-gray-500">No customer requests received yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {requests.map((req) => (
                    <div
                      key={req.request_id}
                      className="bg-white rounded-xl shadow-md border border-gray-100 hover:border-green-300 transition overflow-hidden p-6"
                    >
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-gray-100">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="text-lg font-bold text-gray-900">
                              {req.customer?.full_name || `Customer #${req.customer_id}`}
                            </h3>
                            {getCategoryBadge(req.request_type)}
                          </div>
                          <p className="text-xs text-gray-500">
                            {req.customer?.email} {(req.customer?.phone_no_1 || req.customer?.phone_number) ? `• ${req.customer.phone_no_1 || req.customer.phone_number}` : ''} •{' '}
                            {new Date(req.request_date).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div>{getStatusBadge(req.status)}</div>
                      </div>

                      {/* Request Details */}
                      <div className="mb-6">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Request Details:</h4>
                        <div className="bg-gray-50 p-4 rounded-lg text-gray-800 text-sm whitespace-pre-wrap border border-gray-200/60">
                          {req.request_details}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 font-medium">Update Status:</span>
                          <button
                            onClick={() => handleUpdateStatus(req.request_id, 'In Progress')}
                            disabled={req.status === 'In Progress'}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition disabled:opacity-50"
                          >
                            Mark In Progress
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req.request_id, 'Resolved')}
                            disabled={req.status === 'Resolved'}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition disabled:opacity-50"
                          >
                            Mark Resolved
                          </button>
                        </div>

                        <button
                          onClick={(e) => handleDeleteClick(e, req.request_id, 'request')}
                          className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition"
                        >
                          Delete Card
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VISITOR MESSAGES */}
          {activeTab === 'messages' && (
            <div>
              {loadingMessages ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                  <p className="text-gray-500">No visitor messages found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.message_id}
                      className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-200 ${
                        !message.is_read ? 'border-l-4 border-l-green-500 border-gray-200' : 'border-gray-200'
                      }`}
                    >
                      <div
                        className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                        onClick={() => toggleMessage(message.message_id)}
                      >
                        <div>
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            {message.f_name} {message.l_name}
                            {!message.is_read && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-bold">
                                New
                              </span>
                            )}
                          </h3>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {message.email} • {new Date(message.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-gray-400">
                          {expandedMessageId === message.message_id ? '▲' : '▼'}
                        </div>
                      </div>

                      {expandedMessageId === message.message_id && (
                        <div className="p-4 border-t border-gray-100 bg-gray-50">
                          <div className="mb-2 text-xs text-gray-600">
                            <strong>Interested in:</strong> {message.interested_in || 'N/A'} | <strong>Phone:</strong> {message.phone_no || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-800 whitespace-pre-wrap bg-white p-3 rounded-lg border border-gray-200 mt-2">
                            {message.message_text}
                          </div>
                          <div className="mt-4 flex justify-end">
                            <button
                              className="text-xs font-semibold text-red-600 hover:text-red-800"
                              onClick={(e) => handleDeleteClick(e, message.message_id, 'message')}
                            >
                              Delete Message
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <StaffFooter />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 rounded-lg text-sm text-white hover:bg-red-700 shadow-sm"
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

export default MessagesPage;
