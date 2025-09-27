import { client } from "../client.js";

// Get all spots in a city
async function getSpotsByCity(cityId) {
  const { rows } = await client.query(
    `SELECT * FROM spots WHERE city_id = $1`,
    [cityId]
  );
  return rows;
}

// Get one spot by ID
async function getSpotById(spotId) {
  const { rows } = await client.query(`SELECT * FROM spots WHERE id = $1`, [
    spotId,
  ]);
  return rows[0];
}

export { getSpotsByCity, getSpotById };
