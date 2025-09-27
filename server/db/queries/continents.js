import { client } from "../client.js";

export async function getAllContinents() {
  const { rows } = await client.query(`
    SELECT * FROM continents ORDER BY name
  `);
  return rows;
}
