import { client } from "../client.js";

// Get all cities in a country
async function getCitiesByCountry(countryId) {
  const { rows } = await client.query(
    `SELECT * FROM cities WHERE country_id = $1`,
    [countryId]
  );
  return rows;
}

export { getCitiesByCountry };
