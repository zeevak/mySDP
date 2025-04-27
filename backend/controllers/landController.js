// controllers/landController.js
const axios = require("axios");
const Visitor = require("../models/Visitor");
const Land = require("../models/Land");
require("dotenv").config();

exports.checkEligibility = async (req, res) => {
  const { name, email, land_size, land_location, soil_type, climate } =
    req.body;
  try {
    // Create Visitor
    const visitor = await Visitor.create({
      name,
      email,
      land_size,
      land_location,
      soil_type,
      climate,
    });

    // Mock ML prediction (replace with actual ML model)
    const eligible =
      land_size > 1 && soil_type === "loamy" && climate === "tropical";
    const feedback = eligible
      ? "Suitable for Agarwood cultivation"
      : "Unsuitable due to soil or climate conditions";

    // Create Land record
    await Land.create({
      visitor_id: visitor.visitor_id,
      eligible,
      suggested_crops: eligible ? "Agarwood" : "None",
      feedback,
    });

    // Update Visitor
    await Visitor.update(
      { eligibility_status: eligible, eligibility_feedback: feedback },
      { where: { visitor_id: visitor.visitor_id } }
    );

    // Fetch weather data
    const weather = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${land_location}&appid=${process.env.WEATHER_API_KEY}`
    );

    res.json({
      eligible,
      feedback,
      weather: weather.data,
      plants: eligible ? Math.floor(land_size * 100) : 0,
      cost: eligible ? land_size * 10000 : 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error checking eligibility" });
  }
};