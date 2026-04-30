# Security Guidelines

This document outlines the security measures implemented in the Physics Learning Platform.

## Authentication & Authorization

### JWT (JSON Web Tokens)
- Tokens are issued with 7-day expiration
- Tokens contain user ID and role information
- Tokens are signed with a secret key (must be at least 32 characters)
- Tokens should never be stored in URLs or cookies (use localStorage with caution)

### Password Security
- Passwords are hashed using bcryptjs with 10 salt rounds
- Passwords must be at least 6 characters
- Passwords are never returned in API responses

### Role-Based Access Control
Three roles are implemented:
- **admin**: Full access to admin endpoints
- **editor**: Can create and edit content
- **viewer**: Can only view content

## Rate Limiting

Rate limits are implemented to prevent abuse:

| Endpoint Type | Limit | Window |
|---|---|---|
| General API | 100 requests | 15 minutes |
| Authentication | 5 attempts | 15 minutes |
| Admin | 100 requests | 1 minute |
| File Upload | 50 uploads | 1 hour |

When rate limit is exceeded, requests are rejected with HTTP 429.

## Input Validation

All user inputs are validated using Joi schema validation:

- Email format validation
- Password length requirements
- String length limits
- Required field validation
- Type checking
- Enum validation for status/role fields

Invalid inputs result in HTTP 400 with detailed error messages.

## CORS Protection

- Cross-Origin Resource Sharing is restricted to configured frontend URL
- Only `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS` methods allowed
- Required headers: `Content-Type`, `Authorization`, `X-Requested-With`

## Security Headers

The API sets these security headers on all responses:

- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `Referrer-Policy: no-referrer` - Controls referrer information
- `Permissions-Policy` - Disables dangerous permissions (geolocation, microphone, camera)
- `Helmet.js` - Additional HTTP headers for security

## CSRF Protection

Admin state-changing requests require the `X-Requested-With: XMLHttpRequest` header to prevent CSRF attacks.

## Environment Variables

All sensitive information is stored in environment variables:

- `MONGO_URI` - Database connection string
- `JWT_SECRET` - Token signing secret (must be strong)
- `CLOUDINARY_API_SECRET` - File upload service secret
- Never commit `.env` files to version control

## Database Security

- MongoDB connection uses TLS/SSL encryption
- Database connection pooling with size limits
- Query injection protection through Mongoose schema validation
- Indexed fields for efficient and secure queries

## API Security Best Practices

### Always
- Use HTTPS in production
- Validate all inputs server-side
- Never trust client-side validation alone
- Use strong JWT secrets (minimum 32 characters)
- Keep dependencies updated
- Log security-relevant events

### Never
- Return sensitive data in error messages
- Expose database structure in responses
- Store plain-text passwords
- Disable CORS in production
- Use weak JWT secrets
- Disable rate limiting in production

## Monitoring & Logging

All requests are logged with Morgan middleware, including:
- Request method and path
- Response status
- Request duration
- IP address

Errors are logged with full stack traces (in development mode only).

## Frontend Security

### Token Management
- Tokens stored in localStorage
- Token expiry is checked before each API call
- Tokens are cleared on logout
- Automatic logout on token expiration
- Warning displayed when token is expiring soon

### API Communication
- All API calls include JWT token in Authorization header
- 401 responses automatically trigger logout
- Timeout set to 30 seconds for all requests

### Protected Routes
- Admin routes require authentication and admin role
- Protected routes redirect to login if not authenticated

## File Upload Security

- File type validation (PDFs, images)
- File size limits enforced
- Files stored in Cloudinary (secure cloud storage)
- Files served with proper Content-Type headers
- PDF files served inline (not as downloads)

## Testing Security

Run security tests:
```bash
npm test
```

Audit dependencies:
```bash
npm audit
npm audit fix
```

## Incident Response

If a security vulnerability is discovered:

1. **Do not** disclose publicly
2. Contact the development team
3. Verify and patch the vulnerability
4. Deploy the patch
5. Document the incident

## Compliance

This platform implements security measures aligned with:
- OWASP Top 10 Prevention
- GDPR data protection principles
- Standard API security practices

## Regular Security Maintenance

- Update dependencies monthly: `npm update`
- Review security audit: `npm audit`
- Monitor error logs for suspicious activity
- Rotate JWT secrets periodically
- Review access logs for unauthorized attempts

---

For security concerns or to report vulnerabilities, please contact the development team.
