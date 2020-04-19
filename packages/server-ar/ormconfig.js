require("dotenv").config();

const config = {
    type: "postgres",
    synchronize: true,
    logging: false, // ["query", "error"],
    cache: true,
    entities: process.env.NODE_ENV === "production" ? ["dist/**/**.entity{.ts,.js}"] : ["src/**/**.entity{.ts,.js}"],
    migrations: process.env.NODE_ENV === "production" ? ["dist/db/migrations/**/*.{ts,js}"] : ["src/db/migrations/**/*.{ts,js}"],
    cli: {
        migrationsDir: "src/db/migrations",
        subscribersDir: "src/db/subscribers",
    },
};

if (process.env.DATABASE_URL) {
    config.ssl = true;
    config.url = process.env.DATABASE_URL;
} else if (process.env.DB_HOST) {
    config.ssl = true;
    config.host = process.env.DB_HOST;
    config.database = process.env.DB_NAME;
    config.username = process.env.DB_USER;
    config.password = process.env.DB_PASSWORD;
    config.port = 5432;
} else {
    config.host = "localhost";
    config.database = "ar-migrate";
    config.port = 5432;
}



module.exports = config;
