import express from 'express';
import path from 'path';
import multer from 'multer';  // Import multer for file uploads
import { fileURLToPath } from 'url'; // Import for ES module compatibility
import { dirname } from 'path'; // Import dirname to get directory name from fileURL
import Capsule from '../models/capsuleModel.js';  // Capsule model
import Collab from '../models/collaboration.js';

const router = express.Router();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads')); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});


const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'audio/mp3', 'video/mp4'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // Accept file
  } else {
    cb(new Error('Invalid file type. Only images, videos, and audio files are allowed.'));
  }
};


const upload = multer({ storage, fileFilter });


router.post('/', upload.single('file'), async (req, res) => {
  // const { email, password } = req.body;
  try {
    const { capsuleName, unlockDate, typeOfCapsule, password ,collab ,latitude , longitude} = req.body;

    if (!capsuleName || !unlockDate || !typeOfCapsule || !password || !collab) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = `/uploads/${req.file.filename}`; 

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

    res.status(201).json({
      message: 'Capsule saved successfully',
      data: savedCapsule,
      fileUrl: filePath, 
    });
  } catch (error) {
    console.error('Error saving capsule:', error);
    res.status(500).json({ message: 'Failed to save the capsule', error: error.message });
  }
});

export default router;