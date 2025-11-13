import { loadEnvFile } from "node:process";

loadEnvFile();

export const CONFIG = {
  port: process.env.PORT,
  database: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  }
};
