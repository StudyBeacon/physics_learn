 import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import connectDB from '../config/db.js'
import User from '../models/User.js'

dotenv.config()

const email = 'yogesrai978@gmail.com'
const password = 'Yogesh@9880'
const name = 'Admin User'

await connectDB(process.env.MONGO_URI)

const existing = await User.findOne({ email })
const salt = await bcrypt.genSalt(10)
const hashed = await bcrypt.hash(password, salt)

if (existing) {
  existing.password = hashed
  existing.role = 'admin'
  existing.name = existing.name || name
  await existing.save()
  console.log('Updated existing user to admin:', email)
} else {
  await User.create({ name, email, password: hashed, role: 'admin' })
  console.log('Created admin user:', email)
}

process.exit(0)


