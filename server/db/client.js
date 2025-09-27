import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

export const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
});

export async function connectDB() {
  try {
    await client.connect();
    console.log("Database connected");
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
}
