# Employee Management API

A comprehensive backend API for employee management with authentication, attendance tracking, email notifications, and report generation built with NestJS v11.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)

## 🛠 Tech Stack

- **NestJS v11** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **TypeORM** - ORM for database operations
- **MySQL** - Relational database
- **PassportJS & JWT** - Authentication
- **Bull & Redis** - Queue management
- **jsPDF** - PDF report generation
- **ExcelJS** - Excel report generation
- **Jest** - Unit and E2E testing
- **Swagger** - API documentation

## ✨ Features

### 1. Authentication System
- User registration with email and password
- JWT-based authentication
- Login/Logout functionality
- Password reset with secure tokens
- Email notifications for password reset

### 2. Employee Management
- Full CRUD operations for employees
- Fields: names, email, employeeIdentifier, phoneNumber
- Unique constraints on email and identifier
- Protected routes with JWT authentication

### 3. Attendance Tracking
- Check-in/Check-out functionality
- One record per employee per day
- Automatic email notifications on attendance events
- Date-based attendance queries

### 4. Email Notifications
- Queue-based email processing using Bull
- Attendance notifications
- Password reset emails
- Console-based email service (ready for SMTP integration)

### 5. Report Generation
- PDF attendance reports by date
- Excel attendance reports by date
- Employee details with check-in/check-out times

### 6. API Documentation
- Interactive Swagger UI
- Complete endpoint documentation
- Request/Response schemas

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher)
- **MySQL** (v8 or higher)
- **Redis** (v6 or higher)

## 🚀 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd employee-management-api
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up MySQL database**
```bash
# Create database
mysql -u root -p
CREATE DATABASE employee_management;
exit;
```

4. **Start Redis server**
```bash
# macOS (using Homebrew)
brew services start redis

# Linux
sudo systemctl start redis

# Or run Redis in Docker
docker run -d -p 6379:6379 redis:7-alpine
```

## ⚙️ Configuration

1. **Create environment file**
```bash
cp .env.example .env
```

2. **Configure environment variables**

Edit `.env` file with your settings:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=employee_management

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=1d

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# Application
PORT=3000
NODE_ENV=development
```

## 🏃 Running the Application

### Development Mode
```bash
pnpm start:dev
```

### Production Mode
```bash
# Build the application
pnpm build

# Start production server
pnpm start:prod
```

### Watch Mode
```bash
pnpm start:watch
```

The application will start on `http://localhost:3000`

## 📚 API Documentation

Once the application is running, access the interactive Swagger documentation at:

```
http://localhost:3000/api
```

### Main Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

#### Employees (Protected)
- `POST /employees` - Create employee
- `GET /employees` - Get all employees
- `GET /employees/:id` - Get employee by ID
- `PUT /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee

#### Attendance (Protected)
- `POST /attendance/check-in` - Check in employee
- `POST /attendance/check-out` - Check out employee
- `GET /attendance?date=YYYY-MM-DD` - Get attendance by date

#### Reports (Protected)
- `GET /reports/attendance/pdf?date=YYYY-MM-DD` - Download PDF report
- `GET /reports/attendance/excel?date=YYYY-MM-DD` - Download Excel report

## 🧪 Testing

### Run Unit Tests
```bash
pnpm test
```

### Run E2E Tests
```bash
pnpm test:e2e
```

### Run Tests with Coverage
```bash
pnpm test:cov
```

### Watch Mode
```bash
pnpm test:watch
```

## 📁 Project Structure

```
src/
├── auth/                   # Authentication module
│   ├── dto/               # Data transfer objects
│   ├── strategies/        # Passport strategies
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/                 # Users module
│   ├── entities/
│   ├── users.service.ts
│   └── users.module.ts
├── employees/             # Employees module
│   ├── dto/
│   ├── entities/
│   ├── employees.controller.ts
│   ├── employees.service.ts
│   └── employees.module.ts
├── attendance/            # Attendance module
│   ├── dto/
│   ├── entities/
│   ├── attendance.controller.ts
│   ├── attendance.service.ts
│   └── attendance.module.ts
├── mail/                  # Email service
│   ├── mail.service.ts
│   └── mail.module.ts
├── queue/                 # Queue processing
│   ├── email.processor.ts
│   └── queue.module.ts
├── reports/               # Report generation
│   ├── reports.controller.ts
│   ├── reports.service.ts
│   └── reports.module.ts
├── database/              # Database configuration
│   └── database.module.ts
├── common/                # Shared resources
│   └── guards/
│       └── jwt-auth.guard.ts
├── app.module.ts
└── main.ts
```

## 🔐 Authentication Flow

1. **Register**: Create an account with email and password
2. **Login**: Receive JWT access token
3. **Use Token**: Include token in Authorization header: `Bearer <token>`
4. **Protected Routes**: All employee, attendance, and report endpoints require authentication

## 📧 Email Configuration

Currently, email notifications are logged to the console. To enable actual email sending:

1. Update `.env` with SMTP credentials:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@employeemanagement.com
```

2. Modify `src/mail/mail.service.ts` to use nodemailer with your SMTP configuration.

## 🔄 CI/CD

GitHub Actions workflow is configured to:
- Run on pull requests to `master` and `development` branches
- Set up MySQL and Redis services
- Install dependencies
- Run unit tests
- Run E2E tests

## 🐛 Troubleshooting

### MySQL Connection Issues
- Ensure MySQL is running: `mysql.server status`
- Check credentials in `.env` file
- Verify database exists: `SHOW DATABASES;`

### Redis Connection Issues
- Check Redis is running: `redis-cli ping`
- Should return `PONG`
- Verify port 6379 is available

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using port 3000:
```bash
lsof -ti:3000 | xargs kill -9
```

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Dushime Brother

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.
