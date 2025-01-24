import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; 
import { useNavigate, Navigate } from 'react-router-dom';
import Loader from '../components/Loader'

const CapsulesFetcher = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!userInfo?.email) {
    return <Navigate to="/login" />;
  }

  const [records, setRecords] = useState([]); 
  const [capsules, setCapsules] = useState([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const fetchRecords = async () => {
    setIsLoading(true); 
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/allcollab');
      const data = await response.json();

      const capResponse = await fetch('http://localhost:5000/all-records');
      const capData = await capResponse.json();

      const filteredCapData = capData.filter(
        (item) => item.collab === userInfo?.email
      );

      setCapsules(filteredCapData);
    } catch (err) {
      console.error('Error fetching records:', err);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const filteredRecords = capsules.filter((record) => {
    const unlockDate = new Date(record.unlockDate);
    return unlockDate.toISOString().split('T')[0] === todayString;
  });

  const unfilteredRecords = capsules.filter((record) => {
    const unlockDate = new Date(record.unlockDate);
    return unlockDate.toISOString().split('T')[0] !== todayString;
  });

  const handleViewClick = (id) => {
    navigate(`/record/${id}`); 
  };

  return (
    <div>
      <h3>Invited Capsules</h3>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <h1>Today's Records</h1>
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
                      <span className="font-medium">Password: </span>
                      {record.password}
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="button"
                        className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 m-4"
                        onClick={() => handleViewClick(record._id)}
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
            <p>No locked records.</p>
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
                      <span className="font-medium">Latitude: </span>
                      {record.latitude}
                    </div>
                    <div className="text-gray-600 text-sm mb-2">
                      <span className="font-medium">Longitude: </span>
                      {record.longitude}
                    </div>
                    <div className="text-gray-600 text-sm mb-2">
                      <span className="font-medium">Collaborator: </span>
                      {record.collab}
                    </div>
                  </div>
                </div>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default CapsulesFetcher;
