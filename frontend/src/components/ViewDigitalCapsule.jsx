import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from './Loader';

const ViewDigitalCapsule = () => {
  const { userInfo } = useSelector((state) => state.auth); // Get the logged-in user info from Redux
  try {
    console.log(userInfo.email);
  } catch {
    return <Navigate to="/login" />;
  }

  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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
    navigate(`/record/${id}`);
  };

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const filteredRecords = records.filter((record) => {
    const unlockDate = new Date(record.unlockDate);
    const unlockDateString = unlockDate.toISOString().split('T')[0];
    return unlockDateString === todayString;
  });

  const unfilteredRecords = records.filter((record) => {
    const unlockDate = new Date(record.unlockDate);
    const unlockDateString = unlockDate.toISOString().split('T')[0];
    return unlockDateString !== todayString;
  });

  return (
    <>
      <h1>Today's Records</h1>
      {isLoading &&
         <Loader />
      }
      {error && <p className="error">{error}</p>}
      {filteredRecords.length === 0 ? (
        <p>No records to unlock today.</p>
      ) : (
        <ul className="list-none space-y-2">
          {filteredRecords.map((record, index) => (
                <div key={index}>
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
                  <span className="font-medium">Longitude: </span>
                  {record.longitude}
                </div>
                <div className="text-gray-600 text-sm mb-2">
                  <span className="font-medium">Latitude: </span>
                  {record.latitude}
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 m-4"
                    onClick={() =>handleViewClick(record._id)}
                  >
                    View
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
          {unfilteredRecords.map((record, index) => (
            <div key={index}>
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
                  <span className="font-medium">Longitude: </span>
                  {record.longitude}
                </div>
                <div className="text-gray-600 text-sm mb-2">
                  <span className="font-medium">Latitude: </span>
                  {record.latitude}
                </div>
              </div>
            </div>
          ))}
        </ul>
      )}
    </>
  );
};

export default ViewDigitalCapsule;
