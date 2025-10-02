import { client } from "../client.js";
// Get favorites for a user
export async function getFavoritesByUser(userId) {
  const { rows } = await client.query(
    `
    SELECT f.id, f.spot_id, s.name, s.description, s.image_url, s.mode
    FROM favorites f
    JOIN spots s ON f.spot_id = s.id
    WHERE f.user_id = $1
  `,
    [userId]
  );
  return rows;
}

// Add a favorite
export async function addFavorite(userId, spotId) {
  const { rows } = await client.query(
    `INSERT INTO favorites (user_id, spot_id)
     VALUES ($1, $2)
     RETURNING *`,
    [userId, spotId]
  );
  return rows[0];
}

// Remove a favorite
export async function removeFavorite(userId, favoriteId) {
  await client.query(
    `DELETE FROM favorites
     WHERE id = $1 AND user_id = $2`,
    [favoriteId, userId]
  );
}

export async function deleteFavorite(userId, favoriteId) {
  const { rowCount } = await client.query(
    `DELETE FROM favorites
     WHERE id = $1 AND user_id = $2`,
    [favoriteId, userId]
  );
  return rowCount > 0;
}
