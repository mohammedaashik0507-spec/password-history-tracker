# Deployment Guide

## Production Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code reviewed
- [ ] Environment variables configured
- [ ] Database backup created
- [ ] Security audit completed

### Database Setup (MongoDB)

#### Local MongoDB
```bash
# Install MongoDB
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Connect
mongo mongodb://localhost:27017
```

#### MongoDB Atlas (Cloud)
1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Get connection string
5. Update MONGODB_URI in .env

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
```

### Backend Deployment

#### Option 1: Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create password-tracker-api

# Set buildpack for Node.js
heroku buildpacks:set heroku/nodejs

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_very_secret_key_generate_with_crypto
heroku config:set CLIENT_URL=https://your-frontend-url.com
heroku config:set BCRYPT_ROUNDS=10
heroku config:set MAX_LOGIN_ATTEMPTS=5
heroku config:set LOCK_TIME=15

# Deploy from git
git push heroku main

# View logs
heroku logs --tail
```

#### Option 2: AWS EC2

```bash
# SSH into instance
ssh -i your-key.pem ec2-user@your-ip

# Install Node.js
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Clone repository
git clone your-repo-url
cd password-tracker/backend

# Install dependencies
npm install --production

# Create .env file with production values
nano .env

# Start with PM2
pm2 start src/server.js --name "password-tracker-api"

# Save PM2 config
pm2 save
pm2 startup

# Setup Nginx as reverse proxy
# ... (configure nginx.conf)
```

#### Option 3: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
```

```bash
# Build and push
docker build -t password-tracker-api .
docker push your-docker-registry/password-tracker-api

# Run in production
docker run -d \
  --name password-tracker-api \
  -e MONGODB_URI=your_mongodb_uri \
  -e JWT_SECRET=your_secret \
  -p 5000:5000 \
  password-tracker-api
```

### Frontend Deployment

#### Option 1: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Set environment variables in Vercel dashboard
# VITE_API_URL=https://your-api-url.com/api
```

#### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist

# Or connect GitHub repo and enable auto-deploy
```

#### Option 3: AWS S3 + CloudFront

```bash
# Build
npm run build

# Create S3 bucket
aws s3 mb s3://password-tracker-app

# Upload files
aws s3 sync dist/ s3://password-tracker-app --delete

# Create CloudFront distribution
# ... (AWS Console)
```

### SSL/TLS Certificate Setup

#### Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Monitoring & Logging

#### Application Monitoring
```bash
# PM2 Monitoring
pm2 monit

# View logs
pm2 logs password-tracker-api

# Set up log rotation
pm2 install pm2-logrotate
```

#### Sentry (Error Tracking)
```bash
# Install Sentry SDK
npm install @sentry/node

# Configure in server.js
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 1.0,
});
```

#### DataDog / New Relic (APM)
- Sign up and follow integration guides
- Add environment variables
- Monitor performance and errors

### Performance Optimization

#### Backend
```javascript
// Enable gzip compression
import compression from 'compression';
app.use(compression());

// Add caching headers
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});
```

#### Frontend
```bash
# Optimize bundle
npm run build -- --analyze

# Results in dist/stats.html
```

### Security Hardening

#### Production Environment Variables
```bash
# Change all default values
JWT_SECRET=$(openssl rand -hex 32)
BCRYPT_ROUNDS=12  # Increase from 10
MAX_LOGIN_ATTEMPTS=3  # Decrease from 5
LOCK_TIME=30  # Increase from 15 minutes

# Enable CORS stricter
CLIENT_URL=https://yourdomain.com  # No wildcard
```

#### Database Security
```bash
# Enable MongoDB authentication
# Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "strong-password",
  roles: ["root"]
})

# Enable authentication in MongoDB config
security:
  authorization: enabled
```

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/password-tracker

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=general:10m rate=100r/m;
    limit_req zone=general burst=200 nodelay;

    location / {
        root /var/www/password-tracker/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### Post-Deployment Testing

```bash
# Test API health
curl https://yourdomain.com/api/health

# Test authentication
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"TestPass123!"}'

# Load testing
ab -n 1000 -c 100 https://yourdomain.com/

# Security scanning
npm install -g snyk
snyk test

# SSL testing
curl -I https://yourdomain.com
```

### Backup Strategy

#### Database Backups
```bash
# Automated daily backup (cron job)
0 2 * * * mongodump --uri "mongodb://localhost:27017/password-history-tracker" --out /backups/$(date +\%Y-\%m-\%d)

# Or with MongoDB Atlas automatic backups (enabled by default)
```

#### File Backups
```bash
# Backup environment files
tar -czf backups/env-backup-$(date +%Y-%m-%d).tar.gz .env

# Backup code
git tag production-$(date +%Y-%m-%d)
git push --tags
```

### Disaster Recovery Plan

1. **Database Failure**
   - Restore from latest backup
   - Verify data integrity
   - Test authentication
   - Monitor for errors

2. **Server Failure**
   - Deploy to new instance
   - Restore database
   - Verify all services
   - Update DNS/load balancer

3. **Security Breach**
   - Rotate all secrets immediately
   - Review audit logs
   - Force password resets
   - Notify users if needed

## Monitoring Dashboard

Key metrics to monitor:
- API response time (target: < 200ms)
- Error rate (target: < 0.1%)
- Database connection pool usage
- CPU and memory usage
- Failed login attempts
- Password expiration warnings
- User registration rate

## Maintenance Schedule

- **Daily**: Check error logs and monitoring alerts
- **Weekly**: Review security audit logs
- **Monthly**: Database maintenance and optimization
- **Quarterly**: Security audit and penetration testing
- **Annually**: Disaster recovery drill

## Support Contacts

- **Uptime Monitoring**: StatusPage.io
- **Incident Management**: PagerDuty
- **Issue Tracking**: GitHub Issues / Jira
- **On-Call Schedule**: [Your Schedule]
