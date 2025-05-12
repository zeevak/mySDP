// controllers/landController.js
const axios = require("axios");
const Visitor = require("../models/Visitor");
const VisitorLand = require("../models/VisitorLand");
const Customer = require("../models/Customer");
const CustomerLand = require("../models/CustomerLand");
require("dotenv").config();

exports.saveVisitorData = async (req, res) => {
  const {
    title,
    firstName,
    lastName,
    nic,
    phone,
    email,
    province,
    district,
    area,
    climateZone,
    landShape,
    soilType,
    hasWater,
    hasStones,
    hasLandslideRisk,
    hasForestry,
    landSize,
    eligible,
    details
  } = req.body;

  try {
    // Format the name
    const fullName = `${title} ${firstName} ${lastName}`;

    // Format the land location
    const landLocation = `${area}, ${district}, ${province}`;

    // Create geo_type from landShape and other properties
    let geoType = landShape;
    if (hasWater) geoType += ", Has Water";
    if (hasStones) geoType += ", Has Stones";
    if (hasLandslideRisk) geoType += ", Landslide Risk";
    if (hasForestry) geoType += ", Forestry Area";

    // Create feedback based on eligibility details
    let feedback = "Land assessment results: ";
    if (details) {
      if (!details.climateZone) feedback += "Climate zone not suitable. ";
      if (!details.soilType) feedback += "Soil type not ideal. ";
      if (!details.water) feedback += "Water conditions not suitable. ";
      if (!details.stones) feedback += "Stone presence may affect cultivation. ";
      if (!details.landslide) feedback += "Landslide risk is a concern. ";
    }

    // Create Visitor record
    const visitor = await Visitor.create({
      title: title,
      f_name: firstName,
      l_name: lastName,
      phone: `+94${phone}`,
      email: email || null, // Handle optional email
      created_at: new Date()
    });

    // Create VisitorLand record
    await VisitorLand.create({
      visitor_id: visitor.visitor_id,
      province: province,
      district: district,
      city: area,
      climate_zone: climateZone,
      land_shape: landShape,
      has_water: hasWater,
      soil_type: soilType,
      has_stones: hasStones,
      has_landslide_risk: hasLandslideRisk,
      has_forestry: hasForestry,
      land_size: landSize
    });

    res.status(201).json({
      success: true,
      message: "Visitor data saved successfully",
      visitor_id: visitor.visitor_id,
      eligible: eligible
    });
  } catch (err) {
    console.error("Error saving visitor data:", err);
    res.status(500).json({
      success: false,
      message: "Error saving visitor data",
      error: err.message
    });
  }
};

exports.checkEligibility = async (req, res) => {
  const { firstName, lastName, email, landSize, province, district, city, soilType, climateZone } =
    req.body;
  try {
    // Create Visitor
    const visitor = await Visitor.create({
      title: "Mr/Ms",
      f_name: firstName,
      l_name: lastName,
      email,
      created_at: new Date()
    });

    // Mock ML prediction (replace with actual ML model)
    const eligible =
      landSize > 1 && soilType === "loamy" && climateZone === "low country wet zone";
    const feedback = eligible
      ? "Suitable for Agarwood cultivation"
      : "Unsuitable due to soil or climate conditions";

    // Create VisitorLand record
    await VisitorLand.create({
      visitor_id: visitor.visitor_id,
      province,
      district,
      city,
      climate_zone: climateZone,
      soil_type: soilType,
      land_size: landSize,
      has_water: false,
      has_stones: false,
      has_landslide_risk: false,
      has_forestry: false
    });

    // Fetch weather data
    const weather = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},${district},${province}&appid=${process.env.WEATHER_API_KEY}`
    );

    res.json({
      eligible,
      feedback,
      weather: weather.data,
      plants: eligible ? Math.floor(landSize * 100) : 0,
      cost: eligible ? landSize * 10000 : 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error checking eligibility" });
  }
};