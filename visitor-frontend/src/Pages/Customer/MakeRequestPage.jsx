import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

const MakeRequestPage = () => {
  const navigate = useNavigate();
  const [requestType, setRequestType] = useState('Inquiry');
  const [requestDetails, setRequestDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [myRequests, setMyRequests] = useState([]);
  const [fetchingRequests, setFetchingRequests] = useState(true);

  const categories = [
    {
      id: 'Inquiry',
      title: 'Inquiry / Question',
      description: 'Ask a question or seek guidance from our care team.',
      icon: '❓',
      color: 'border-blue-500 bg-blue-50 text-blue-700'
    },
    {
      id: 'Suggestion',
      title: 'Suggestion',
      description: 'Share feedback or ideas to improve your experience.',
      icon: '💡',
      color: 'border-amber-500 bg-amber-50 text-amber-700'
    },
    {
      id: 'Complaint',
      title: 'Complaint',
      description: 'Report an issue or concern for immediate attention.',
      icon: '⚠️',
      color: 'border-rose-500 bg-rose-50 text-rose-700'
    },
    {
      id: 'General Note',
      title: 'General Note',
      description: 'Provide an update or note regarding your account/project.',
      icon: '📝',
      color: 'border-emerald-500 bg-emerald-50 text-emerald-700'
    }
  ];

  const getToken = () => localStorage.getItem('token') || localStorage.getItem('customerToken');

  const fetchMyRequests = async () => {
    try {
      setFetchingRequests(true);
      const token = getToken();
      if (!token) {
        setFetchingRequests(false);
        return;
      }

      const response = await axios.get('/api/requests/my-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.data) {
        setMyRequests(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch request history:', err);
    } finally {
      setFetchingRequests(false);
    }
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestDetails.trim()) {
      setError('Please provide request details.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);

      const token = getToken();
      if (!token) {
        setError('Please log in to your customer account to submit a request.');
        setLoading(false);
        return;
      }

      await axios.post(
        '/api/requests',
        {
          request_type: requestType,
          request_details: requestDetails
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSuccessMessage('Your request has been submitted! Our team will review it shortly.');
      setRequestDetails('');
      fetchMyRequests();
    } catch (err) {
      console.error('Submit request error:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Resolved ✓</span>;
      case 'in progress':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">In Progress ⏳</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">Pending ⏱️</span>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Customer Care
            </h1>
            <p className="text-gray-600 mt-1">Submit suggestions, notes, complaints, or ask questions to our staff.</p>
          </div>
          <button
            onClick={() => navigate('/customer/CustomerDashBoard')}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition shadow-sm"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-500 text-red-700 text-sm shadow-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">×</button>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border-l-4 border-green-500 text-green-700 text-sm shadow-sm flex items-center justify-between">
            <span>{successMessage}</span>
            <button onClick={() => setSuccessMessage(null)} className="text-green-500 hover:text-green-700 font-bold">×</button>
          </div>
        )}

        {/* Request Form Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-10">
          <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-6 py-4 text-white">
            <h2 className="text-lg font-bold">Submit a New Request</h2>
            <p className="text-xs text-green-100">Select a category and detail what you need assistance with.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Category Selection Grid */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Select Request Type</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => {
                  const isSelected = requestType === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setRequestType(cat.id)}
                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-3 ${
                        isSelected
                          ? `${cat.color} shadow-md scale-[1.01]`
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <h4 className="font-semibold text-sm">{cat.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{cat.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Request Details Text Area */}
            <div>
              <label htmlFor="requestDetails" className="block text-sm font-semibold text-gray-800 mb-2">
                Request Details
              </label>
              <textarea
                id="requestDetails"
                rows="5"
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                placeholder="Write your note, suggestion, complaint, or question here in detail..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm text-gray-800 placeholder-gray-400 outline-none transition"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition transform active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <span>Submit Request</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Customer Request History */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center justify-between">
            <span>Your Submitted Requests</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{myRequests.length} Total</span>
          </h2>

          {fetchingRequests ? (
            <div className="py-8 text-center text-gray-400">Loading request history...</div>
          ) : myRequests.length === 0 ? (
            <div className="py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <span className="text-3xl block mb-2">📋</span>
              <p className="text-gray-500 text-sm">You haven't submitted any requests yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((req) => (
                <div key={req.request_id} className="p-4 rounded-xl border border-gray-200 hover:border-green-300 transition bg-gray-50/50">
                  <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-gray-200 text-gray-800">
                        {req.request_type || 'Inquiry'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(req.request_date).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {getStatusBadge(req.status)}
                  </div>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap">{req.request_details}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MakeRequestPage;
