-- Migration: Unify RequestStatus enum
-- Removes: pending_doctor_approval, approved, in_Progress
-- Keeps: pending, accepted, rejected, resubmit

-- Step 1: Migrate any rows that use old statuses to their canonical equivalents
UPDATE requests SET status = 'pending'   WHERE status = 'pending_doctor_approval';
UPDATE requests SET status = 'accepted'  WHERE status = 'approved';
UPDATE requests SET status = 'pending'   WHERE status = 'in_Progress';

-- Step 2: Drop the default so it doesn't block the type change
ALTER TABLE requests ALTER COLUMN status DROP DEFAULT;

-- Step 3: Rename the old enum type so we can replace it
ALTER TYPE request_status RENAME TO request_status_old;

-- Step 4: Create the new unified enum
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'rejected', 'resubmit');

-- Step 5: Migrate the column to the new enum type
ALTER TABLE requests
  ALTER COLUMN status TYPE request_status
  USING status::text::request_status;

-- Step 6: Restore the default with the new type
ALTER TABLE requests ALTER COLUMN status SET DEFAULT 'pending'::request_status;

-- Step 7: Drop the old enum type
DROP TYPE request_status_old;