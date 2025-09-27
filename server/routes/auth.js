import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { registerUser, findUserByUsername } from "../db/queries/auth.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // add this to .env later!

// Register
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await registerUser(username, password);
    res.status(201).send(user);
  } catch (err) {
    next(err);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await findUserByUsername(username);

    if (!user) {
      return res.status(401).send({ error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ error: "Invalid username or password" });
    }

    // Issue JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.send({ message: "Login successful", token });
  } catch (err) {
    next(err);
  }
});

export default router;
