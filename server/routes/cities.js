import { Router } from "express";
import { getCitiesByCountry } from "../db/queries/cities.js";

const router = Router();

// GET /api/cities/:countryId
router.get("/:countryId", async (req, res, next) => {
  try {
    const { countryId } = req.params;
    const cities = await getCitiesByCountry(countryId);
    res.json(cities);
  } catch (err) {
    next(err);
  }
});

export default router;
