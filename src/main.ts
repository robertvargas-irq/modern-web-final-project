import "dotenv/config";
import db_connect from "./config/db_connect.js";

// connect to the database
await db_connect();

