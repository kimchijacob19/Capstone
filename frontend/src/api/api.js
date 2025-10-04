const API_URL = "http://localhost:3000/api";

// continents
export async function fetchContinents() {
  const res = await fetch(`${API_URL}/continents`);
  if (!res.ok) throw new Error("Failed to fetch continents");
  return res.json();
}

// countries by continent
export async function fetchCountries(continentId) {
  const res = await fetch(`${API_URL}/countries/${continentId}`);
  if (!res.ok) throw new Error("Failed to fetch countries");
  return res.json();
}

// cities by country
export async function fetchCities(countryId) {
  const res = await fetch(`${API_URL}/cities/${countryId}`);
  if (!res.ok) throw new Error("Failed to fetch cities");
  return res.json();
}

// spots by city
export async function fetchSpots(cityId) {
  const res = await fetch(`${API_URL}/spots/city/${cityId}`);
  if (!res.ok) throw new Error("Failed to fetch spots");
  return res.json();
}

// favorites
export async function fetchFavorites(token) {
  const res = await fetch(`${API_URL}/favorites`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch favorites");
  return res.json();
}

// adding favorites
export async function addFavorite(token, spotId) {
  const res = await fetch(`${API_URL}/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ spot_id: spotId }),
  });
  if (!res.ok) throw new Error("Failed to add favorite");
  return res.json();
}

// removing favorites
export async function removeFavorite(token, favoriteId) {
  const res = await fetch(`${API_URL}/favorites/${favoriteId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to remove favorite");
  return res.json();
}
