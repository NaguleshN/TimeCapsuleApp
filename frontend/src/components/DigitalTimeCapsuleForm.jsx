import React, { useState } from 'react';

const DigitalTimeCapsuleForm = () => {
  const [capsuleName, setCapsuleName] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [typeOfCapsule, setTypeOfCapsule] = useState('video');
  const [password, setPassword] = useState('');
  const [file, setFile] = useState(null);  // State for file
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
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