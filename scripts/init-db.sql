-- ProxaPeople Database Initialization Script
-- This script runs automatically when the PostgreSQL container starts for the first time

-- Create database extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set up initial database configuration
-- Note: Drizzle migrations will handle table creation
-- This file is mainly for extensions and any database-level setup

-- Create a read-only monitoring user (optional)
-- DO $$
-- BEGIN
--   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'monitor') THEN
--     CREATE ROLE monitor WITH LOGIN PASSWORD 'monitor_password';
--     GRANT CONNECT ON DATABASE proxapeople_dev TO monitor;
--     GRANT USAGE ON SCHEMA public TO monitor;
--     GRANT SELECT ON ALL TABLES IN SCHEMA public TO monitor;
--     ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO monitor;
--   END IF;
-- END
-- $$;

-- Log initialization completion
SELECT 'ProxaPeople database initialized successfully' as status;