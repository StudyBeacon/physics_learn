import express from "express"
import dotenv from "dotenv"
import helmet from "helmet"
import morgan from "morgan"
import connectDB from "./config/db.js"
import { validateEnv } from "./config/envValidation.js"
import { errorHandler, asyncHandler } from "./middleware/errorHandler.js"
import { generalLimiter, authLimiter } from "./middleware/rateLimiter.js"

// Load env vars
dotenv.config()

// Validate environment variables
validateEnv()

// Initialize app
const app = express()

// Trust proxy
app.set('trust proxy', 1)

// Security middleware
app.use(helmet())

// Logging middleware
app.use(morgan('combined'))

// Body parser
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// General rate limiting
app.use(generalLimiter)

// Serve uploaded files with proper headers for PDFs
app.use('/uploads', (req, res, next) => {
  if (req.path.endsWith('.pdf')) {
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline') // Display instead of download
  }
  next()
}, express.static('uploads'))

// Serve past-questions uploads with proper headers for PDFs
app.use('/uploads/past-questions', (req, res, next) => {
  if (req.path.endsWith('.pdf')) {
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'inline') // Display instead of download
  }
  next()
}, express.static('uploads/past-questions'))

// Serve past-questions images
app.use('/uploads/past-questions-images', express.static('uploads/past-questions-images'))

// CORS and security headers
const FRONTEND_URL = process.env.FRONTEND_URL
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'no-referrer')
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')
  res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL)
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

// Connect DB
connectDB(process.env.MONGO_URI)

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "✅ Physics Learning Platform API is running", version: "1.0.0" })
})

// Routes
import authRoutes from "./routes/authRoutes.js"
import yearRoutes from "./routes/yearRoutes.js"
import subjectRoutes from "./routes/subjectRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import chapterNoteRoutes from "./routes/chapterNoteRoutes.js"
import pastQuestionRoutes from "./routes/pastQuestionRoutes.js"

app.use("/api/auth", authLimiter, authRoutes)
app.use("/api/years", yearRoutes)
app.use("/api/subjects", subjectRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/chapter-notes", chapterNoteRoutes)
app.use("/api/past-questions", pastQuestionRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Error handling middleware (MUST be last)
app.use(errorHandler)

// Start server
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})
