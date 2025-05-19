import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StaffHeader from '../../Components/Staff_Header';
import StaffFooter from '../../Components/Staff_Footer';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch messages from the API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/message', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.data) {
          setMessages(response.data.data);
          // Count unread messages
          const unreadMessages = response.data.data.filter(msg => !msg.is_read);
          setUnreadCount(unreadMessages.length);
        } else {
          setMessages([]);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load messages');
        setLoading(false);
        console.error(err);
      }
    };

    fetchMessages();
  }, []);

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
        await axios.get(`/api/message/${messageId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Update the message in the local state
        setMessages(messages.map(msg =>
          msg.message_id === messageId ? { ...msg, is_read: true } : msg
        ));

        // Update unread count
        setUnreadCount(prevCount => prevCount - 1);
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
      await axios.delete(`/api/message/${messageToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Check if the deleted message was unread
      const deletedMessage = messages.find(msg => msg.message_id === messageToDelete);
      if (deletedMessage && !deletedMessage.is_read) {
        setUnreadCount(prevCount => prevCount - 1);
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
      setError('Failed to delete message');
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
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <StaffHeader />

      <main className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
            {unreadCount > 0 && (
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {unreadCount} Unread
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
              {successMessage}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <p className="text-gray-500">No messages found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.message_id}
                  className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
                    !message.is_read ? 'border-l-4 border-green-500' : ''
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
                      <div className="mt-4 flex justify-end space-x-4">
                        <button
                          className="text-sm text-red-500 hover:text-red-700"
                          onClick={(e) => handleDeleteClick(e, message.message_id)}
                        >
                          Delete
                        </button>
                        <button
                          className="text-sm text-gray-500 hover:text-gray-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedMessageId(null);
                          }}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <StaffFooter />

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

export default MessagesPage;
