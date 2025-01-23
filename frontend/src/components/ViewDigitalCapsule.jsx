import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { getAuthTokenFromCookie } from '../slices/getAuthTokenFromCookie.js';
import { Navigate, Outlet } from 'react-router-dom';

const ViewDigitalCapsule = () => {
  const token = getAuthTokenFromCookie();
      console.log(token)
      if(!token){
          return <Navigate to="/login" />;
      }
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('http://localhost:5000/all-records', {
          method: "GET",  
          credentials: "include", 
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched Records:', data); // Debugging response
        setRecords(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'An error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
      const navigate = useNavigate();
  
      const handleViewClick = (id) => {
        navigate(`/record/${id}`); // Navigate to the record detail page with the _id
      };

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const filteredRecords = records.filter(record => {
    const unlockDate = new Date(record.unlockDate);
    const unlockDateString = unlockDate.toISOString().split('T')[0];
    return unlockDateString === todayString;
  });

  const unfilteredRecords = records.filter(record => {
    const unlockDate = new Date(record.unlockDate);
    const unlockDateString = unlockDate.toISOString().split('T')[0];
    return unlockDateString !== todayString;
  });

    return (
        <>
          <h1>Today's Records</h1>
          {isLoading && <p>Loading records...</p>}
          {error && <p className="error">{error}</p>}
          {filteredRecords.length === 0 ? (
            <p>No records to unlock today.</p>
          ) : (
            <ul class ="list-none space-y-2">
              {filteredRecords.map((record, index) => (
                <div key={index}>
                  {/* <div className="record">
                    <div className="record-item">Capsule Name: {record.capsuleName}</div>
                    <div className="record-item">Unlock Date: {record.unlockDate}</div>
                    <div className="record-item">Type of Capsule: {record.typeOfCapsule}</div>
                    <div className="record-item">Password: {record.password}</div>
                  </div> */}
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
                    <div class="flex justify-between ">
                        <button type="button" class="bg-blue-500  px-4 py-2 rounded-md hover:bg-blue-600  m-4" onClick={() => handleViewClick(record._id)} >View</button>
                    </div>
                </div>
                </div>
              ))}
            </ul>
          )}
  return (
    <>
      <h1>Today's Records</h1>
      {isLoading && <p>Loading records...</p>}
      {error && <p className="error">{error}</p>}
      {filteredRecords.length === 0 ? (
        <p>No records to unlock today.</p>
      ) : (
        <ul className="list-none space-y-2">
          {filteredRecords.map((record) => (
            <div key={record.id || record._id}>
              <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4 m-4">
                <div className="text-xl font-semibold text-gray-800 mb-2">
                  Capsule Name: {record.capsuleName}
                </div>
                <div className="text-gray-600 text-sm mb-2">
                  <span className="font-medium">Unlock Date: </span>
                  {record.unlockDate}
                </div>
                <div className="text-gray-600 text-sm mb-2">
                  <span className="font-medium">Type of Capsule: </span>
                  {record.typeOfCapsule}
                </div>
                <div className="text-gray-600 text-sm mb-2">
                  <span className="font-medium">Password: </span>
                  {record.password}
                </div>
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 m-4"
                    onClick={() => {
                      if (record.id || record._id) {
                        navigate(`/view-capsule/${record.id || record._id}`);
                      } else {
                        alert('Unable to navigate. Record ID is missing.');
                      }
                    }}
                  >
                    View
                  </button>
                  <button
                    type="button"
                    className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600 m-4"
                  >
                    Delete
                  </button>
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
        <ul className="list-none space-y-2">
          {unfilteredRecords.map((record) => (
            <div key={record.id || record._id}>
              <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4 m-4">
                <div className="text-xl font-semibold text-gray-800 mb-2">
                  Capsule Name: {record.capsuleName}
                </div>
                <div className="text-gray-600 text-sm mb-2">
                  <span className="font-medium">Unlock Date: </span>
                  {record.unlockDate}
                </div>
                <div className="text-gray-600 text-sm mb-2">
                  <span className="font-medium">Type of Capsule: </span>
                  {record.typeOfCapsule}
                </div>
                <div className="text-gray-600 text-sm mb-2">
                  <span className="font-medium">Password: </span>
                  {record.password}
                </div>
                    <button type="button" class="bg-blue-500  px-4 py-2 rounded-md hover:bg-blue-600  m-4" onClick={() => handleViewClick(record._id)} >View</button>
              </div>
            </div>
          ))}
        </ul>
      )}
    </>
  );
};

export default ViewDigitalCapsule;