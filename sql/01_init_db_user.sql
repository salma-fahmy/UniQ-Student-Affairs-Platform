-- Create app_user if not exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_user') THEN
    CREATE USER app_user WITH PASSWORD 'password';
  END IF;
END
$$;

GRANT CONNECT ON DATABASE unv TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
ALTER USER app_user NOBYPASSRLS;

-- Grant privileges on future tables created by postgres user (migrations)
ALTER DEFAULT PRIVILEGES FOR USER postgres IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;

ALTER DEFAULT PRIVILEGES FOR USER postgres IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO app_user;