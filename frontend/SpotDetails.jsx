import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function SpotDetails() {
  const { id } = useParams();
  const [spot, setSpot] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/spots/${id}`)
      .then((res) => res.json())
      .then((data) => setSpot(data))
      .then((err) => console.error("Error fetching spot:", err));
  }, [id]);

  if (!spot) return <p>Loading...</p>;

  return (
    <div>
      <h1>{spot.name}</h1>
      <p>
        <strong>Mode:</strong> {spot.mode}
      </p>
      <p>{spot.dexcription}</p>
      {spot.image_url && (
        <img src={spot.image_url} alt={spot.name} width="400" />
      )}
    </div>
  );
}
