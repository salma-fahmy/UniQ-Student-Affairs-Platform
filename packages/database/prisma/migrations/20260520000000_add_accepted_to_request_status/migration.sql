-- ── Migration: 20260520000000_add_accepted_to_request_status ─────────────────
-- The business rules spec defines request statuses as: accepted, rejected, resubmit.
-- "accepted" is added as the canonical approval term for requests.
-- "approved" is kept in the enum for backward compatibility with existing data.
 
ALTER TYPE "request_status" ADD VALUE IF NOT EXISTS 'accepted';
