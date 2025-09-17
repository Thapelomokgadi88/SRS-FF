import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  studentNo: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  idNumber: { type: String, required: true },
  email: { type: String, required: true },
  mobile: String,
  programmeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Programme', required: true },
  intakeYear: { type: Number, required: true },
  status: { type: String, enum: ['active', 'graduated', 'suspended', 'withdrawn'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

studentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Student', studentSchema);