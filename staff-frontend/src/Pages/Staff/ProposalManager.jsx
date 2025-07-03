import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StaffHeader from '../../Components/Staff_Header';
import StaffFooter from '../../Components/Staff_Footer';
import { getAuthAxios, isAuthenticated, logout } from '../../utils/authUtils';

const ProposalManager = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch proposals
  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      logout(navigate);
      return;
    }

    const fetchProposalsData = async () => {
      try {
        setLoading(true);
        const authAxios = getAuthAxios();
        const response = await authAxios.get('/api/proposal');

        if (response.data && response.data.success) {
          setProposals(response.data.data);
          setError(null);
        } else {
          setError('Failed to fetch proposals');
        }
      } catch (err) {
        console.error('Error fetching proposals:', err);
        setError('Failed to fetch proposals. Please try again.');
        
        // Handle unauthorized error
        if (err.response && err.response.status === 401) {
          logout(navigate);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProposalsData();
  }, [navigate]);

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const authAxios = getAuthAxios();
      const response = await authAxios.get('/api/proposal');

      if (response.data && response.data.success) {
        setProposals(response.data.data);
        setError(null);
      } else {
        setError('Failed to fetch proposals');
      }
    } catch (err) {
      console.error('Error fetching proposals:', err);
      setError('Failed to fetch proposals. Please try again.');
      
      // Handle unauthorized error
      if (err.response && err.response.status === 401) {
        logout(navigate);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (proposalId) => {
    if (!window.confirm('Are you sure you want to delete this proposal?')) {
      return;
    }

    try {
      const authAxios = getAuthAxios();
      await authAxios.delete(`/api/proposal/${proposalId}`);
      
      setSuccess('Proposal deleted successfully');
      fetchProposals(); // Refresh the list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting proposal:', err);
      setError('Failed to delete proposal. Please try again.');
      
      // Handle unauthorized error
      if (err.response && err.response.status === 401) {
        logout(navigate);
      }
    }
  };

  const handleStatusChange = async (proposalId, newStatus) => {
    try {
      const authAxios = getAuthAxios();
      await authAxios.patch(`/api/proposal/${proposalId}/status`, {
        status: newStatus
      });
      
      setSuccess('Proposal status updated successfully');
      fetchProposals(); // Refresh the list
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating proposal status:', err);
      setError('Failed to update proposal status. Please try again.');
      
      // Handle unauthorized error
      if (err.response && err.response.status === 401) {
        logout(navigate);
      }
    }
  };

  // Filter proposals based on search and status
  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.proposal_id?.toString().includes(searchTerm) ||
                         proposal.project_type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || proposal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProposals = filteredProposals.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProposals.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Under Review':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <StaffHeader />
      
      <main className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Proposal Management</h1>
            <Link
              to="/staff/submit-proposal"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition duration-200"
            >
              Create New Proposal
            </Link>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search by customer name, proposal ID, or project type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex space-x-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          {/* Proposals Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : currentProposals.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No proposals found.</p>
                <Link
                  to="/staff/submit-proposal"
                  className="text-green-600 hover:text-green-800 mt-2 inline-block"
                >
                  Create your first proposal
                </Link>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Proposal ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Land
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Project Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duration
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentProposals.map((proposal) => (
                        <tr key={proposal.proposal_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{proposal.proposal_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {proposal.customer_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {proposal.needs_land_selection ? (
                              <span className="text-red-600 font-medium">
                                ⚠️ Land Required
                              </span>
                            ) : (
                              <span className="text-green-600">
                                {proposal.land_info}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {proposal.project_type}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {proposal.project_duration} years
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(proposal.project_value)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={proposal.status}
                              onChange={(e) => handleStatusChange(proposal.proposal_id, e.target.value)}
                              className={`px-2 py-1 text-xs rounded-full ${getStatusColor(proposal.status)} border-0 focus:ring-2 focus:ring-green-500`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="Under Review">Under Review</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(proposal.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Link
                                to={`/staff/proposals/${proposal.proposal_id}/edit`}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(proposal.proposal_id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                          <span className="font-medium">
                            {Math.min(indexOfLastItem, filteredProposals.length)}
                          </span>{' '}
                          of <span className="font-medium">{filteredProposals.length}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          {Array.from({ length: totalPages }, (_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => paginate(i + 1)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === i + 1
                                  ? 'z-10 bg-green-50 border-green-500 text-green-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      
      <StaffFooter />
    </div>
  );
};

export default ProposalManager;
