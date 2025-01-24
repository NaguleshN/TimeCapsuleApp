// src/App.jsx
import React from 'react';
import { Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import DigitalTimeCapsuleForm from './components/DigitalTimeCapsuleForm';
import ViewDigitalCapsule from './components/ViewDigitalCapsule';
import CapsuleDetail from './components/CapsuleDetail.jsx'; // Import the details component
import ViewInvitations from './components/ViewInvitations';
import LoginScreen from './screens/LoginScreen';
import Map from './components/Map'; // Import the map component
import 'leaflet/dist/leaflet.css'; // Ensure Leaflet styles are included globally
import RegisterScreen from './screens/RegisterScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import Timeline from './components/Timeline.jsx';

const App = () => {
  return (
    <>
      <Header />
      <ToastContainer />
      <Container className="my-2">
        <Routes>
          <Route path="/" element={<DigitalTimeCapsuleForm />} />
          <Route path="/view-capsule" element={<ViewDigitalCapsule />} />
          <Route path="/view-invitations" element={<ViewInvitations />} />
          <Route path="/map" element={<Map />} /> 
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/record/:id" element={<CapsuleDetail />} /> 
          
        </Routes>
      </Container>
    </>
  );
};

export default App;