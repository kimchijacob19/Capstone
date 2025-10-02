import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl, (accessToken = import.meta.env.VITE_MAPBOX_TOKEN);

function Map({ latitude, longitude, spotName }) {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!latitude || !longitude) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox//styles/mapbox/streets-v11",
      center: [longitude, latitude], // lng, lat
      zoom: 12,
    });

    // add marker
    new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .setPopup(new mapboxgl.Popup().setText(spotName))
      .addTo(map);

    return () => map.remove();
  }, [latitude, longitude, spotName]);

  return (
    <div
      ref={mapContainer}
      style={{ width: "100%", height: "400px", marginTop: "1rem" }}
    />
  );
}

export default Map;
