import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Assuming you're using Redux for session management

const CapsulesFetcher = () => {
  const { userInfo } = useSelector((state) => state.auth); // Get the logged-in user info from Redux
  const [records, setRecords] = useState([]); // List of records
  const [capsules, setCapsules] = useState([]); // Capsules fetched

  // Fetch all records initially
  const fetchRecords = async () => {
    try {
      const response = await fetch('http://localhost:5000/allcollab');
      const data = await response.json();
      //   console.log(data)
      for (let i = 0; i < data.length; i++) {
          
          console.log(data[i].email)
              console.log(userInfo?.email)
          if (data[i].email === userInfo?.email) {
              // console.log(data[i].email)
        //     // console.log(data[i].email)
        //     // console.log(data[i].capsule)
        //     console.log("---")
        //     // setRecords(data);
            setRecords((prevRecords) => [...prevRecords, data[i].capsule]);
        //     // console.log(userInfo?.email)
          }
      }
    
      
    } catch (error) {
      console.error('Error fetching records:', error);
    }
  };

  const fetchCapsulesForUser = async () => {
    try {
      const filteredCapsules = await Promise.all(
        records.map(async (record) => {
            const response = await fetch(`http://localhost:5000/getcollab/${record}`);
            const capsuleData = await response.json();
            console.log(capsuleData[0])
            return capsuleData[0]; 
        })
      );

      setCapsules(filteredCapsules.filter((capsule) => capsule !== null));
    } catch (error) {
      console.error('Error fetching capsules for user:', error);
    }
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
      {/* {capsules.length > 0 ? (
        capsules.map((capsule) => (
          <div key={capsule._id}>
            <h5>{capsule.capsuleName}</h5>
            <p>Unlock Date: {capsule.unlockDate}</p>
            <p>Type: {capsule.typeOfCapsule}</p>
          </div>
        ))
      ) : (
        <p>No capsules available for the user.</p>
      )} */}


        {capsules.length === 0 ? (
            <p>No records to unlock today.</p>
          ) : (
            <ul class ="list-none space-y-2">
              {capsules.map((record, index) => (
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
                        <span class="font-medium">Unlock date: </span>{record.unlockDate}
                    </div>
                    <div class="text-gray-600 text-sm mb-2">
                        <span class="font-medium">Latitude: </span>{record.latitude}
                    </div>
                    <div class="text-gray-600 text-sm mb-2">
                        <span class="font-medium">Longitude: </span>{record.longitude}
                    </div>
                    <div class="flex justify-between ">
                        <button type="button" class="bg-blue-500  px-4 py-2 rounded-md hover:bg-blue-600  m-4" >View</button>
                        <button type="button" class="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600  m-4">Delete</button>
                    </div>
                </div>
                </div>
              ))}
            </ul>
          )}
    </div>
  );
};

export default CapsulesFetcher;
