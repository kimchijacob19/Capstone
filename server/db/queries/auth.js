import { client } from "../client.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register new user
export async function registerUser({ username, password, name, email }) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const {
    rows: [user],
  } = await client.query(
    `
    INSERT INTO app_users (username, password, name, email)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, name, email;
  `,
    [username, hashedPassword, name, email]
  );

  return user;
}

// Login user
export async function loginUser({ username, password }) {
  const {
    rows: [user],
  } = await client.query(
    `
    SELECT * FROM app_users
    WHERE username = $1
  `,
    [username]
  );

  if (!user) throw new Error("Invalid username or password");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid username or password");

  // Create token
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
    },
  };
}
