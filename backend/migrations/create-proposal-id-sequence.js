// migrations/create-proposal-id-sequence.js
const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = require('../config/db');

/**
 * Migration to create the proposal_id_seq sequence if it doesn't exist
 */
module.exports = async function() {
  const transaction = await sequelize.transaction();

  try {
    console.log('Starting migration: Creating proposal_id_seq sequence');

    // Check if sequence exists
    const sequenceCheck = await sequelize.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.sequences 
        WHERE sequence_name = 'proposal_id_seq'
      )
    `, { 
      type: QueryTypes.SELECT,
      transaction
    });

    if (!sequenceCheck[0].exists) {
      console.log('proposal_id_seq sequence does not exist. Creating it...');
      
      // Create the sequence
      await sequelize.query(`
        CREATE SEQUENCE proposal_id_seq
        START WITH 1
        INCREMENT BY 1
        NO MINVALUE
        NO MAXVALUE
        CACHE 1;
      `, { transaction });
      
      console.log('proposal_id_seq sequence created successfully');
    } else {
      console.log('proposal_id_seq sequence already exists');
    }

    // Commit the transaction
    await transaction.commit();
    console.log('Migration completed successfully');
  } catch (error) {
    await transaction.rollback();
    console.error('Migration failed:', error);
    throw error;
  }
};
