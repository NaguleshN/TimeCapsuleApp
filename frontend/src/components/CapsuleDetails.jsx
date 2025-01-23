import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CapsuleDetails = () => {
  const { id } = useParams();  // Getting the capsule ID from the URL
  const [capsule, setCapsule] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCapsule = async () => {
      try {
        const response = await fetch(`http://localhost:5000/records/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCapsule(data);  // Set capsule data
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCapsule();
  }, [id]);  // Re-fetch data whenever `id` changes

  if (error) return <p>Error: {error}</p>;
  if (!capsule) return <p>Loading capsule details...</p>;

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white p-4 m-4">
      <h1 className="text-xl font-semibold text-gray-800 mb-2">
        Capsule Name: {capsule.capsuleName}
      </h1>
      <p className="text-gray-600 text-sm mb-2">
        <span className="font-medium">Unlock Date: </span>
        {capsule.unlockDate}
      </p>
      <p className="text-gray-600 text-sm mb-2">
        <span className="font-medium">Type of Capsule: </span>
        {capsule.typeOfCapsule}
      </p>
      <p className="text-gray-600 text-sm mb-2">
        <span className="font-medium">Password: </span>
        {capsule.password}
      </p>
      {/* Display more details if needed */}
      <div>
        {capsule.additionalInfo && (
          <p className="text-gray-600 text-sm mb-2">
            <span className="font-medium">Additional Information: </span>
            {capsule.additionalInfo}
          </p>
        )}
      </div>
    </div>
  );
};

export default CapsuleDetails;