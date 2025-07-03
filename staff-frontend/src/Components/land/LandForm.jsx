import React from 'react';
import LocationSelector from './LocationSelector';
import LandFeatures from './LandFeatures';
import {
  climateZones,
  landShapes,
  soilTypes
} from '../../utils/locationData';

/**
 * Reusable Land Form component that can be used by both customer and visitor land forms
 */
const LandForm = ({
  formData,
  formErrors,
  handleInputChange,
  handleProvinceChange,
  handleDistrictChange,
  provinces,
  districts,
  cities,
  isDisabled = false
}) => {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Location Selector Component */}
        <LocationSelector
          formData={formData}
          formErrors={formErrors}
          handleProvinceChange={handleProvinceChange}
          handleDistrictChange={handleDistrictChange}
          handleInputChange={handleInputChange}
          provinces={provinces}
          districts={districts}
          cities={cities}
          isDisabled={isDisabled}
        />

        {/* Climate Zone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Climate Zone</label>
          <select
            name="climate_zone"
            value={formData.climate_zone}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isDisabled}
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
            disabled={isDisabled}
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
            disabled={isDisabled}
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
            disabled={isDisabled}
          />
          {formErrors.land_size && (
            <p className="text-red-500 text-sm mt-1">{formErrors.land_size}</p>
          )}
        </div>
      </div>

      {/* Land Features Checkboxes */}
      <LandFeatures 
        formData={formData} 
        handleInputChange={handleInputChange} 
        isDisabled={isDisabled} 
      />
    </div>
  );
};

export default LandForm;
