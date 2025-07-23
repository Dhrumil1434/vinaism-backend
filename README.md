# 🍇 VINAISM-WORKSPACE

![TypeScript](https://img.shields.io/badge/TypeScript-4.x-blue?logo=typescript)
![Express](https://img.shields.io/badge/Express-5.x-lightgrey?logo=express)
![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-green?logo=data)
![Zod](https://img.shields.io/badge/Zod-Validation-purple?logo=zod)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue?logo=mysql)
![CI](https://img.shields.io/badge/CI-Passing-brightgreen)

---

![Vinaism Workspace Demo](demo.gif)

> **A modern, scalable TypeScript backend for real-world apps, featuring Drizzle ORM, Zod validation, robust error handling, and beautiful code structure.**

---

## 📚 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [Utilities & Middlewares](#utilities--middlewares)
- [API Endpoints](#api-endpoints)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Features
- **TypeScript-first**: Type safety everywhere
- **Express 5**: Modern, modular routing
- **Drizzle ORM**: Type-safe SQL for MySQL
- **Zod**: End-to-end validation (request, response, filters)
- **Robust error handling**: Centralized, user-friendly, and developer-friendly
- **Pagination & Filtering**: Universal utility for all modules
- **Modular structure**: Clean separation of concerns
- **Production-ready**: Rate limiting, CORS, compression, logging
- **Environment validation**: Never miss a required env var
- **Beautiful code**: ESLint, Prettier, Husky, lint-staged
- **Ready for MongoDB**: Dual DB support (MySQL + MongoDB)
- **Easy migrations**: Drizzle Kit for schema evolution
- **Open for contribution**: Clean, documented, and extensible

---

## 🛠️ Tech Stack
- **TypeScript**
- **Express 5**
- **Drizzle ORM** (MySQL)
- **Zod** (validation)
- **MySQL** (primary DB)
- **MongoDB** (optional, for hybrid use)
- **ESLint, Prettier, Husky** (code quality)
- **dotenv** (env management)
- **Joi** (legacy validation)
- **Other**: Morgan, CORS, Compression, Rate Limiting, Cookie Parser

---

## 🏗️ Project Structure
```text
vinaism-workspace/
├── src/
│   ├── app.ts                # Express app setup
│   ├── index.ts              # Entry point (env, DB, server)
│   ├── db/
│   │   ├── mysql.db.ts       # Drizzle + MySQL connection
│   │   └── mongo.db.ts       # MongoDB connection
│   ├── schema/               # Drizzle ORM schemas (see below)
│   ├── utils/                # Utilities (pagination, error, response, etc.)
│   ├── middlewares/          # Error, validation, response, etc.
│   ├── modules/              # Business logic (user, userType, ...)
│   └── routes/               # Express routers
├── drizzle.config.ts         # Drizzle ORM config
├── package.json              # Scripts & dependencies
├── README.md                 # This file
└── ...
```

---

## 🗄️ Database Schema (Drizzle ORM)
- **user_types**: `userTypeId`, `typeName`, `description`, `is_active`, `createdAt`, `updatedAt`
- **Timestamps**: All major tables have `createdAt` and `updatedAt` (auto-managed)
- **Other tables**: users, roles, permissions, projects, vendors, ...

```ts
// Example: userTypes.schema.ts
export const userTypes = mysqlTable('user_types', {
  userTypeId: int('user_type_id').autoincrement().primaryKey(),
  typeName: varchar('type_name', { length: 100 }).unique(),
  description: varchar('description', { length: 255 }),
  ...timestamps,
});
```

---

## 🧰 Utilities & Middlewares
- **apiResponse.util.ts**: Standardized API responses
- **apiError.util.ts**: Custom error class
- **asyncHandler.util.ts**: Async/await error wrapper
- **validateEnv.util.ts**: Environment variable validation
- **pagination.util.ts**: Universal pagination/filtering
- **response.validator.middleware.ts**: Outgoing response validation
- **zodSchema.validator.middleware.ts**: Request/query/param validation
- **errorHandler.middleware.ts**: Centralized error handling (with Zod support)

---

## 🔗 API Endpoints (UserType Example)
| Method | Path                | Description                |
|--------|---------------------|----------------------------|
| POST   | `/api/userType/`    | Create a user type         |
| GET    | `/api/userType/`    | List user types (paginated, filtered) |
| PUT    | `/api/userType/:userTypeId` | Update a user type         |

- All endpoints use Zod for validation and return standardized responses.
- Pagination, filtering, and error handling are consistent across all modules.

---

## 🏁 Getting Started

### 1. **Clone the repo**
```bash
git clone https://github.com/your-username/vinaism-workspace.git
cd vinaism-workspace
```

### 2. **Install dependencies**
```bash
npm install
```

### 3. **Set up environment variables**
Create a `.env` file in the root:
```env
PORT=3000
DATABASE_URL=mysql://user:pass@localhost:3306/vinaism
MONGO_URI=mongodb://localhost:27017/vinaism
ACCESS_TOKEN_SECRET=your-access-token-secret
REFRESH_TOKEN_SECRET=your-refresh-token-secret
NODE_ENV=development
```

### 4. **Run migrations**
```bash
npm run db:migrate
```

### 5. **Start the development server**
```bash
npm run dev
```

### 6. **Open API in your browser or Postman**
```
http://localhost:3000/api/userType
```

---

## 📜 Scripts
| Script            | Description                        |
|-------------------|------------------------------------|
| dev               | Start dev server (hot reload)      |
| build             | Compile TypeScript                 |
| start             | Run compiled code                  |
| lint              | Lint code with ESLint              |
| format            | Format code with Prettier          |
| db:generate       | Generate Drizzle ORM types         |
| db:migrate        | Run DB migrations                  |
| db:push           | Push schema changes to DB          |
| db:studio         | Open Drizzle Studio (GUI)          |
| db:init           | Init Drizzle config                |

---

## 🧑‍💻 Contributing
We welcome contributions! Please open issues, submit PRs, and help us make Vinaism Workspace even better.

1. Fork the repo
2. Create a new branch
3. Make your changes
4. Open a pull request

---

## 📸 Demo & Animations
- ![API Demo](api-demo.gif)
- ![Validation Animation](validation.gif)
- ![Error Handling](error-handling.gif)

---

## 📄 License
MIT

---

> Made with ❤️ by the Vinaism Workspace community 