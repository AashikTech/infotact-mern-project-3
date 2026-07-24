# Enterprise HRMS & Payroll Automation

A secure, full-stack HRMS system built with MERN stack featuring role-based access control, automated payroll generation, and comprehensive employee management.

## Features

- JWT Authentication with bcrypt password hashing
- Role-Based Access Control (Employee, HR Manager, Admin)
- Leave Request Management
- Automated Payroll Processing
- PDF Payslip Generation
- MongoDB Aggregation Pipelines
- React Query State Management
- Dockerized Deployment

## Tech Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT + bcrypt
- Helmet.js, Rate Limiting
- PDFKit

**Frontend:**
- React 19 + Vite
- TailwindCSS v4
- React Router v6
- React Query

## Installation

### Local Development

1. Clone repository
```bash
git clone https://github.com/AashikTech/infotact-mern-project-3.git
cd enterprise-hrms
```

2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run seed  # Seed database
npm run dev
```

3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Docker Deployment

```bash
docker-compose up --build
```

## Demo Credentials

- **Admin:** admin@company.com / admin123
- **HR Manager:** hr@company.com / hr123
- **Employee:** john.doe@company.com / employee123

## Project Timeline

- **Week 1:** Secure API Architecture & RBAC
- **Week 2:** MongoDB Data Modeling & Aggregations
- **Week 3:** React Dashboard Development
- **Week 4:** PDF Generation & Deployment

## License

MIT License
