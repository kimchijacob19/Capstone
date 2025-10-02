import { Router } from "express";
import { registerUser, loginUser } from "../db/queries/auth.js";

const router = Router();

// Register
router.post("/register", async (req, res, next) => {
  try {
    const { username, password, name, email } = req.body;
    if (!username || !password || !name || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await registerUser({ username, password, name, email });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
});

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const data = await loginUser({ username, password });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
