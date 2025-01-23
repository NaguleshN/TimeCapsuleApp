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

// Initialize environment variables
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

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// File upload setup (using Multer)
const upload = multer({
  dest: uploadsDir, // Save files to the 'uploads' folder
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB size limit (adjust as needed)
}).single('file'); // Accepts a single file upload with the field name 'file'

// Serve static files (uploaded media) in production
if (process.env.NODE_ENV === 'production') {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Serving the 'uploads' folder
}

// Capsule Routes
app.use('/api/capsules', capsuleRoutes);  // Use the capsule routes here

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

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Serving static files from 'uploads' folder

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(port, () => console.log(`Server started on port ${port}`));