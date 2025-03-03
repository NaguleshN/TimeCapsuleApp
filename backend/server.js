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
import Capsule from './models/capsuleModel.js';
import User from './models/userModel.js';
import cors from 'cors';
import nodemailer from 'nodemailer';
import cron from 'node-cron';
import { GridFSBucket, ObjectId } from 'mongodb';

dotenv.config();

const port = process.env.PORT || 5000;

connectDB();

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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendEmail = ({ to, subject, text }) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

app.get('/get_capsules_data/', async (req, res) => {
  try {
    const capsules = await Capsule.find().select('capsuleName unlockDate _id');
    res.json(capsules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching capsules' });
  }
});

app.post('/send_email', async (req, res) => {
  const { to, subject, text, unlockDate } = req.body;

  const date = new Date(unlockDate);

  const kolkataTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);

  const [month, day, year, hour, minute] = kolkataTime.match(/\d+/g);
  const kolkataDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:00`);

  const cronExpression = `${kolkataDate.getMinutes()} ${kolkataDate.getHours()} ${kolkataDate.getDate()} ${kolkataDate.getMonth() + 1} *`;

  console.log(`Scheduling email for ${to} at ${kolkataDate}`);

  cron.schedule(cronExpression, () => {
    sendEmail({ to, subject, text });
  });

  res.status(200).json({ message: 'Email scheduled successfully' });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single('file');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/capsules', capsuleRoutes);
app.use('/api/users', userRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

app.get('/all-records', async (req, res) => {
  let client;
  try {
    client = await connectDB();
    const db = client.db();

    const allRecords = await Capsule.find();

    const bucket = new GridFSBucket(db, {
      bucketName: 'uploads',
    });

    const recordsWithFileUrls = await Promise.all(
      allRecords.map(async (record) => {
        if (record.file) {
          // console.log(record.file)
          const fileId = new ObjectId(record.file);
          const fileUrl = `http://localhost:5000/api/capsules/files/${fileId}`;
          return { ...record.toObject(), fileUrl };
        }
        return record.toObject();
      })
    );

    res.json(recordsWithFileUrls);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ message: 'Error fetching records' });
  } 
});

app.get('/records/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const record = await Capsule.findById(id);
    if (!record) {
      return res.status(404).json({ message: 'Capsule not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch capsule', error });
  }
});

app.get('/all-users', async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

app.get('/api/capsules/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const userCapsules = await Capsule.find({ userId });
    if (!userCapsules) {
      return res.status(404).json({ message: 'No capsules found for this user' });
    }
    res.json(userCapsules);
  } catch (error) {
    console.error('Error fetching capsules for user:', error);
    res.status(500).json({ message: 'Failed to fetch capsules for the user' });
  }
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));