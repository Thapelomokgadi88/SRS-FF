import mongoose from 'mongoose';

const enrolmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  moduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  academicYear: { type: Number, required: true },
  semester: { type: Number, required: true },
  status: { type: String, enum: ['not-started', 'in-progress', 'completed', 'withdrawn'], default: 'not-started' },
  finalMark: Number,
  letterGrade: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

enrolmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Enrolment', enrolmentSchema);