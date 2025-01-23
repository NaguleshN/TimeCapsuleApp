import React, { useState , useEffect } from 'react';

const DigitalTimeCapsuleForm = () => {
  const [capsuleName, setCapsuleName] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [typeOfCapsule, setTypeOfCapsule] = useState('video');
  const [collab, setCollab] = useState('');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);  // State for file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [records, setRecords] = useState([]);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const getUsers = async () =>{

    try {
      const doc_res = await fetch('http://localhost:5000/all-users');
      console.log(doc_res)
      if (!doc_res.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await doc_res.json();
      console.log(data);
      setRecords(data);
    } catch (error) {
      console.error('Error fetching data:', error);
        setError(error.message || 'An error occurred.');
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the data to send
    const formData = new FormData();
    formData.append('capsuleName', capsuleName);
    formData.append('unlockDate', unlockDate);
    formData.append('typeOfCapsule', typeOfCapsule);
    formData.append('password', password);
    if (file) formData.append('file', file);  // Append the file if selected

    try {
      setLoading(true);
      setError(null); // Reset any previous error
      setSuccess(false); // Reset success state

      // Send the form data to the backend
      const response = await fetch('/api/capsules', {
        method: 'POST',
        body: formData,
      });

      

      // Check if the response is OK (status 201)
      if (response.ok) {
        const data = await response.json();
        console.log('Capsule saved successfully:', data);
        setSuccess(true);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to save the capsule');
      }
    } catch (error) {
      setError('An error occurred while saving the capsule');
      console.error(error);
    } finally {
      setLoading(false); // Reset the loading state
    }
  };

  useEffect(() => {
    getUsers(); 
  }, []);

  return (
    <div>
      <h1>Digital Time Capsule Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Capsule Name:
            <input
              type="text"
              value={capsuleName}
              onChange={(e) => setCapsuleName(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Unlock Date:
            <input
              type="date"
              value={unlockDate}
              onChange={(e) => setUnlockDate(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Type of Capsule:
            <select
              value={typeOfCapsule}
              onChange={(e) => setTypeOfCapsule(e.target.value)}
              required
            >
              <option value="video">Video</option>
              <option value="photo">Photo</option>
              <option value="audio">Audio</option>
            </select>
          </label>
        </div>
        <div>
          <label>
           Collaborators :
            <select
              value={collab}
              onChange={(e) => setCollab(e.target.value)}
              required
            >
              { 
              records.map((record, index) => (
                <option key={index} value={record.email}>
                  {record.email}
                </option>
              ))}
             
            </select>
          </label>
        </div>
        <div>
          <label>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Upload File (Photo, Video, Audio):
            <input
              type="file"
              accept="image/*,video/*,audio/*"  // Limit file types
              onChange={handleFileChange}
            />
          </label>
        </div>


        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Submit'}
        </button>
      </form>

      {success && <div className="alert alert-success mt-3">Capsule saved successfully!</div>}
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default DigitalTimeCapsuleForm;