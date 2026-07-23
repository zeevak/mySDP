import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import StaffHeader from '../../Components/Staff_Header';
import { getUserRole } from '../../utils/authUtils';
import StaffFooter from '../../Components/Staff_Footer';

const CustomerManager = () => {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null); // 'asc' or 'desc'

  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:5001/api/staff/customers', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.success) {
          setCustomers(response.data.data);
        } else {
          setError('Failed to fetch customers');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to load customers. Please try again later.');
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);



  // Handle customer edit
  const handleEdit = (customerId) => {
    navigate(`/staff/edit-customer/${customerId}`);
  };

  // Handle customer delete confirmation
  const handleDeleteConfirmation = (customer) => {
    setCustomerToDelete(customer);
    setShowDeleteModal(true);
  };

  // Handle customer delete
  const handleDelete = async () => {
    if (!customerToDelete) return;

    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://localhost:5001/api/staff/customers/${customerToDelete.customer_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Remove deleted customer from state
      setCustomers(customers.filter(c => c.customer_id !== customerToDelete.customer_id));

      // Close modal and reset state
      setShowDeleteModal(false);
      setCustomerToDelete(null);


    } catch (err) {
      console.error('Error deleting customer:', err);
      setError('Failed to delete customer. Please try again.');
    }
  };

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone_no_1?.includes(searchTerm) ||
    customer.nic_number?.includes(searchTerm)
  );

  // Handle sorting toggles
  const handleSort = (field) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort filtered customers
  const sortedCustomers = React.useMemo(() => {
    if (!sortField || !sortDirection) return filteredCustomers;

    return [...filteredCustomers].sort((a, b) => {
      let valA, valB;

      switch (sortField) {
        case 'customer_id':
          valA = a.customer_id || '';
          valB = b.customer_id || '';
          return sortDirection === 'asc'
            ? valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' })
            : valB.localeCompare(valA, undefined, { numeric: true, sensitivity: 'base' });
        case 'name':
          valA = (a.f_name || a.l_name ? `${a.f_name || ''} ${a.l_name || ''}`.trim() : a.full_name || '').toLowerCase();
          valB = (b.f_name || b.l_name ? `${b.f_name || ''} ${b.l_name || ''}`.trim() : b.full_name || '').toLowerCase();
          break;
        case 'email':
          valA = (a.email || '').toLowerCase();
          valB = (b.email || '').toLowerCase();
          break;
        case 'registered':
          valA = a.created_at ? new Date(a.created_at).getTime() : 0;
          valB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        default:
          return 0;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredCustomers, sortField, sortDirection]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <StaffHeader />

      <main className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
            <Link
              to="/staff/add-customer"
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              Add New Customer
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 border border-red-200">
              {error}
            </div>
          )}

          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
            <div className="p-4 border-b">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No customers found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors duration-150"
                        onClick={() => handleSort('customer_id')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Customer ID</span>
                          <span className="flex flex-col">
                            <svg className={`h-2 w-2 ${sortField === 'customer_id' && sortDirection === 'asc' ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 4l-8 8h16z" />
                            </svg>
                            <svg className={`h-2 w-2 ${sortField === 'customer_id' && sortDirection === 'desc' ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 20l-8-8h16z" />
                            </svg>
                          </span>
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors duration-150"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Name</span>
                          <span className="flex flex-col">
                            <svg className={`h-2 w-2 ${sortField === 'name' && sortDirection === 'asc' ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 4l-8 8h16z" />
                            </svg>
                            <svg className={`h-2 w-2 ${sortField === 'name' && sortDirection === 'desc' ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 20l-8-8h16z" />
                            </svg>
                          </span>
                        </div>
                      </th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors duration-150"
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Email</span>
                          <span className="flex flex-col">
                            <svg className={`h-2 w-2 ${sortField === 'email' && sortDirection === 'asc' ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 4l-8 8h16z" />
                            </svg>
                            <svg className={`h-2 w-2 ${sortField === 'email' && sortDirection === 'desc' ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 20l-8-8h16z" />
                            </svg>
                          </span>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIC</th>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors duration-150"
                        onClick={() => handleSort('registered')}
                      >
                        <div className="flex items-center space-x-2">
                          <span>Registered</span>
                          <div className="flex items-center space-x-1">
                            <span 
                              title="Oldest to Newest" 
                              className={`text-xs ${sortField === 'registered' && sortDirection === 'asc' ? 'text-green-600 font-extrabold' : 'text-gray-400'}`}
                            >
                              ↑
                            </span>
                            <span 
                              title="Newest to Oldest" 
                              className={`text-xs ${sortField === 'registered' && sortDirection === 'desc' ? 'text-green-600 font-extrabold' : 'text-gray-400'}`}
                            >
                              ↓
                            </span>
                          </div>
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedCustomers.map((customer) => (
                      <tr
                        key={customer.customer_id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                        onClick={() => navigate(`/staff/customers/${customer.customer_id}`)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {customer.customer_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.f_name || customer.l_name ? 
                              `${customer.f_name || ''} ${customer.l_name || ''}`.trim() : 
                              customer.full_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{customer.phone_no_1 || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{customer.nic_number || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(customer.created_at)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleEdit(customer.customer_id)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Edit
                          </button>
                          {userRole === 'Admin' && (
                            <button
                              onClick={() => handleDeleteConfirmation(customer)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>


        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete customer <span className="font-semibold">{customerToDelete?.full_name}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <StaffFooter />
    </div>
  );
};

export default CustomerManager;
