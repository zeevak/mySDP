import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StaffHeader from '../../Components/Staff_Header';
import StaffFooter from '../../Components/Staff_Footer';

const StaffManager = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Form state
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role_id: 2, // Default to Staff role (role_id 2)
    username: '',
    password: ''
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) return 'Full name is required';
    if (!/^[A-Za-z\s]+$/.test(name)) return 'Full name should only contain letters and spaces';
    return '';
  };

  const validateUsername = (username) => {
    if (!username.trim()) return 'Username is required';
    if (!/^[A-Za-z0-9_]+$/.test(username)) return 'Username should only contain letters, numbers, and underscores';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone.trim()) return 'Phone number is required';
    if (!/^0\d{9}$/.test(phone)) return 'Phone number must start with 0 followed by 9 digits';
    return '';
  };

  const validateEmail = (email) => {
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
    return '';
  };

  const validatePassword = (password, isEdit = false) => {
    if (!isEdit && !password.trim()) return 'Password is required';
    if (password.trim() && password.length < 6) return 'Password must be at least 6 characters';
    return '';
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/admin/staff', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Check if response has data property
      if (response.data && response.data.data) {
        setStaff(response.data.data);
      } else if (Array.isArray(response.data)) {
        // Handle case where response is directly an array
        setStaff(response.data);
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Received unexpected data format from server');
      }

      setLoading(false);
    } catch (err) {
      setError('Failed to load staff data');
      setLoading(false);
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate the field as user types
    let errorMessage = '';
    switch (name) {
      case 'name':
        errorMessage = validateName(value);
        break;
      case 'username':
        errorMessage = validateUsername(value);
        break;
      case 'phone':
        errorMessage = validatePhone(value);
        break;
      case 'email':
        errorMessage = validateEmail(value);
        break;
      case 'password':
        errorMessage = validatePassword(value, formMode === 'edit');
        break;
      default:
        break;
    }

    // Update form errors
    setFormErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));
  };

  const handleAddStaff = () => {
    setFormMode('add');
    setFormData({
      name: '',
      email: '',
      phone: '',
      role_id: 2, // Default to Staff role
      username: '',
      password: ''
    });
    setShowModal(true);
  };

  const handleEditStaff = (staffMember) => {
    setFormMode('edit');
    setSelectedStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone_no || '', // Keep as 'phone' in the form state
      role_id: staffMember.role_id,
      username: staffMember.username,
      password: '' // Don't populate password for security
    });
    setShowModal(true);
  };

  const handleDeleteStaff = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/staff/${selectedStaff.staff_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state after successful deletion
      setStaff(staff.filter(s => s.staff_id !== selectedStaff.staff_id));
      setShowDeleteConfirm(false);
      setSelectedStaff(null);
    } catch (err) {
      setError('Failed to delete staff member');
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setError(null);
    setSuccessMessage(null);

    // Validate all fields
    const errors = {
      name: validateName(formData.name),
      username: validateUsername(formData.username),
      phone: validatePhone(formData.phone),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password, formMode === 'edit')
    };

    // Update form errors
    setFormErrors(errors);

    // Check if there are any validation errors
    const hasErrors = Object.values(errors).some(error => error !== '');
    if (hasErrors) {
      setError('Please fix the validation errors before submitting.');
      return;
    }

    // Check for duplicate username, email, or phone number
    if (formMode === 'add' ||
        (formMode === 'edit' && formData.username !== selectedStaff.username) ||
        (formMode === 'edit' && formData.email !== selectedStaff.email) ||
        (formMode === 'edit' && formData.phone !== selectedStaff.phone_no)) {

      try {
        // Check for existing values in other staff members
        const existingStaff = staff.filter(s =>
          s.staff_id !== (selectedStaff?.staff_id || 0) &&
          (s.username === formData.username ||
           s.email === formData.email ||
           s.phone_no === formData.phone)
        );

        if (existingStaff.length > 0) {
          const duplicateStaff = existingStaff[0];
          if (duplicateStaff.username === formData.username) {
            setFormErrors(prev => ({ ...prev, username: 'Username already exists' }));
            setError('Username already exists. Please choose a different username.');
            return;
          }
          if (duplicateStaff.email === formData.email) {
            setFormErrors(prev => ({ ...prev, email: 'Email already exists' }));
            setError('Email already exists. Please use a different email address.');
            return;
          }
          if (duplicateStaff.phone_no === formData.phone) {
            setFormErrors(prev => ({ ...prev, phone: 'Phone number already exists' }));
            setError('Phone number already exists. Please use a different phone number.');
            return;
          }
        }
      } catch (err) {
        console.error('Error checking for duplicates:', err);
      }
    }

    try {
      const token = localStorage.getItem('token');

      // Create a properly formatted request payload
      const staffData = {
        name: formData.name,
        email: formData.email,
        phone_no: formData.phone, // Changed from 'phone' to 'phone_no' to match the controller
        role_id: parseInt(formData.role_id), // Ensure role_id is a number
        username: formData.username,
        password: formData.password
        // status is set to 'Active' by default in the model
      };

      if (formMode === 'add') {
        const response = await axios.post('/api/admin/staff', staffData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Add the new staff member to the local state
        setStaff([...staff, response.data.data]);

        // Show success message
        const roleName = getRoleName(parseInt(formData.role_id));
        setSuccessMessage(`Successfully added ${formData.name} as a/an ${roleName}. An email has been sent to ${formData.email} with login details.`);
      } else {
        const response = await axios.put(`/api/admin/staff/${selectedStaff.staff_id}`, staffData, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Update the staff member in the local state
        setStaff(staff.map(s => s.staff_id === selectedStaff.staff_id ? response.data.data : s));

        // Show success message
        setSuccessMessage(`Successfully updated ${formData.name}'s information.`);
      }

      setShowModal(false);
      setSelectedStaff(null);

      // Clear form errors
      setFormErrors({});

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      setError(`Failed to ${formMode === 'add' ? 'add' : 'update'} staff member: ${err.response?.data?.error || err.message}`);
      console.error(err);
    }
  };

  // Helper function to get role name from role_id
  const getRoleName = (roleId) => {
    switch(roleId) {
      case 1: return 'Admin';
      case 2: return 'Staff';
      default: return 'Unknown';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <StaffHeader />

      <main className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
            <button
              onClick={handleAddStaff}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
            >
              Add New Staff
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6 border border-green-200">
              {successMessage}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staff.map((staffMember) => (
                    <tr key={staffMember.staff_id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-500 font-medium">{staffMember.name.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{staffMember.name}</div>
                            <div className="text-sm text-gray-500">{staffMember.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{staffMember.email}</div>
                        <div className="text-sm text-gray-500">{staffMember.phone_no}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          staffMember.role_id === 1 ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {getRoleName(staffMember.role_id)}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditStaff(staffMember)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staffMember)}
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
      </main>

      {/* Add/Edit Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                {formMode === 'add' ? 'Add New Staff' : 'Edit Staff'}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    required
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    required
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder="0XXXXXXXXX"
                    required
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.username ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    required
                  />
                  {formErrors.username && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {formMode === 'add' ? 'Password' : 'New Password (leave blank to keep current)'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                      required={formMode === 'add'}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        // Eye-slash icon (password visible)
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                        </svg>
                      ) : (
                        // Eye icon (password hidden)
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value={2}>Staff</option>
                    <option value={1}>Admin</option>
                  </select>
                </div>


              </div>

              <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200"
                >
                  {formMode === 'add' ? 'Add Staff' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-800">Confirm Delete</h3>
            </div>

            <div className="p-6">
              <p className="text-gray-700">
                Are you sure you want to delete <span className="font-semibold">{selectedStaff?.name}</span>? This action cannot be undone.
              </p>
            </div>

            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
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

export default StaffManager;
