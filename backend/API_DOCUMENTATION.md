# Physics Learning Platform - API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

Tokens expire in 7 days from issue time.

---

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer"
  }
}
```

**Validation Errors (400):**
```json
{
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**Error: Email Already Exists (400):**
```json
{
  "message": "User with this email already exists"
}
```

---

### POST /auth/login
Login to existing account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer"
  }
}
```

**Error: Invalid Credentials (401):**
```json
{
  "message": "Invalid email or password"
}
```

---

### POST /auth/admin-login
Admin login (only for users with admin role).

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "adminPassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Admin login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Error: User Not Admin (403):**
```json
{
  "message": "Only admins can access this endpoint"
}
```

---

## Admin Endpoints
All endpoints require authentication and admin role.

**Headers:**
```
Authorization: Bearer <token>
X-Requested-With: XMLHttpRequest
```

### GET /admin/stats
Get platform statistics.

**Response (200 OK):**
```json
{
  "users": 150,
  "posts": 45,
  "materials": 320,
  "chapters": 128
}
```

---

### GET /admin/users
List all users.

**Response (200 OK):**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "viewer",
    "createdAt": "2024-01-15T10:30:00Z"
  }
]
```

---

### POST /admin/users
Create a new user account.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePassword123",
  "role": "editor"
}
```

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "editor"
  }
}
```

---

### PUT /admin/users/:id
Update user information.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "role": "admin"
}
```

**Response (200 OK):**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "admin"
  }
}
```

---

### DELETE /admin/users/:id
Delete a user account.

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

---

## Rate Limiting

The API implements rate limiting to protect against abuse:

- **General endpoints**: 100 requests per 15 minutes per IP
- **Auth endpoints**: 5 attempts per 15 minutes per IP
- **Admin endpoints**: 100 requests per 1 minute per IP
- **File uploads**: 50 uploads per hour per IP

When rate limit is exceeded, the response is:
```json
{
  "message": "Too many requests, please try again later."
}
```

HTTP Status: 429 Too Many Requests

---

## Error Handling

### Standard Error Response Format
```json
{
  "message": "Error description"
}
```

### HTTP Status Codes

- **200 OK** - Request successful
- **201 Created** - Resource created successfully
- **400 Bad Request** - Validation error or missing required fields
- **401 Unauthorized** - Missing or invalid authentication token
- **403 Forbidden** - User doesn't have permission for this resource
- **404 Not Found** - Resource not found
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - Server error

---

## Token Expiry

Tokens expire after 7 days. When a token expires, you must log in again to get a new token.

**Expired Token Response:**
```json
{
  "message": "Token expired"
}
```

---

## Security Headers

All responses include these security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: no-referrer`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`

---

## CORS Policy

The API only accepts requests from configured frontend URL:
```
FRONTEND_URL=http://localhost:5173
```

Cross-origin requests from other domains will be rejected.

---

## Example Request (using cURL)

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Admin Stats (with token)
```bash
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Environment Variables

Create a `.env` file with the following variables:

```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/db
JWT_SECRET=your-secret-key-at-least-32-characters
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

See `.env.example` for complete reference.
