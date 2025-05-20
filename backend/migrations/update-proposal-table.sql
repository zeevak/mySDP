-- Update proposal table to include new fields
-- First, check if the columns already exist
DO $$
BEGIN
    -- Check if project_type column exists
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'proposal' AND column_name = 'project_type'
    ) THEN
        -- Add project_type column
        ALTER TABLE proposal 
        ADD COLUMN project_type VARCHAR(10) CHECK (project_type IN ('Agarwood', 'Sandalwood', 'Vanilla', 'Other'));
        
        -- Make it NOT NULL after adding with a default value to handle existing rows
        ALTER TABLE proposal 
        ALTER COLUMN project_type SET DEFAULT 'Agarwood';
        
        UPDATE proposal SET project_type = 'Agarwood' WHERE project_type IS NULL;
        
        ALTER TABLE proposal 
        ALTER COLUMN project_type SET NOT NULL;
    END IF;

    -- Check if project_duration column exists
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'proposal' AND column_name = 'project_duration'
    ) THEN
        -- Add project_duration column
        ALTER TABLE proposal 
        ADD COLUMN project_duration INTEGER;
        
        -- Make it NOT NULL after adding with a default value to handle existing rows
        ALTER TABLE proposal 
        ALTER COLUMN project_duration SET DEFAULT 4;
        
        UPDATE proposal SET project_duration = 4 WHERE project_duration IS NULL;
        
        ALTER TABLE proposal 
        ALTER COLUMN project_duration SET NOT NULL;
    END IF;

    -- Check if project_value column exists
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'proposal' AND column_name = 'project_value'
    ) THEN
        -- Add project_value column
        ALTER TABLE proposal 
        ADD COLUMN project_value DECIMAL(10, 2);
        
        -- Make it NOT NULL after adding with a default value to handle existing rows
        ALTER TABLE proposal 
        ALTER COLUMN project_value SET DEFAULT 100000.00;
        
        UPDATE proposal SET project_value = 100000.00 WHERE project_value IS NULL;
        
        ALTER TABLE proposal 
        ALTER COLUMN project_value SET NOT NULL;
    END IF;

    -- Update payment_mode check constraint
    ALTER TABLE proposal 
    DROP CONSTRAINT IF EXISTS proposal_payment_mode_check;
    
    ALTER TABLE proposal 
    ADD CONSTRAINT proposal_payment_mode_check 
    CHECK (payment_mode IN ('full', 'installments'));

    -- Remove project_type from project table if it exists
    IF EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'project' AND column_name = 'project_type'
    ) THEN
        -- First, copy project_type values to proposal table for existing projects
        UPDATE proposal p
        SET project_type = pr.project_type
        FROM project pr
        WHERE p.proposal_id = pr.proposal_id
        AND pr.project_type IS NOT NULL;
        
        -- Then drop the column from project table
        ALTER TABLE project 
        DROP COLUMN project_type;
    END IF;
END $$;
