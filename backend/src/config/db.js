import mongoose from "mongoose"

const connectDB = async (mongoURI) => {
  try {
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10, // Maintain up to 10 socket connections
      retryWrites: true,
      w: 'majority'
    })
    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message)
    console.log("🔄 Retrying connection in 5 seconds...")
    setTimeout(() => {
      connectDB(mongoURI)
    }, 5000)
  }
}

export default connectDB
