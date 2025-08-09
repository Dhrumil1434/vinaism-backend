# 🍇 VINAISM Backend - Enterprise-Grade Authentication & Project Management API

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Express](https://img.shields.io/badge/Express-5.x-lightgrey?logo=express)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-green?logo=data)
![Zod](https://img.shields.io/badge/Zod-Validation-purple?logo=zod)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue?logo=mysql)
![Passport](https://img.shields.io/badge/Passport-OAuth-red?logo=passport)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?logo=jsonwebtokens)

---

> **A production-ready TypeScript backend featuring comprehensive authentication, OAuth integration, role-based access control, and project management capabilities. Built with enterprise-level security, scalability, and maintainability in mind.**

---

## 📚 Table of Contents

- [🚀 Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture & Design Patterns](#️-architecture--design-patterns)
- [🔐 Authentication & Security](#-authentication--security)
- [🗄️ Database Schema](#️-database-schema)
- [📁 Project Structure](#-project-structure)
- [🔗 API Endpoints](#-api-endpoints)
- [🏁 Getting Started](#-getting-started)
- [🧪 Testing with Postman](#-testing-with-postman)
- [📜 Scripts](#-scripts)
- [🚀 Deployment](#-deployment)
- [🧑‍💻 Contributing](#-contributing)

---

## 🚀 Features

### 🔐 **Authentication & Authorization**
- **Multi-factor Authentication**: Email/phone + password login
- **OAuth 2.0 Integration**: Google, Facebook, Apple OAuth with state management
- **JWT-based Authentication**: Access & refresh token system
- **Role-based Access Control**: User types with permission management
- **Account Security**: Login attempt tracking, account lockout, session management
- **Password Management**: Bcrypt hashing, OAuth user handling

### 🏢 **Business Modules**
- **User Management**: Registration, profile management, user types
- **Project Management**: Projects, tasks, time tracking, assignments
- **Vendor & Supplier Management**: Vendor categories, orders, order items
- **Client Management**: Client profiles, contact management
- **Worker & Designer Management**: Role-specific user management
- **Notification System**: Activity logs and notifications

### 🛡️ **Enterprise Security**
- **Rate Limiting**: Protection against abuse
- **CORS Configuration**: Secure cross-origin requests
- **Environment Validation**: Fail-fast on missing configurations
- **Input Validation**: Comprehensive Zod schema validation
- **Error Handling**: Centralized, structured error responses
- **Session Management**: Secure session handling for OAuth flows

### 🏗️ **Architecture Excellence**
- **Clean Architecture**: Service-Controller-Repository pattern
- **Type Safety**: Full TypeScript implementation with strict mode
- **Database ORM**: Type-safe Drizzle ORM with MySQL
- **Validation**: End-to-end Zod validation (request/response)
- **Testing**: Vitest integration for unit and integration tests
- **Code Quality**: ESLint, Prettier, Husky, lint-staged

---

## 🛠️ Tech Stack

### **Core Technologies**
- **Runtime**: Node.js with TypeScript 5.x
- **Framework**: Express 5.x
- **Database**: MySQL with Drizzle ORM
- **Authentication**: JWT + Passport.js (OAuth)
- **Validation**: Zod schemas

### **Authentication & Security**
- **JWT**: `jsonwebtoken` for access/refresh tokens
- **OAuth**: `passport-google-oauth20`, `passport-facebook`, `passport-apple`
- **Password Hashing**: `bcrypt`
- **Session Management**: `express-session`
- **Rate Limiting**: `express-rate-limit`

### **Development & Quality**
- **Testing**: Vitest + Supertest
- **Code Quality**: ESLint + Prettier + Husky
- **Type Checking**: TypeScript strict mode
- **API Development**: Morgan logging, CORS, Compression

---

## 🏗️ Architecture & Design Patterns

### **Clean Architecture Layers**

```
┌─────────────────────────────────────────────────────────────┐
│                     🌐 Routes Layer                         │
│  (Express routes, middleware binding, parameter validation) │
├─────────────────────────────────────────────────────────────┤
│                   🎮 Controller Layer                       │
│     (Request handling, response formatting, middleware)     │
├─────────────────────────────────────────────────────────────┤
│                   💼 Service Layer                          │
│    (Business logic, orchestration, cross-module calls)     │
├─────────────────────────────────────────────────────────────┤
│                  🗃️ Repository Layer                        │
│      (Database operations, query building, ORM calls)      │
├─────────────────────────────────────────────────────────────┤
│                   📊 Schema Layer                           │
│       (Drizzle ORM schemas, database relationships)        │
└─────────────────────────────────────────────────────────────┘
```

### **Module Design Pattern**

Each module follows a consistent structure:

```
modules/user/login/
├── login.controller.ts      # Request/response handling
├── login.service.ts         # Business logic
├── loginSchema.repository.ts # Database operations
├── login.types.ts           # TypeScript interfaces
├── login.constant.ts        # Constants and config
├── validators/              # Input/output validation
│   ├── login.dto.ts         # Zod schemas
│   └── login.validators.ts  # Business validation
├── utils/                   # Module-specific utilities
│   ├── auth.util.ts         # JWT, bcrypt operations
│   └── login.util.ts        # Login-specific helpers
└── repositories/            # Sub-repositories
    ├── loginAttempts.repository.ts
    └── loginSession.repository.ts
```

---

## 🔐 Authentication & Security

### **Authentication Flow**

```mermaid
graph TD
    A[Client Request] --> B{Auth Type?}
    B -->|Email/Password| C[Login Controller]
    B -->|OAuth| D[OAuth Controller]
    
    C --> E[Validate Credentials]
    E --> F[Generate JWT Tokens]
    F --> G[Set HTTP-Only Cookies]
    G --> H[Return User Data]
    
    D --> I[OAuth Provider]
    I --> J[OAuth Callback]
    J --> K[Extract User Profile]
    K --> L[Link/Create User]
    L --> F
```

### **Security Features**

1. **JWT Token System**:
   - Access tokens (15 min expiry)
   - Refresh tokens (30 days expiry)
   - HTTP-only cookie storage
   - Automatic token rotation

2. **OAuth Integration**:
   - Google OAuth 2.0
   - Facebook OAuth
   - Apple Sign-In ready
   - State parameter for CSRF protection
   - Automatic user linking/creation

3. **Account Protection**:
   - Login attempt tracking
   - Account lockout (5 failed attempts)
   - IP address and user agent logging
   - Session management and cleanup

4. **Input Validation**:
   - Zod schema validation
   - Request body, query, and parameter validation
   - Response validation and sanitization
   - File upload validation (Multer)

---

## 🗄️ Database Schema

### **Core Authentication Tables**

```sql
-- Users table with OAuth support
users (
  user_id, user_name, email, phone_number,
  first_name, last_name, password (nullable for OAuth),
  profile_picture, user_type, email_verified,
  phone_verified, admin_approved, last_login_at,
  created_at, updated_at
)

-- OAuth metadata for social logins
oauth_metadata (
  id, user_id, provider, provider_user_id,
  provider_email, provider_name, provider_picture,
  access_token, refresh_token, token_expires_at,
  created_at, updated_at
)

-- Login session management
login_sessions (
  session_id, user_id, refresh_token,
  is_active, expires_at, user_agent,
  ip_address, created_at, updated_at
)

-- Security tracking
login_attempts (
  attempt_id, user_id, attempt_count,
  is_locked, lockout_until, last_attempt_at,
  ip_address, user_agent, created_at, updated_at
)
```

### **Business Domain Tables**

```sql
-- Project management
projects, project_space_details, task_assignments, time_logs

-- Vendor & supplier management  
vendors, vendor_categories, vendor_orders, vendor_order_items, suppliers

-- User & role management
user_types, roles, permissions, role_permissions, user_roles

-- Client & contact management
clients, contacts, addresses, id_cards

-- Notification & activity
notifications, activity_logs, price_forms
```

---

## 📁 Project Structure

```
VINAISM_BACKEND/
├── 📁 src/
│   ├── 🚀 app.ts                    # Express app configuration
│   ├── 🏁 index.ts                  # Application entry point
│   │
│   ├── 📁 config/                   # Configuration files
│   │   └── passport.config.ts       # Passport OAuth strategies
│   │
│   ├── 📁 db/                       # Database connections
│   │   ├── mysql.db.ts              # Drizzle MySQL setup
│   │   └── mongo.db.ts              # MongoDB connection
│   │
│   ├── 📁 schema/                   # Drizzle ORM schemas
│   │   ├── user.schema.ts           # User table definition
│   │   ├── oauthMetadata.schema.ts  # OAuth data schema
│   │   ├── loginSession.schema.ts   # Session management
│   │   ├── loginAttempts.schema.ts  # Security tracking
│   │   ├── project.schema.ts        # Project entities
│   │   ├── vendor.schema.ts         # Vendor management
│   │   └── helpers/
│   │       └── column.helpers.ts    # Reusable column definitions
│   │
│   ├── 📁 middlewares/              # Express middlewares
│   │   ├── auth.middleware.ts       # JWT authentication
│   │   ├── errorHandler.middleware.ts # Global error handling
│   │   ├── zodSchema.validator.middleware.ts # Request validation
│   │   ├── response.validator.middleware.ts # Response validation
│   │   └── multerBase.middleware.ts # File upload handling
│   │
│   ├── 📁 utils/                    # Shared utilities
│   │   ├── apiError.util.ts         # Custom error class
│   │   ├── apiResponse.util.ts      # Standardized responses
│   │   ├── asyncHandler.util.ts     # Async error wrapper
│   │   ├── pagination.util.ts       # Universal pagination
│   │   └── validateEnv.util.ts      # Environment validation
│   │
│   ├── 📁 modules/                  # Business logic modules
│   │   └── 📁 user/                 # User domain
│   │       ├── 📁 login/            # Authentication module
│   │       │   ├── login.controller.ts     # Login endpoints
│   │       │   ├── login.service.ts        # Login business logic
│   │       │   ├── loginSchema.repository.ts # Database operations
│   │       │   ├── login.types.ts          # TypeScript interfaces
│   │       │   ├── login.constant.ts       # Login constants
│   │       │   ├── 📁 validators/          # Input/output validation
│   │       │   │   ├── login.dto.ts        # Zod schemas
│   │       │   │   └── login.validators.ts # Business validation
│   │       │   ├── 📁 utils/               # Login utilities
│   │       │   │   ├── auth.util.ts        # JWT & bcrypt
│   │       │   │   └── login.util.ts       # Login helpers
│   │       │   └── 📁 repositories/        # Sub-repositories
│   │       │       ├── loginAttempts.repository.ts
│   │       │       └── loginSession.repository.ts
│   │       │
│   │       ├── 📁 oAuth/            # OAuth integration module
│   │       │   ├── oauth.controller.ts     # OAuth endpoints
│   │       │   ├── oauth.service.ts        # OAuth business logic
│   │       │   ├── oauthSchema.repository.ts # OAuth database ops
│   │       │   ├── oauth.types.ts          # OAuth interfaces
│   │       │   ├── oauth.constants.ts      # OAuth configuration
│   │       │   ├── 📁 validators/          # OAuth validation
│   │       │   │   ├── oauth.dto.ts        # OAuth Zod schemas
│   │       │   │   └── oauth.validators.ts # OAuth validation logic
│   │       │   ├── 📁 utils/               # OAuth utilities
│   │       │   │   ├── phoneNumber.util.ts # Phone placeholder handling
│   │       │   │   ├── userType.util.ts    # UserType validation
│   │       │   │   └── user.sanitization.util.ts # Data sanitization
│   │       │   └── 📁 middleware/          # OAuth middleware
│   │       │       └── oauth.validation.middleware.ts
│   │       │
│   │       ├── 📁 registration/     # User registration module
│   │       │   ├── registration.controller.ts
│   │       │   ├── registration.service.ts
│   │       │   ├── otp.controller.ts       # OTP verification
│   │       │   ├── otp.service.ts
│   │       │   ├── admin.controller.ts     # Admin approval
│   │       │   └── 📁 validators/
│   │       │       └── registration.dtos.ts
│   │       │
│   │       └── 📁 userTypes/        # User type management
│   │           ├── userType.controller.ts
│   │           ├── userType.service.ts
│   │           ├── userTypeSchema.repository.ts
│   │           └── 📁 validators/
│   │               └── userType.validator.ts
│   │
│   └── 📁 routes/                   # Express route definitions
│       ├── login.routes.ts          # Login endpoints
│       ├── oauth.routes.ts          # OAuth endpoints  
│       ├── userRegistration.routes.ts # Registration endpoints
│       ├── otp.routes.ts            # OTP verification
│       ├── admin.routes.ts          # Admin operations
│       └── userType.routes.ts       # User type management
│
├── 📁 drizzle/                      # Database migrations
│   └── migrations/                  # Auto-generated migration files
│
├── ⚙️ drizzle.config.ts             # Drizzle ORM configuration
├── ⚙️ tsconfig.json                 # TypeScript configuration
├── ⚙️ vitest.config.ts              # Test configuration
├── ⚙️ eslint.config.cjs             # ESLint rules
├── 📦 package.json                  # Dependencies & scripts
└── 📖 README.md                     # This documentation
```

---

## 🔗 API Endpoints

### **Authentication & User Management**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| **Authentication** |
| `POST` | `/api/userLogin` | Email/phone + password login | ❌ |
| `POST` | `/api/userLogin/refresh` | Refresh access token | ❌ |
| `POST` | `/api/userLogin/logout` | Logout (invalidate tokens) | ✅ |
| **OAuth Integration** |
| `GET` | `/api/auth/google?userTypeId=33` | Initiate Google OAuth | ❌ |
| `GET` | `/api/auth/facebook?userTypeId=32` | Initiate Facebook OAuth | ❌ |
| `GET` | `/api/auth/google/callback` | Google OAuth callback | ❌ |
| `GET` | `/api/auth/facebook/callback` | Facebook OAuth callback | ❌ |
| `GET` | `/api/auth/connections` | Get user's OAuth connections | ✅ |
| `POST` | `/api/auth/link` | Link OAuth account to user | ✅ |
| `DELETE` | `/api/auth/unlink/:provider` | Unlink OAuth account | ✅ |
| **User Registration** |
| `POST` | `/api/userRegister` | Register new user | ❌ |
| `POST` | `/api/otp/send` | Send OTP verification | ❌ |
| `POST` | `/api/otp/verify` | Verify OTP code | ❌ |
| **Admin Operations** |
| `GET` | `/api/admin/pending-users` | Get users pending approval | ✅ Admin |
| `POST` | `/api/admin/approve-user/:userId` | Approve user registration | ✅ Admin |
| **User Type Management** |
| `GET` | `/api/userType` | List user types (paginated) | ✅ |
| `POST` | `/api/userType` | Create user type | ✅ Admin |
| `PUT` | `/api/userType/:userTypeId` | Update user type | ✅ Admin |

### **Request/Response Examples**

**Login Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Login Response:**
```json
{
  "statusCode": 200,
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "userId": 123,
      "userName": "johndoe",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "userType": {
        "userTypeId": 33,
        "typeName": "client",
        "description": "Client user type"
      },
      "email_verified": true,
      "phone_verified": true,
      "admin_approved": true
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    },
    "expiresIn": 900
  }
}
```

**OAuth Initiation:**
```bash
# Redirect user to:
GET /api/auth/google?userTypeId=33

# User will be redirected to Google, then back to:
GET /api/auth/google/callback?code=...&state=...
```

---

## 🏁 Getting Started

### **Prerequisites**
- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### **1. Clone & Install**
```bash
git clone <repository-url>
cd VINAISM_BACKEND
npm install
```

### **2. Environment Configuration**
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DATABASE_URL=mysql://root:password@localhost:3306/vinaism

# JWT Secrets (generate strong secrets in production)
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-min-256-bits
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-min-256-bits

# OAuth Configuration (obtain from provider consoles)
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Facebook OAuth  
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:5000/api/auth/facebook/callback

# Session Secret (for OAuth state management)
SESSION_SECRET=your-session-secret-for-oauth-flows

# Optional: MongoDB (for hybrid database usage)
MONGO_URI=mongodb://localhost:27017/vinaism
```

### **3. Database Setup**
```bash
# Generate migration files from schema
npm run db:generate

# Run migrations to create tables
npm run db:migrate

# (Optional) Open Drizzle Studio to view database
npm run db:studio
```

### **4. OAuth Provider Setup**

**Google OAuth Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Secret to `.env`

**Facebook OAuth Setup:**
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URI: `http://localhost:5000/api/auth/facebook/callback`
5. Copy App ID and Secret to `.env`

### **5. Start Development Server**
```bash
npm run dev
```

The server will start at `http://localhost:5000` with hot reloading.

### **6. Verify Installation**
```bash
# Test the API
curl http://localhost:5000/api/userType

# Check database connection (logs should show "✅ MySQL connection established")
```

---

## 🧪 Testing with Postman

### **Import Collection**
1. Download the [Postman Collection](docs/VINAISM-API.postman_collection.json)
2. Import into Postman
3. Set environment variables:
   - `base_url`: `http://localhost:5000`
   - `jwt_token`: (will be set after login)

### **Testing Workflow**

**1. Test Regular Login:**
```json
POST /api/userLogin
{
  "email": "user@example.com", 
  "password": "password123"
}
```

**2. Test OAuth (Browser Required):**
```bash
# Open in browser (Postman can't handle OAuth redirects)
http://localhost:5000/api/auth/google?userTypeId=33
```

**3. Test Protected Endpoints:**
```bash
# Copy accessToken from login response
GET /api/auth/connections
Authorization: Bearer <accessToken>
```

### **OAuth Testing Notes**
- OAuth initiation must be done in a browser
- Copy the final JSON response containing `accessToken`
- Use the token in Postman for protected endpoints
- OAuth state parameter ensures `userTypeId` persistence

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start` | Start production server |
| `npm run test` | Run test suite with Vitest |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Check code with ESLint |
| `npm run format` | Format code with Prettier |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Apply database migrations |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |

---

## 🚀 Deployment

### **Production Environment Variables**
```env
NODE_ENV=production
PORT=443
DATABASE_URL=mysql://user:pass@production-db:3306/vinaism
ACCESS_TOKEN_SECRET=<256-bit-production-secret>
REFRESH_TOKEN_SECRET=<256-bit-production-secret>
SESSION_SECRET=<256-bit-production-secret>

# Update OAuth callback URLs to production domains
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
FACEBOOK_CALLBACK_URL=https://yourdomain.com/api/auth/facebook/callback
```

### **Production Checklist**
- [ ] Update OAuth provider callback URLs
- [ ] Generate strong production secrets (256-bit minimum)
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure production database with connection pooling
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting for production traffic
- [ ] Set up automated backups
- [ ] Configure CORS for production domains

### **Docker Deployment**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 🧑‍💻 Contributing

We welcome contributions! Please follow these guidelines:

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the existing patterns
4. Add tests for new functionality
5. Run linting and tests: `npm run lint && npm test`
6. Commit with descriptive messages
7. Push to your fork and create a Pull Request

### **Code Standards**
- Follow the existing module structure and naming conventions
- Use TypeScript strict mode - no `any` types
- Add Zod validation for all input/output
- Include proper error handling with `ApiError`
- Write unit tests for business logic
- Document complex functions with JSDoc

### **Module Development Pattern**
When adding new modules, follow this structure:
```
modules/domain/feature/
├── feature.controller.ts    # HTTP layer
├── feature.service.ts       # Business logic  
├── featureSchema.repository.ts # Database layer
├── feature.types.ts         # TypeScript interfaces
├── feature.constants.ts     # Constants and messages
├── validators/              # Validation layer
│   ├── feature.dto.ts       # Zod schemas
│   └── feature.validators.ts # Business validation
└── utils/                   # Feature-specific utilities
    └── feature.util.ts
```

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Drizzle ORM** for excellent TypeScript database integration
- **Passport.js** for OAuth authentication strategies  
- **Zod** for runtime type validation
- **Express.js** community for middleware ecosystem

---

> **Built with ❤️ for enterprise-grade applications**

**Project Status**: ✅ Production Ready | 🔄 Actively Maintained | 📈 Growing

For questions, issues, or contributions, please visit our [GitHub repository](https://github.com/your-org/vinaism-backend).