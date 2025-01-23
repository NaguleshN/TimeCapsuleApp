import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = ({ userId }) => {
  const [capsules, setCapsules] = useState([]);
  const [position, setPosition] = useState(null); // Current location
  const mapRef = useRef();

  // Fetch the capsules of a specific user
  const getUserCapsules = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/capsules/user/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch capsules');
      }
      const data = await response.json();
      console.log('Fetched capsules:', data);  // Debugging log
      setCapsules(data); // Store the capsules
    } catch (error) {
      console.error('Error fetching capsules:', error);
    }
  };

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }

    // Fetch user capsules
    getUserCapsules();
  }, [userId]);

  if (position === null) {
    return <div>Loading map...</div>;
  }

  return (
    <div style={{ height: "400px", marginTop: "30px" }}>
      <MapContainer center={position} zoom={13} style={{ height: "100%" }} ref={mapRef}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Marker for current position */}
        {position && (
          <Marker position={position} icon={L.divIcon({ className: 'invisible' })}>
            <Popup>
              You are here!<br />
              Latitude: {position[0]}, Longitude: {position[1]}
            </Popup>
          </Marker>
        )}

        {/* Markers for each user's capsules */}
        {capsules.map((capsule, index) => {
          if (capsule.latitude && capsule.longitude) {
            return (
              <Marker
                key={index}
                position={[capsule.latitude, capsule.longitude]}
                icon={L.divIcon({ className: 'capsule-marker' })}  // Optional: Customize marker style
              >
                <Popup>
                  <strong>Capsule: </strong>{capsule.capsuleName}<br />
                  Latitude: {capsule.latitude}, Longitude: {capsule.longitude}
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default Map;