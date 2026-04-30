# Deployment Guide

## Prerequisites

- Node.js 16+
- MongoDB Atlas account or local MongoDB
- Cloudinary account (for file uploads)
- Vercel/Heroku account (optional, for hosting)

## Environment Setup

### 1. Backend Environment Variables

Create `.env` file in the backend directory:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/physics-learning-platform?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-very-secure-random-secret-at-least-32-characters-long

# Server
NODE_ENV=production
PORT=5000

# Frontend
FRONTEND_URL=https://yourdomain.com

# Cloudinary (file uploads)
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 2. Frontend Environment Variables

Create `.env` file in the frontend directory:

```env
VITE_API_URL=https://api.yourdomain.com
```

## Backend Deployment

### Option 1: Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku App**
   ```bash
   cd backend
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGO_URI="your-mongodb-uri"
   heroku config:set JWT_SECRET="your-secret"
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL="https://yourdomain.com"
   heroku config:set CLOUDINARY_NAME="your-name"
   heroku config:set CLOUDINARY_API_KEY="your-key"
   heroku config:set CLOUDINARY_API_SECRET="your-secret"
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **View Logs**
   ```bash
   heroku logs --tail
   ```

### Option 2: Railway.app Deployment

1. **Connect Repository**
   - Go to railway.app
   - Create new project
   - Connect your GitHub repository

2. **Set Environment Variables**
   - Add all variables from `.env` file

3. **Deploy**
   - Railway automatically deploys on push

### Option 3: DigitalOcean/AWS Deployment

1. **SSH into Server**
   ```bash
   ssh root@your-server-ip
   ```

2. **Install Node.js and PM2**
   ```bash
   curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   sudo npm install -g pm2
   ```

3. **Clone Repository**
   ```bash
   git clone your-repo-url
   cd bsc-physics-platform/backend
   npm install
   ```

4. **Create `.env` File**
   ```bash
   nano .env
   # Add all environment variables
   ```

5. **Start with PM2**
   ```bash
   pm2 start src/server.js --name "physics-api"
   pm2 startup
   pm2 save
   ```

6. **Setup Reverse Proxy (Nginx)**
   ```bash
   sudo apt-get install nginx
   sudo nano /etc/nginx/sites-available/default
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   ```bash
   sudo systemctl restart nginx
   ```

7. **Setup SSL with Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d api.yourdomain.com
   ```

## Frontend Deployment

### Option 1: Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables in Vercel Dashboard**
   - Go to project settings
   - Add `VITE_API_URL`

### Option 2: Netlify Deployment

1. **Connect Repository**
   - Go to netlify.com
   - Click "New site from Git"
   - Select your repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment Variables**
   - Add `VITE_API_URL` in site settings

### Option 3: AWS S3 + CloudFront

1. **Build**
   ```bash
   cd frontend
   npm run build
   ```

2. **Upload to S3**
   ```bash
   aws s3 sync dist/ s3://your-bucket-name
   ```

3. **Create CloudFront Distribution**
   - S3 bucket as origin
   - Enable HTTPS

## Database Setup

### MongoDB Atlas

1. Go to mongodb.com/cloud
2. Create cluster
3. Add IP whitelist (allow all for development)
4. Create database user
5. Get connection string
6. Add to `.env` as `MONGO_URI`

### Initial Seed Data

```bash
cd backend
npm run seed
```

## Post-Deployment Checklist

- [ ] Environment variables set correctly
- [ ] Database connected and seeded
- [ ] CORS configured with correct frontend URL
- [ ] SSL certificates installed (HTTPS)
- [ ] Cloudinary credentials working
- [ ] API responding to requests
- [ ] Authentication working
- [ ] Admin panel accessible
- [ ] Rate limiting active
- [ ] Error logging working
- [ ] Backups configured
- [ ] Monitoring setup (optional)

## Performance Optimization

### Backend
```bash
# Enable compression
npm install compression
```

Update `server.js`:
```javascript
import compression from 'compression';
app.use(compression());
```

### Frontend
- Build with: `npm run build`
- Gzip compression enabled
- Code splitting configured in Vite
- Images optimized

## Monitoring & Maintenance

### Health Check
```bash
curl https://api.yourdomain.com/
```

Response should be:
```json
{
  "message": "✅ Physics Learning Platform API is running",
  "version": "1.0.0"
}
```

### Log Management
- Heroku: `heroku logs --tail`
- Custom server: Check `/var/log/pm2/` or application logs

### Database Backups
- MongoDB Atlas: Automated daily backups
- Manual backup: `mongodump`
- Store backups securely

## Troubleshooting

### Cannot Connect to Database
- Check MONGO_URI in `.env`
- Verify IP is whitelisted in MongoDB Atlas
- Test connection: `mongosh "mongodb_uri"`

### 401 Unauthorized on Protected Routes
- Check JWT_SECRET matches between deployments
- Verify token hasn't expired
- Clear browser cache and re-login

### Rate Limiting Too Strict
- Adjust limits in `src/middleware/rateLimiter.js`
- Deploy changes and restart server

### File Upload Not Working
- Verify Cloudinary credentials
- Check file size limits
- Test Cloudinary API key

## Rollback Procedure

```bash
# Heroku
heroku releases
heroku rollback v123

# Git-based deployments
git revert <commit-hash>
git push

# Manual servers
pm2 stop all
git checkout previous-version
npm install
pm2 start src/server.js
```

## Scaling

For high traffic:
- Use load balancer
- Horizontal scaling with multiple instances
- Redis caching layer
- CDN for static assets
- Database read replicas

## Security Hardening

- [ ] Update Node.js to latest LTS
- [ ] Run `npm audit fix`
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up DDoS protection
- [ ] Enable database encryption
- [ ] Regular security audits

---

For issues or questions, refer to the API documentation or security guidelines.
