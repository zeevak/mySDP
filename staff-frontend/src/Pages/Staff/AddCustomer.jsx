import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StaffHeader from '../../Components/Staff_Header';
import StaffFooter from '../../Components/Staff_Footer';

const AddCustomer = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    name_with_ini: '',
    full_name: '',
    f_name: '',
    l_name: '',
    date_of_birth: '',
    nic_number: '',
    add_line_1: '',
    add_line_2: '',
    add_line_3: '',
    city: '',
    district: '',
    province: '',
    phone_no_1: '',
    phone_no_2: '',
    email: '',
    password: '',
    confirm_password: ''
  });

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'full_name':
      case 'f_name':
      case 'l_name':
        return value.trim() ? '' : `${name.replace('_', ' ')} is required`;

      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        return '';

      case 'phone_no_1':
        if (!value.trim()) return 'Phone number is required';
        if (!/^0\d{9}$/.test(value)) return 'Phone number must start with 0 followed by 9 digits';
        return '';

      case 'phone_no_2':
        if (value && !/^0\d{9}$/.test(value)) return 'Phone number must start with 0 followed by 9 digits';
        return '';

      case 'nic_number':
        if (!value.trim()) return 'NIC number is required';
        if (!/^(\d{9}[vVxX]|\d{12})$/.test(value))
          return 'NIC must be in format 123456789V or 12 digits';
        return '';

      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 6) return 'Password must be at least 6 characters';
        return '';

      case 'confirm_password':
        if (!value) return 'Please confirm your password';
        if (value !== formData.password) return 'Passwords do not match';
        return '';

      default:
        return '';
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate field
    const errorMessage = validateField(name, value);
    setFormErrors(prev => ({
      ...prev,
      [name]: errorMessage
    }));

    // Special case for confirm_password
    if (name === 'password') {
      const confirmError = formData.confirm_password
        ? (value === formData.confirm_password ? '' : 'Passwords do not match')
        : '';
      setFormErrors(prev => ({
        ...prev,
        confirm_password: confirmError
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setError(null);
    setSuccess(null);

    // Validate all required fields
    const requiredFields = ['full_name', 'f_name', 'l_name', 'email', 'phone_no_1', 'nic_number', 'password', 'confirm_password'];
    const errors = {};

    requiredFields.forEach(field => {
      const errorMessage = validateField(field, formData[field]);
      if (errorMessage) {
        errors[field] = errorMessage;
      }
    });

    // Update form errors
    setFormErrors(errors);

    // Check if there are any validation errors
    if (Object.keys(errors).length > 0) {
      setError('Please fix the validation errors before submitting.');
      return;
    }

    try {
      setLoading(true);

      // Prepare data for API
      const customerData = {
        ...formData,
        // Remove confirm_password as it's not needed for the API
        confirm_password: undefined
      };

      // Get token from localStorage
      const token = localStorage.getItem('token');

      // Send data to API
      const response = await axios.post(
        'http://localhost:5001/api/customer/register',
        customerData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Customer added successfully!');
      setLoading(false);

      // Reset form
      setFormData({
        title: '',
        name_with_ini: '',
        full_name: '',
        f_name: '',
        l_name: '',
        date_of_birth: '',
        nic_number: '',
        add_line_1: '',
        add_line_2: '',
        add_line_3: '',
        city: '',
        district: '',
        province: '',
        phone_no_1: '',
        phone_no_2: '',
        email: '',
        password: '',
        confirm_password: ''
      });

      // Navigate to customer list after 2 seconds
      setTimeout(() => {
        navigate('/staff/customers');
      }, 2000);

    } catch (err) {
      setLoading(false);
      console.error('Error adding customer:', err);

      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to add customer. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <StaffHeader />

      <main className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Add New Customer</h1>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition duration-200"
            >
              Back
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6 border border-red-200">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6 border border-green-200">
              {success}
            </div>
          )}

          <div className="bg-white shadow-md rounded-lg p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Title</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Miss">Miss</option>
                    <option value="Ven">Ven</option>
                  </select>
                </div>

                {/* Name with Initials */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name with Initials</label>
                  <input
                    type="text"
                    name="name_with_ini"
                    value={formData.name_with_ini}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., A.B. Smith"
                  />
                </div>

                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.full_name ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    required
                  />
                  {formErrors.full_name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.full_name}</p>
                  )}
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="f_name"
                    value={formData.f_name}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.f_name ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    required
                  />
                  {formErrors.f_name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.f_name}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="l_name"
                    value={formData.l_name}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.l_name ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    required
                  />
                  {formErrors.l_name && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.l_name}</p>
                  )}
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* NIC Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    NIC Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nic_number"
                    value={formData.nic_number}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.nic_number ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder="123456789V or 123456789012"
                    required
                  />
                  {formErrors.nic_number && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.nic_number}</p>
                  )}
                </div>

                {/* Address Line 1 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                  <input
                    type="text"
                    name="add_line_1"
                    value={formData.add_line_1}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Address Line 2 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                  <input
                    type="text"
                    name="add_line_2"
                    value={formData.add_line_2}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Address Line 3 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Line 3</label>
                  <input
                    type="text"
                    name="add_line_3"
                    value={formData.add_line_3}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {/* Province */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Province</option>
                    <option value="Central">Central</option>
                    <option value="Eastern">Eastern</option>
                    <option value="North Central">North Central</option>
                    <option value="Northern">Northern</option>
                    <option value="North Western">North Western</option>
                    <option value="Sabaragamuwa">Sabaragamuwa</option>
                    <option value="Southern">Southern</option>
                    <option value="Uva">Uva</option>
                    <option value="Western">Western</option>
                  </select>
                </div>

                {/* Phone Number 1 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="phone_no_1"
                    value={formData.phone_no_1}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.phone_no_1 ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder="0XXXXXXXXX"
                    required
                  />
                  {formErrors.phone_no_1 && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone_no_1}</p>
                  )}
                </div>

                {/* Phone Number 2 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number 2</label>
                  <input
                    type="text"
                    name="phone_no_2"
                    value={formData.phone_no_2}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.phone_no_2 ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder="0XXXXXXXXX"
                  />
                  {formErrors.phone_no_2 && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.phone_no_2}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
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

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.password ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    required
                  />
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleInputChange}
                    className={`w-full border ${formErrors.confirm_password ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                    required
                  />
                  {formErrors.confirm_password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.confirm_password}</p>
                  )}
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="bg-white text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition duration-200 mr-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-200 flex items-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Add Customer'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <StaffFooter />
    </div>
  );
};

export default AddCustomer;
