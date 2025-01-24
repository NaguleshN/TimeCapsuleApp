import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigate, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const DigitalTimeCapsuleForm = () => {
  
  const { userInfo } = useSelector((state) => state.auth); 
  const navigate = useNavigate();

  if (!userInfo?.email) {
    return <Navigate to="/login" />;
  }

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
  const [position, setPosition] = useState(null); 
  const [clickPosition, setClickPosition] = useState(null); 
  const [latitude, setLatitude] = useState(''); 
  const [longitude, setLongitude] = useState(''); 

  
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

    getUsers();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toFixed(6));
          setLongitude(position.coords.longitude.toFixed(6));
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to fetch location. Please enable location services.');
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  const MailTrigger = async () => {
    console.log(userInfo?.email) 
    const mailformData = new FormData();
    mailformData.append('to', userInfo?.email);
    mailformData.append('subject', "regarding capsule notification");
    mailformData.append('text', `You can able to view your capsule at time of unlocking ${userInfo?.email}`);
    const response = await fetch('/send-mail', {
      method: 'POST',
      body: mailformData,
    });

  }

  const handleMail = async (unlockdate ,cap_id) => {

    const response2 =  await axios.post('http://localhost:5000/send_email', {
      to: userInfo?.email,
      subject: "regarding capsule notification",
      text : `Capsule is unlocked !! To view : http://localhost:3000/record/${cap_id} `,
      unlockDate : unlockdate 
    });
    console.log(response2)
    alert('Email sent successfully!');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('capsuleName', capsuleName);
    formData.append('unlockDate', unlockDate);
    formData.append('typeOfCapsule', typeOfCapsule);
    formData.append('password',"1234");
    formData.append('collab', collab);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
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
        // console.log("data",data.data)
        console.log(data.data._id)
        await handleMail(unlockDate, data.data._id);

        navigate("/view-capsule");
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

   
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setClickPosition(e.latlng);
        setLatitude(lat); 
        setLongitude(lng);  
      },
    });
    return null;
  };

  
  const invisibleMarkerStyle = {
    opacity: 0, 
  };

  const customPopupStyles = {
    backgroundColor: "white", 
    color: "black", 
    fontSize: "14px", 
    padding: "10px", 
    borderRadius: "5px",
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
        {/* {new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            hour12: false,
          })} */}
        <Form.Group className="mb-3" controlId="unlockDateTime">
          <Form.Label>Unlock Date and Time</Form.Label>
          <Form.Control
            type="datetime-local"
            value={unlockDate}
            onChange={(e) => setUnlockDate(e.target.value)}
            min={new Date().toLocaleString('en-US', {
              timeZone: 'Asia/Kolkata',
              hour12: false,
            })}
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
          <Form.Control
            type="text"
            value={collab}
            onChange={(e) => setCollab(e.target.value)}
            placeholder="Enter collaborator's email"
            required
          />
          {collab && (
            <div className="mt-2">
              {records.some((record) => record.email === collab) ? (
                <span style={{ color: "green" }}>Exists</span>
              ) : (
                <span style={{ color: "red" }}>Doesn't Exist</span>
              )}
            </div>
          )}
        </Form.Group>

        {/* <Form.Group className="mb-3" controlId="collab">
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
        </Form.Group> */}

        <Form.Group className="mb-3" controlId="password" style={{ display: 'none' }}>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="hidden"
            value="1234"
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

      <div style={{ height: "400px", marginTop: "30px" }}>
        <MapContainer center={position} zoom={13} style={{ height: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        
          {position && (
            <Marker position={position} icon={L.divIcon()} style={{ opacity: 0 }}>
              <Popup>
                You are here!<br />
                Latitude: {position[0]}, Longitude: {position[1]}
              </Popup>
            </Marker>
          )}
         
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