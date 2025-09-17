import OpenAI from 'openai';
import Student from '../models/Student.js';
import Programme from '../models/Programme.js';
import Faculty from '../models/Faculty.js';
import Module from '../models/Module.js';
import Enrolment from '../models/Enrolment.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key'
});

class AnalyticsService {
  async generateInsights() {
    try {
      // Gather comprehensive data
      const [
        totalStudents,
        totalProgrammes,
        totalModules,
        totalEnrolments,
        studentsByStatus,
        studentsByFaculty,
        enrolmentsByStatus,
        recentEnrolments,
        topProgrammes
      ] = await Promise.all([
        Student.countDocuments(),
        Programme.countDocuments(),
        Module.countDocuments(),
        Enrolment.countDocuments(),
        this.getStudentsByStatus(),
        this.getStudentsByFaculty(),
        this.getEnrolmentsByStatus(),
        this.getRecentEnrolments(),
        this.getTopProgrammes()
      ]);

      const analyticsData = {
        overview: {
          totalStudents,
          totalProgrammes,
          totalModules,
          totalEnrolments
        },
        distributions: {
          studentsByStatus,
          studentsByFaculty,
          enrolmentsByStatus
        },
        trends: {
          recentEnrolments,
          topProgrammes
        },
        timestamp: new Date().toISOString()
      };

      // Generate AI insights if API key is available
      let aiInsights = null;
      if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'demo-key') {
        aiInsights = await this.generateAIInsights(analyticsData);
      } else {
        aiInsights = this.generateMockInsights(analyticsData);
      }

      return {
        ...analyticsData,
        insights: aiInsights
      };
    } catch (error) {
      console.error('Error generating insights:', error);
      return this.getFallbackAnalytics();
    }
  }

  async getStudentsByStatus() {
    return await Student.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);
  }

  async getStudentsByFaculty() {
    return await Student.aggregate([
      {
        $lookup: {
          from: 'programmes',
          localField: 'programmeId',
          foreignField: '_id',
          as: 'programme'
        }
      },
      { $unwind: '$programme' },
      {
        $lookup: {
          from: 'faculties',
          localField: 'programme.facultyId',
          foreignField: '_id',
          as: 'faculty'
        }
      },
      { $unwind: '$faculty' },
      { $group: { _id: '$faculty.name', count: { $sum: 1 } } },
      { $project: { faculty: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);
  }

  async getEnrolmentsByStatus() {
    return await Enrolment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $project: { status: '$_id', count: 1, _id: 0 } }
    ]);
  }

  async getRecentEnrolments() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return await Enrolment.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $project: { date: '$_id', count: 1, _id: 0 } },
      { $sort: { date: 1 } }
    ]);
  }

  async getTopProgrammes() {
    return await Student.aggregate([
      {
        $lookup: {
          from: 'programmes',
          localField: 'programmeId',
          foreignField: '_id',
          as: 'programme'
        }
      },
      { $unwind: '$programme' },
      { $group: { _id: '$programme.name', count: { $sum: 1 } } },
      { $project: { programme: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
  }

  async generateAIInsights(data) {
    try {
      const prompt = `
        Analyze this university student records data and provide 3-5 key insights:
        
        Overview: ${JSON.stringify(data.overview)}
        Student Status Distribution: ${JSON.stringify(data.distributions.studentsByStatus)}
        Students by Faculty: ${JSON.stringify(data.distributions.studentsByFaculty)}
        Enrolment Status: ${JSON.stringify(data.distributions.enrolmentsByStatus)}
        Top Programmes: ${JSON.stringify(data.trends.topProgrammes)}
        
        Provide actionable insights about enrollment trends, student performance, faculty popularity, and recommendations for improvement.
      `;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating AI insights:', error);
      return this.generateMockInsights(data);
    }
  }

  generateMockInsights(data) {
    const insights = [];
    
    if (data.overview.totalStudents > 0) {
      insights.push(`📊 Currently managing ${data.overview.totalStudents} students across ${data.overview.totalProgrammes} programmes.`);
    }
    
    if (data.distributions.studentsByFaculty.length > 0) {
      const topFaculty = data.distributions.studentsByFaculty[0];
      insights.push(`🎓 ${topFaculty.faculty} is the most popular faculty with ${topFaculty.count} students.`);
    }
    
    if (data.distributions.studentsByStatus.length > 0) {
      const activeStudents = data.distributions.studentsByStatus.find(s => s.status === 'active');
      if (activeStudents) {
        insights.push(`✅ ${activeStudents.count} students are currently active in their studies.`);
      }
    }
    
    if (data.trends.topProgrammes.length > 0) {
      const topProgramme = data.trends.topProgrammes[0];
      insights.push(`🏆 ${topProgramme.programme} is the most enrolled programme with ${topProgramme.count} students.`);
    }
    
    insights.push(`📈 Real-time analytics show healthy enrollment patterns across all faculties.`);
    
    return insights.join('\n\n');
  }

  getFallbackAnalytics() {
    return {
      overview: {
        totalStudents: 0,
        totalProgrammes: 0,
        totalModules: 0,
        totalEnrolments: 0
      },
      distributions: {
        studentsByStatus: [],
        studentsByFaculty: [],
        enrolmentsByStatus: []
      },
      trends: {
        recentEnrolments: [],
        topProgrammes: []
      },
      insights: 'Analytics service is initializing. Please check back in a moment.',
      timestamp: new Date().toISOString()
    };
  }
}

export default new AnalyticsService();