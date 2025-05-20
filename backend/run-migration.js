// run-migration.js
const updateProposalSchema = require('./migrations/update-proposal-schema');
const createProposalIdSequence = require('./migrations/create-proposal-id-sequence');

async function runMigrations() {
  try {
    console.log('Starting migrations...');

    // Run the create proposal ID sequence migration
    await createProposalIdSequence();

    // Run the update proposal schema migration
    await updateProposalSchema();

    console.log('All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
