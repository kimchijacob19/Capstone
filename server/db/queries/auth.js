import { client } from "../client.js";
import bcrypt from "bcrypt";

// Register user
export async function registerUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const { rows } = await client.query(
    `INSERT INTO app_users (username, password)
     VALUES ($1, $2)
     RETURNING id, username`,
    [username, hashedPassword]
  );
  return rows[0];
}

// Find user by username
export async function findUserByUsername(username) {
  const { rows } = await client.query(
    `SELECT * FROM app_users WHERE username = $1`,
    [username]
  );
  return rows[0];
}
