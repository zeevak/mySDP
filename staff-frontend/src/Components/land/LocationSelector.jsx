import React from 'react';

/**
 * Reusable component for selecting location (province, district, city)
 */
const LocationSelector = ({
  formData,
  formErrors,
  handleProvinceChange,
  handleDistrictChange,
  handleInputChange,
  provinces,
  districts,
  cities,
  isDisabled = false
}) => {
  return (
    <>
      {/* Province */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
        <select
          name="province"
          value={formData.province}
          onChange={handleProvinceChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isDisabled}
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
          onChange={handleDistrictChange}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={!formData.province || isDisabled}
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
          disabled={!formData.district || isDisabled}
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
    </>
  );
};

export default LocationSelector;
