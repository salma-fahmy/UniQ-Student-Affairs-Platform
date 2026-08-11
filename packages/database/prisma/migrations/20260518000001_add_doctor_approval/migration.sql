-- ── Migration: 20260518000001_add_doctor_approval ────────────────────────────
-- Adds assigned_doctor_id column to requests table to support the
-- pending_doctor_approval workflow (CRS_REG / CRS_WTH request types).

ALTER TABLE "requests"
  ADD COLUMN IF NOT EXISTS "assigned_doctor_id" VARCHAR(50);

CREATE INDEX IF NOT EXISTS "requests_assigned_doctor_id_idx"
  ON "requests"("assigned_doctor_id");