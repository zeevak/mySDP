/**
 * Utility functions for land management
 */

/**
 * Validate land form data
 * @param {Object} formData - The form data to validate
 * @param {boolean} isCustomerRequired - Whether customer selection is required
 * @returns {Object} - Object containing validation errors
 */
export const validateLandForm = (formData, isCustomerRequired = true) => {
  const errors = {};

  if (isCustomerRequired && !formData.customer_id) {
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

  return errors;
};

/**
 * Check if land is eligible for agarwood cultivation
 * @param {Object} landData - The land data to check
 * @returns {Object} - Object containing eligibility status and details
 */
export const checkLandEligibility = (landData) => {
  // Check climate zone
  const isClimateZoneEligible = ['Low Country Wet Zone', 'Mid Country Wet Zone'].includes(landData.climate_zone);
  
  // Check soil type
  const isSoilTypeEligible = ['Loamy', 'Sandy Loam', 'Clay Loam'].includes(landData.soil_type);
  
  // Check water availability
  const isWaterEligible = landData.has_water;
  
  // Check stones
  const isStonesEligible = !landData.has_stones;
  
  // Check landslide risk
  const isLandslideEligible = !landData.has_landslide_risk;
  
  // Overall eligibility
  const isEligible = isClimateZoneEligible && isSoilTypeEligible && isWaterEligible && isStonesEligible && isLandslideEligible;
  
  return {
    eligible: isEligible,
    details: {
      climateZone: isClimateZoneEligible,
      soilType: isSoilTypeEligible,
      water: isWaterEligible,
      stones: isStonesEligible,
      landslide: isLandslideEligible,
      forestry: landData.has_forestry
    }
  };
};

/**
 * Format land data for display
 * @param {Object} land - The land data to format
 * @returns {Object} - Formatted land data
 */
export const formatLandData = (land) => {
  return {
    id: land.customer_land_id || land.visitor_land_id,
    location: [land.city, land.district, land.province].filter(Boolean).join(', '),
    size: land.land_size,
    features: {
      climate: land.climate_zone,
      shape: land.land_shape,
      soil: land.soil_type,
      hasWater: land.has_water ? 'Yes' : 'No',
      hasStones: land.has_stones ? 'Yes' : 'No',
      hasLandslideRisk: land.has_landslide_risk ? 'Yes' : 'No',
      hasForestry: land.has_forestry ? 'Yes' : 'No'
    }
  };
};
