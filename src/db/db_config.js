import config from "../config/config.js";
import pg from 'pg';

// Create a new PostgreSQL client instance
const client = new pg.Client({
    host: config.host,
    port: config.port,
    database: config.database,
    user: config.username,
    password: config.password,
});

// Connect to the database
client.connect().then(() => {
    console.log("Connected to PostgreSQL database");
});

process.on("exit", () => {
    client.end();
});


// reuse client instance in  multiple places
export default client;


