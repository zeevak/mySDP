import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import ResultsCalculation from './ResultsCalculation';

// --- Dropdown data ---
const provinces = [
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

const districtsMap = {
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

const citiesMap = {
  "Kandy": ["Kandy City", "Peradeniya", "Katugastota", "Gampola"],
  "Matale": ["Matale City", "Dambulla", "Galewela", "Naula"],
  "Colombo": ["Colombo Fort", "Dehiwala", "Mount Lavinia", "Nugegoda"],
  // Add more cities for each district
};

const landShapes = ["Flat", "Gentle Slope", "Steep Slope", "Terraced", "Undulating"];
const soilTypes = ["Clay", "Sand", "Loam", "Silt", "Peat", "Salt", "Chalk"];

const AgarwoodCalculator = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [result, setResult] = useState(null);
  const [isEligible, setIsEligible] = useState(false);
  const [warnings, setWarnings] = useState({});
  const [waterBlocksProgress, setWaterBlocksProgress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Add state for radio button warnings
  const [radioWarnings, setRadioWarnings] = useState({
    hasStones: false,
    hasLandslideRisk: false,
    hasForestry: false
  });

  // Define validation schema
  const validationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    firstName: Yup.string()
      .matches(/^[A-Za-z\s]+$/, 'Only letters are allowed')
      .required('First name is required'),
    lastName: Yup.string()
      .matches(/^[A-Za-z\s]+$/, 'Only letters are allowed')
      .required('Last name is required'),
    nic: Yup.string()
      .matches(/^(\d{9}[vV]|\d{12})$/, 'NIC must be 9 digits followed by V or 12 digits')
      .required('NIC is required'),
    phone: Yup.string()
      .matches(/^\d{9}$/, 'Phone number must be 9 digits')
      .required('Phone number is required'),
    email: Yup.string().email('Invalid email format'),
    hasOwnLand: Yup.boolean().oneOf([true], 'You must have your own land to proceed'),
    province: Yup.string().when('hasOwnLand', {
      is: true,
      then: Yup.string().required('Province is required')
    }),
    district: Yup.string().when('province', {
      is: (val) => val && val.length > 0,
      then: Yup.string().required('District is required')
    }),
    city: Yup.string().when('district', {
      is: (val) => val && val.length > 0,
      then: Yup.string().required('City is required')
    }),
    climateZone: Yup.string().when('city', {
      is: (val) => val && val.length > 0,
      then: Yup.string().required('Climate zone is required')
    }),
    landShape: Yup.string().when('climateZone', {
      is: (val) => val && val.length > 0,
      then: Yup.string().required('Land shape is required')
    }),
    hasWater: Yup.boolean().when('landShape', {
      is: 'Flat',
      then: Yup.boolean().required('Please specify if the land contains water')
    }),
    soilType: Yup.string().required('Soil type is required'),
    hasStones: Yup.boolean().required('Please specify if the land has stones'),
    hasLandslideRisk: Yup.boolean().required('Please specify if there is landslide risk'),
    hasForestry: Yup.boolean().required('Please specify if there is forestry area'),
    landSize: Yup.number()
      .typeError('Land size must be a number')
      .positive('Land size must be positive')
      .required('Land size is required')
  });

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      title: '',
      firstName: '',
      lastName: '',
      nic: '',
      phone: '',
      email: '',
      hasOwnLand: false,
      province: '',
      district: '',
      city: '',
      climateZone: '',
      landShape: '',
      hasWater: undefined,
      soilType: '',
      hasStones: undefined,
      hasLandslideRisk: undefined,
      hasForestry: undefined,
      landSize: ''
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true
  });

  // Handle province change
  const handleProvinceChange = (e) => {
    const province = e.target.value;
    formik.setFieldValue('province', province, true);
    formik.setFieldValue('district', '', true);
    formik.setFieldValue('city', '', true);
    setDistricts(districtsMap[province] || []);
    setCities([]);
  };

  // Handle district change
  const handleDistrictChange = (e) => {
    const district = e.target.value;
    formik.setFieldValue('district', district, true);
    formik.setFieldValue('city', '', true);
    setCities(citiesMap[district] || []);
  };

  // Check soil type and set warnings
  const checkSoilType = (value) => {
    if (['Clay', 'Sand', 'Salt'].includes(value)) {
      setWarnings((prev) => ({
        ...prev,
        soilType: `Warning: ${value} soil is not ideal for agarwood cultivation, but you can proceed.`
      }));
    } else {
      setWarnings((prev) => ({
        ...prev,
        soilType: undefined
      }));
    }
  };

  // Handle water change
  const handleWaterChange = (hasWater) => {
    formik.setFieldValue('hasWater', hasWater, true);

    // If flat land has water, block progress
    if (formik.values.landShape === 'Flat' && hasWater) {
      setWaterBlocksProgress(true);
    } else {
      setWaterBlocksProgress(false);
    }
  };

  // Handle radio button changes with warnings
  const handleRadioChange = (field, value) => {
    formik.setFieldValue(field, value, true);
    formik.setFieldTouched(field, true, false);

    // Set warning if "No" is selected for certain fields
    if (field === 'hasStones' && value === false) {
      setRadioWarnings(prev => ({...prev, hasStones: true}));
    } else if (field === 'hasStones') {
      setRadioWarnings(prev => ({...prev, hasStones: false}));
    }

    if (field === 'hasLandslideRisk' && value === false) {
      setRadioWarnings(prev => ({...prev, hasLandslideRisk: true}));
    } else if (field === 'hasLandslideRisk') {
      setRadioWarnings(prev => ({...prev, hasLandslideRisk: false}));
    }

    if (field === 'hasForestry' && value === false) {
      setRadioWarnings(prev => ({...prev, hasForestry: true}));
    } else if (field === 'hasForestry') {
      setRadioWarnings(prev => ({...prev, hasForestry: false}));
    }
  };

  // Go to specific step
  const goToStep = (newStep) => {
    if (newStep > step) {
      validateCurrentStep();
    } else {
      setStep(newStep);
    }
  };

  // Function to save visitor data to the backend
  const saveVisitorData = async () => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      // Prepare the data to send to the backend
      const visitorData = {
        title: formik.values.title,
        firstName: formik.values.firstName,
        lastName: formik.values.lastName,
        nic: formik.values.nic,
        phone: formik.values.phone,
        email: formik.values.email,
        province: formik.values.province,
        district: formik.values.district,
        city: formik.values.city,
        climateZone: formik.values.climateZone,
        landShape: formik.values.landShape,
        soilType: formik.values.soilType,
        hasWater: formik.values.hasWater,
        hasStones: formik.values.hasStones,
        hasLandslideRisk: formik.values.hasLandslideRisk,
        hasForestry: formik.values.hasForestry,
        landSize: Number(formik.values.landSize),
        eligible: isEligible,
        details: result?.details
      };

      // Send the data to the backend
      const response = await axios.post('http://localhost:5000/api/land/save-visitor', visitorData);

      if (response.data.success) {
        console.log('Visitor data saved successfully:', response.data);
        // Navigate to the results page with the land size
        navigate(`/investment/results/${formik.values.landSize}`);
      } else {
        setSubmitError('Failed to save visitor data. Please try again.');
      }
    } catch (error) {
      console.error('Error saving visitor data:', error);
      setSubmitError('An error occurred while saving your data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Validate current step before proceeding
  const validateCurrentStep = () => {
    if (step === 1) {
      if (
        formik.values.title &&
        formik.values.firstName &&
        formik.values.lastName &&
        formik.values.nic &&
        formik.values.phone &&
        !formik.errors.title &&
        !formik.errors.firstName &&
        !formik.errors.lastName &&
        !formik.errors.nic &&
        !formik.errors.phone &&
        !formik.errors.email
      ) {
        setStep(2);
      } else {
        formik.setTouched({
          title: true,
          firstName: true,
          lastName: true,
          nic: true,
          phone: true,
          email: !!formik.values.email
        });
      }
    } else if (step === 2) {
      if (formik.values.hasOwnLand) {
        setStep(3);
      } else {
        formik.setFieldTouched('hasOwnLand', true);
      }
    } else if (step === 3) {
      if (
        formik.values.province &&
        formik.values.district &&
        formik.values.city &&
        !formik.errors.province &&
        !formik.errors.district &&
        !formik.errors.city
      ) {
        setStep(4);
      } else {
        formik.setTouched({
          ...formik.touched,
          province: true,
          district: true,
          city: true
        });
      }
    } else if (step === 4) {
      if (formik.values.climateZone && !formik.errors.climateZone) {
        setStep(5);
      } else {
        formik.setFieldTouched('climateZone', true);
      }
    } else if (step === 5) {
      // Check if water blocks progress
      if (waterBlocksProgress) {
        return; // Don't proceed if water blocks progress
      }

      // First, ensure all fields are touched to show validation errors
      formik.setTouched({
        ...formik.touched,
        landShape: true,
        soilType: true,
        hasStones: true,
        hasLandslideRisk: true,
        hasForestry: true,
        landSize: true
      }, true);

      // Directly check if required fields are filled
      const requiredFieldsFilled =
        formik.values.landShape &&
        formik.values.soilType &&
        (formik.values.hasWater !== undefined || formik.values.landShape !== 'Flat') &&
        formik.values.hasStones !== undefined &&
        formik.values.hasLandslideRisk !== undefined &&
        formik.values.hasForestry !== undefined &&
        formik.values.landSize;

      // If all required fields are filled, submit the form
      if (requiredFieldsFilled) {
        // Force landSize to be a number
        if (formik.values.landSize) {
          formik.setFieldValue('landSize', Number(formik.values.landSize), false);
        }

        // Manually run the eligibility check and set results
        const isClimateZoneEligible = ['low country wet zone', 'montane wet zone', 'montane dry zone', 'intermediate zone', 'dry mixed zone'].includes(formik.values.climateZone);
        const isSoilTypeEligible = !['Clay', 'Sand', 'Salt'].includes(formik.values.soilType);
        const isWaterEligible = formik.values.landShape !== 'Flat' || !formik.values.hasWater;
        const isStonesEligible = !formik.values.hasStones;
        const isLandslideEligible = !formik.values.hasLandslideRisk;
        const eligible = isClimateZoneEligible && isWaterEligible && isStonesEligible && isLandslideEligible;

        setIsEligible(eligible);
        setResult({
          name: `${formik.values.title} ${formik.values.firstName} ${formik.values.lastName}`,
          eligible,
          landSize: Number(formik.values.landSize),
          details: {
            climateZone: isClimateZoneEligible,
            soilType: isSoilTypeEligible,
            water: isWaterEligible,
            stones: isStonesEligible,
            landslide: isLandslideEligible,
            forestry: formik.values.hasForestry
          }
        });

        // Save visitor data to the backend
        saveVisitorData();

        // Move to results step
        setStep(6);
      }
    }
  };

  // Effect to validate form when values change
  useEffect(() => {
    // This helps clear errors as soon as values are entered
    if (formik.values.soilType && formik.touched.soilType) {
      formik.setFieldError('soilType', undefined);
    }

    if (formik.values.landSize && formik.touched.landSize) {
      formik.setFieldError('landSize', undefined);
    }
  }, [formik.values.soilType, formik.values.landSize, formik.touched.soilType, formik.touched.landSize, formik]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-green-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center text-green-800 mb-6">Agarwood Investment Calculator</h1>
            <p className="text-gray-600 text-center mb-8">
              Find out if your land is suitable for growing agarwood, a high-value plantation crop.
            </p>

            {/* Progress Steps */}
            <div className="flex justify-between mb-8">
              {[1, 2, 3, 4, 5].map((stepNumber) => (
                <button
                  key={stepNumber}
                  onClick={() => goToStep(stepNumber)}
                  type="button"
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    stepNumber === step
                      ? 'bg-green-600 text-white'
                      : stepNumber < step
                        ? 'bg-green-200 text-green-800 hover:bg-green-300'
                        : 'bg-gray-200 text-gray-600 cursor-not-allowed'
                  }`}
                  disabled={stepNumber > step}
                >
                  {stepNumber}
                </button>
              ))}
            </div>

            <form>
              {/* Step 1: Visitor Details */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-semibold text-green-800 mb-4">Personal Information</h2>

                  {/* Title */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                    <div className="flex space-x-4">
                      {['Mr', 'Mrs', 'Miss', 'Ven'].map((title) => (
                        <label key={title} className="inline-flex items-center">
                          <input
                            type="radio"
                            name="title"
                            value={title}
                            checked={formik.values.title === title}
                            onChange={formik.handleChange}
                            className="form-radio h-4 w-4 text-green-600"
                          />
                          <span className="ml-2">{title}</span>
                        </label>
                      ))}
                    </div>
                    {formik.touched.title && formik.errors.title && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
                    )}
                  </div>

                  {/* First/Last Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name*</label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                      {formik.touched.firstName && formik.errors.firstName && (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.firstName}</div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name*</label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      />
                      {formik.touched.lastName && formik.errors.lastName && (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.lastName}</div>
                      )}
                    </div>
                  </div>

                  {/* NIC */}
                  <div className="mb-4">
                    <label htmlFor="nic" className="block text-sm font-medium text-gray-700 mb-1">NIC*</label>
                    <input
                      id="nic"
                      name="nic"
                      type="text"
                      value={formik.values.nic}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="123456789V or 123456789012"
                    />
                    {formik.touched.nic && formik.errors.nic && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.nic}</div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Contact Number*</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-gray-500 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                        +94
                      </span>
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="771234567"
                      />
                    </div>
                    {formik.touched.phone && formik.errors.phone && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.phone}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address (Optional)</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Land Ownership */}
              {step === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-green-800 mb-4">Land Ownership</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Do you have your own land?*</label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="hasOwnLand"
                          value="true"
                          checked={formik.values.hasOwnLand === true}
                          onChange={() => formik.setFieldValue('hasOwnLand', true)}
                          className="form-radio h-4 w-4 text-green-600"
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="hasOwnLand"
                          value="false"
                          checked={formik.values.hasOwnLand === false}
                          onChange={() => formik.setFieldValue('hasOwnLand', false)}
                          className="form-radio h-4 w-4 text-green-600"
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                    {formik.touched.hasOwnLand && formik.errors.hasOwnLand && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.hasOwnLand}</div>
                    )}
                    {formik.values.hasOwnLand === false && (
                      <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                        <p className="font-medium">Note:</p>
                        <p>You must have your own land to grow agarwood. If you're interested in investment opportunities without owning land, please contact us directly.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Location */}
              {step === 3 && (
                <div>
                  <h2 className="text-xl font-semibold text-green-800 mb-4">Location</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Province */}
                    <div>
                      <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">Province*</label>
                      <select
                        id="province"
                        name="province"
                        value={formik.values.province}
                        onChange={handleProvinceChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      >
                        <option value="">Select Province</option>
                        {provinces.map(province => (
                          <option key={province} value={province}>{province}</option>
                        ))}
                      </select>
                      {formik.touched.province && formik.errors.province && (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.province}</div>
                      )}
                    </div>

                    {/* District */}
                    <div>
                      <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">District*</label>
                      <select
                        id="district"
                        name="district"
                        value={formik.values.district}
                        onChange={handleDistrictChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        disabled={!formik.values.province}
                      >
                        <option value="">Select District</option>
                        {districts.map(district => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                      {formik.touched.district && formik.errors.district && (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.district}</div>
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City*</label>
                      <select
                        id="city"
                        name="city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                        disabled={!formik.values.district}
                      >
                        <option value="">Select City</option>
                        {cities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      {formik.touched.city && formik.errors.city && (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.city}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Climate Zone */}
              {step === 4 && (
                <div>
                  <h2 className="text-xl font-semibold text-green-800 mb-4">Climate Zone</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select the climate zone of your land:*</label>
                    <div className="space-y-2">
                      {[
                        'low country wet zone',
                        'montane wet zone',
                        'montane dry zone',
                        'intermediate zone',
                        'dry mixed zone',
                        'other'
                      ].map((zone) => (
                        <label key={zone} className="flex items-center p-3 border rounded-md hover:bg-green-50">
                          <input
                            type="radio"
                            name="climateZone"
                            value={zone}
                            checked={formik.values.climateZone === zone}
                            onChange={formik.handleChange}
                            className="form-radio h-4 w-4 text-green-600"
                          />
                          <span className="ml-2 capitalize">{zone}</span>
                        </label>
                      ))}
                    </div>
                    {formik.touched.climateZone && formik.errors.climateZone && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.climateZone}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 5: Land Details */}
              {step === 5 && (
                <div>
                  <h2 className="text-xl font-semibold text-green-800 mb-4">Land Details</h2>

                  {/* Land Shape */}
                  <div className="mb-4">
                    <label htmlFor="landShape" className="block text-sm font-medium text-gray-700 mb-1">Land Shape*</label>
                    <select
                      id="landShape"
                      name="landShape"
                      value={formik.values.landShape}
                      onChange={(e) => {
                        const shape = e.target.value;
                        formik.setFieldValue('landShape', shape, true);

                        // Reset water value when shape changes
                        if (shape !== 'Flat') {
                          formik.setFieldValue('hasWater', undefined, true);
                          setWaterBlocksProgress(false);
                        }
                      }}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select Land Shape</option>
                      {landShapes.map(shape => (
                        <option key={shape} value={shape}>{shape}</option>
                      ))}
                    </select>
                    {formik.touched.landShape && formik.errors.landShape && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.landShape}</div>
                    )}
                  </div>

                  {/* Water (if Flat) */}
                  {formik.values.landShape === 'Flat' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Does the land contain or have water flowing through it?*</label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="hasWater"
                            value="true"
                            checked={formik.values.hasWater === true}
                            onChange={() => handleWaterChange(true)}
                            className="form-radio h-4 w-4 text-green-600"
                          />
                          <span className="ml-2">Yes</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="hasWater"
                            value="false"
                            checked={formik.values.hasWater === false}
                            onChange={() => handleWaterChange(false)}
                            className="form-radio h-4 w-4 text-green-600"
                          />
                          <span className="ml-2">No</span>
                        </label>
                      </div>
                      {formik.touched.hasWater && formik.errors.hasWater && (
                        <div className="text-red-500 text-sm mt-1">{formik.errors.hasWater}</div>
                      )}

                      {/* Warning for flat land with water */}
                      {formik.values.hasWater === true && (
                        <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
                          <p className="font-medium">Warning:</p>
                          <p>Flat land with water is not suitable for agarwood cultivation. Please contact us for alternative options or select a different land type.</p>
                          <a href="/contact" className="mt-2 inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200">
                            Contact Us
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Soil Type with warning logic - FIXED */}
                  <div className="mb-4">
                    <label htmlFor="soilType" className="block text-sm font-medium text-gray-700 mb-1">Soil Type*</label>
                    <select
                      id="soilType"
                      name="soilType"
                      value={formik.values.soilType}
                      onChange={e => {
                        const selected = e.target.value;
                        formik.setFieldValue('soilType', selected, true);
                        formik.setFieldError('soilType', undefined); // Clear error immediately
                        checkSoilType(selected);
                      }}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Select Soil Type</option>
                      {soilTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {formik.touched.soilType && formik.errors.soilType && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.soilType}</div>
                    )}
                    {warnings.soilType && (
                      <div className="text-yellow-600 text-sm mt-1">{warnings.soilType}</div>
                    )}
                  </div>

                  {/* Stones - FIXED with warning */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Is the land mostly covered with stones?*</label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="hasStones"
                          value="true"
                          checked={formik.values.hasStones === true}
                          onChange={() => handleRadioChange('hasStones', true)}
                          className="form-radio h-4 w-4 text-green-600"
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="hasStones"
                          value="false"
                          checked={formik.values.hasStones === false}
                          onChange={() => handleRadioChange('hasStones', false)}
                          className="form-radio h-4 w-4 text-green-600"
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                    {formik.touched.hasStones && formik.errors.hasStones && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.hasStones}</div>
                    )}
                    {radioWarnings.hasStones && (
                      <div className="text-green-600 text-sm mt-1">Good choice! Land without stones is better for agarwood cultivation.</div>
                    )}
                  </div>

                  {/* Landslide Risk - FIXED with warning */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Is there a landslide risk in the area?*</label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="hasLandslideRisk"
                          value="true"
                          checked={formik.values.hasLandslideRisk === true}
                          onChange={() => handleRadioChange('hasLandslideRisk', true)}
                          className="form-radio h-4 w-4 text-green-600"
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="hasLandslideRisk"
                          value="false"
                          checked={formik.values.hasLandslideRisk === false}
                          onChange={() => handleRadioChange('hasLandslideRisk', false)}
                          className="form-radio h-4 w-4 text-green-600"
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                    {formik.touched.hasLandslideRisk && formik.errors.hasLandslideRisk && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.hasLandslideRisk}</div>
                    )}
                    {radioWarnings.hasLandslideRisk && (
                      <div className="text-green-600 text-sm mt-1">Good choice! Land without landslide risk is better for agarwood cultivation.</div>
                    )}
                  </div>

                  {/* Forestry Area - FIXED with warning */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Is the land part of a forestry area?*</label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="hasForestry"
                          value="true"
                          checked={formik.values.hasForestry === true}
                          onChange={() => handleRadioChange('hasForestry', true)}
                          className="form-radio h-4 w-4 text-green-600"
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="hasForestry"
                          value="false"
                          checked={formik.values.hasForestry === false}
                          onChange={() => handleRadioChange('hasForestry', false)}
                          className="form-radio h-4 w-4 text-green-600"
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                    {formik.touched.hasForestry && formik.errors.hasForestry && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.hasForestry}</div>
                    )}
                    {radioWarnings.hasForestry && (
                      <div className="text-green-600 text-sm mt-1">Note: Non-forestry land may have different regulatory requirements.</div>
                    )}
                  </div>

                  {/* Land Size - FIXED */}
                  <div className="mb-4">
                    <label htmlFor="landSize" className="block text-sm font-medium text-gray-700 mb-1">Land size that you wish to cultivate (in perches)*</label>
                    <input
                      id="landSize"
                      name="landSize"
                      type="number"
                      value={formik.values.landSize}
                      onChange={e => {
                        const value = e.target.value;
                        formik.setFieldValue('landSize', value === '' ? '' : Number(value), true);
                        formik.setFieldError('landSize', undefined); // Clear error immediately
                      }}
                      onBlur={formik.handleBlur}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                    {formik.touched.landSize && formik.errors.landSize && (
                      <div className="text-red-500 text-sm mt-1">{formik.errors.landSize}</div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 6: Results */}
              {step === 6 && result && (
                <div className="text-center">
                  {isEligible ? (
                    <div className="mb-6">
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-green-800 mb-2">Congratulations!</h2>
                      <p className="text-lg text-gray-700 mb-4">You're eligible to grow agarwood on your land.</p>

                      {/* Results Calculation Component */}
                      <ResultsCalculation
                        landSize={result.landSize}
                        customerName={result.name}
                      />
                    </div>
                  ) : (
                    <div className="mb-6">
                      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-red-800 mb-2">We're Sorry</h2>
                      <p className="text-lg text-gray-700 mb-4">Your land doesn't meet all the requirements for agarwood cultivation.</p>
                      <p className="text-gray-600">However, we have other investment opportunities that might suit you better.</p>

                      {/* Assessment Details */}
                      <div className="mt-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Assessment Details</h3>
                        <div className="bg-gray-50 p-4 rounded-lg text-left">
                          <ul className="space-y-2">
                            <li className="flex items-center">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${result.details.climateZone ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {result.details.climateZone ? '✓' : '✗'}
                              </span>
                              <span>Climate Zone: {formik.values.climateZone}</span>
                            </li>
                            <li className="flex items-center">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${result.details.soilType ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-700'}`}>
                                {result.details.soilType ? '✓' : '!'}
                              </span>
                              <span>
                                Soil Type: {formik.values.soilType}
                                {!result.details.soilType && (
                                  <span className="ml-2 text-yellow-700">(Warning: Not ideal for agarwood)</span>
                                )}
                              </span>
                            </li>
                            <li className="flex items-center">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${result.details.water ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {result.details.water ? '✓' : '✗'}
                              </span>
                              <span>Water Conditions: {formik.values.landShape === 'Flat' ? (formik.values.hasWater ? 'Has water' : 'No water') : 'Not flat land'}</span>
                            </li>
                            <li className="flex items-center">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${result.details.stones ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {result.details.stones ? '✓' : '✗'}
                              </span>
                              <span>Stone Coverage: {formik.values.hasStones ? 'High' : 'Low'}</span>
                            </li>
                            <li className="flex items-center">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${result.details.landslide ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                {result.details.landslide ? '✓' : '✗'}
                              </span>
                              <span>Landslide Risk: {formik.values.hasLandslideRisk ? 'Yes' : 'No'}</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="mt-8 flex justify-center space-x-4">
                        <a href="/investment" className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition duration-200">
                          Explore Other Investments
                        </a>
                        <a href="/contact" className="px-6 py-2 border border-green-600 text-green-600 font-medium rounded-md hover:bg-green-50 transition duration-200">
                          Contact Us
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              {step < 6 && (
                <div className="flex justify-between mt-8">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition duration-200"
                    >
                      Previous
                    </button>
                  )}
                  <div className="flex-grow"></div>

                  {/* Show error message if there was an error submitting the form */}
                  {submitError && (
                    <div className="text-red-500 mb-4">
                      {submitError}
                    </div>
                  )}

                  {step < 5 ? (
                    <button
                      type="button"
                      onClick={validateCurrentStep}
                      className="px-6 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition duration-200"
                      disabled={waterBlocksProgress}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={validateCurrentStep}
                      className={`px-6 py-2 ${
                        waterBlocksProgress || isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-green-600 hover:bg-green-700'
                      } text-white font-medium rounded-md transition duration-200 flex items-center`}
                      disabled={waterBlocksProgress || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        'Confirm'
                      )}
                    </button>
                  )}
                </div>
              )}

            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AgarwoodCalculator;