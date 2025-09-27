import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  getFavoritesByUser,
  addFavorite,
  removeFavorite,
} from "../db/queries/favorites.js";

const router = Router();

// GET to get logged in user's favorites
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const favorites = await getFavoritesByUser(req.user.id);
    res.send(favorites);
  } catch (err) {
    next(err);
  }
});

// POST to add a new favorite
router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { spotId, spot_id } = req.body;
    const idToUse = spotId || spot_id;

    if (!idToUse) {
      return res.status(400).send({ error: "spotId is required" });
    }

    const favorite = await addFavorite(req.user.id, idToUse);
    res.send(favorite);
  } catch (err) {
    next(err);
  }
});

// DELETE to remove a favorite
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    await removeFavorite(req.user.id, id);
    res.json({ message: "Favorite removed" });
  } catch (err) {
    next(err);
  }
});

// DELETE to favorite by :id
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const deleted = await deleteFavorite(req.user.id, req.params.id);
    if (!deleted) {
      return res.status(404).send({ error: "Favorite not found or not yours" });
    }
    res.send({ message: "Favorite removed" });
  } catch (err) {
    next(err);
  }
});

export default router;
