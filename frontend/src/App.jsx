import { useState, useEffect } from "react";
import {
  fetchContinents,
  fetchCountries,
  fetchCities,
  fetchSpots,
  fetchFavorites,
  addFavorite,
  removeFavorite,
} from "./api/api";
import Auth from "./Auth.jsx";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";
import FilterSwitch from "./FilterSwitch.jsx";

function App() {
  const [continents, setContinents] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [spots, setSpots] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const [selectedContinent, setSelectedContinent] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const [filterMode, setFilterMode] = useState("both");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [activeTab, setActiveTab] = useState("explore");

  const MAPBOX_TOKEN =
    "pk.eyJ1IjoiamNob2kxOSIsImEiOiJjbWc5eWRscmgwbmFmMnJwbHJkbDN0NWhoIn0.3AavJNdXGc9sQNP_07i4ZQ";

  // fetch continents after login
  useEffect(() => {
    if (!token) return;
    async function loadContinents() {
      try {
        setLoading(true);
        const data = await fetchContinents();
        setContinents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadContinents();
  }, [token]);

  // continent → countries
  useEffect(() => {
    if (!selectedContinent) return;
    async function loadCountries() {
      try {
        setLoading(true);
        const data = await fetchCountries(selectedContinent);
        setCountries(data);
        setCities([]);
        setSpots([]);
        setSelectedCountry(null);
        setSelectedCity(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCountries();
  }, [selectedContinent]);

  // country → cities
  useEffect(() => {
    if (!selectedCountry) return;
    async function loadCities() {
      try {
        setLoading(true);
        const data = await fetchCities(selectedCountry);
        setCities(data);
        setSpots([]);
        setSelectedCity(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadCities();
  }, [selectedCountry]);

  // city → spots
  useEffect(() => {
    if (!selectedCity) return;
    async function loadSpots() {
      try {
        setLoading(true);
        const data = await fetchSpots(selectedCity);
        setSpots(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadSpots();
  }, [selectedCity]);

  // favorites
  useEffect(() => {
    if (!token || activeTab !== "favorites") return;
    async function loadFavorites() {
      try {
        setLoading(true);
        const data = await fetchFavorites(token);
        setFavorites(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, [token, activeTab]);

  // mode filter
  const filteredSpots = (() => {
    if (!spots.length) return [];
    switch (filterMode) {
      case "day":
        return spots.filter((s) => s.mode === "day" || s.mode === "both");
      case "night":
        return spots.filter((s) => s.mode === "night" || s.mode === "both");
      default:
        return spots;
    }
  })();

  // favorites handlers
  async function handleAddFavorite(spotId) {
    try {
      const newFav = await addFavorite(token, spotId);
      setFavorites((prev) => [...prev, newFav]);
    } catch (err) {
      console.error(err);
      alert("Failed to add favorite");
    }
  }

  async function handleRemoveFavorite(favId) {
    try {
      await removeFavorite(token, favId);
      setFavorites((prev) => prev.filter((f) => f.id !== favId));
    } catch (err) {
      console.error(err);
      alert("Failed to remove favorite");
    }
  }

  return (
    <div className="app-container">
      <h1>WebSpot Guide</h1>

      {!token ? (
        <Auth onAuthSuccess={(t) => setToken(t)} />
      ) : (
        <>
          {/* Navbar */}
          <div className="navbar">
            <button
              className="secondary"
              onClick={() => {
                localStorage.removeItem("token");
                setToken(null);
              }}
            >
              Logout
            </button>
            <div className="tabs">
              <button
                className={`primary ${activeTab === "explore" ? "active" : ""}`}
                onClick={() => setActiveTab("explore")}
              >
                Explore
              </button>
              <button
                className={`primary ${
                  activeTab === "favorites" ? "active" : ""
                }`}
                onClick={() => setActiveTab("favorites")}
              >
                Your Next Destinations
              </button>
            </div>
          </div>

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* Shared Map */}
          <div className="map-container">
            <Map
              initialViewState={{
                latitude:
                  activeTab === "explore"
                    ? filteredSpots[0]?.latitude || 20
                    : favorites[0]?.latitude || 20,
                longitude:
                  activeTab === "explore"
                    ? filteredSpots[0]?.longitude || 0
                    : favorites[0]?.longitude || 0,
                zoom:
                  (activeTab === "explore" && filteredSpots.length > 0) ||
                  (activeTab === "favorites" && favorites.length > 0)
                    ? 4
                    : 1.5,
              }}
              style={{ width: "100%", height: 400 }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              mapboxAccessToken={MAPBOX_TOKEN}
            >
              {activeTab === "explore" &&
                filteredSpots.map(
                  (s) =>
                    s.latitude &&
                    s.longitude && (
                      <Marker
                        key={s.id}
                        latitude={parseFloat(s.latitude)}
                        longitude={parseFloat(s.longitude)}
                      >
                        <span style={{ fontSize: "20px", color: "red" }}>
                          📍
                        </span>
                      </Marker>
                    )
                )}

              {activeTab === "favorites" &&
                favorites.map(
                  (f) =>
                    f.latitude &&
                    f.longitude && (
                      <Marker
                        key={f.id}
                        latitude={parseFloat(f.latitude)}
                        longitude={parseFloat(f.longitude)}
                      >
                        <span style={{ fontSize: "20px", color: "blue" }}>
                          🎯
                        </span>
                      </Marker>
                    )
                )}
            </Map>
          </div>

          {/* Explore Tab */}
          {activeTab === "explore" && (
            <>
              {/* Filter */}
              <FilterSwitch
                filterMode={filterMode}
                setFilterMode={setFilterMode}
              />

              {/* Continents */}
              <h2>Continents</h2>
              <ul className="drilldown-list">
                {continents.map((c) => (
                  <li key={c.id}>
                    <button
                      className="secondary"
                      onClick={() => setSelectedContinent(c.id)}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>

              {/* Countries */}
              {countries.length > 0 && (
                <>
                  <h2>Countries</h2>
                  <ul className="drilldown-list">
                    {countries.map((c) => (
                      <li key={c.id}>
                        <button
                          className="secondary"
                          onClick={() => setSelectedCountry(c.id)}
                        >
                          {c.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Cities */}
              {cities.length > 0 && (
                <>
                  <h2>Cities</h2>
                  <ul className="drilldown-list">
                    {cities.map((c) => (
                      <li key={c.id}>
                        <button
                          className="secondary"
                          onClick={() => setSelectedCity(c.id)}
                        >
                          {c.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {/* Spots */}
              {filteredSpots.length > 0 && (
                <>
                  <h2>Spots</h2>
                  <div className="card-grid">
                    {filteredSpots.map((s) => {
                      const isFavorite = favorites.some(
                        (f) => f.spot_id === s.id
                      );
                      return (
                        <div
                          key={s.id}
                          className={`card ${isFavorite ? "favorite" : ""}`}
                        >
                          <h3>{s.name}</h3>
                          <p>{s.description}</p>
                          <p>
                            <strong>Mode:</strong> {s.mode}
                          </p>
                          {s.image_url && (
                            <img src={s.image_url} alt={s.name} />
                          )}
                          <div>
                            {isFavorite ? (
                              <button
                                className="remove"
                                onClick={() => {
                                  const fav = favorites.find(
                                    (f) => f.spot_id === s.id
                                  );
                                  if (fav) handleRemoveFavorite(fav.id);
                                }}
                              >
                                Somewhere else
                              </button>
                            ) : (
                              <button
                                className="primary"
                                onClick={() => handleAddFavorite(s.id)}
                              >
                                I'm going here!
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}

          {/* Favorites Tab */}
          {activeTab === "favorites" && (
            <>
              <h2>My Favorites</h2>
              {favorites.length === 0 ? (
                <p>No favorites yet.</p>
              ) : (
                <div className="card-grid">
                  {favorites.map((f) => (
                    <div key={f.id} className="card favorite">
                      <h3>{f.spot_name || "Spot"}</h3>
                      {f.image_url && (
                        <img src={f.image_url} alt={f.spot_name} />
                      )}
                      <div>
                        <button
                          className="remove"
                          onClick={() => handleRemoveFavorite(f.id)}
                        >
                          Let's go somewhere else!
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
