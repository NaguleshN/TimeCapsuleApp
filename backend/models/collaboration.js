import mongoose from 'mongoose';
import Capsule from './capsuleModel.js';

const collaborationSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    capsule: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Capsule', // Reference the Capsule model
        required: true 
      },
  },
  { timestamps: true } 
);

const Collab = mongoose.model('Collab', collaborationSchema);

export default Collab;