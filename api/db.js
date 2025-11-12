import { Pool } from "pg";
import { CONFIG } from "./index.js"

export const pool = new Pool({
  user: CONFIG.database.username,
  database: CONFIG.database.name,
  password: CONFIG.database.password,
});
