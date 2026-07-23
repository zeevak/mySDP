import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import { authService } from '../../services/authService';
import {
  provinces,
  districtsMap,
  loadCitiesFromCSV,
  climateZones,
  landShapes,
  soilTypes
} from '../../utils/locationData';

const projectTypes = [
  'Agarwood',
  'Vanilla',
  'Sandalwood',
  'Coconut',
  'Teak',
  'Cinnamon',
  'Rubber',
  'Cocoa',
  'Tea',
  'Other'
];

const NewInvestmentPage = () => {
  const navigate = useNavigate();

  // Form State combining Land details & Proposal details
  const [formData, setFormData] = useState({
    // Land Info
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
    has_forestry: false,

    // Proposal Info
    project_type: 'Agarwood',
    project_duration: '5',
    project_value: '',
    payment_mode: 'full'
  });

  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [citiesMap, setCitiesMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Load cities from CSV
  useEffect(() => {
    const loadCities = async () => {
      try {
        const data = await loadCitiesFromCSV();
        setCitiesMap(data || {});
      } catch (err) {
        console.error('Error loading cities CSV:', err);
      }
    };
    loadCities();
  }, []);

  // Update districts when province changes
  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setFormData(prev => ({
      ...prev,
      province: selectedProvince,
      district: '',
      city: ''
    }));
    setDistricts(districtsMap[selectedProvince] || []);
    setCities([]);
  };

  // Update cities when district changes
  const handleDistrictChange = (e) => {
    const selectedDistrict = e.target.value;
    setFormData(prev => ({
      ...prev,
      district: selectedDistrict,
      city: ''
    }));
    setCities(citiesMap[selectedDistrict] || []);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.province) errors.province = 'Province is required';
    if (!formData.district) errors.district = 'District is required';
    if (!formData.city) errors.city = 'City / Area is required';
    if (!formData.climate_zone) errors.climate_zone = 'Climate zone is required';
    if (!formData.land_shape) errors.land_shape = 'Land shape is required';
    if (!formData.soil_type) errors.soil_type = 'Soil type is required';
    if (!formData.land_size || parseFloat(formData.land_size) <= 0) {
      errors.land_size = 'Please enter a valid land size in perches';
    }
    if (!formData.project_type) errors.project_type = 'Project type is required';
    if (!formData.project_duration || parseInt(formData.project_duration) <= 0) {
      errors.project_duration = 'Project duration is required';
    }
    if (!formData.project_value || parseFloat(formData.project_value) <= 0) {
      errors.project_value = 'Please enter a valid estimated project value';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError('Please fix the highlighted errors before submitting.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authService.submitNewInvestment(formData);
      if (response.data && response.data.success) {
        setSuccess('Investment proposal submitted successfully! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/customer/CustomerDashBoard');
        }, 1800);
      } else {
        setError(response.data?.message || 'Failed to submit investment proposal.');
      }
    } catch (err) {
      console.error('Error submitting new investment:', err);
      setError(err.response?.data?.message || 'Error submitting investment proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculations for preview
  const projectValueNum = parseFloat(formData.project_value) || 0;
  const durationNum = parseInt(formData.project_duration) || 1;
  const fullDiscount = projectValueNum * 0.10;
  const fullNetValue = projectValueNum * 0.90;

  const installmentCount = durationNum * 4; // Quarterly
  const installmentAmount = installmentCount > 0 ? projectValueNum / installmentCount : 0;

  return (
    <div className="flex flex-col min-h-screen bg-green-50/40">
      <Header />

      <main className="flex-grow py-10 px-4 max-w-4xl mx-auto w-full">
        {/* Top Header & Navigation */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <button
              onClick={() => navigate('/customer/CustomerDashBoard')}
              className="text-green-700 hover:text-green-800 font-semibold text-sm flex items-center transition-colors mb-2"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-extrabold text-gray-800">New Investment Proposal</h1>
            <p className="text-gray-600 text-sm mt-1">
              Provide your land details and investment options. Our team will review your submission promptly.
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 shadow-sm mb-6 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200 shadow-sm mb-6 text-sm font-semibold">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECTION 1: Land Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-6 space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-xl font-bold text-green-800">1. Land Information</h2>
              <p className="text-xs text-gray-500">Location, soil characteristics, and physical features of your land parcel.</p>
            </div>

            {/* Location Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Province *</label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleProvinceChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Province</option>
                  {provinces.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                {formErrors.province && <p className="text-red-500 text-xs mt-1">{formErrors.province}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">District *</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleDistrictChange}
                  disabled={!formData.province}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                >
                  <option value="">Select District</option>
                  {districts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {formErrors.district && <p className="text-red-500 text-xs mt-1">{formErrors.district}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">City / Area *</label>
                {cities && cities.length > 0 ? (
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select City / Area</option>
                    {cities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter City or Area"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                )}
                {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
              </div>
            </div>

            {/* Specs & Characteristics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Climate Zone *</label>
                <select
                  name="climate_zone"
                  value={formData.climate_zone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 capitalize"
                >
                  <option value="">Select Climate Zone</option>
                  {climateZones.map(cz => (
                    <option key={cz} value={cz}>{cz}</option>
                  ))}
                </select>
                {formErrors.climate_zone && <p className="text-red-500 text-xs mt-1">{formErrors.climate_zone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Land Shape *</label>
                <select
                  name="land_shape"
                  value={formData.land_shape}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Land Shape</option>
                  {landShapes.map(ls => (
                    <option key={ls} value={ls}>{ls}</option>
                  ))}
                </select>
                {formErrors.land_shape && <p className="text-red-500 text-xs mt-1">{formErrors.land_shape}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Soil Type *</label>
                <select
                  name="soil_type"
                  value={formData.soil_type}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Soil Type</option>
                  {soilTypes.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                {formErrors.soil_type && <p className="text-red-500 text-xs mt-1">{formErrors.soil_type}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Land Size (Perches) *</label>
                <input
                  type="number"
                  name="land_size"
                  value={formData.land_size}
                  onChange={handleInputChange}
                  placeholder="e.g. 50"
                  step="0.01"
                  min="0.01"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {formErrors.land_size && <p className="text-red-500 text-xs mt-1">{formErrors.land_size}</p>}
              </div>
            </div>

            {/* Land Features Checkboxes */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Special Land Features</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium text-gray-700 bg-gray-50/60 p-4 rounded-lg border border-gray-100">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="has_water"
                    checked={formData.has_water}
                    onChange={handleInputChange}
                    className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                  />
                  <span>Natural Water Source</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="has_stones"
                    checked={formData.has_stones}
                    onChange={handleInputChange}
                    className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                  />
                  <span>Has Stones / Rocks</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="has_landslide_risk"
                    checked={formData.has_landslide_risk}
                    onChange={handleInputChange}
                    className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                  />
                  <span>Landslide Risk</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="has_forestry"
                    checked={formData.has_forestry}
                    onChange={handleInputChange}
                    className="rounded text-green-600 focus:ring-green-500 h-4 w-4"
                  />
                  <span>Existing Forestry</span>
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 2: Investment Proposal Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-6 space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-xl font-bold text-green-800">2. Investment Proposal Details</h2>
              <p className="text-xs text-gray-500">Choose plantation crop, investment period, valuation, and payment plan.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Project Crop Type *</label>
                <select
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-medium"
                >
                  {projectTypes.map(pt => (
                    <option key={pt} value={pt}>{pt}</option>
                  ))}
                </select>
                {formErrors.project_type && <p className="text-red-500 text-xs mt-1">{formErrors.project_type}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Project Duration (Years) *</label>
                <input
                  type="number"
                  name="project_duration"
                  value={formData.project_duration}
                  onChange={handleInputChange}
                  min="1"
                  max="30"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {formErrors.project_duration && <p className="text-red-500 text-xs mt-1">{formErrors.project_duration}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Estimated Value (LKR) *</label>
                <input
                  type="number"
                  name="project_value"
                  value={formData.project_value}
                  onChange={handleInputChange}
                  placeholder="e.g. 1500000"
                  min="1000"
                  step="1000"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-semibold text-green-800"
                />
                {formErrors.project_value && <p className="text-red-500 text-xs mt-1">{formErrors.project_value}</p>}
              </div>
            </div>

            {/* Payment Mode Selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Payment Plan Mode *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`border rounded-lg p-4 cursor-pointer flex items-start space-x-3 transition-all ${
                  formData.payment_mode === 'full' 
                    ? 'border-green-600 bg-green-50/80 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment_mode"
                    value="full"
                    checked={formData.payment_mode === 'full'}
                    onChange={handleInputChange}
                    className="mt-1 text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <div className="font-bold text-gray-800 text-sm">Full Payment (10% Discount)</div>
                    <div className="text-xs text-gray-500 mt-0.5">Pay in full upon proposal approval to receive an upfront 10% discount.</div>
                  </div>
                </label>

                <label className={`border rounded-lg p-4 cursor-pointer flex items-start space-x-3 transition-all ${
                  formData.payment_mode === 'installments' 
                    ? 'border-green-600 bg-green-50/80 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment_mode"
                    value="installments"
                    checked={formData.payment_mode === 'installments'}
                    onChange={handleInputChange}
                    className="mt-1 text-green-600 focus:ring-green-500"
                  />
                  <div>
                    <div className="font-bold text-gray-800 text-sm">Quarterly Installment Plan</div>
                    <div className="text-xs text-gray-500 mt-0.5">Spread investment evenly across quarterly installments over your duration.</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Dynamic Financial Calculation Preview */}
            {projectValueNum > 0 && (
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">Financial Calculation Preview</h3>
                
                {formData.payment_mode === 'full' ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 text-xs block">Original Value:</span>
                      <span className="font-semibold text-gray-800">LKR {projectValueNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div>
                      <span className="text-emerald-700 text-xs block">Upfront Discount (10%):</span>
                      <span className="font-semibold text-emerald-700">- LKR {fullDiscount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div>
                      <span className="text-emerald-800 text-xs block font-bold">Net Final Amount:</span>
                      <span className="font-extrabold text-emerald-700 text-base">LKR {fullNetValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 text-xs block">Total Investment Value:</span>
                      <span className="font-semibold text-gray-800">LKR {projectValueNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">Quarterly Installments:</span>
                      <span className="font-semibold text-gray-800">{installmentCount} installments</span>
                    </div>
                    <div>
                      <span className="text-emerald-800 text-xs block font-bold">Per Quarter Amount:</span>
                      <span className="font-extrabold text-emerald-700 text-base">LKR {installmentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form Controls */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/customer/CustomerDashBoard')}
              className="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md shadow-md transition duration-200 flex items-center disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Submitting Proposal...
                </>
              ) : (
                'Submit Investment Proposal'
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default NewInvestmentPage;
