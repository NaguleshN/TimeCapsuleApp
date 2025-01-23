import mongoose from 'mongoose';

const capsuleSchema = new mongoose.Schema(
  {
    capsuleName: { type: String, required: true },
    unlockDate: { type: Date, required: true },
    typeOfCapsule: { type: String, enum: ['video', 'photo', 'audio'], required: true },
    collab: { type: String, required: true },
    password: { type: String, required: true },
    file: { type: String }, 
    latitude: { type: Number }, 
    longitude: { type: Number },
  },
  { timestamps: true } 
);

const Capsule = mongoose.model('Capsule', capsuleSchema);

export default Capsule;