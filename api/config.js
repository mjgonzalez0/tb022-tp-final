import { loadEnvFile } from "node:process";

try {
  loadEnvFile();
} catch (_) {
  console.log("No se pudo leer el archivo '.env'");
}

export const CONFIG = {
  port: process.env.API_PORT,
  database: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  jwt: {
    secret: process.env.API_AUTH_SECRET,
  },
};
