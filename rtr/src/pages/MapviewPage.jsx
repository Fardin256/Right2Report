import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapviewPage = () => {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  return (
    <div>
      <h2>Your Location</h2>

      {position && (
        <MapContainer center={position} zoom={13} style={{ height: "500px", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>You are here</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default MapviewPage;