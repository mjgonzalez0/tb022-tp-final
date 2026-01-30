import { Pool } from "pg";
import { CONFIG } from "./config.js"

export const pool = new Pool({
  host: CONFIG.database.host,
  user: CONFIG.database.username,
  database: CONFIG.database.name,
  password: CONFIG.database.password,
});
