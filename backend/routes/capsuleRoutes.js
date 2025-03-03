import express from 'express';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { MongoClient, ObjectId, GridFSBucket } from 'mongodb';
import connectDB from '../config/db.js';
import Capsule from '../models/capsuleModel.js';
import Collab from '../models/collaboration.js';
import fs from 'fs';

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
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, videos, and audio files are allowed.'));
  }
};

const upload = multer({ storage, fileFilter });

router.post('/', upload.single('file'), async (req, res) => {
  let client;
  try {
    const { capsuleName, unlockDate, typeOfCapsule, password, collab, latitude, longitude } = req.body;

    if (!capsuleName || !unlockDate || !typeOfCapsule || !password || !collab) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    client = await connectDB();
    const db = client.db();

    const bucket = new GridFSBucket(db, {
      bucketName: 'uploads',
    });

    const readableStream = fs.createReadStream(req.file.path);

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: {
        contentType: req.file.mimetype,
        uploadDate: new Date(),
      },
    });

    readableStream.pipe(uploadStream)
      .on('error', (error) => {
        console.error('Error uploading file to GridFS:', error);
        res.status(500).json({ message: 'Failed to upload file to GridFS' });
      })
      .on('finish', async () => {
        fs.unlinkSync(req.file.path);
        const newCapsule = new Capsule({
          capsuleName,
          unlockDate,
          typeOfCapsule,
          collab,
          password,
          file: uploadStream.id.toString(),
          latitude,
          longitude,
        });

        const newCollab = new Collab({
          email: collab,
          capsule: newCapsule._id,
        });

        await newCollab.save();
        const savedCapsule = await newCapsule.save();

        res.status(201).json({
          message: 'Capsule saved successfully',
          data: savedCapsule,
          fileId: uploadStream.id.toString(),
          fileUrl: `/api/files/${uploadStream.id}`,
        });
      });
  } catch (error) {
    console.error('Error saving capsule:', error);
    res.status(500).json({ message: 'Failed to save the capsule / valid format include mp3/mp4/jpeg/png', error: error.message });
  }
});

router.get('/files/:fileId', async (req, res) => {
  let client;
  try {
    const fileId = new ObjectId(req.params.fileId);

    client = await connectDB();
    const db = client.db();

    const bucket = new GridFSBucket(db, {
      bucketName: 'uploads',
    });

    const file = await db.collection('uploads.files').findOne({ _id: fileId });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set('Content-Type', file.metadata.contentType);
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);

    const downloadStream = bucket.openDownloadStream(fileId);
    downloadStream.pipe(res)
      .on('error', (error) => {
        console.error('Error streaming file from GridFS:', error);
        res.status(500).json({ message: 'Failed to stream file' });
      });
  } catch (error) {
    console.error('Error retrieving file:', error);
    res.status(500).json({ message: 'Failed to retrieve file' });
  }
});

export default router;