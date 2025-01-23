import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const DigitalTimeCapsuleForm = () => {
  const [capsuleName, setCapsuleName] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [typeOfCapsule, setTypeOfCapsule] = useState('video');
  const [collab, setCollab] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [records, setRecords] = useState([]);
  const [position, setPosition] = useState(null); // Map Position
  const [clickPosition, setClickPosition] = useState(null); // Clicked position
  const [latitude, setLatitude] = useState(''); // Latitude state
  const [longitude, setLongitude] = useState(''); // Longitude state

  // Get users from server
  const getUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/all-users');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message || 'An error occurred while fetching users.');
    }
  };

  // Get current location for map
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting location", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    getUsers(); // Fetch users once on component mount
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('capsuleName', capsuleName);
    formData.append('unlockDate', unlockDate);
    formData.append('typeOfCapsule', typeOfCapsule);
    formData.append('password', password);
    formData.append('collab', collab);
    formData.append('latitude', latitude);  // Add latitude to form data
    formData.append('longitude', longitude);  // Add longitude to form data
    if (file) formData.append('file', file);

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await fetch('/api/capsules', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Capsule saved successfully:', data);
        setSuccess(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save the capsule.');
      }
    } catch (error) {
      setError('An error occurred while saving the capsule.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle map click event
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setClickPosition(e.latlng);
        setLatitude(lat);  // Set latitude
        setLongitude(lng);  // Set longitude
      },
    });
    return null;
  };

  // Invisible marker style for current location
  const invisibleMarkerStyle = {
    opacity: 0,  // Make marker invisible
  };

  // Custom Popup styles (inline styles)
  const customPopupStyles = {
    backgroundColor: "white",  // White background for the popup
    color: "black",  // Black text inside the popup
    fontSize: "14px",  // Optional: Adjust font size
    padding: "10px",  // Optional: Adjust padding
    borderRadius: "5px",  // Optional: Rounded corners
  };

  if (position === null) {
    return <div>Loading map...</div>;
  }

  return (
    <Container className="mt-5">
      <h5 className="text-center mb-4">Digital Time Capsule Form</h5>
      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3" controlId="capsuleName">
          <Form.Label>Capsule Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter capsule name"
            value={capsuleName}
            onChange={(e) => setCapsuleName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="unlockDate">
          <Form.Label>Unlock Date</Form.Label>
          <Form.Control
            type="date"
            value={unlockDate}
            onChange={(e) => setUnlockDate(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="typeOfCapsule">
          <Form.Label>Type of Capsule</Form.Label>
          <Form.Select
            value={typeOfCapsule}
            onChange={(e) => setTypeOfCapsule(e.target.value)}
            required
          >
            <option value="video">Video</option>
            <option value="photo">Photo</option>
            <option value="audio">Audio</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="collab">
          <Form.Label>Collaborators</Form.Label>
          <Form.Select
            value={collab}
            onChange={(e) => setCollab(e.target.value)}
            required
          >
            <option value="" disabled>
              -- Select Collaborator --
            </option>
            {records.map((record, index) => (
              <option key={index} value={record.email}>
                {record.email}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter a secure password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="file">
          <Form.Label>Upload File</Form.Label>
          <Form.Control
            type="file"
            accept="image/*,video/*,audio/*"
            onChange={handleFileChange}
          />
        </Form.Group>

        {/* Latitude and Longitude Fields */}
        <Form.Group className="mb-3" controlId="latitude">
          <Form.Label>Latitude</Form.Label>
          <Form.Control
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            readOnly
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="longitude">
          <Form.Label>Longitude</Form.Label>
          <Form.Control
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            readOnly
          />
        </Form.Group>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner
                animation="border"
                size="sm"
                className="me-2"
                role="status"
              />
              Saving...
            </>
          ) : (
            'Submit'
          )}
        </Button>
      </Form>

      {success && (
        <Alert variant="success" className="mt-3">
          Capsule saved successfully!
        </Alert>
      )}
      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      {/* Map Section */}
      <div style={{ height: "400px", marginTop: "30px" }}>
        <MapContainer center={position} zoom={13} style={{ height: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Invisible marker for current location */}
          {position && (
            <Marker position={position} icon={L.divIcon()} style={{ opacity: 0 }}>
              <Popup>
                You are here!<br />
                Latitude: {position[0]}, Longitude: {position[1]}
              </Popup>
            </Marker>
          )}
          {/* Marker and info for clicked location */}
          {clickPosition && (
            <Marker position={clickPosition}>
              <Popup style={customPopupStyles}>
                <strong>Place Name:</strong> {`Latitude: ${clickPosition.lat}, Longitude: ${clickPosition.lng}`}
              </Popup>
            </Marker>
          )}
          <MapClickHandler />
        </MapContainer>
      </div>
    </Container>
  );
};

export default DigitalTimeCapsuleForm;