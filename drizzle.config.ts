import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

// Parse the DATABASE_URL
const databaseUrl = new URL(process.env.DATABASE_URL!);

export default defineConfig({
    dialect: "postgresql",
    schema: "./db/schema.ts",
    out: "./drizzle",
    dbCredentials: {
        host: databaseUrl.hostname,
        user: databaseUrl.username,
        password: databaseUrl.password,
        database: databaseUrl.pathname.slice(1),
        port: Number(databaseUrl.port) || 5432,
        ssl: { rejectUnauthorized: false },
    },
    verbose: true,
    strict: true
});