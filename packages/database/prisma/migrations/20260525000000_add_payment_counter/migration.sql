-- CreateTable: payment_counters (for PAY-YYYY-NNNNN numbering)
-- Note: The Payment model already exists in the schema.
-- This migration adds a dedicated PaymentCounter so payment numbers
-- don't share the sequence with request counters.

CREATE TABLE IF NOT EXISTS "payment_counters" (
    "id"       SERIAL      NOT NULL,
    "year"     INTEGER     NOT NULL,
    "sequence" INTEGER     NOT NULL DEFAULT 0,
    CONSTRAINT "payment_counters_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "payment_counters_year_key" ON "payment_counters"("year");
CREATE INDEX IF NOT EXISTS "payment_counters_year_idx" ON "payment_counters"("year");
