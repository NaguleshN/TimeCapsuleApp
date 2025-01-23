// src/App.jsx
import React from 'react';
import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import DigitalTimeCapsuleForm from './components/DigitalTimeCapsuleForm';
import CapsuleDetails from './components/CapsuleDetail';



import ViewDigitalCapsule from './components/ViewDigitalCapsule';
import CapsuleDetails from './components/CapsuleDetails'; // Import the details component
import ViewInvitations from './components/ViewInvitations';
import LoginScreen from './screens/LoginScreen';
import Map from './components/Map'; // Import the map component
import 'leaflet/dist/leaflet.css'; // Ensure Leaflet styles are included globally

const App = () => {
  return (
    <>
      <Header />
      <ToastContainer />
      <Container className="my-2">
        <Routes>
          <Route path="/" element={<DigitalTimeCapsuleForm />} />
          <Route path="/view-capsule" element={<ViewDigitalCapsule />} />
          <Route path="/view-capsule/:id" element={<CapsuleDetails />} /> {/* Dynamic route */}
          <Route path="/view-invitations" element={<ViewInvitations />} />
          <Route path="/map" element={<Map />} /> {/* Map route */}
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/record/:id" element={<CapsuleDetails />} /> 
          {/* Add additional routes here as needed */}
        </Routes>
      </Container>
    </>
  );
};

export default App;