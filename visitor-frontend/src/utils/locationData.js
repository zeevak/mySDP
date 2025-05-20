// locationData.js
// Utility functions for handling location data

// Province data
export const provinces = [
  "Central Province",
  "Eastern Province",
  "North Central Province",
  "Northern Province",
  "North Western Province",
  "Sabaragamuwa Province",
  "Southern Province",
  "Uva Province",
  "Western Province"
];

// District data by province
export const districtsMap = {
  "Central Province": ["Kandy", "Matale", "Nuwara Eliya"],
  "Eastern Province": ["Ampara", "Batticaloa", "Trincomalee"],
  "North Central Province": ["Anuradhapura", "Polonnaruwa"],
  "Northern Province": ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
  "North Western Province": ["Kurunegala", "Puttalam"],
  "Sabaragamuwa Province": ["Kegalle", "Ratnapura"],
  "Southern Province": ["Galle", "Hambantota", "Matara"],
  "Uva Province": ["Badulla", "Monaragala"],
  "Western Province": ["Colombo", "Gampaha", "Kalutara"]
};

// Function to parse CSV data into a structured format
export const parseCitiesCSV = (csvData) => {
  // Split the CSV data into lines
  const lines = csvData.split('\n');

  // Skip the header line
  const dataLines = lines.slice(1);

  // Create a map to store cities by district
  const citiesByDistrict = {};

  // Process each line
  dataLines.forEach(line => {
    // Skip empty lines
    if (!line.trim()) return;

    // Parse the CSV line
    const parts = line.split(',');
    if (parts.length < 3) return;

    const id = parts[0];
    const district = parts[1];
    const name = parts[2];

    // Skip if district or name is missing
    if (!district || !name) return;

    // Initialize the district array if it doesn't exist
    if (!citiesByDistrict[district]) {
      citiesByDistrict[district] = [];
    }

    // Add the city to the district array if it's not already there
    if (!citiesByDistrict[district].includes(name)) {
      citiesByDistrict[district].push(name);
    }
  });

  // Sort cities alphabetically within each district
  Object.keys(citiesByDistrict).forEach(district => {
    citiesByDistrict[district].sort();
  });

  return citiesByDistrict;
};

// Function to load cities from the CSV file
export const loadCitiesFromCSV = async () => {
  try {
    // Use the correct path to the cities.csv file
    const response = await fetch('/cities.csv');
    if (!response.ok) {
      throw new Error(`Failed to fetch cities.csv: ${response.status} ${response.statusText}`);
    }
    const csvData = await response.text();
    return parseCitiesCSV(csvData);
  } catch (error) {
    console.error('Error loading cities data:', error);
    // Return a default empty object if there's an error
    return {};
  }
};

// Climate zones
export const climateZones = [
  'low country wet zone',
  'montane wet zone',
  'montane dry zone',
  'intermediate zone',
  'dry mixed zone',
  'low country dry zone',
  'low country intermediate zone',
  'mid country wet zone',
  'mid country intermediate zone',
  'up country wet zone',
  'up country intermediate zone'
];

// Land shapes
export const landShapes = [
  "Flat",
  "Gentle Slope",
  "Steep Slope",
  "Terraced",
  "Undulating"
];

// Soil types
export const soilTypes = [
  "Clay",
  "Sand",
  "Loam",
  "Silt",
  "Peat",
  "Salt",
  "Chalk"
];
