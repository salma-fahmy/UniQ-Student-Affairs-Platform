-- Migration: Unify ComplaintStatus enum
-- Removes: resolved, closed, approved
-- Keeps: open, in_progress, accepted, rejected

-- Step 1: Migrate any rows using old statuses to canonical equivalents
UPDATE complaints SET status = 'accepted'    WHERE status = 'approved';
UPDATE complaints SET status = 'rejected'    WHERE status = 'closed';
UPDATE complaints SET status = 'in_progress' WHERE status = 'resolved';

-- Step 2: Drop the default so it doesn't block the type change
ALTER TABLE complaints ALTER COLUMN status DROP DEFAULT;

-- Step 3: Rename the old enum type
ALTER TYPE complaint_status RENAME TO complaint_status_old;

-- Step 4: Create the new unified enum
CREATE TYPE complaint_status AS ENUM ('open', 'in_progress', 'accepted', 'rejected');

-- Step 5: Migrate the column to the new enum type
ALTER TABLE complaints
  ALTER COLUMN status TYPE complaint_status
  USING status::text::complaint_status;

-- Step 6: Restore the default
ALTER TABLE complaints ALTER COLUMN status SET DEFAULT 'open'::complaint_status;

-- Step 7: Drop the old enum type
DROP TYPE complaint_status_old;