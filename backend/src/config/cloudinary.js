import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

// Ensure env vars are loaded even if this module is imported before server initializes dotenv
dotenv.config()

// Expect env vars: CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
})

export default cloudinary


