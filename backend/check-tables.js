// check-tables.js
const sequelize = require('./config/db');
const { QueryTypes } = require('sequelize');

async function checkTables() {
  try {
    await sequelize.authenticate();
    console.log('Connection successful');
    console.log('Database config:', {
      name: process.env.DB_NAME,
      user: process.env.DB_USER,
      host: process.env.DB_HOST
    });

    // Get all tables
    const tables = await sequelize.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'",
      { type: QueryTypes.SELECT }
    );

    console.log('Tables in database:', tables);

    if (tables.length === 0) {
      console.log('No tables found in the database');
      return;
    }

    // Check specific tables we're interested in
    const tablesToCheck = ['customer', 'staff', 'project', 'inventory', 'message', 'request'];

    for (const tableName of tablesToCheck) {
      try {
        const result = await sequelize.query(
          `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '${tableName}')`,
          { type: QueryTypes.SELECT }
        );

        const exists = result[0].exists;
        console.log(`Table '${tableName}' exists: ${exists}`);

        if (exists) {
          const countResult = await sequelize.query(
            `SELECT COUNT(*) as count FROM "${tableName}"`,
            { type: QueryTypes.SELECT }
          );
          console.log(`${tableName}: ${countResult[0].count} records`);
        }
      } catch (err) {
        console.error(`Error checking table ${tableName}:`, err.message);
      }
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

checkTables();
