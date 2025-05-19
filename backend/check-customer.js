// check-customer.js
const sequelize = require('./config/db');
const { QueryTypes } = require('sequelize');

async function checkCustomerTable() {
  try {
    await sequelize.authenticate();
    console.log('Connection successful');
    
    // Check customer table structure
    const columns = await sequelize.query(
      `SELECT column_name, data_type 
       FROM information_schema.columns 
       WHERE table_name = 'customer'`,
      { type: QueryTypes.SELECT }
    );
    
    console.log('Customer table columns:', columns);
    
    // Check sample data
    const customers = await sequelize.query(
      'SELECT * FROM customer LIMIT 2',
      { type: QueryTypes.SELECT }
    );
    
    console.log('Sample customers:', customers);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

checkCustomerTable();
