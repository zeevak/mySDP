const sequelize = require('./config/db');

async function checkSchema() {
  try {
    console.log('Checking inventory table schema...');
    
    const [results] = await sequelize.query("SELECT * FROM information_schema.columns WHERE table_name = 'inventory'");
    
    console.log('Inventory table columns:');
    console.log(JSON.stringify(results, null, 2));
    
    // Check if inventory_id is auto-incrementing
    const [autoIncrementResults] = await sequelize.query(`
      SELECT column_name, column_default, is_nullable, data_type
      FROM information_schema.columns
      WHERE table_name = 'inventory' AND column_name = 'inventory_id'
    `);
    
    console.log('Inventory ID column details:');
    console.log(JSON.stringify(autoIncrementResults, null, 2));
    
    // Check if there's a sequence for inventory_id
    const [sequenceResults] = await sequelize.query(`
      SELECT * FROM information_schema.sequences
      WHERE sequence_name LIKE '%inventory%'
    `);
    
    console.log('Inventory sequences:');
    console.log(JSON.stringify(sequenceResults, null, 2));
    
  } catch (error) {
    console.error('Error checking schema:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed');
  }
}

checkSchema();
