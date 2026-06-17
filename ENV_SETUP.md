# Environment Setup Guide

This file explains all the configuration options for the Password History Tracker application.

## Backend Configuration (.env)

Create `backend/.env` from `backend/.env.example`:

### Database Configuration
```bash
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/password-history-tracker

# Or use MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/password-history-tracker
```

### Server Configuration
```bash
# Server port
PORT=5000

# Environment mode
NODE_ENV=development  # or 'production'

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### JWT Configuration
```bash
# Secret key for JWT tokens (generate a random string!)
JWT_SECRET=your-super-secret-jwt-key-generate-random-string

# JWT token expiration
JWT_EXPIRY=7d
```

### Password Policy
```bash
# Minimum password length
MIN_PASSWORD_LENGTH=8

# Password expiration days
PASSWORD_EXPIRY_DAYS=90

# Number of previous passwords to check for reuse
PREVENT_REUSE_COUNT=5
```

### Security Configuration
```bash
# Account lockout settings
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME=15  # minutes

# Bcrypt hash rounds (higher = more secure but slower)
BCRYPT_ROUNDS=10

# Rate limiting
RATE_LIMIT_WINDOW=15  # minutes
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
PASSWORD_RATE_LIMIT_MAX=3
```

### Example Backend .env
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/password-history-tracker

# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRY=7d

# Password Policy
MIN_PASSWORD_LENGTH=8
PASSWORD_EXPIRY_DAYS=90
PREVENT_REUSE_COUNT=5

# Security
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME=15
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
PASSWORD_RATE_LIMIT_MAX=3
```

---

## Frontend Configuration (.env)

Create `frontend/.env` from `frontend/.env.example`:

### API Configuration
```bash
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

### Example Frontend .env
```bash
VITE_API_URL=http://localhost:5000/api
```

---

## 🔐 Security Best Practices

### Development Environment
```bash
# Safe defaults for development
JWT_SECRET=dev-key-not-for-production
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Production Environment
```bash
# Generate secure random key for production
# Use: openssl rand -hex 32
JWT_SECRET=your-generated-random-hex-string

NODE_ENV=production
CLIENT_URL=https://yourdomain.com  # Your actual domain

# Stricter security settings
MAX_LOGIN_ATTEMPTS=3
BCRYPT_ROUNDS=12
PASSWORD_EXPIRY_DAYS=60
```

---

## 🚀 Generating Secure Keys

### JWT Secret (Production)
```bash
# On Mac/Linux:
openssl rand -hex 32

# On Windows PowerShell:
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Random -Count 32 | ForEach-Object {[char]$_} | Join-String)))

# Or use an online generator:
# https://generate-random.org/encryption-key-generator
```

### Example Output
```
a7f8e9c1b2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7
```

---

## 🗄️ Database Configuration

### Local MongoDB

**Windows**:
- Default: `mongodb://localhost:27017/password-history-tracker`

**Mac**:
- After installation: `mongod` starts on `mongodb://localhost:27017`

**Linux**:
- After installation: `mongod` starts on `mongodb://localhost:27017`

### MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string (looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/password-history-tracker
   ```
5. Add to backend `.env`:
   ```bash
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/password-history-tracker
   ```

---

## 🔄 Environment Variables Reference

| Variable | Default | Description |
|----------|---------|-------------|
| **MONGODB_URI** | localhost:27017 | MongoDB connection string |
| **PORT** | 5000 | Backend server port |
| **NODE_ENV** | development | Environment (dev/production) |
| **CLIENT_URL** | localhost:5173 | Frontend URL for CORS |
| **JWT_SECRET** | CHANGE_ME | Secret key for JWT |
| **JWT_EXPIRY** | 7d | Token expiration time |
| **MIN_PASSWORD_LENGTH** | 8 | Minimum password chars |
| **PASSWORD_EXPIRY_DAYS** | 90 | Password expiration days |
| **PREVENT_REUSE_COUNT** | 5 | Previous passwords to check |
| **MAX_LOGIN_ATTEMPTS** | 5 | Failed attempts before lockout |
| **LOCK_TIME** | 15 | Account lockout duration (min) |
| **BCRYPT_ROUNDS** | 10 | Password hash rounds |

---

## 📋 Deployment Environment Variables

### Heroku
```bash
heroku config:set MONGODB_URI=your_mongo_uri
heroku config:set JWT_SECRET=your_generated_secret
heroku config:set CLIENT_URL=https://your-frontend.vercel.app
heroku config:set NODE_ENV=production
```

### AWS EC2
```bash
export MONGODB_URI=your_mongo_uri
export JWT_SECRET=your_generated_secret
export CLIENT_URL=https://yourdomain.com
export NODE_ENV=production
```

### Docker
Create `.env` file and pass to Docker:
```bash
docker run --env-file .env -p 5000:5000 password-tracker
```

---

## ✅ Verification Checklist

Before starting the app, verify:

- [ ] Backend `.env` file exists and has `MONGODB_URI`
- [ ] Frontend `.env` file exists and has `VITE_API_URL`
- [ ] `JWT_SECRET` is changed from default
- [ ] MongoDB is running
- [ ] `NODE_ENV` is set to 'development' (or 'production')
- [ ] `PORT` 5000 is not in use
- [ ] `VITE_PORT` (usually 5173) is not in use

---

## 🐛 Common Configuration Issues

### Issue: Can't connect to MongoDB
**Solution**: 
- Check `MONGODB_URI` is correct
- Ensure MongoDB is running (`mongod`)
- Check database name in URI

### Issue: CORS error in browser
**Solution**:
- Verify `CLIENT_URL` matches your frontend URL
- Check that backend `.env` has correct `CLIENT_URL`

### Issue: "JWT_SECRET must be set"
**Solution**:
- Open `backend/.env`
- Ensure `JWT_SECRET` is set to a non-empty string

### Issue: Port already in use
**Solution**:
- Change `PORT` in backend `.env`
- Or kill process using the port

---

## 🔑 Quick Copy-Paste Templates

### Quick Development Setup
```bash
# backend/.env
MONGODB_URI=mongodb://localhost:27017/password-history-tracker
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRY=7d
MIN_PASSWORD_LENGTH=8
PASSWORD_EXPIRY_DAYS=90
PREVENT_REUSE_COUNT=5
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME=15
BCRYPT_ROUNDS=10
```

```bash
# frontend/.env
VITE_API_URL=http://localhost:5000/api
```

---

**Last Updated**: June 2026
**For Issues**: Check README.md or QUICK_START.md
