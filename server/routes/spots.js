import { Router } from "express";
import { getSpotsByCity, getSpotById } from "../db/queries/spots.js";

const router = Router();

// GET /api/spots/city/:cityId
router.get("/city/:cityId", async (req, res, next) => {
  try {
    const { cityId } = req.params;
    const spots = await getSpotsByCity(cityId);
    res.json(spots);
  } catch (err) {
    next(err);
  }
});

// GET /api/spots/detail/:spotId
router.get("/:spotId", async (req, res, next) => {
  try {
    const { spotId } = req.params;
    const spot = await getSpotById(spotId);
    if (!spot) {
      return res.status(404).json({ error: "Spot not found" });
    }
    res.json(spot);
  } catch (err) {
    next(err);
  }
});

export default router;
