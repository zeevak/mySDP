import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StaffHeader from '../../Components/Staff_Header';
import StaffFooter from '../../Components/Staff_Footer';
import {
  provinces,
  districtsMap,
  climateZones,
  landShapes,
  soilTypes,
  loadCitiesFromCSV
} from '../../utils/locationData';

const AddCustomerLand = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [citiesMap, setCitiesMap] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    customer_id: customerId || '',
    province: '',
    district: '',
    city: '',
    climate_zone: '',
    land_shape: '',
    has_water: false,
    soil_type: '',
    has_stones: false,
    has_landslide_risk: false,
    has_forestry: false,
    land_size: ''
  });

  // Load cities data from CSV
  useEffect(() => {
    const loadCities = async () => {
      try {
        const citiesData = await loadCitiesFromCSV();
        console.log('Cities data loaded:', citiesData);
        setCitiesMap(citiesData);
      } catch (error) {
        console.error('Error loading cities data:', error);
        setError('Failed to load location data. Please try again later.');
      }
    };

    loadCities();
  }, []);

  // Fetch customers if no customerId is provided
  useEffect(() => {
    if (!customerId) {
      fetchCustomers();
    } else {
      fetchCustomerDetails(customerId);
    }
  }, [customerId]);

  // Filter customers based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer => {
        const fullName = `${customer.title} ${customer.full_name}`.toLowerCase();
        const customerId = customer.customer_id.toLowerCase();
        const searchLower = searchTerm.toLowerCase();

        return fullName.includes(searchLower) || customerId.includes(searchLower);
      });

      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      setCustomerLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get('http://localhost:5001/api/staff/customers', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.success) {
        setCustomers(response.data.data);
        setFilteredCustomers(response.data.data);
      } else {
        setError('Failed to fetch customers');
      }

      setCustomerLoading(false);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers. Please try again later.');
      setCustomerLoading(false);
    }
  };

  // Fetch customer details
  const fetchCustomerDetails = async (id) => {
    try {
      setCustomerLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get(`http://localhost:5001/api/staff/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.success) {
        setSelectedCustomer(response.data.data);
      } else {
        setError('Failed to fetch customer details');
      }

      setCustomerLoading(false);
    } catch (err) {
      console.error('Error fetching customer details:', err);
      setError('Failed to load customer details. Please try again later.');
      setCustomerLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle different input types
    const inputValue = type === 'checkbox' ? checked : value;

    setFormData({
      ...formData,
      [name]: inputValue
    });

    // Clear field-specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Handle customer selection
  const handleCustomerChange = (e) => {
    const selectedId = e.target.value;
    setFormData({
      ...formData,
      customer_id: selectedId
    });

    if (selectedId) {
      fetchCustomerDetails(selectedId);
      setSearchTerm(''); // Clear search term when customer is selected
    } else {
      setSelectedCustomer(null);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle province change
  const handleProvinceChange = (e) => {
    const province = e.target.value;
    setFormData({
      ...formData,
      province,
      district: '',
      city: ''
    });

    // Update districts based on selected province
    setDistricts(districtsMap[province] || []);
    setCities([]);
  };

  // Handle district change
  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setFormData({
      ...formData,
      district,
      city: ''
    });

    // Update cities based on selected district
    setCities(citiesMap[district] || []);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.customer_id) {
      errors.customer_id = 'Please select a customer';
    }

    if (!formData.province) {
      errors.province = 'Province is required';
    }

    if (!formData.district) {
      errors.district = 'District is required';
    }

    if (!formData.city) {
      errors.city = 'City is required';
    }

    if (!formData.climate_zone) {
      errors.climate_zone = 'Climate zone is required';
    }

    if (!formData.land_shape) {
      errors.land_shape = 'Land shape is required';
    }

    if (!formData.soil_type) {
      errors.soil_type = 'Soil type is required';
    }

    if (!formData.land_size) {
      errors.land_size = 'Land size is required';
    } else if (isNaN(formData.land_size) || parseFloat(formData.land_size) <= 0) {
      errors.land_size = 'Land size must be a positive number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get token from localStorage
      const token = localStorage.getItem('token');

      // Prepare data for API
      const landData = {
        ...formData,
        land_size: parseFloat(formData.land_size)
      };

      // Send data to API
      const response = await axios.post(
        `http://localhost:5001/api/staff/customers/${formData.customer_id}/lands`,
        landData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Land added successfully!');
      setLoading(false);

      // Navigate back to lands page after 2 seconds
      setTimeout(() => {
        navigate(`/staff/lands`);
      }, 2000);

    } catch (err) {
      setLoading(false);
      console.error('Error adding land:', err);

      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to add land. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <StaffHeader />

      <main className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Add New Land</h1>
            <button
              onClick={() => navigate('/staff/dashboard')}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
            >
              Back to Dashboard
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

          {customerLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6">
              <form onSubmit={handleSubmit}>
                {/* Customer Selection */}
                {!customerId && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>

                    {/* Search Input */}
                    <div className="mb-3">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search by name or ID..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                        />
                        {searchTerm && (
                          <button
                            type="button"
                            onClick={() => setSearchTerm('')}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Customer Dropdown */}
                    <select
                      name="customer_id"
                      value={formData.customer_id}
                      onChange={handleCustomerChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select a Customer</option>
                      {filteredCustomers.map((customer) => (
                        <option key={customer.customer_id} value={customer.customer_id}>
                          {customer.title} {customer.full_name} ({customer.customer_id})
                        </option>
                      ))}
                    </select>
                    {formErrors.customer_id && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.customer_id}</p>
                    )}
                  </div>
                )}

                {/* Selected Customer Info */}
                {selectedCustomer && (
                  <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                    <h3 className="font-medium text-gray-700 mb-2">Selected Customer:</h3>
                    <p>
                      <span className="font-medium">Name:</span> {selectedCustomer.title} {selectedCustomer.full_name}
                    </p>
                    <p>
                      <span className="font-medium">ID:</span> {selectedCustomer.customer_id}
                    </p>
                    <p>
                      <span className="font-medium">Contact:</span> {selectedCustomer.phone_no_1 || 'N/A'}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Province */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={(e) => {
                        const province = e.target.value;
                        setFormData({
                          ...formData,
                          province,
                          district: '',
                          city: ''
                        });

                        // Update districts based on selected province
                        setDistricts(districtsMap[province] || []);
                        setCities([]);
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Province</option>
                      {provinces.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                    {formErrors.province && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.province}</p>
                    )}
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={(e) => {
                        const district = e.target.value;
                        setFormData({
                          ...formData,
                          district,
                          city: ''
                        });

                        // Update cities based on selected district
                        if (district && citiesMap[district]) {
                          console.log(`Setting cities for district ${district}:`, citiesMap[district]);
                          setCities(citiesMap[district]);
                        } else {
                          console.log(`No cities found for district ${district}`);
                          setCities([]);
                        }
                      }}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled={!formData.province}
                    >
                      <option value="">Select District</option>
                      {districts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                    {formErrors.district && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.district}</p>
                    )}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled={!formData.district}
                    >
                      <option value="">Select City</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    {formErrors.city && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>
                    )}
                  </div>

                  {/* Climate Zone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Climate Zone</label>
                    <select
                      name="climate_zone"
                      value={formData.climate_zone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Climate Zone</option>
                      {climateZones.map(zone => (
                        <option key={zone} value={zone}>{zone}</option>
                      ))}
                    </select>
                    {formErrors.climate_zone && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.climate_zone}</p>
                    )}
                  </div>

                  {/* Land Shape */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Land Shape</label>
                    <select
                      name="land_shape"
                      value={formData.land_shape}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Land Shape</option>
                      {landShapes.map(shape => (
                        <option key={shape} value={shape}>{shape}</option>
                      ))}
                    </select>
                    {formErrors.land_shape && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.land_shape}</p>
                    )}
                  </div>

                  {/* Soil Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
                    <select
                      name="soil_type"
                      value={formData.soil_type}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select Soil Type</option>
                      {soilTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {formErrors.soil_type && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.soil_type}</p>
                    )}
                  </div>

                  {/* Land Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Land Size (perch)</label>
                    <input
                      type="number"
                      name="land_size"
                      value={formData.land_size}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0.01"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    {formErrors.land_size && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.land_size}</p>
                    )}
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="has_water"
                      name="has_water"
                      checked={formData.has_water}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="has_water" className="ml-2 block text-sm text-gray-700">
                      Has Water Source
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="has_stones"
                      name="has_stones"
                      checked={formData.has_stones}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="has_stones" className="ml-2 block text-sm text-gray-700">
                      Has Stones
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="has_landslide_risk"
                      name="has_landslide_risk"
                      checked={formData.has_landslide_risk}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="has_landslide_risk" className="ml-2 block text-sm text-gray-700">
                      Has Landslide Risk
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="has_forestry"
                      name="has_forestry"
                      checked={formData.has_forestry}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="has_forestry" className="ml-2 block text-sm text-gray-700">
                      Has Forestry
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Adding Land...' : 'Add Land'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      <StaffFooter />
    </div>
  );
};

export default AddCustomerLand;
