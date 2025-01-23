import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import capsuleRoutes from './routes/capsuleRoutes.js';
import multer from 'multer';
import fs from 'fs';
import mongoose from 'mongoose';
import Capsule from './models/capsuleModel.js';
import User from './models/userModel.js';
import cors from 'cors';
import User from './models/userModel.js'
import Collab from './models/collaboration.js'
import loginUser from './middleware/loginUser.js'
import { protect } from './middleware/authMiddleware.js';


dotenv.config();

// Resolve __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure the uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);  // Create the folder if it doesn't exist
}

const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Create an instance of Express
const app = express();



const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'], 
  methods: ['GET', 'POST'], 
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const upload = multer({
  dest: uploadsDir, 
  limits: { fileSize: 10 * 1024 * 1024 },
}).single('file');


if (process.env.NODE_ENV === 'production') {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}

// Capsule Routes
app.use('/api/capsules', capsuleRoutes);

// User routes
app.use('/api/users', userRoutes);

// POST route for uploading files (photo, video, audio)
app.post('/api/upload', upload, async (req, res) => {
  try {
    // Check if the file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Handle file (for example, save the file details to MongoDB or perform additional processing)
    const fileUrl = `/uploads/${req.file.filename}`; // URL for the uploaded file

    return res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file,
      fileUrl,
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Failed to upload file' });
  }
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  
if (process.env.NODE_ENV === 'production') {

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.get('/all-records', protect, async (req, res) => {
  try {
    const allRecords = await Capsule.find();
    res.json(allRecords); 
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ message: 'Error fetching records' });
  }
});

// Route for fetching a specific record by ID
app.get('/records/:id', async (req, res) => {
  const { id } = req.params;  // Extract the ID from the request
  try {
    const record = await Capsule.findById(id);  // Retrieve the record from MongoDB
    if (!record) {
      return res.status(404).json({ message: 'Capsule not found' });
    }
    res.json(record);  // Return the capsule details
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch capsule', error });
  }
});

// Route for fetching all users
app.get('/all-users', async (req, res) => {
  try {
    const allUsers = await User.find(); 
    res.json(allUsers); 
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Route for fetching capsules of a specific user
app.get('/api/capsules/user/:userId', async (req, res) => {
  const { userId } = req.params; // Get userId from request parameters
  try {
    const userCapsules = await Capsule.find({ userId }); // Find all capsules for this user
    if (!userCapsules) {
      return res.status(404).json({ message: 'No capsules found for this user' });
    }
    res.json(userCapsules); // Return all capsules of the specific user
  } catch (error) {
    console.error('Error fetching capsules for user:', error);
    res.status(500).json({ message: 'Failed to fetch capsules for the user' });
  }
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));