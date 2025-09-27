import { Router } from "express";
import { getAllContinents } from "../db/queries/continents.js";

const router = Router();

// GET /api/continents
router.get("/", async (req, res, next) => {
  try {
    const continents = await getAllContinents();
    res.json(continents);
  } catch (err) {
    next(err);
  }
});

export default router;
