import { client } from "../client.js";

async function getCountriesByContinent(continentId) {
  const { rows } = await client.query(
    `SELECT * FROM countries WHERE continent_id = $1`,
    [continentId]
  );
  return rows;
}

export { getCountriesByContinent };
