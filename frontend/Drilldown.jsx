import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Drilldown() {
  const [continents, setContinents] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [spots, setSpots] = useState([]);

  const [selectedContinent, setSelectedContinent] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Load continents first
  useEffect(() => {
    fetch("http://localhost:3000/api/continents")
      .then((res) => res.json())
      .then((data) => setContinents(data))
      .catch((err) => console.error("Error fetching continents:", err));
  }, []);

  // Load countries after continent is selected
  useEffect(() => {
    if (selectedContinent) {
      fetch(`http://localhost:3000/api/countries/${selectedContinent}`)
        .then((res) => res.json())
        .then((data) => setCountries(data))
        .catch((err) => console.error("Error fetching countries:", err));
    }
  }, [selectedContinent]);

  // Load cities after country is selected
  useEffect(() => {
    if (selectedCountry) {
      fetch(`http://localhost:3000/api/cities/${selectedCountry}`)
        .then((res) => res.json())
        .then((data) => setCities(data))
        .catch((err) => console.error("Error fetching cities:", err));
    }
  }, [selectedCountry]);

  // Load spots after city is selected
  useEffect(() => {
    if (selectedCity) {
      fetch(`http://localhost:3000/api/spots/${selectedCity}`)
        .then((res) => res.json())
        .then((data) => setSpots(data))
        .catch((err) => console.error("Error fetching spots:", err));
    }
  }, [selectedCity]);

  return (
    <div>
      <h1>WebSpot Guide</h1>

      {/* Step 1: Continents */}
      <h2>Step 1: Choose a Continent</h2>
      <select
        onChange={(e) => setSelectedContinent(e.target.value)}
        value={selectedContinent || ""}
      >
        <option value="">-- Select Continent --</option>
        {continents.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Step 2: Countries */}
      {selectedContinent && (
        <>
          <h2>Step 2: Choose a Country</h2>
          <select
            onChange={(e) => setSelectedCountry(e.target.value)}
            value={selectedCountry || ""}
          >
            <option value="">-- Select Country --</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Step 3: Cities */}
      {selectedCountry && (
        <>
          <h2>Step 3: Choose a City</h2>
          <select
            onChange={(e) => setSelectedCity(e.target.value)}
            value={selectedCity || ""}
          >
            <option value="">-- Select City --</option>
            {cities.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </>
      )}

      {/* Step 4: Spots */}
      {selectedCity && (
        <>
          <h2>Step 4: Available Spots</h2>
          <ul>
            {spots.map((s) => (
              <li key={s.id}>
                <Link to={`/spots/${s.id}`}>
                  <strong>{s.name}</strong> ({s.mode})
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
