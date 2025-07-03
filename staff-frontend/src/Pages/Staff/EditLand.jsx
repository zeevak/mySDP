import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StaffHeader from '../../Components/Staff_Header';
import StaffFooter from '../../Components/Staff_Footer';
import { provinces, districtsMap } from '../../utils/locationData';
import { loadCitiesFromCSV } from '../../utils/locationData';
import LandForm from '../../components/land/LandForm';
import { validateLandForm } from '../../utils/landUtils';

const EditLand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [citiesMap, setCitiesMap] = useState({});
  const [formData, setFormData] = useState({
    customer_id: '',
    province: '',
    district: '',
    city: '',
    climate_zone: '',
    land_shape: '',
    soil_type: '',
    land_size: '',
    has_water: false,
    has_stones: false,
    has_landslide_risk: false,
    has_forestry: false
  });
  const [customerInfo, setCustomerInfo] = useState(null);

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

  // Fetch land data
  useEffect(() => {
    const fetchLand = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');

        const response = await axios.get(`http://localhost:5001/api/staff/lands/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data && response.data.success) {
          const landData = response.data.data;

          // Set form data
          setFormData({
            customer_id: landData.customer_id,
            province: landData.province || '',
            district: landData.district || '',
            city: landData.city || '',
            climate_zone: landData.climate_zone || '',
            land_shape: landData.land_shape || '',
            soil_type: landData.soil_type || '',
            land_size: landData.land_size || '',
            has_water: landData.has_water || false,
            has_stones: landData.has_stones || false,
            has_landslide_risk: landData.has_landslide_risk || false,
            has_forestry: landData.has_forestry || false
          });

          // Set districts based on province
          if (landData.province) {
            setDistricts(districtsMap[landData.province] || []);
          }

          // Set cities based on district
          if (landData.district && citiesMap[landData.district]) {
            setCities(citiesMap[landData.district]);
          }

          // Fetch customer info
          if (landData.customer_id) {
            fetchCustomerInfo(landData.customer_id);
          }
        } else {
          setError('Failed to fetch land data');
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching land:', err);
        setError('Failed to load land data. Please try again later.');
        setLoading(false);
      }
    };

    if (id) {
      fetchLand();
    }
  }, [id, citiesMap]);

  // Fetch customer info
  const fetchCustomerInfo = async (customerId) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`http://localhost:5001/api/staff/customers/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data && response.data.success) {
        setCustomerInfo(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching customer info:', err);
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const errors = validateLandForm(formData, false); // false because customer is already selected

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Prepare data for API
      const landData = {
        province: formData.province,
        district: formData.district,
        city: formData.city,
        climate_zone: formData.climate_zone,
        land_shape: formData.land_shape,
        soil_type: formData.soil_type,
        land_size: parseFloat(formData.land_size),
        has_water: formData.has_water,
        has_stones: formData.has_stones,
        has_landslide_risk: formData.has_landslide_risk,
        has_forestry: formData.has_forestry
      };

      // Send data to API
      await axios.put(
        `http://localhost:5001/api/staff/lands/${id}`,
        landData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Land updated successfully!');
      setLoading(false);

      // Navigate back to lands page after 2 seconds
      setTimeout(() => {
        navigate('/staff/lands');
      }, 2000);

    } catch (err) {
      setLoading(false);
      console.error('Error updating land:', err);

      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to update land. Please try again later.');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <StaffHeader />

      <main className="flex-grow bg-gray-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Edit Land</h1>
            <button
              onClick={() => navigate('/staff/lands')}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
            >
              Back to Lands
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

          {loading && !formData.customer_id ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg p-6">
              {customerInfo && (
                <div className="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
                  <h3 className="font-medium text-gray-700 mb-2">Customer Information:</h3>
                  <p>
                    <span className="font-medium">Name:</span> {customerInfo.title} {customerInfo.full_name}
                  </p>
                  <p>
                    <span className="font-medium">ID:</span> {customerInfo.customer_id}
                  </p>
                  <p>
                    <span className="font-medium">Contact:</span> {customerInfo.phone_no_1 || 'N/A'}
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Land Form Component */}
                <LandForm
                  formData={formData}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  handleProvinceChange={(e) => {
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
                  handleDistrictChange={(e) => {
                    const district = e.target.value;
                    setFormData({
                      ...formData,
                      district,
                      city: ''
                    });

                    // Update cities based on selected district
                    if (district && citiesMap[district]) {
                      setCities(citiesMap[district]);
                    } else {
                      setCities([]);
                    }
                  }}
                  provinces={provinces}
                  districts={districts}
                  cities={cities}
                />

                {/* Submit Button */}
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 ${
                      loading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading ? 'Updating Land...' : 'Update Land'}
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

export default EditLand;
