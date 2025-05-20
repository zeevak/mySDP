// run-sql-migration.js
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create a PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'susaruAgroDB',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function runSqlMigration() {
  const client = await pool.connect();
  
  try {
    console.log('Starting SQL migration...');
    
    // Begin transaction
    await client.query('BEGIN');
    
    // Read and execute the SQL file
    const sqlFilePath = path.join(__dirname, 'migrations', 'update-proposal-table.sql');
    const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('Executing SQL script...');
    await client.query(sqlScript);
    
    // Commit transaction
    await client.query('COMMIT');
    
    console.log('SQL migration completed successfully');
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('SQL migration failed:', error);
  } finally {
    // Release the client back to the pool
    client.release();
    
    // Close the pool
    await pool.end();
  }
}

runSqlMigration();
