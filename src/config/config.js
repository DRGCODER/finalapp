import env from "dotenv";

env.config();
const config = {
    secret: process.env.SESSION_TOKEN,
    database: process.env.DB_NAME || "drg",
    username: process.env.DB_USER || "drg",
    password: process.env.DB_PASSWORD || 12233441,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    serverPort: process.env.SERVER_PORT,
    timeout: 1000 * 30,
};

export default config;