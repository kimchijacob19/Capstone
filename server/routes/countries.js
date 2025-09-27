import { Router } from "express";
import { getCountriesByContinent } from "../db/queries/countries.js";

const router = Router();

// GET /api/countries/:continentId
router.get("/:continentId", async (req, res, next) => {
  try {
    const { continentId } = req.params;
    const countries = await getCountriesByContinent(continentId);
    res.json(countries);
  } catch (err) {
    next(err);
  }
});

export default router;
