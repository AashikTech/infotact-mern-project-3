const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Department = require('../models/Department');
const Employee = require('../models/Employee');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Sample data
const departments = [
  { name: 'Human Resources', description: 'Manages employee relations and recruitment' },
  { name: 'Engineering', description: 'Software development and technical operations' },
  { name: 'Marketing', description: 'Brand management and customer acquisition' },
  { name: 'Finance', description: 'Financial planning and accounting' },
  { name: 'Operations', description: 'Day-to-day business operations' }
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@company.com',
    password: 'Admin123!',
    role: 'admin'
  },
  {
    name: 'HR Manager',
    email: 'hr@company.com',
    password: 'HrManager123!',
    role: 'hr'
  },
  {
    name: 'John Employee',
    email: 'john@company.com',
    password: 'Employee123!',
    role: 'employee'
  },
  {
    name: 'Jane Employee',
    email: 'jane@company.com',
    password: 'Employee123!',
    role: 'employee'
  }
];

const employees = [
  {
    employeeId: 'EMP001',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@company.com',
    phone: '1234567890',
    position: 'System Administrator',
    salary: 80000,
    joinDate: new Date('2023-01-15')
  },
  {
    employeeId: 'EMP002',
    firstName: 'HR',
    lastName: 'Manager',
    email: 'hr@company.com',
    phone: '1234567891',
    position: 'HR Manager',
    salary: 75000,
    joinDate: new Date('2023-02-20')
  },
  {
    employeeId: 'EMP003',
    firstName: 'John',
    lastName: 'Employee',
    email: 'john@company.com',
    phone: '1234567892',
    position: 'Software Developer',
    salary: 70000,
    joinDate: new Date('2023-03-10')
  },
  {
    employeeId: 'EMP004',
    firstName: 'Jane',
    lastName: 'Employee',
    email: 'jane@company.com',
    phone: '1234567893',
    position: 'Marketing Specialist',
    salary: 65000,
    joinDate: new Date('2023-04-05')
  }
];

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Department.deleteMany({});
    await Employee.deleteMany({});

    console.log('Data cleared...');

    // Create departments
    const createdDepartments = await Department.insertMany(departments);
    console.log(`${createdDepartments.length} departments created`);

    // Create users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);

    // Create employees with department references
    const employeesWithDept = employees.map((emp, index) => ({
      ...emp,
      department: createdDepartments[index % createdDepartments.length]._id,
      user: createdUsers[index]._id
    }));

    const createdEmployees = await Employee.insertMany(employeesWithDept);
    console.log(`${createdEmployees.length} employees created`);

    console.log('Seed data created successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: admin@company.com / Admin123!');
    console.log('HR: hr@company.com / HrManager123!');
    console.log('Employee: john@company.com / Employee123!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
