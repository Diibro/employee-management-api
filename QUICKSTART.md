# Quick Start Guide

## Immediate Setup (5 minutes)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and set:
- `DB_PASSWORD` - your MySQL root password
- `JWT_SECRET` - any random secure string

### 3. Create Database
```bash
mysql -u root -p
CREATE DATABASE employee_management;
exit;
```

### 4. Start Redis (Choose one)
```bash
# Option 1: macOS Homebrew
brew services start redis

# Option 2: Docker
docker run -d -p 6379:6379 redis:7-alpine

# Option 3: Linux
sudo systemctl start redis
```

### 5. Run the Application
```bash
pnpm start:dev
```

### 6. Access Swagger Documentation
Open browser: http://localhost:3000/api

## Testing the API

### 1. Register a User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "password123"}'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "password123"}'
```

Copy the `access_token` from the response.

### 3. Create an Employee (use your token)
```bash
curl -X POST http://localhost:3000/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "names": "John Doe",
    "email": "john.doe@company.com",
    "employeeIdentifier": "EMP001",
    "phoneNumber": "+1234567890"
  }'
```

### 4. Check In Employee
```bash
curl -X POST http://localhost:3000/attendance/check-in \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"employeeId": "EMPLOYEE_ID_FROM_STEP_3"}'
```

### 5. Get Attendance Report
```bash
# Today's date in format YYYY-MM-DD
curl -X GET "http://localhost:3000/attendance?date=2026-02-08" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Download PDF Report
Visit in browser (with authentication):
```
http://localhost:3000/reports/attendance/pdf?date=2026-02-08
```

## Run Tests

```bash
# Unit tests
pnpm test

# E2E tests (requires database connection)
pnpm test:e2e

# Coverage
pnpm test:cov
```

## Troubleshooting

### MySQL Error: "Access denied"
- Check DB_USERNAME and DB_PASSWORD in .env
- Try: `mysql -u root -p` to verify credentials

### Redis Error: "Connection refused"
- Check Redis is running: `redis-cli ping`
- Should return: `PONG`

### Port 3000 already in use
- Change PORT in .env file
- Or kill process: `lsof -ti:3000 | xargs kill -9`

### TypeORM sync issues
- Set `synchronize: true` in development (already configured)
- For production, use migrations

## Default Configuration

- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/api
- **Database**: localhost:3306
- **Redis**: localhost:6379

## Project Features Status

✅ Authentication (Register, Login, Logout, Password Reset)
✅ Employee CRUD (Create, Read, Update, Delete)
✅ Attendance Tracking (Check-in, Check-out)
✅ Email Notifications (Console-based, Queue processing)
✅ Report Generation (PDF, Excel)
✅ API Documentation (Swagger)
✅ Unit Tests (20 tests passing)
✅ E2E Tests
✅ GitHub Actions CI
✅ TypeScript strict mode
✅ Validation with class-validator
✅ JWT Authentication
✅ Bull Queue with Redis

## Production Deployment Checklist

- [ ] Change JWT_SECRET to a secure random string
- [ ] Set NODE_ENV=production
- [ ] Configure real SMTP for email sending
- [ ] Set up proper database with migrations
- [ ] Configure Redis with persistence
- [ ] Set up SSL/TLS certificates
- [ ] Configure CORS for your frontend domain
- [ ] Set up logging and monitoring
- [ ] Configure rate limiting
- [ ] Set up backup strategy for database
