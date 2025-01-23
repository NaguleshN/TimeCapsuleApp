import mongoose from 'mongoose';

const capsuleSchema = new mongoose.Schema(
  {
    capsuleName: { type: String, required: true },
    unlockDate: { type: Date, required: true },
    typeOfCapsule: { type: String, enum: ['video', 'photo', 'audio'], required: true },
    password: { type: String, required: true },
    file: { type: String },  // Add field to store the file path
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Capsule = mongoose.model('Capsule', capsuleSchema);

export default Capsule;