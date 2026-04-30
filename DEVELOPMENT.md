# Development Guide

This guide helps you set up and work with the Physics Learning Platform in development mode.

## Project Structure

```
bsc-physics-platform/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── server.js       # Express app entry point
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   └── validation/     # Joi schemas
│   ├── __tests__/          # Test files
│   └── package.json
│
└── frontend/                # React + Vite app
    ├── src/
    │   ├── App.jsx         # Main component
    │   ├── pages/          # Page components
    │   ├── components/     # Reusable components
    │   ├── hooks/          # Custom React hooks
    │   ├── utils/          # Utility functions
    │   ├── api/            # API client
    │   └── main.jsx        # Entry point
    └── package.json
```

## Prerequisites

- Node.js 18+ (download from nodejs.org)
- MongoDB (local or Atlas)
- Git
- Code editor (VS Code recommended)

## Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/bsc-physics-platform.git
cd bsc-physics-platform
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGO_URI=mongodb://localhost:27017/physics-learning-platform
JWT_SECRET=dev-secret-key-minimum-32-characters-long-okay
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173
```

Start development server:
```bash
npm run dev
```

Server runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

Start development server:
```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

## Running Tests

### Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Development Workflow

### Adding a New Feature

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature-name
   ```

2. **Backend Changes**
   ```bash
   # Add validation schema in src/validation/schemas.js
   # Create/update controller in src/controllers/
   # Create/update route in src/routes/
   # Update tests in __tests__/
   ```

3. **Frontend Changes**
   ```bash
   # Create/update page in src/pages/
   # Create/update component in src/components/
   # Update API calls in src/api/
   ```

4. **Test Changes**
   ```bash
   npm test
   npm run dev
   ```

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   git push origin feature/new-feature-name
   ```

6. **Create Pull Request** on GitHub

### Code Style Guidelines

**JavaScript/Node.js:**
- Use `const` by default, `let` if needed
- Use arrow functions
- Use destructuring
- Use async/await for promises
- Add JSDoc comments for functions

Example:
```javascript
/**
 * Get user by ID
 * @param {string} userId - User MongoDB ID
 * @returns {Promise<Object>} User object
 * @throws {Error} If user not found
 */
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new AppError('User not found', 404);
  res.json(user);
});
```

**React:**
- Use functional components
- Use hooks (useState, useEffect, useContext)
- Use descriptive component names
- Props should be destructured
- Add PropTypes or TypeScript

Example:
```javascript
export function UserCard({ user, onDelete }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await API.delete(`/users/${user.id}`);
      onDelete(user.id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={handleDelete} disabled={loading}>
        Delete
      </button>
    </div>
  );
}
```

## Database Management

### MongoDB Local Setup

```bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu)
sudo apt-get install -y mongodb

# Windows
# Download installer from mongodb.com
```

### Seed Database

```bash
cd backend
npm run seed
```

This creates initial data including an admin user.

### Database Tools

**MongoDB Compass** (GUI):
```bash
# Download from mongodb.com/products/compass
```

**MongoDB Shell** (CLI):
```bash
# Connect to local database
mongosh mongodb://localhost:27017

# List databases
show databases

# Use specific database
use physics-learning-platform

# View collections
show collections

# Query users
db.users.find()
```

## API Testing

### Using Postman

1. Download from postman.com
2. Import collection: `backend/postman-collection.json`
3. Set environment variables in Postman
4. Test endpoints

### Using cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Get admin stats (replace TOKEN)
curl -X GET http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer TOKEN"
```

## Debugging

### Backend Debugging

**VS Code Debug Configuration** (`.vscode/launch.json`):
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Backend",
      "program": "${workspaceFolder}/backend/src/server.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

**Console Logging**
```javascript
console.log('Debug:', variable); // General log
console.error('Error:', error);  // Error log
console.warn('Warning:', message); // Warning log
```

### Frontend Debugging

1. Open DevTools: `F12` or `Ctrl+Shift+I`
2. Check Console tab for errors
3. Use React DevTools browser extension
4. Use Redux DevTools if applicable

## Common Issues

### Port Already in Use

```bash
# macOS/Linux - Find and kill process
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB Connection Error

```bash
# Check MongoDB is running
mongosh

# If fails, start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux
```

### CORS Error

- Check `FRONTEND_URL` matches frontend URL
- Verify `Access-Control-Allow-Origin` header

### Token Expired

- Log out and log back in
- Token expires in 7 days
- Check browser console for expiry warnings

### File Upload Not Working

- Verify Cloudinary credentials in `.env`
- Check file size limits
- Verify file format is allowed

## Performance Tips

### Backend
- Use database indexes for frequently queried fields
- Implement pagination for large datasets
- Cache responses when appropriate
- Monitor slow queries with MongoDB profiler

### Frontend
- Use React.lazy() for code splitting
- Implement image optimization
- Minimize re-renders with useMemo/useCallback
- Use Chrome DevTools Performance tab

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes
git add .
git commit -m "feat: description"

# Push and create PR
git push origin feature/feature-name

# After merge
git checkout main
git pull
git branch -d feature/feature-name
```

## Useful Commands

```bash
# Backend
cd backend
npm run dev          # Start dev server
npm test             # Run tests
npm audit            # Check vulnerabilities
npm run seed         # Seed database

# Frontend
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview build

# Git
git status           # Check status
git log              # View commit history
git diff             # Show changes
git stash            # Temporary save changes
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request
6. Wait for code review
7. Merge to main

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Mongoose Documentation](https://mongoosejs.com/)

## Support

For issues or questions:
- Check existing GitHub issues
- Create new issue with detailed description
- Join development Discord channel (if available)
