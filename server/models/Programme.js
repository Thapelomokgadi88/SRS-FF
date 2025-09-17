import mongoose from 'mongoose';

const programmeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  facultyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', required: true },
  level: { type: String, enum: ['certificate', 'diploma', 'degree', 'masters', 'phd'], required: true },
  totalCredits: { type: Number, required: true },
  durationYears: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

programmeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Programme', programmeSchema);