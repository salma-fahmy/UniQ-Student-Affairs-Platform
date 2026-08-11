-- ── Migration: 20260518000000_add_statuses ───────────────────────────────────
-- Adds new status variants to complaint_status and request_status enums.
-- These values were applied directly to the DB and are now recorded here
-- to bring the migration history back in sync with the actual schema.

-- complaint_status: add approved + rejected
ALTER TYPE "complaint_status" ADD VALUE IF NOT EXISTS 'approved';
ALTER TYPE "complaint_status" ADD VALUE IF NOT EXISTS 'rejected';

-- request_status: add resubmit + pending_doctor_approval
ALTER TYPE "request_status" ADD VALUE IF NOT EXISTS 'resubmit';
ALTER TYPE "request_status" ADD VALUE IF NOT EXISTS 'pending_doctor_approval';