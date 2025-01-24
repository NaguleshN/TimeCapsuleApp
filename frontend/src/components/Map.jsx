import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from 'leaflet/dist/images/marker-icon.png'; 

const Map = () => {
  const [capsules, setCapsules] = useState([]); 
  const mapRef = useRef();

 
  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:5000/all-records", {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched capsules:", data); 
      setCapsules(data);
    } catch (error) {
      console.error("Error fetching capsules:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); 

 
  const MapCenter = () => {
    const map = useMap();
    if (capsules.length > 0) {
      const latitudes = capsules.map(capsule => capsule.latitude).filter(lat => lat && !isNaN(lat));
      const longitudes = capsules.map(capsule => capsule.longitude).filter(lon => lon && !isNaN(lon));
      const bounds = L.latLngBounds(
        latitudes.map((lat, index) => [lat, longitudes[index]])
      );
      map.fitBounds(bounds); 
    }
    return null;
  };

 
  const defaultIcon = new L.Icon({
    iconUrl: markerIcon, 
    iconSize: [25, 41], 
    iconAnchor: [12, 41], 
    popupAnchor: [0, -41],
  });

  return (
    <div>
    
      <div style={{ height: "400px", marginTop: "30px" }}>
        <MapContainer center={[11.0168, 76.9558]} zoom={13} style={{ height: "100%" }} ref={mapRef}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

        
          <MapCenter />

         
          {capsules.map((capsule) => {
          
            if (capsule.latitude && capsule.longitude && !isNaN(capsule.latitude) && !isNaN(capsule.longitude)) {
              return (
                <Marker
                  key={capsule._id} 
                  position={[capsule.latitude, capsule.longitude]}
                  icon={defaultIcon} 
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

      <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ccc" }}>
        <h3>Capsule Records</h3>
        <ul>
          {capsules.length > 0 ? (
            capsules.map((record, index) => (
              <li key={index}>
                <strong>Record {index + 1}:</strong>
                <br />
                <strong>Capsule Name:</strong> {record.capsuleName}<br />
                <strong>Latitude:</strong> {record.latitude}<br />
                <strong>Longitude:</strong> {record.longitude}
              </li>
            ))
          ) : (
            <li>No records available.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Map;