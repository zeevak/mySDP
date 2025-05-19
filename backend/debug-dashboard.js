// debug-dashboard.js
const sequelize = require('./config/db');
const queries = require('./queries/dashboardQueries');
const { QueryTypes } = require('sequelize');

async function debugDashboard() {
  try {
    await sequelize.authenticate();
    console.log('Connection successful');

    // Directly check specific tables
    const tablesToCheck = ['customer', 'staff', 'project', 'inventory', 'message', 'request'];

    for (const tableName of tablesToCheck) {
      try {
        // Check if table exists
        const result = await sequelize.query(
          `SELECT EXISTS (
            SELECT FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = '${tableName}'
          )`,
          { type: QueryTypes.SELECT }
        );

        const exists = result[0].exists;
        console.log(`Table '${tableName}' exists: ${exists}`);

        if (exists) {
          // Count records
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

    // Check message table structure
    try {
      const messageColumns = await sequelize.query(
        `SELECT column_name, data_type
         FROM information_schema.columns
         WHERE table_name = 'message'`,
        { type: QueryTypes.SELECT }
      );
      console.log('Message table columns:', messageColumns);

      // Check if is_read column exists
      const hasIsReadColumn = messageColumns.some(col => col.column_name === 'is_read');
      console.log('Has is_read column:', hasIsReadColumn);

      if (hasIsReadColumn) {
        // Check message data
        const messages = await sequelize.query(
          'SELECT * FROM message LIMIT 5',
          { type: QueryTypes.SELECT }
        );
        console.log('Sample messages:', messages);
      }
    } catch (err) {
      console.error('Error checking message table structure:', err.message);
    }

    // Test unread message count query
    try {
      console.log('Testing unread message count query...');
      const unreadMessageCount = await sequelize.query(
        queries.unreadMessageCount,
        { type: QueryTypes.SELECT }
      );
      console.log('Unread message count result:', unreadMessageCount);
    } catch (err) {
      console.error('Error with unread message count query:', err.message);
    }

    // Test recent customers query
    try {
      console.log('Testing recent customers query...');
      const recentCustomers = await sequelize.query(
        queries.recentCustomers,
        { type: QueryTypes.SELECT }
      );
      console.log('Recent customers result:', recentCustomers);
    } catch (err) {
      console.error('Error with recent customers query:', err.message);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

debugDashboard();
