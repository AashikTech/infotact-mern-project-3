# Enterprise HRMS & Payroll Automation

A comprehensive Human Resource Management System (HRMS) and Payroll Automation platform built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

### Week 1: Secure Backend Architecture
- Express.js server with MongoDB connection
- JWT authentication system
- Bcrypt password hashing (12 rounds)
- Role-Based Access Control (RBAC) middleware
- Helmet.js for HTTP security headers
- Rate limiting for API protection
- CORS configuration

### Week 2: Database Design & API
- Employee Mongoose schema
- Department Mongoose schema
- Leave Request schema
- Payroll schema
- MongoDB aggregations with $lookup
- Seed data script

### Week 3: Frontend Development
- Vite + React project setup
- Tailwind CSS v4 styling
- Authentication pages (Login/Register)
- Protected dashboard layout
- Employee data table component
- Leave request form
- React Query state management
- HR Manager approval dashboard

### Week 4: DevOps & Deployment
- PDF generation with PDFKit
- Payroll slip template
- Batch payroll processing API
- Dockerfile for backend
- Dockerfile for frontend
- docker-compose.yml
- GitHub Actions CI/CD pipeline

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Query
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT, bcrypt
- **Security**: Helmet.js, CORS, Rate Limiting
- **DevOps**: Docker, GitHub Actions

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB
- Docker (optional)

### Installation

1. Clone the repository
```bash
git clone https://github.com/AashikTech/infotact-mern-project-3.git
cd enterprise-hrms
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables
```bash
# Backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret

# Frontend
cp .env.example .env
# Edit .env with your API URL
```

5. Start development servers
```bash
# Backend (from backend directory)
npm run dev

# Frontend (from frontend directory)
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Employees
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Departments
- `GET /api/departments` - Get all departments
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department

### Leave Requests
- `GET /api/leaves` - Get all leave requests
- `POST /api/leaves` - Create leave request
- `PUT /api/leaves/:id/approve` - Approve leave request
- `PUT /api/leaves/:id/reject` - Reject leave request

### Payroll
- `GET /api/payroll` - Get all payroll records
- `POST /api/payroll/generate` - Generate payroll
- `GET /api/payroll/:id/payslip` - Get payslip PDF

## Project Structure

```
enterprise-hrms/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── .github/
│   └── workflows/
│       └── ci.yml
├── docker-compose.yml
├── README.md
└── .gitignore
```

## GitHub Workflow

This project follows a strict 4-week sprint workflow:

- **Week 1**: Secure Backend Architecture & RBAC
- **Week 2**: Database Design & API Development
- **Week 3**: Frontend Development
- **Week 4**: DevOps & Deployment

Each week includes:
- Feature branch development
- Issue-tracked commits
- Pull request with detailed description
- Code review and merge

## License

MIT License

## Contact

- GitHub: [AashikTech](https://github.com/AashikTech)
- Repository: [infotact-mern-project-3](https://github.com/AashikTech/infotact-mern-project-3)
