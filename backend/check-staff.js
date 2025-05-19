// check-staff.js
const sequelize = require('./config/db');
const { QueryTypes } = require('sequelize');

async function checkStaffTable() {
  try {
    await sequelize.authenticate();
    console.log('Connection successful');
    
    // Check staff table structure
    const columns = await sequelize.query(
      `SELECT column_name, data_type 
       FROM information_schema.columns 
       WHERE table_name = 'staff'`,
      { type: QueryTypes.SELECT }
    );
    
    console.log('Staff table columns:', columns);
    
    // Check sample data
    const staff = await sequelize.query(
      'SELECT * FROM staff LIMIT 2',
      { type: QueryTypes.SELECT }
    );
    
    console.log('Sample staff:', staff);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

checkStaffTable();
