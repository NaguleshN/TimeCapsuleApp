import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Assuming you're using Redux for session management
import { useNavigate } from "react-router-dom";
import { Navigate, Outlet } from 'react-router-dom';
import { getAuthTokenFromCookie } from '../slices/getAuthTokenFromCookie.js';


const CapsulesFetcher = () => {
    const token = getAuthTokenFromCookie();
    console.log(token)
    if(!token){
        return <Navigate to="/login" />;
    }
  const { userInfo } = useSelector((state) => state.auth); // Get the logged-in user info from Redux
  const [records, setRecords] = useState([]); // List of records
  const [capsules, setCapsules] = useState([]); // Capsules fetched

  // Fetch all records initially
  const fetchRecords = async () => {
    try {
      const response = await fetch('http://localhost:5000/allcollab');
      const data = await response.json();
      //   console.log(data)

    //   const filteredData = data.filter(item => item.email === userInfo?.email).map(item => item.capsule);;
        
    //   console.log(filteredData)

      const cap_response = await fetch('http://localhost:5000/all-records');
      const cap_data = await cap_response.json();
    //   console.log(cap_data)

      const filteredCapData = cap_data.filter(item => item.collab == userInfo?.email );
      console.log(userInfo?.email)
      
      console.log(filteredCapData);
      setCapsules(filteredCapData)

      
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };


    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; 
    console.log(todayString)

    const filteredRecords = capsules.filter(record => {
        const unlockDate = new Date(record.unlockDate);
        const unlockDateString = unlockDate.toISOString().split('T')[0];
        return unlockDateString === todayString;
    });

    const unfilteredRecords = capsules.filter(record => {
        const unlockDate = new Date(record.unlockDate);
        const unlockDateString = unlockDate.toISOString().split('T')[0];
        return unlockDateString != todayString; 
    });
    
    const navigate = useNavigate();

    const handleViewClick = (id) => {
      navigate(`/record/${id}`); // Navigate to the record detail page with the _id
    };

  useEffect(() => {
    fetchRecords(); 
  }, []);

  useEffect(() => {
    if (records.length > 0 && userInfo?.email) {
      fetchCapsulesForUser(); 
    }
  }, [records, userInfo]);

  return (
   
    <div>
      <h3>User Capsules</h3>
      
      {filteredRecords.length === 0 ? (
            <p>No records to unlock today.</p>
          ) : (
            <ul class ="list-none space-y-2">
              {filteredRecords.map((record, index) => (
                <div key={index}>
                  
                 <div class="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4 m-4">
                    <div class="text-xl font-semibold text-gray-800 mb-2">Capsule Name: {record.capsuleName}</div>
                    <div class="text-gray-600 text-sm mb-2">
                        <span class="font-medium">Unlock Date: </span>{record.unlockDate}
                    </div>
                    <div class="text-gray-600 text-sm mb-2">
                        <span class="font-medium">Type of Capsule: </span>{record.typeOfCapsule}
                    </div>
                    <div class="text-gray-600 text-sm mb-2">
                        <span class="font-medium">Password: </span>{record.password}
                    </div>
                    <div class="flex justify-between ">
                        <button type="button" class="bg-blue-500  px-4 py-2 rounded-md hover:bg-blue-600  m-4" onClick={() => handleViewClick(record._id)} >View</button>
                     
                    </div>
                </div>
                </div>
              ))}
            </ul>
          )}

            <h1>Locked Records</h1>

            {unfilteredRecords.length === 0 ? (
            <p>No records to unlock today.</p>
            ) : (
            <ul class ="list-none space-y-2">
              {unfilteredRecords.map((record, index) => (
                <div key={index} >
                 
                <div class="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4 m-4">
                    <div class="text-xl font-semibold text-gray-800 mb-2">Capsule Name: {record.capsuleName}</div>
                    <div class="text-gray-600 text-sm mb-2">
                        <span class="font-medium">Unlock Date: </span>{record.unlockDate}
                    </div>
                    <div class="text-gray-600 text-sm mb-2">
                        <span class="font-medium">Type of Capsule: </span>{record.typeOfCapsule}
                    </div>
                    <div class="text-gray-600 text-sm mb-2">
                        <span class="font-medium">Latitude: </span>{record.latitude}
                    </div>
                    <div class="text-gray-600 text-sm mb-2">
                        <span class="font-medium">Longitude: </span>{record.longitude}
                    </div>
                    <div class="text-gray-600 text-sm mb-2">
                        <span class="font-medium">Longitude: </span>{record.collab}
                    </div>
                </div>
                </div>
              ))}
            </ul>
          )} 

        {/* {capsules.length === 0 ? (
            <p>No records to unlock today.</p>
          ) : (
            <ul class ="list-none space-y-2">
              {capsules.map((record, index) => (
                <div key={index}>
                 
                 <div class="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4 m-4">
                    <div class="text-xl font-semibold text-gray-800 mb-2">Capsule Name: {record.capsuleName}</div>
                    <div class="text-gray-600 text-sm mb-2">
                        <span class="font-medium">Unlock Date: </span>{record.unlockDate}
                    </div>
                    <div class="text-gray-600 text-sm mb-2">
                        <span class="font-medium">Type of Capsule: </span>{record.typeOfCapsule}
                    </div>
                    <div class="text-gray-600 text-sm mb-2">
                        <span class="font-medium">Unlock date: </span>{record.unlockDate}
                    </div>
                    <div class="text-gray-600 text-sm mb-2">
                        <span class="font-medium">Latitude: </span>{record.latitude}
                    </div>
                    <div class="text-gray-600 text-sm mb-2">
                        <span class="font-medium">Longitude: </span>{record.longitude}
                    </div>
                    <div class="text-gray-600 text-sm mb-2">
                        <span class="font-medium">Longitude: </span>{record.collab}
                    </div>
                    <div class="flex justify-between ">
                        <button type="button" class="bg-blue-500  px-4 py-2 rounded-md hover:bg-blue-600  m-4" >View</button>
                        <button type="button" class="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600  m-4">Delete</button>
                    </div>
                </div>
                </div>
              ))}
            </ul>
          )} */}
    </div>
  );
};

export default CapsulesFetcher;
