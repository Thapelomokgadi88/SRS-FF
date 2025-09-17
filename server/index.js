import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import Student from './models/Student.js';
import Programme from './models/Programme.js';
import Faculty from './models/Faculty.js';
import Module from './models/Module.js';
import Enrolment from './models/Enrolment.js';
import analyticsService from './services/analyticsService.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    startRealTimeAnalytics();
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

// API Routes
app.get('/api/students', async (req, res) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { studentNo: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }
    
    const students = await Student.find(query)
      .populate('programmeId', 'name code level')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Student.countDocuments(query);
    
    res.json({
      students,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/programmes', async (req, res) => {
  try {
    const { search, level, facultyId } = req.query;
    const query = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (level) {
      query.level = level;
    }
    
    if (facultyId) {
      query.facultyId = facultyId;
    }
    
    const programmes = await Programme.find(query)
      .populate('facultyId', 'name code')
      .sort({ name: 1 });
    
    res.json(programmes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/faculties', async (req, res) => {
  try {
    const faculties = await Faculty.find().sort({ name: 1 });
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/modules', async (req, res) => {
  try {
    const { search, programmeId, yearLevel, semester } = req.query;
    const query = { activeFlag: true };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (programmeId) {
      query.programmeId = programmeId;
    }
    
    if (yearLevel) {
      query.yearLevel = parseInt(yearLevel);
    }
    
    if (semester) {
      query.semesterOffered = parseInt(semester);
    }
    
    const modules = await Module.find(query)
      .populate('programmeId', 'name code')
      .sort({ yearLevel: 1, semesterOffered: 1, title: 1 });
    
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/enrolments', async (req, res) => {
  try {
    const { studentId, moduleId, status, academicYear } = req.query;
    const query = {};
    
    if (studentId) query.studentId = studentId;
    if (moduleId) query.moduleId = moduleId;
    if (status) query.status = status;
    if (academicYear) query.academicYear = parseInt(academicYear);
    
    const enrolments = await Enrolment.find(query)
      .populate('studentId', 'firstName lastName studentNo')
      .populate('moduleId', 'title code credits')
      .sort({ createdAt: -1 });
    
    res.json(enrolments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/analytics', async (req, res) => {
  try {
    const analytics = await analyticsService.generateInsights();
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Real-time analytics
function startRealTimeAnalytics() {
  // Send analytics updates every 30 seconds
  setInterval(async () => {
    try {
      const analytics = await analyticsService.generateInsights();
      io.emit('analytics-update', analytics);
    } catch (error) {
      console.error('Error broadcasting analytics:', error);
    }
  }, 30000);

  // Watch for database changes and emit updates
  const changeStreams = [
    Student.watch(),
    Programme.watch(),
    Module.watch(),
    Enrolment.watch()
  ];

  changeStreams.forEach(stream => {
    stream.on('change', async (change) => {
      console.log('Database change detected:', change.operationType);
      
      // Emit specific updates based on collection
      const collection = change.ns.coll;
      io.emit(`${collection}-change`, {
        type: change.operationType,
        data: change.fullDocument,
        timestamp: new Date().toISOString()
      });
      
      // Trigger analytics refresh
      setTimeout(async () => {
        try {
          const analytics = await analyticsService.generateInsights();
          io.emit('analytics-update', analytics);
        } catch (error) {
          console.error('Error updating analytics after change:', error);
        }
      }, 1000);
    });
  });
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial analytics
  analyticsService.generateInsights()
    .then(analytics => {
      socket.emit('analytics-update', analytics);
    })
    .catch(error => {
      console.error('Error sending initial analytics:', error);
    });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Real-time analytics enabled`);
});