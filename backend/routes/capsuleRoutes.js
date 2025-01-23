import express from 'express';
import path from 'path';
import multer from 'multer';  // Import multer for file uploads
import { fileURLToPath } from 'url'; // Import for ES module compatibility
import { dirname } from 'path'; // Import dirname to get directory name from fileURL
import Capsule from '../models/capsuleModel.js';  // Capsule model
import Collab from '../models/collaboration.js'

const router = express.Router();

// Resolve __dirname for ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configure multer storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify where to store the uploaded files (e.g., in 'uploads' folder)
    cb(null, path.join(__dirname, '../uploads')); // Ensure 'uploads' folder is relative to this file
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for each file
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Filter to allow only certain file types (photo, video, audio)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'audio/mp3', 'video/mp4'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // Accept file
  } else {
    cb(new Error('Invalid file type. Only images, videos, and audio files are allowed.'));
  }
};

// Initialize multer with storage and file filter options
const upload = multer({ storage, fileFilter });

// POST route for creating a new capsule with file upload
router.post('/', upload.single('file'), async (req, res) => {
  // const { email, password } = req.body;
  try {
    const { capsuleName, unlockDate, typeOfCapsule, password ,collab ,latitude , longitude} = req.body;

    // Validate required fields
    if (!capsuleName || !unlockDate || !typeOfCapsule || !password || !collab) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // If no file uploaded, return an error
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Define file path (to save in the database)
    const filePath = `/uploads/${req.file.filename}`;  // URL path for the file

    // Create a new Capsule instance with the form data and file path
    const newCapsule = new Capsule({
      capsuleName,
      unlockDate,
      typeOfCapsule,
      collab,
      password,
      file: filePath,
      latitude,
      longitude
    });
    console.log(req.body.collab)
    
    const newCollab = new Collab({
      email: req.body.collab,
      capsule: newCapsule._id, 
    });

    await newCollab.save();
    
    const savedCapsule = await newCapsule.save();

    // Respond with a success message and capsule data
    res.status(201).json({
      message: 'Capsule saved successfully',
      data: savedCapsule,
      fileUrl: filePath,  // Include the file URL in the response
    });
  } catch (error) {
    console.error('Error saving capsule:', error);
    res.status(500).json({ message: 'Failed to save the capsule', error: error.message });
  }
});

export default router;