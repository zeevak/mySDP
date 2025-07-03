# Land Management Components

This directory contains reusable components for land management functionality in the Susaru Agro application.

## Component Structure

### LandForm.jsx
The main form component that combines all land-related form fields. It uses the following sub-components:
- LocationSelector - For province, district, and city selection
- LandFeatures - For checkboxes related to land features (water, stones, etc.)

### LocationSelector.jsx
Handles the cascading selection of province, district, and city.

### LandFeatures.jsx
Displays checkboxes for land features like water source, stones, landslide risk, and forestry.

## Usage

### In AddCustomerLand.jsx
```jsx
<LandForm
  formData={formData}
  formErrors={formErrors}
  handleInputChange={handleInputChange}
  handleProvinceChange={handleProvinceChange}
  handleDistrictChange={handleDistrictChange}
  provinces={provinces}
  districts={districts}
  cities={cities}
/>
```

### In EditLand.jsx
```jsx
<LandForm
  formData={formData}
  formErrors={formErrors}
  handleInputChange={handleInputChange}
  handleProvinceChange={(e) => {
    // Province change logic
  }}
  handleDistrictChange={(e) => {
    // District change logic
  }}
  provinces={provinces}
  districts={districts}
  cities={cities}
/>
```

## Utility Functions

The `landUtils.js` file in the `utils` directory contains helper functions:

- `validateLandForm(formData, isCustomerRequired)` - Validates land form data
- `checkLandEligibility(landData)` - Checks if land is eligible for agarwood cultivation
- `formatLandData(land)` - Formats land data for display

## Relationship Between Customer Land and Visitor Land

The application maintains two separate systems for land management:

1. **Visitor Land System**
   - For potential customers checking land eligibility
   - Stored in the `visitor_land` table
   - Used in the visitor frontend

2. **Customer Land System**
   - For registered customers' lands
   - Stored in the `customer_land` table
   - Managed by staff in the staff frontend

These systems share similar data structures but serve different purposes. The reusable components in this directory help maintain consistency between both systems while reducing code duplication.
