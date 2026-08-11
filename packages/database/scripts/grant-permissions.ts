import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const { POSTGRES_PW, POSTGRES_DB, APP_USER_PW } = process.env;

console.log("POSTGRES_PW:", POSTGRES_PW);
console.log("POSTGRES_DB:", POSTGRES_DB);
console.log("APP_USER_PW:", APP_USER_PW);

if (!POSTGRES_PW || !POSTGRES_DB || !APP_USER_PW) {
    console.error("Missing required environment variables!");
    process.exit(1);
}

const prisma = new PrismaClient({
    adapter: new PrismaPg({
        connectionString: `postgresql://postgres:${POSTGRES_PW}@postgres:5432/${POSTGRES_DB}`,
    }),
});

async function grantPermissions() {
    try {
        console.log("Granting permissions to app_user...");

        await prisma.$executeRawUnsafe(`
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app_user') THEN
                    CREATE ROLE app_user WITH LOGIN PASSWORD '${APP_USER_PW}';
                END IF;
            END
            $$;
        `);

        await prisma.$executeRawUnsafe(
            `GRANT USAGE ON SCHEMA public TO app_user;`
        );
        await prisma.$executeRawUnsafe(
            `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;`
        );
        await prisma.$executeRawUnsafe(
            `GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;`
        );
        await prisma.$executeRawUnsafe(
            `ALTER USER app_user NOBYPASSRLS;`
        );

        console.log("Permissions granted successfully!");
    } catch (error) {
        console.error("Error granting permissions:", error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

grantPermissions();