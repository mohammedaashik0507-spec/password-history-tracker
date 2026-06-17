# Password History Tracker

A production-quality full-stack web application for secure password management and history tracking.

## 🌟 Features

### Authentication & Security
- ✅ User Registration & Login with JWT
- ✅ Role-based Authorization (Admin/User)
- ✅ Account Lockout after 5 failed attempts
- ✅ Secure password hashing with bcrypt
- ✅ Password expiration warnings
- ✅ Two-factor authentication ready

### Password Management
- ✅ Password history tracking (prevents reuse of last 5 passwords)
- ✅ Password strength meter with recommendations
- ✅ Password expiration policy (90 days)
- ✅ Password complexity validation
- ✅ Secure password change functionality
- ✅ Password status monitoring

### User Dashboard
- ✅ Security score calculation
- ✅ Password status display
- ✅ Last password change date
- ✅ Password history summary
- ✅ Expiration warnings

### Admin Dashboard
- ✅ User management
- ✅ Security audit logs
- ✅ Failed login attempts tracking
- ✅ Security reports
- ✅ Account unlock functionality
- ✅ User statistics

### Security Features
- ✅ Helmet security headers
- ✅ CORS protection
- ✅ Rate limiting (API & Auth endpoints)
- ✅ Input validation & sanitization
- ✅ SQL injection prevention (MongoDB)
- ✅ XSS protection
- ✅ CSRF token support
- ✅ Secure error handling
- ✅ Audit logging for all actions
- ✅ IP address tracking

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Icons**: React Icons

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Security**: Helmet, Express Rate Limit, Express Validator
- **CORS**: Enabled for cross-origin requests

### Development Tools
- **IDE**: VS Code
- **Version Control**: Git
- **Package Manager**: npm

## 📁 Project Structure

```
password-history-tracker/
├── backend/
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   │   ├── config.js
│   │   │   ├── database.js
│   │   │   └── constants.js
│   │   ├── models/           # MongoDB models
│   │   │   ├── User.js
│   │   │   ├── PasswordHistory.js
│   │   │   └── AuditLog.js
│   │   ├── controllers/      # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── passwordController.js
│   │   │   └── adminController.js
│   │   ├── services/         # Business logic
│   │   │   ├── authService.js
│   │   │   ├── passwordService.js
│   │   │   └── adminService.js
│   │   ├── routes/           # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── adminRoutes.js
│   │   │   └── healthRoutes.js
│   │   ├── middleware/       # Custom middleware
│   │   │   ├── auth.js
│   │   │   ├── validation.js
│   │   │   ├── security.js
│   │   │   └── errorHandler.js
│   │   ├── utils/            # Utility functions
│   │   │   ├── tokenUtils.js
│   │   │   ├── passwordUtils.js
│   │   │   ├── responseUtils.js
│   │   │   └── helpers.js
│   │   └── server.js         # Main server file
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   │   ├── api.js
│   │   │   └── constants.js
│   │   ├── context/          # React contexts
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── components/       # Reusable components
│   │   │   ├── layouts/
│   │   │   │   ├── AuthLayout.jsx
│   │   │   │   └── MainLayout.jsx
│   │   │   └── common/
│   │   │       ├── Navbar.jsx
│   │   │       └── Sidebar.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── RegisterPage.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardPage.jsx
│   │   │   │   └── ChangePasswordPage.jsx
│   │   │   ├── admin/
│   │   │   │   └── AdminDashboardPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── routes/           # Route protection
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/         # API services
│   │   │   └── apiService.js
│   │   ├── utils/            # Utility functions
│   │   │   └── helpers.js
│   │   ├── index.css         # Global styles
│   │   ├── App.jsx           # Main App component
│   │   └── main.jsx          # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .gitignore
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud - MongoDB Atlas)
- Git

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd password-history-tracker
```

#### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB URI and settings
# MONGODB_URI=mongodb://localhost:27017/password-history-tracker
# JWT_SECRET=your_secret_key_here

# Start MongoDB (if running locally)
# mongod

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

#### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### Environment Variables

#### Backend (.env)
```
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/password-history-tracker

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d

# Security
BCRYPT_ROUNDS=10
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME=15

# Client URL
CLIENT_URL=http://localhost:5173

# Password Policy
MIN_PASSWORD_LENGTH=8
PASSWORD_EXPIRY_DAYS=90
PREVENT_REUSE_COUNT=5
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout
- `POST /api/auth/change-password` - Change password
- `GET /api/auth/password-status` - Get password status
- `GET /api/auth/password-history` - Get password history
- `POST /api/auth/check-password-strength` - Check password strength

### Admin
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users/:userId/unlock` - Unlock user account
- `GET /api/admin/logs` - Get audit logs
- `GET /api/admin/logs/failed-logins` - Get failed login attempts
- `GET /api/admin/security-report` - Get security report

### Health
- `GET /api/health` - Health check

## 🔐 Security Best Practices Implemented

1. **Password Security**
   - Bcrypt hashing with 10 salt rounds
   - Strong password requirements (uppercase, lowercase, number, special char)
   - Password history to prevent reuse
   - Password expiration policy

2. **Authentication**
   - JWT tokens with expiration
   - Secure token storage in localStorage
   - Token refresh mechanism ready
   - Role-based access control

3. **Account Security**
   - Account lockout after 5 failed attempts
   - Login attempt tracking
   - IP address logging
   - User agent tracking

4. **API Security**
   - Rate limiting on all endpoints
   - Stricter rate limits on auth endpoints
   - Input validation and sanitization
   - CORS protection
   - Helmet security headers
   - SQL injection prevention

5. **Audit & Compliance**
   - Comprehensive audit logging
   - All actions tracked with timestamps
   - IP address and device information logged
   - Security reports generation

## 🧪 Testing

### Test Accounts
After registration, you can create test accounts:

1. **Regular User**
   - Email: user@example.com
   - Password: TestPass123!

2. **Admin User** (Create via MongoDB)
   ```javascript
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin" } }
   )
   ```

### Manual Testing Checklist
- [ ] User registration with validation
- [ ] User login
- [ ] Password change with history check
- [ ] Failed login attempt tracking
- [ ] Account lockout functionality
- [ ] Admin dashboard access
- [ ] Audit log viewing
- [ ] Security report generation
- [ ] Dark/Light theme toggle
- [ ] Responsive design on mobile

## 📦 Build & Deployment

### Frontend Build
```bash
cd frontend
npm run build
```

### Backend Production Setup
```bash
cd backend
npm install --production
NODE_ENV=production npm start
```

### Deployment Options

#### Heroku (Backend)
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create password-tracker-api

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_secret

# Deploy
git push heroku main
```

#### Vercel (Frontend)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variable: `VITE_API_URL=your_backend_url`
4. Deploy

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally: `mongod`
- Check MongoDB Atlas connection string if using cloud
- Verify MONGODB_URI in .env file

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

### CORS Errors
- Check CLIENT_URL in backend .env matches frontend URL
- Ensure CORS middleware is properly configured

### Password Validation Errors
- Password must contain: uppercase, lowercase, number, special character
- Minimum 8 characters required
- Example: `SecurePass123!`

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

Your Name - Initial work

## 📞 Support

For support, email support@example.com or open an issue in the repository.

## 🎯 Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] OAuth2 integration (Google, GitHub)
- [ ] Email notifications for password expiry
- [ ] Password strength requirements customization
- [ ] Advanced security analytics
- [ ] Bulk user management
- [ ] Export audit logs to CSV
- [ ] Custom security policies
- [ ] User activity timeline
- [ ] Machine learning-based anomaly detection

## ✅ Checklist for Production

- [ ] Update all credentials and secrets
- [ ] Enable HTTPS
- [ ] Configure MongoDB backup
- [ ] Set up monitoring and logging
- [ ] Configure email notifications
- [ ] Set up automated testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Load testing
- [ ] Disaster recovery plan
