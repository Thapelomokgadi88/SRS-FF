import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';

import Student from '../server/models/Student.js';
import Programme from '../server/models/Programme.js';
import Faculty from '../server/models/Faculty.js';
import Module from '../server/models/Module.js';
import Enrolment from '../server/models/Enrolment.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Sample data arrays
const faculties = [
  { code: 'ENG', name: 'Faculty of Engineering', description: 'Engineering and Technology programmes' },
  { code: 'BUS', name: 'Faculty of Business', description: 'Business and Management programmes' },
  { code: 'SCI', name: 'Faculty of Science', description: 'Natural and Applied Sciences' },
  { code: 'ART', name: 'Faculty of Arts', description: 'Arts and Humanities programmes' },
  { code: 'MED', name: 'Faculty of Medicine', description: 'Medical and Health Sciences' },
  { code: 'LAW', name: 'Faculty of Law', description: 'Legal Studies programmes' },
  { code: 'EDU', name: 'Faculty of Education', description: 'Education and Teaching programmes' },
  { code: 'AGR', name: 'Faculty of Agriculture', description: 'Agricultural and Environmental Sciences' },
  { code: 'ICT', name: 'Faculty of ICT', description: 'Information and Communication Technology' },
  { code: 'SOC', name: 'Faculty of Social Sciences', description: 'Social Sciences and Psychology' }
];

const programmeTemplates = {
  ENG: [
    { name: 'Civil Engineering', level: 'degree', credits: 360, duration: 4 },
    { name: 'Mechanical Engineering', level: 'degree', credits: 360, duration: 4 },
    { name: 'Electrical Engineering', level: 'degree', credits: 360, duration: 4 },
    { name: 'Computer Engineering', level: 'degree', credits: 360, duration: 4 },
    { name: 'Chemical Engineering', level: 'degree', credits: 360, duration: 4 },
    { name: 'Industrial Engineering', level: 'degree', credits: 360, duration: 4 },
    { name: 'Environmental Engineering', level: 'degree', credits: 360, duration: 4 },
    { name: 'Biomedical Engineering', level: 'degree', credits: 360, duration: 4 },
    { name: 'Aerospace Engineering', level: 'degree', credits: 360, duration: 4 },
    { name: 'Materials Engineering', level: 'degree', credits: 360, duration: 4 },
    { name: 'Engineering Technology', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Mechanical Technology', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Electrical Technology', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Civil Technology', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Engineering Management', level: 'masters', credits: 180, duration: 2 },
    { name: 'Structural Engineering', level: 'masters', credits: 180, duration: 2 },
    { name: 'Power Systems Engineering', level: 'masters', credits: 180, duration: 2 }
  ],
  BUS: [
    { name: 'Business Administration', level: 'degree', credits: 360, duration: 4 },
    { name: 'Accounting', level: 'degree', credits: 360, duration: 4 },
    { name: 'Finance', level: 'degree', credits: 360, duration: 4 },
    { name: 'Marketing', level: 'degree', credits: 360, duration: 4 },
    { name: 'Human Resource Management', level: 'degree', credits: 360, duration: 4 },
    { name: 'Supply Chain Management', level: 'degree', credits: 360, duration: 4 },
    { name: 'International Business', level: 'degree', credits: 360, duration: 4 },
    { name: 'Entrepreneurship', level: 'degree', credits: 360, duration: 4 },
    { name: 'Economics', level: 'degree', credits: 360, duration: 4 },
    { name: 'Business Management', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Office Administration', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Financial Management', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Retail Management', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Business Studies', level: 'certificate', credits: 120, duration: 1 },
    { name: 'Master of Business Administration', level: 'masters', credits: 180, duration: 2 },
    { name: 'Master of Finance', level: 'masters', credits: 180, duration: 2 },
    { name: 'Master of Accounting', level: 'masters', credits: 180, duration: 2 }
  ],
  SCI: [
    { name: 'Computer Science', level: 'degree', credits: 360, duration: 4 },
    { name: 'Mathematics', level: 'degree', credits: 360, duration: 4 },
    { name: 'Physics', level: 'degree', credits: 360, duration: 4 },
    { name: 'Chemistry', level: 'degree', credits: 360, duration: 4 },
    { name: 'Biology', level: 'degree', credits: 360, duration: 4 },
    { name: 'Statistics', level: 'degree', credits: 360, duration: 4 },
    { name: 'Environmental Science', level: 'degree', credits: 360, duration: 4 },
    { name: 'Biotechnology', level: 'degree', credits: 360, duration: 4 },
    { name: 'Applied Mathematics', level: 'degree', credits: 360, duration: 4 },
    { name: 'Data Science', level: 'degree', credits: 360, duration: 4 },
    { name: 'Laboratory Technology', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Computer Applications', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Science Technology', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Master of Science in Computer Science', level: 'masters', credits: 180, duration: 2 },
    { name: 'Master of Science in Mathematics', level: 'masters', credits: 180, duration: 2 },
    { name: 'Master of Science in Data Science', level: 'masters', credits: 180, duration: 2 }
  ],
  ART: [
    { name: 'English Literature', level: 'degree', credits: 360, duration: 4 },
    { name: 'History', level: 'degree', credits: 360, duration: 4 },
    { name: 'Philosophy', level: 'degree', credits: 360, duration: 4 },
    { name: 'Fine Arts', level: 'degree', credits: 360, duration: 4 },
    { name: 'Music', level: 'degree', credits: 360, duration: 4 },
    { name: 'Theatre Arts', level: 'degree', credits: 360, duration: 4 },
    { name: 'Linguistics', level: 'degree', credits: 360, duration: 4 },
    { name: 'Cultural Studies', level: 'degree', credits: 360, duration: 4 },
    { name: 'Creative Writing', level: 'degree', credits: 360, duration: 4 },
    { name: 'Art and Design', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Music Performance', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Creative Arts', level: 'certificate', credits: 120, duration: 1 },
    { name: 'Master of Arts in Literature', level: 'masters', credits: 180, duration: 2 },
    { name: 'Master of Fine Arts', level: 'masters', credits: 180, duration: 2 }
  ],
  MED: [
    { name: 'Medicine', level: 'degree', credits: 540, duration: 6 },
    { name: 'Nursing', level: 'degree', credits: 360, duration: 4 },
    { name: 'Pharmacy', level: 'degree', credits: 360, duration: 4 },
    { name: 'Physiotherapy', level: 'degree', credits: 360, duration: 4 },
    { name: 'Medical Laboratory Science', level: 'degree', credits: 360, duration: 4 },
    { name: 'Radiography', level: 'degree', credits: 360, duration: 4 },
    { name: 'Public Health', level: 'degree', credits: 360, duration: 4 },
    { name: 'Occupational Therapy', level: 'degree', credits: 360, duration: 4 },
    { name: 'Dental Technology', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Medical Assistant', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Nursing Assistant', level: 'certificate', credits: 120, duration: 1 },
    { name: 'Master of Medicine', level: 'masters', credits: 240, duration: 3 },
    { name: 'Master of Public Health', level: 'masters', credits: 180, duration: 2 }
  ],
  LAW: [
    { name: 'Bachelor of Laws', level: 'degree', credits: 360, duration: 4 },
    { name: 'Legal Studies', level: 'degree', credits: 360, duration: 4 },
    { name: 'Criminology', level: 'degree', credits: 360, duration: 4 },
    { name: 'Paralegal Studies', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Legal Assistant', level: 'certificate', credits: 120, duration: 1 },
    { name: 'Master of Laws', level: 'masters', credits: 180, duration: 2 },
    { name: 'Master of Legal Studies', level: 'masters', credits: 180, duration: 2 }
  ],
  EDU: [
    { name: 'Primary Education', level: 'degree', credits: 360, duration: 4 },
    { name: 'Secondary Education', level: 'degree', credits: 360, duration: 4 },
    { name: 'Early Childhood Education', level: 'degree', credits: 360, duration: 4 },
    { name: 'Special Education', level: 'degree', credits: 360, duration: 4 },
    { name: 'Educational Psychology', level: 'degree', credits: 360, duration: 4 },
    { name: 'Physical Education', level: 'degree', credits: 360, duration: 4 },
    { name: 'Teaching English as Second Language', level: 'degree', credits: 360, duration: 4 },
    { name: 'Educational Technology', level: 'degree', credits: 360, duration: 4 },
    { name: 'Teaching Practice', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Early Childhood Development', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Teaching Assistant', level: 'certificate', credits: 120, duration: 1 },
    { name: 'Master of Education', level: 'masters', credits: 180, duration: 2 },
    { name: 'Master of Educational Leadership', level: 'masters', credits: 180, duration: 2 }
  ],
  AGR: [
    { name: 'Agriculture', level: 'degree', credits: 360, duration: 4 },
    { name: 'Animal Science', level: 'degree', credits: 360, duration: 4 },
    { name: 'Plant Science', level: 'degree', credits: 360, duration: 4 },
    { name: 'Agricultural Economics', level: 'degree', credits: 360, duration: 4 },
    { name: 'Food Science', level: 'degree', credits: 360, duration: 4 },
    { name: 'Forestry', level: 'degree', credits: 360, duration: 4 },
    { name: 'Agricultural Engineering', level: 'degree', credits: 360, duration: 4 },
    { name: 'Veterinary Science', level: 'degree', credits: 450, duration: 5 },
    { name: 'Agricultural Technology', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Animal Health', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Farm Management', level: 'certificate', credits: 120, duration: 1 },
    { name: 'Master of Agriculture', level: 'masters', credits: 180, duration: 2 }
  ],
  ICT: [
    { name: 'Information Technology', level: 'degree', credits: 360, duration: 4 },
    { name: 'Software Engineering', level: 'degree', credits: 360, duration: 4 },
    { name: 'Information Systems', level: 'degree', credits: 360, duration: 4 },
    { name: 'Cybersecurity', level: 'degree', credits: 360, duration: 4 },
    { name: 'Network Engineering', level: 'degree', credits: 360, duration: 4 },
    { name: 'Web Development', level: 'degree', credits: 360, duration: 4 },
    { name: 'Database Administration', level: 'degree', credits: 360, duration: 4 },
    { name: 'Mobile App Development', level: 'degree', credits: 360, duration: 4 },
    { name: 'Computer Networks', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Software Development', level: 'diploma', credits: 240, duration: 3 },
    { name: 'IT Support', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Web Design', level: 'certificate', credits: 120, duration: 1 },
    { name: 'Master of Information Technology', level: 'masters', credits: 180, duration: 2 },
    { name: 'Master of Cybersecurity', level: 'masters', credits: 180, duration: 2 }
  ],
  SOC: [
    { name: 'Psychology', level: 'degree', credits: 360, duration: 4 },
    { name: 'Sociology', level: 'degree', credits: 360, duration: 4 },
    { name: 'Social Work', level: 'degree', credits: 360, duration: 4 },
    { name: 'Political Science', level: 'degree', credits: 360, duration: 4 },
    { name: 'International Relations', level: 'degree', credits: 360, duration: 4 },
    { name: 'Anthropology', level: 'degree', credits: 360, duration: 4 },
    { name: 'Development Studies', level: 'degree', credits: 360, duration: 4 },
    { name: 'Gender Studies', level: 'degree', credits: 360, duration: 4 },
    { name: 'Community Development', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Social Services', level: 'diploma', credits: 240, duration: 3 },
    { name: 'Counselling', level: 'certificate', credits: 120, duration: 1 },
    { name: 'Master of Psychology', level: 'masters', credits: 180, duration: 2 },
    { name: 'Master of Social Work', level: 'masters', credits: 180, duration: 2 }
  ]
};

// Generate module templates for different programme types
const generateModules = (programmeName, level, credits, duration, facultyCode) => {
  const modules = [];
  const creditsPerYear = Math.floor(credits / duration);
  const modulesPerYear = level === 'certificate' ? 6 : level === 'diploma' ? 8 : level === 'masters' ? 6 : 10;
  const creditsPerModule = Math.floor(creditsPerYear / modulesPerYear);
  
  const coreSubjects = {
    ENG: ['Mathematics', 'Physics', 'Engineering Drawing', 'Materials Science', 'Thermodynamics', 'Mechanics', 'Electronics', 'Project Management'],
    BUS: ['Accounting', 'Economics', 'Marketing', 'Management', 'Finance', 'Statistics', 'Business Law', 'Operations Management'],
    SCI: ['Mathematics', 'Statistics', 'Research Methods', 'Laboratory Techniques', 'Data Analysis', 'Scientific Writing', 'Ethics', 'Computer Applications'],
    ART: ['Critical Thinking', 'Research Methods', 'Cultural Studies', 'Communication', 'History', 'Philosophy', 'Creative Expression', 'Literature'],
    MED: ['Anatomy', 'Physiology', 'Pathology', 'Pharmacology', 'Clinical Skills', 'Medical Ethics', 'Public Health', 'Research Methods'],
    LAW: ['Constitutional Law', 'Criminal Law', 'Civil Law', 'Legal Research', 'Legal Writing', 'Ethics', 'Jurisprudence', 'Court Procedures'],
    EDU: ['Educational Psychology', 'Curriculum Development', 'Teaching Methods', 'Assessment', 'Classroom Management', 'Child Development', 'Educational Technology', 'Special Needs'],
    AGR: ['Plant Science', 'Animal Science', 'Soil Science', 'Agricultural Economics', 'Farm Management', 'Crop Production', 'Livestock Management', 'Agricultural Technology'],
    ICT: ['Programming', 'Database Systems', 'Networks', 'Software Engineering', 'Web Development', 'Cybersecurity', 'Project Management', 'Systems Analysis'],
    SOC: ['Research Methods', 'Statistics', 'Social Theory', 'Psychology', 'Anthropology', 'Ethics', 'Community Development', 'Policy Analysis']
  };
  
  const subjects = coreSubjects[facultyCode] || ['Core Subject 1', 'Core Subject 2', 'Core Subject 3', 'Core Subject 4', 'Core Subject 5', 'Core Subject 6', 'Core Subject 7', 'Core Subject 8'];
  
  for (let year = 1; year <= duration; year++) {
    for (let semester = 1; semester <= 2; semester++) {
      const modulesThisSemester = Math.floor(modulesPerYear / 2);
      for (let i = 0; i < modulesThisSemester; i++) {
        const subjectIndex = ((year - 1) * 2 + (semester - 1)) * modulesThisSemester + i;
        const subject = subjects[subjectIndex % subjects.length];
        
        modules.push({
          title: `${subject} ${year}`,
          description: `${subject} for year ${year}, semester ${semester}`,
          credits: creditsPerModule,
          yearLevel: year,
          semesterOffered: semester
        });
      }
    }
  }
  
  return modules;
};

// Generate realistic South African names
const generateSouthAfricanName = () => {
  const firstNames = [
    'Thabo', 'Nomsa', 'Sipho', 'Zanele', 'Mandla', 'Precious', 'Bongani', 'Nomthandazo',
    'Tshepo', 'Lerato', 'Kagiso', 'Tebogo', 'Mpho', 'Kgothatso', 'Refilwe', 'Palesa',
    'John', 'Mary', 'David', 'Sarah', 'Michael', 'Elizabeth', 'James', 'Jennifer',
    'Ahmed', 'Fatima', 'Hassan', 'Aisha', 'Omar', 'Khadija', 'Ali', 'Zainab',
    'Raj', 'Priya', 'Arjun', 'Kavitha', 'Vikram', 'Deepika', 'Ravi', 'Meera'
  ];
  
  const lastNames = [
    'Mthembu', 'Nkomo', 'Dlamini', 'Mokoena', 'Mahlangu', 'Khumalo', 'Ndlovu', 'Mabaso',
    'Van der Merwe', 'Botha', 'Pretorius', 'Du Plessis', 'Steyn', 'Fourie', 'Nel', 'Venter',
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Patel', 'Singh', 'Kumar', 'Sharma', 'Gupta', 'Agarwal', 'Jain', 'Shah',
    'Mohamed', 'Abdullah', 'Ibrahim', 'Hassan', 'Ali', 'Ahmed', 'Khan', 'Malik'
  ];
  
  return {
    firstName: faker.helpers.arrayElement(firstNames),
    lastName: faker.helpers.arrayElement(lastNames)
  };
};

// Generate South African ID number
const generateSAIdNumber = (birthYear) => {
  const year = birthYear.toString().slice(-2);
  const month = faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0');
  const day = faker.number.int({ min: 1, max: 28 }).toString().padStart(2, '0');
  const gender = faker.number.int({ min: 0, max: 9999 }).toString().padStart(4, '0');
  const citizenship = '0'; // SA citizen
  const race = '8'; // Not used anymore but still part of format
  
  const partial = year + month + day + gender + citizenship + race;
  
  // Calculate check digit (simplified)
  let sum = 0;
  for (let i = 0; i < partial.length; i++) {
    if (i % 2 === 0) {
      sum += parseInt(partial[i]);
    } else {
      const doubled = parseInt(partial[i]) * 2;
      sum += doubled > 9 ? doubled - 9 : doubled;
    }
  }
  const checkDigit = (10 - (sum % 10)) % 10;
  
  return partial + checkDigit;
};

async function populateDatabase() {
  console.log('🚀 Starting MongoDB database population...');
  
  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      Student.deleteMany({}),
      Programme.deleteMany({}),
      Faculty.deleteMany({}),
      Module.deleteMany({}),
      Enrolment.deleteMany({})
    ]);
    
    // 1. Insert Faculties
    console.log('📚 Inserting faculties...');
    const facultyDocs = await Faculty.insertMany(faculties);
    console.log(`✅ Inserted ${facultyDocs.length} faculties`);
    
    // 2. Generate and insert Programmes
    console.log('🎓 Generating programmes...');
    const programmes = [];
    let programmeCounter = 1;
    
    for (const faculty of facultyDocs) {
      const templates = programmeTemplates[faculty.code] || [];
      for (const template of templates) {
        programmes.push({
          code: `${faculty.code}${programmeCounter.toString().padStart(3, '0')}`,
          name: template.name,
          facultyId: faculty._id,
          level: template.level,
          totalCredits: template.credits,
          durationYears: template.duration
        });
        programmeCounter++;
      }
    }
    
    const programmeDocs = await Programme.insertMany(programmes);
    console.log(`✅ Inserted ${programmeDocs.length} programmes`);
    
    // 3. Generate and insert Modules
    console.log('📖 Generating modules...');
    const allModules = [];
    let moduleCounter = 1;
    
    for (const programme of programmeDocs) {
      const faculty = facultyDocs.find(f => f._id.equals(programme.facultyId));
      const modules = generateModules(
        programme.name,
        programme.level,
        programme.totalCredits,
        programme.durationYears,
        faculty.code
      );
      
      for (const module of modules) {
        allModules.push({
          code: `${programme.code}${moduleCounter.toString().padStart(3, '0')}`,
          title: module.title,
          description: module.description,
          credits: module.credits,
          yearLevel: module.yearLevel,
          semesterOffered: module.semesterOffered,
          programmeId: programme._id
        });
        moduleCounter++;
      }
    }
    
    // Insert modules in batches
    const batchSize = 100;
    let insertedModules = 0;
    
    for (let i = 0; i < allModules.length; i += batchSize) {
      const batch = allModules.slice(i, i + batchSize);
      const moduleDocs = await Module.insertMany(batch);
      insertedModules += moduleDocs.length;
      console.log(`✅ Inserted ${insertedModules}/${allModules.length} modules`);
    }
    
    // 4. Generate and insert Students
    console.log('👥 Generating 500 students...');
    const students = [];
    const currentYear = new Date().getFullYear();
    
    for (let i = 1; i <= 500; i++) {
      const name = generateSouthAfricanName();
      const intakeYear = faker.number.int({ min: currentYear - 4, max: currentYear });
      const birthYear = intakeYear - faker.number.int({ min: 18, max: 25 });
      const programme = faker.helpers.arrayElement(programmeDocs);
      
      students.push({
        studentNo: `STU${currentYear}${i.toString().padStart(4, '0')}`,
        firstName: name.firstName,
        lastName: name.lastName,
        idNumber: generateSAIdNumber(birthYear),
        email: `${name.firstName.toLowerCase()}.${name.lastName.toLowerCase()}${i}@student.university.ac.za`,
        mobile: `+27${faker.number.int({ min: 600000000, max: 899999999 })}`,
        programmeId: programme._id,
        intakeYear: intakeYear,
        status: faker.helpers.arrayElement(['active', 'active', 'active', 'active', 'graduated', 'suspended'])
      });
    }
    
    // Insert students in batches
    let insertedStudents = 0;
    
    for (let i = 0; i < students.length; i += batchSize) {
      const batch = students.slice(i, i + batchSize);
      const studentDocs = await Student.insertMany(batch);
      insertedStudents += studentDocs.length;
      console.log(`✅ Inserted ${insertedStudents}/${students.length} students`);
    }
    
    // 5. Get all modules for enrolment generation
    const allModulesDocs = await Module.find();
    
    // 6. Generate sample enrolments
    console.log('📝 Generating sample enrolments...');
    const allStudentsDocs = await Student.find().limit(200); // Enrol first 200 students
    
    const enrolments = [];
    
    for (const student of allStudentsDocs) {
      const studentProgramme = programmeDocs.find(p => p._id.equals(student.programmeId));
      const programmeModules = allModulesDocs.filter(m => m.programmeId.equals(student.programmeId));
      
      // Enrol in modules for their current year
      const currentStudentYear = Math.min(
        currentYear - student.intakeYear + 1,
        studentProgramme.durationYears
      );
      
      const yearModules = programmeModules.filter(m => m.yearLevel <= currentStudentYear);
      
      for (const module of yearModules.slice(0, 8)) { // Limit to 8 modules per student
        enrolments.push({
          studentId: student._id,
          moduleId: module._id,
          academicYear: currentYear,
          semester: module.semesterOffered,
          status: faker.helpers.arrayElement(['in-progress', 'completed', 'not-started']),
          finalMark: faker.helpers.maybe(() => faker.number.int({ min: 40, max: 95 }), { probability: 0.6 })
        });
      }
    }
    
    if (enrolments.length > 0) {
      const enrolmentDocs = await Enrolment.insertMany(enrolments);
      console.log(`✅ Inserted ${enrolmentDocs.length} enrolments`);
    }
    
    console.log('\n🎉 MongoDB database population completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Faculties: ${facultyDocs.length}`);
    console.log(`- Programmes: ${programmeDocs.length}`);
    console.log(`- Modules: ${insertedModules}`);
    console.log(`- Students: ${insertedStudents}`);
    console.log(`- Enrolments: ${enrolments.length}`);
    
    console.log('\n🚀 Ready for real-time analytics!');
    
  } catch (error) {
    console.error('❌ Error populating database:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
}

// Run the population script
populateDatabase();