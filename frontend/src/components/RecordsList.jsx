import { useNavigate } from 'react-router-dom';

const RecordsList = () => {
  const navigate = useNavigate();

  // Inside the JSX where the button is rendered
  return (
    <button
      onClick={() => navigate(`/capsule/${record.id}`)} // Pass capsule ID in URL
      className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600 m-4"
    >
      View
    </button>
  );
};