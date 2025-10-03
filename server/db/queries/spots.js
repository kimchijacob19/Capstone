import { client } from "../client.js";
// Get all spots in a city
export async function getSpotsByCity(cityId) {
  const { rows } = await client.query(
    `
      SELECT
        s.id,
        s.name,
        s.description,
        s.image_url,
        s.mode,
        s.latitude,
        s.longitude,
        c.name AS city_name
      FROM spots s
      JOIN cities c ON s.city_id = c.id
      WHERE s.city_id = $1
      ORDER BY s.id;
    `,
    [cityId]
  );
  return rows;
}

// Get one spot by ID
export async function getSpotById(spotId) {
  const { rows } = await client.query(
    `
      SELECT
        s.id,
        s.name,
        s.description,
        s.image_url,
        s.mode,
        c.name AS city_name,
        co.name AS country_name,
        ct.name AS continent_name
      FROM spots s
      JOIN cities c ON s.city_id = c.id
      JOIN countries co ON c.country_id = co.id
      JOIN continents ct ON co.continent_id = ct.id
      WHERE s.id = $1;
    `,
    [spotId]
  );
  return rows[0]; // return one object instead of an array
}
