import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import StaffHeader from '../../Components/Staff_Header';
import { getUserRole } from '../../utils/authUtils';
import StaffFooter from '../../Components/Staff_Footer';
import { provinces, districtsMap } from '../../utils/locationData';
import { generateAllCustomersPDF } from '../../utils/customerReportPdfService';

const CustomerManager = () => {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState(null); // 'asc' or 'desc'

  const [isExportingMaster, setIsExportingMaster] = useState(false);

  // Fetch customers
  useEffect(() => {
    fetchCustomers();
  }, []);

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

      setCustomers(customers.filter(c => c.customer_id !== customerToDelete.customer_id));
      setShowDeleteModal(false);
      setCustomerToDelete(null);

    } catch (err) {
      console.error('Error deleting customer:', err);
      setError('Failed to delete customer. Please try again.');
    }
  };

  // Handle province change
  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    setSelectedDistrict('');
  };

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedProvince('');
    setSelectedDistrict('');
    setSortField(null);
    setSortDirection(null);
  };

  const normalizeProvince = (str) => {
    if (!str) return '';
    return str.toLowerCase().replace(/\bprovince\b/gi, '').trim();
  };

  // Filter customers based on search term, province, district
  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = !searchTerm ||
        customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone_no_1?.includes(searchTerm) ||
        customer.nic_number?.includes(searchTerm) ||
        customer.customer_id?.toLowerCase().includes(searchTerm.toLowerCase());

      const targetProv = normalizeProvince(selectedProvince);
      const customerProv = normalizeProvince(customer.province);
      const landProvinces = (customer.lands || []).map(l => normalizeProvince(l.province));

      const matchesProvince = !selectedProvince || 
        customerProv === targetProv || 
        landProvinces.includes(targetProv);

      const targetDist = selectedDistrict.toLowerCase().trim();
      const customerDist = (customer.district || '').toLowerCase().trim();
      const landDistricts = (customer.lands || []).map(l => (l.district || '').toLowerCase().trim());

      const matchesDistrict = !selectedDistrict || 
        customerDist === targetDist || 
        landDistricts.includes(targetDist);

      return matchesSearch && matchesProvince && matchesDistrict;
    });
  }, [customers, searchTerm, selectedProvince, selectedDistrict]);

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
  const sortedCustomers = useMemo(() => {
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

  // Master PDF report export
  const handleExportMasterReport = async () => {
    try {
      setIsExportingMaster(true);
      await generateAllCustomersPDF(
        sortedCustomers,
        { searchTerm, province: selectedProvince, district: selectedDistrict },
        { field: sortField, direction: sortDirection }
      );
    } catch (err) {
      console.error('Error generating master customer PDF report:', err);
      setError('Failed to generate master customer PDF report.');
    } finally {
      setIsExportingMaster(false);
    }
  };

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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <StaffHeader />

      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
              <p className="text-sm text-gray-600">View, search, filter, and export comprehensive customer reports</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <Link
                to="/staff/customers/generate-reports"
                className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-md font-semibold text-sm flex items-center justify-center transition duration-200 shadow-sm"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                <span>Generate Reports & Analytics</span>
              </Link>
              <Link
                to="/staff/add-customer"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 font-semibold text-sm flex items-center transition duration-200 shadow-sm"
              >
                + Add New Customer
              </Link>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 border border-red-200">
              {error}
            </div>
          )}

          {/* Filter & Search Bar */}
          <div className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Search Keywords</label>
                <input
                  type="text"
                  placeholder="ID, Name, Email, Phone, NIC..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Filter by Province</label>
                <select
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                >
                  <option value="">All Provinces</option>
                  {provinces.map((prov) => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Filter by District</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedProvince}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white disabled:bg-gray-100"
                >
                  <option value="">All Districts</option>
                  {selectedProvince && (districtsMap[selectedProvince] || []).map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleClearFilters}
                  className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
                >
                  Clear Filters
                </button>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
              <span>Showing {sortedCustomers.length} of {customers.length} customer records</span>
              {(searchTerm || selectedProvince || selectedDistrict || sortField) && (
                <span className="text-green-600 font-medium">Filtered Results Active</span>
              )}
            </div>
          </div>

          {/* Customer Table */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6 border border-gray-150">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : sortedCustomers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No customer records match the criteria
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th 
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors"
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
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors"
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
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors"
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
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors"
                        onClick={() => handleSort('registered')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Registered</span>
                          <span className="flex flex-col">
                            <svg className={`h-2 w-2 ${sortField === 'registered' && sortDirection === 'asc' ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 4l-8 8h16z" />
                            </svg>
                            <svg className={`h-2 w-2 ${sortField === 'registered' && sortDirection === 'desc' ? 'text-green-600' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 20l-8-8h16z" />
                            </svg>
                          </span>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700">
                          {customer.customer_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {customer.f_name || customer.l_name ? 
                              `${customer.f_name || ''} ${customer.l_name || ''}`.trim() : 
                              customer.full_name}
                          </div>
                          {(customer.city || customer.province) && (
                            <div className="text-xs text-gray-400">
                              {[customer.city, customer.province].filter(Boolean).join(', ')}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.phone_no_1 || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {customer.nic_number || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(customer.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(customer.customer_id)}
                              className="text-green-600 hover:text-green-900 text-xs font-semibold px-2 py-1"
                            >
                              Edit
                            </button>
                            {userRole === 'Admin' && (
                              <button
                                onClick={() => handleDeleteConfirmation(customer)}
                                className="text-red-600 hover:text-red-900 text-xs font-semibold px-2 py-1"
                              >
                                Delete
                              </button>
                            )}
                          </div>
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
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
