import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navigate, Outlet } from 'react-router-dom';
import {getAuthTokenFromCookie} from '../slices/getAuthTokenFromCookie.js';

const CapsuleDetails = () => {
    const token = getAuthTokenFromCookie();
        console.log(token)
        if(!token){
            return <Navigate to="/login" />;
        }
  const { id } = useParams(); 
  const [records, setRecords] = useState([]); 
  const [error, setError] = useState(""); 

  const fetchRecords = async () => {
    try {
      const response = await fetch("http://localhost:5000/all-records");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const filteredData = data.filter((item) => item._id === id); 
      setRecords(filteredData);
    } catch (error) {
      console.error("Error fetching records:", error);
      setError("Failed to fetch capsule details.");
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [id]); 

  return (
    <>
      <h3 className="text-lg font-bold mb-4">User Capsules</h3>
      {error && <p className="text-red-500">{error}</p>} 
      {records.length === 0 ? (
        <p>No records to unlock today.</p>
      ) : (
        <ul className="list-none space-y-4">
          {records.map((record) => (
            <div key={record._id}>
              <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4">
                <div className="text-xl font-semibold text-gray-800 mb-2">
                  Capsule Name: {record.capsuleName}
                </div>

                {record.typeOfCapsule}
                {record.file}

                <div className="mt-4">
                 

                {record.typeOfCapsule == "photo" ? (
                        <img src={`http://localhost:5000${record.file}`} alt="Capsule content" className="max-w-full" />
                    ) : (
                        null 
                    )}

                {record.typeOfCapsule == "video" ? (
                        <video controls width="100%">
                            <source src={`http://localhost:5000${record.file}`} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        null 
                    )}

                {record.typeOfCapsule == "audio" ? (
                        <audio controls>
                            <source src={`http://localhost:5000${record.file}`} type="audio/mpeg" />
                            Your browser does not support the audio tag.
                        </audio>
                    ) : (
                        null 
                    )}
                
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
              </div>
            </div>
          ))}
        </ul>
      )}
    </>
  );
};

export default CapsuleDetails;
