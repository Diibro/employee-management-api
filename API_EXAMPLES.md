# API Endpoint Examples

## Base URL
```
http://localhost:3000
```

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (201):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### 2. Login
**POST** `/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com"
  }
}
```

### 3. Logout
**POST** `/auth/logout`

Response (200):
```json
{
  "message": "Logged out successfully"
}
```

### 4. Forgot Password
**POST** `/auth/forgot-password`

Request:
```json
{
  "email": "user@example.com"
}
```

Response (200):
```json
{
  "message": "If email exists, reset link has been sent"
}
```

### 5. Reset Password
**POST** `/auth/reset-password`

Request:
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newpassword123"
}
```

Response (200):
```json
{
  "message": "Password reset successful"
}
```

---

## Employee Endpoints (Protected - Require Bearer Token)

### 1. Create Employee
**POST** `/employees`

Headers:
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

Request:
```json
{
  "names": "John Doe",
  "email": "john.doe@company.com",
  "employeeIdentifier": "EMP001",
  "phoneNumber": "+1234567890"
}
```

Response (201):
```json
{
  "id": "uuid",
  "names": "John Doe",
  "email": "john.doe@company.com",
  "employeeIdentifier": "EMP001",
  "phoneNumber": "+1234567890",
  "createdAt": "2026-02-08T10:00:00.000Z",
  "updatedAt": "2026-02-08T10:00:00.000Z"
}
```

### 2. Get All Employees
**GET** `/employees`

Headers:
```
Authorization: Bearer <your-jwt-token>
```

Response (200):
```json
[
  {
    "id": "uuid",
    "names": "John Doe",
    "email": "john.doe@company.com",
    "employeeIdentifier": "EMP001",
    "phoneNumber": "+1234567890",
    "createdAt": "2026-02-08T10:00:00.000Z",
    "updatedAt": "2026-02-08T10:00:00.000Z"
  }
]
```

### 3. Get Employee by ID
**GET** `/employees/:id`

Headers:
```
Authorization: Bearer <your-jwt-token>
```

Response (200):
```json
{
  "id": "uuid",
  "names": "John Doe",
  "email": "john.doe@company.com",
  "employeeIdentifier": "EMP001",
  "phoneNumber": "+1234567890",
  "createdAt": "2026-02-08T10:00:00.000Z",
  "updatedAt": "2026-02-08T10:00:00.000Z"
}
```

### 4. Update Employee
**PUT** `/employees/:id`

Headers:
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

Request (all fields optional):
```json
{
  "names": "John Smith",
  "phoneNumber": "+0987654321"
}
```

Response (200):
```json
{
  "id": "uuid",
  "names": "John Smith",
  "email": "john.doe@company.com",
  "employeeIdentifier": "EMP001",
  "phoneNumber": "+0987654321",
  "createdAt": "2026-02-08T10:00:00.000Z",
  "updatedAt": "2026-02-08T11:00:00.000Z"
}
```

### 5. Delete Employee
**DELETE** `/employees/:id`

Headers:
```
Authorization: Bearer <your-jwt-token>
```

Response (200): Empty

---

## Attendance Endpoints (Protected)

### 1. Check In
**POST** `/attendance/check-in`

Headers:
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

Request:
```json
{
  "employeeId": "employee-uuid"
}
```

Response (201):
```json
{
  "id": "uuid",
  "employeeId": "employee-uuid",
  "date": "2026-02-08",
  "checkInTime": "2026-02-08T09:00:00.000Z",
  "checkOutTime": null,
  "createdAt": "2026-02-08T09:00:00.000Z"
}
```

### 2. Check Out
**POST** `/attendance/check-out`

Headers:
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

Request:
```json
{
  "employeeId": "employee-uuid"
}
```

Response (201):
```json
{
  "id": "uuid",
  "employeeId": "employee-uuid",
  "date": "2026-02-08",
  "checkInTime": "2026-02-08T09:00:00.000Z",
  "checkOutTime": "2026-02-08T17:00:00.000Z",
  "createdAt": "2026-02-08T09:00:00.000Z"
}
```

### 3. Get Attendance by Date
**GET** `/attendance?date=2026-02-08`

Headers:
```
Authorization: Bearer <your-jwt-token>
```

Response (200):
```json
[
  {
    "id": "uuid",
    "employeeId": "employee-uuid",
    "date": "2026-02-08",
    "checkInTime": "2026-02-08T09:00:00.000Z",
    "checkOutTime": "2026-02-08T17:00:00.000Z",
    "createdAt": "2026-02-08T09:00:00.000Z",
    "employee": {
      "id": "employee-uuid",
      "names": "John Doe",
      "email": "john.doe@company.com",
      "employeeIdentifier": "EMP001",
      "phoneNumber": "+1234567890"
    }
  }
]
```

---

## Report Endpoints (Protected)

### 1. Generate PDF Report
**GET** `/reports/attendance/pdf?date=2026-02-08`

Headers:
```
Authorization: Bearer <your-jwt-token>
```

Response (200):
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename=attendance-2026-02-08.pdf`
- Returns PDF file download

### 2. Generate Excel Report
**GET** `/reports/attendance/excel?date=2026-02-08`

Headers:
```
Authorization: Bearer <your-jwt-token>
```

Response (200):
- Content-Type: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- Content-Disposition: `attachment; filename=attendance-2026-02-08.xlsx`
- Returns Excel file download

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Employee not found",
  "error": "Not Found"
}
```

### 409 Conflict
```json
{
  "statusCode": 409,
  "message": "Email already exists",
  "error": "Conflict"
}
```

---

## Using with cURL

### Register and Login
```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Login and save token
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}' \
  | jq -r '.access_token')

echo $TOKEN
```

### Create and Manage Employees
```bash
# Create employee
EMPLOYEE=$(curl -X POST http://localhost:3000/employees \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "names":"John Doe",
    "email":"john@test.com",
    "employeeIdentifier":"EMP001",
    "phoneNumber":"+1234567890"
  }')

EMPLOYEE_ID=$(echo $EMPLOYEE | jq -r '.id')
echo $EMPLOYEE_ID

# Get all employees
curl -X GET http://localhost:3000/employees \
  -H "Authorization: Bearer $TOKEN"

# Check in
curl -X POST http://localhost:3000/attendance/check-in \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"employeeId\":\"$EMPLOYEE_ID\"}"

# Check out
curl -X POST http://localhost:3000/attendance/check-out \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "{\"employeeId\":\"$EMPLOYEE_ID\"}"
```

### Download Reports
```bash
# PDF Report
curl -X GET "http://localhost:3000/reports/attendance/pdf?date=2026-02-08" \
  -H "Authorization: Bearer $TOKEN" \
  -o attendance-report.pdf

# Excel Report
curl -X GET "http://localhost:3000/reports/attendance/excel?date=2026-02-08" \
  -H "Authorization: Bearer $TOKEN" \
  -o attendance-report.xlsx
```

---

## Postman Collection

Import these endpoints into Postman:
1. Create a new environment variable `baseUrl` = `http://localhost:3000`
2. Create a variable `token` to store JWT token
3. Set Authorization header: `Bearer {{token}}`

## Interactive API Documentation

For interactive testing, visit:
```
http://localhost:3000/api
```

The Swagger UI provides:
- Try it out functionality
- Request/Response examples
- Schema documentation
- Authorization configuration
