# Testing Guide

## Unit Testing

### Backend Testing

#### Setup Jest
```bash
cd backend
npm install --save-dev jest @babel/core @babel/preset-env
```

#### Create test file: `src/tests/auth.test.js`
```javascript
import { registerUser, loginUser } from '../services/authService.js';
import User from '../models/User.js';

jest.mock('../models/User.js');

describe('Auth Service', () => {
  describe('registerUser', () => {
    it('should register a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!',
      };

      User.prototype.save = jest.fn().mockResolvedValue(userData);

      const result = await registerUser({}, userData);
      expect(result.user).toBeDefined();
    });

    it('should throw error if user exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'SecurePass123!',
      };

      User.findOne = jest.fn().mockResolvedValue({ _id: '123' });

      await expect(registerUser({}, userData)).rejects.toThrow('User already exists');
    });
  });
});
```

#### Run tests
```bash
npm test
```

### Frontend Testing

#### Setup Vitest
```bash
cd frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

#### Create test file: `src/tests/LoginPage.test.jsx`
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../pages/auth/LoginPage';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';

describe('LoginPage', () => {
  it('renders login form', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText('your@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();
  });

  it('shows error on invalid email', async () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </BrowserRouter>
    );

    const submitButton = screen.getByText('Login');
    fireEvent.click(submitButton);

    await screen.findByText('Email is required');
  });
});
```

## Integration Testing

### API Testing with Postman

#### 1. Authentication Flow
```
POST /api/auth/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "TestPass123!"
}

POST /api/auth/login
{
  "email": "test@example.com",
  "password": "TestPass123!"
}

GET /api/auth/me
Headers: Authorization: Bearer {accessToken}
```

#### 2. Password Management
```
GET /api/auth/password-status
Headers: Authorization: Bearer {accessToken}

POST /api/auth/check-password-strength
{
  "password": "NewPass456!"
}

POST /api/auth/change-password
{
  "currentPassword": "TestPass123!",
  "newPassword": "NewPass456!",
  "confirmPassword": "NewPass456!"
}
```

#### 3. Admin Operations
```
GET /api/admin/users?page=1&limit=20

GET /api/admin/logs?page=1&limit=50

GET /api/admin/security-report?startDate=2024-01-01&endDate=2024-12-31
```

### End-to-End Testing with Cypress

#### Setup Cypress
```bash
cd frontend
npm install --save-dev cypress
npx cypress open
```

#### Create test: `cypress/e2e/auth.cy.js`
```javascript
describe('Authentication Flow', () => {
  it('should register and login', () => {
    // Visit login page
    cy.visit('http://localhost:5173/login');

    // Click register link
    cy.contains('Register here').click();

    // Fill registration form
    cy.get('input[name="name"]').type('Test User');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('TestPass123!');
    cy.get('input[name="confirmPassword"]').type('TestPass123!');

    // Submit form
    cy.get('button[type="submit"]').click();

    // Check redirect to login
    cy.url().should('include', '/login');

    // Login
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('TestPass123!');
    cy.get('button[type="submit"]').click();

    // Check dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('be.visible');
  });

  it('should change password', () => {
    // Login first
    cy.loginAs('test@example.com', 'TestPass123!');

    // Navigate to change password
    cy.visit('http://localhost:5173/dashboard/change-password');

    // Fill form
    cy.get('input[name="currentPassword"]').type('TestPass123!');
    cy.get('input[name="newPassword"]').type('NewPass456!');
    cy.get('input[name="confirmPassword"]').type('NewPass456!');

    // Submit
    cy.get('button[type="submit"]').click();

    // Check success message
    cy.contains('Password changed successfully').should('be.visible');
  });
});
```

## Performance Testing

### Load Testing with Apache Bench

```bash
# Test API endpoint
ab -n 1000 -c 100 http://localhost:5000/api/health

# Results show:
# - Requests per second
# - Mean time per request
# - Transfer rate

# Expected results for production:
# - Min 100 req/s
# - Mean response time < 200ms
```

### Load Testing with Artillery

```bash
# Install
npm install -g artillery

# Create load-test.yml
scenarios:
  - name: "Login Flow"
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "TestPass123!"

# Run test
artillery run load-test.yml --target http://localhost:5000
```

## Security Testing

### Automated Security Scan

```bash
# Install security scanner
npm install -g snyk

# Scan dependencies
snyk test

# Fix vulnerabilities
snyk fix
```

### OWASP ZAP Scanning

```bash
# Install ZAP
# https://www.zaproxy.org/download/

# Run passive scan
zaproxy -cmd \
  -quickurl http://localhost:5173 \
  -quickout security-report.html
```

### Manual Security Testing

1. **SQL Injection**
   - Test: Email: `test@example.com' OR '1'='1`
   - Expected: Input sanitized, no injection

2. **XSS**
   - Test: Name: `<script>alert('xss')</script>`
   - Expected: Script escaped, no execution

3. **CSRF**
   - Test: Change password with mismatched origin
   - Expected: Request rejected

4. **Authentication**
   - Test: Access /api/admin without auth
   - Expected: 401 Unauthorized

5. **Rate Limiting**
   - Test: 10+ login attempts in 1 minute
   - Expected: Rate limit response after 5 attempts

## Test Scenarios

### Registration
- [x] Valid registration with strong password
- [x] Duplicate email registration
- [x] Weak password rejection
- [x] Missing fields validation
- [x] Invalid email format

### Authentication
- [x] Successful login
- [x] Invalid credentials
- [x] Account lockout after 5 failures
- [x] Token expiration
- [x] Token refresh

### Password Management
- [x] Change password
- [x] Password reuse prevention
- [x] Password expiration warning
- [x] Password strength validation
- [x] Password history tracking

### Security
- [x] Unauthorized access prevention
- [x] Role-based access control
- [x] Rate limiting
- [x] Audit logging
- [x] Session security

### Admin Features
- [x] User management
- [x] Audit log viewing
- [x] Security report generation
- [x] Account unlock functionality
- [x] User statistics

## Test Coverage Goals

- **Unit Tests**: 80%+ coverage
- **Integration Tests**: 70%+ coverage
- **E2E Tests**: All critical user flows
- **Performance Tests**: All API endpoints

## Running All Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm run test

# E2E
cd frontend
npm run cypress:open

# Load tests
artillery run load-test.yml
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:5
        options: >-
          --health-cmd mongosh
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: 18

      - name: Install backend dependencies
        working-directory: ./backend
        run: npm install

      - name: Run backend tests
        working-directory: ./backend
        run: npm test

      - name: Install frontend dependencies
        working-directory: ./frontend
        run: npm install

      - name: Run frontend tests
        working-directory: ./frontend
        run: npm run test

      - name: Build frontend
        working-directory: ./frontend
        run: npm run build
```

## Test Report

After running tests, check:
- `coverage/` folder for coverage reports
- `test-results.xml` for detailed results
- `cypress/videos/` for E2E test recordings
