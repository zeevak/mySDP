import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import StaffHeader from '../../Components/Staff_Header';
import StaffFooter from '../../Components/Staff_Footer';

const CustomerManager = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

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

  // Handle customer selection for details view
  const handleViewDetails = (customer) => {
    setSelectedCustomer(customer);
  };

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

      // If the deleted customer was selected, clear selection
      if (selectedCustomer && selectedCustomer.customer_id === customerToDelete.customer_id) {
        setSelectedCustomer(null);
      }
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIC</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCustomers.map((customer) => (
                      <tr
                        key={customer.customer_id}
                        className={`hover:bg-gray-50 ${selectedCustomer?.customer_id === customer.customer_id ? 'bg-green-50' : ''}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.title} {customer.full_name}
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(customer)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEdit(customer.customer_id)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteConfirmation(customer)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Customer Details Panel */}
          {selectedCustomer && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Customer Details</h2>
                <div>
                  <button
                    onClick={() => handleEdit(selectedCustomer.customer_id)}
                    className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition duration-200 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-4">Personal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Full Name:</span>
                        <p className="text-gray-800">{selectedCustomer.title} {selectedCustomer.full_name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Name with Initials:</span>
                        <p className="text-gray-800">{selectedCustomer.name_with_ini || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">First Name:</span>
                        <p className="text-gray-800">{selectedCustomer.f_name || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Last Name:</span>
                        <p className="text-gray-800">{selectedCustomer.l_name || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">NIC Number:</span>
                        <p className="text-gray-800">{selectedCustomer.nic_number || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Date of Birth:</span>
                        <p className="text-gray-800">{formatDate(selectedCustomer.date_of_birth)}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-semibold text-gray-700 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Email:</span>
                        <p className="text-gray-800">{selectedCustomer.email}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Phone Number 1:</span>
                        <p className="text-gray-800">{selectedCustomer.phone_no_1 || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Phone Number 2:</span>
                        <p className="text-gray-800">{selectedCustomer.phone_no_2 || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Address:</span>
                        <p className="text-gray-800">
                          {[
                            selectedCustomer.add_line_1,
                            selectedCustomer.add_line_2,
                            selectedCustomer.add_line_3
                          ].filter(Boolean).join(', ') || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">City:</span>
                        <p className="text-gray-800">{selectedCustomer.city || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">District:</span>
                        <p className="text-gray-800">{selectedCustomer.district || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Province:</span>
                        <p className="text-gray-800">{selectedCustomer.province || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-md font-semibold text-gray-700 mb-4">Account Information</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Customer ID:</span>
                      <p className="text-gray-800">{selectedCustomer.customer_id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Registration Date:</span>
                      <p className="text-gray-800">{formatDate(selectedCustomer.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
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
