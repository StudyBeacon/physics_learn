// Environment validation
export const validateEnv = () => {
  const requiredEnvVars = [
    'MONGO_URI',
    'JWT_SECRET',
    'NODE_ENV'
  ];

  const optionalEnvVars = {
    'PORT': '5000',
    'FRONTEND_URL': 'http://localhost:5173',
    'CLOUDINARY_NAME': '',
    'CLOUDINARY_API_KEY': '',
    'CLOUDINARY_API_SECRET': ''
  };

  // Check required variables
  const missingVars = [];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(v => console.error(`   - ${v}`));
    process.exit(1);
  }

  // Set defaults for optional variables
  for (const [key, defaultValue] of Object.entries(optionalEnvVars)) {
    if (!process.env[key]) {
      process.env[key] = defaultValue;
      if (defaultValue) {
        console.warn(`⚠️  Using default value for ${key}`);
      }
    }
  }

  // Validate NODE_ENV
  const validNodeEnvs = ['development', 'production', 'testing'];
  if (!validNodeEnvs.includes(process.env.NODE_ENV)) {
    console.error(`❌ Invalid NODE_ENV: ${process.env.NODE_ENV}. Must be one of: ${validNodeEnvs.join(', ')}`);
    process.exit(1);
  }

  // Warn if JWT_SECRET is too short
  if (process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  JWT_SECRET is less than 32 characters. Consider using a stronger secret.');
  }

  // Warn if in production without certain variables
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY) {
      console.warn('⚠️  Cloudinary credentials not set. File uploads may not work.');
    }
  }

  console.log('✅ Environment validation passed');
};
