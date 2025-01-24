import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './store';
import { Provider } from 'react-redux';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen.jsx';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import DigitalTimeCapsuleForm from './components/DigitalTimeCapsuleForm'; // Import the form
import ViewDigitalCapsule from './components/ViewDigitalCapsule.jsx'
import ViewInvitations from './components/ViewInvitations.jsx'
import Map from './components/Map.jsx'
import CapsuleDetails from './components/CapsuleDetail.jsx'
import Timeline from './components/Timeline.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='' element={<PrivateRoute />}>
        <Route path='/profile' element={<ProfileScreen />} />
      </Route>
      {/* New route for DigitalTimeCapsuleForm */}
      <Route path='/capsule-form' element={<DigitalTimeCapsuleForm />} />
      <Route path='/view-capsule' element={<ViewDigitalCapsule />} />
      <Route path='/view-invitations' element={<ViewInvitations />} />
      <Route path='/map' element={<Map />} />
      <Route path="/timeline" element={<Timeline />} />
      <Route path="/record/:id" element={<CapsuleDetails />} /> 
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
);