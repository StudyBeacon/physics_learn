import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/db.js"

// Load env vars
dotenv.config()

// Initialize app
const app = express()

// Middleware
app.use(express.json())

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

// Basic security headers and strict CORS
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
app.set('trust proxy', 1)
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
  res.send("API is running...")
})

// Routes
import authRoutes from "./routes/authRoutes.js"
import yearRoutes from "./routes/yearRoutes.js"
import subjectRoutes from "./routes/subjectRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import chapterNoteRoutes from "./routes/chapterNoteRoutes.js"
import pastQuestionRoutes from "./routes/pastQuestionRoutes.js"

app.use("/api/auth", authRoutes)
app.use("/api/years", yearRoutes)
app.use("/api/subjects", subjectRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/chapter-notes", chapterNoteRoutes)
app.use("/api/past-questions", pastQuestionRoutes)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`)
})
