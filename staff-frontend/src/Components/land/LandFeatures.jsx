import React from 'react';

/**
 * Reusable component for land features checkboxes
 */
const LandFeatures = ({ formData, handleInputChange, isDisabled = false }) => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="has_water"
          name="has_water"
          checked={formData.has_water}
          onChange={handleInputChange}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          disabled={isDisabled}
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
          disabled={isDisabled}
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
          disabled={isDisabled}
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
          disabled={isDisabled}
        />
        <label htmlFor="has_forestry" className="ml-2 block text-sm text-gray-700">
          Has Forestry
        </label>
      </div>
    </div>
  );
};

export default LandFeatures;
