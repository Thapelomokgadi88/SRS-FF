import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  credits: { type: Number, required: true },
  yearLevel: { type: Number, required: true },
  semesterOffered: { type: Number, required: true },
  programmeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Programme', required: true },
  activeFlag: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

moduleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Module', moduleSchema);