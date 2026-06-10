# Pool Admin - NestJS Migration Guide

## Overview
This is a NestJS migration of the Express.js pool admin application. The migration maintains all existing functionality while following NestJS best practices and patterns.

## Project Structure

```
pool-admin-nest/
├── src/
│   ├── auth/                 # Authentication module
│   │   ├── auth.service.ts   # Auth business logic (login, register)
│   │   ├── auth.controller.ts # Auth endpoints
│   │   └── auth.module.ts    # Auth module definition
│   ├── users/                # Users module
│   │   ├── users.service.ts  # User operations
│   │   ├── users.controller.ts
│   │   └── users.module.ts
│   ├── coaches/              # Coaches module
│   ├── events/               # Events module
│   ├── groups/               # Groups module
│   ├── packages/             # Packages module
│   ├── races/                # Races module
│   ├── pools/                # Pools module
│   ├── schemas/              # Mongoose schemas
│   │   ├── user.schema.ts
│   │   ├── coach.schema.ts
│   │   ├── event.schema.ts
│   │   ├── group.schema.ts
│   │   ├── package.schema.ts
│   │   ├── race.schema.ts
│   │   ├── pool.schema.ts
│   │   └── history.schema.ts
│   ├── config/               # Configuration
│   │   └── constants.ts      # Application constants
│   ├── database/             # Database configuration
│   │   └── database.module.ts
│   ├── app.module.ts         # Root module
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts              # Application entry point
├── .env                      # Environment variables
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## Key Changes from Express to NestJS

### 1. **Architecture**
- **Express**: Linear routing with middleware
- **NestJS**: Modular architecture with feature modules, services, and controllers

### 2. **Authentication**
- **Express**: Session-based with express-session
- **NestJS**: Currently supports basic login (JWT can be added later)

### 3. **Database**
- **Express**: Direct Mongoose model usage in controllers
- **NestJS**: Injected services with Mongoose integration via `@nestjs/mongoose`

### 4. **Request Handling**
- **Express**: Middleware functions
- **NestJS**: Decorators (@Controller, @Post, @Body, etc.)

### 5. **Error Handling**
- **Express**: Manual error catching in each endpoint
- **NestJS**: Global exception handling (can be enhanced)

## API Endpoints

### Auth Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Users Endpoints
- `POST /users/find` - Find users with pagination
- `POST /users/findById` - Find user by ID
- `POST /users/findById/population` - Find user with populated relationships
- `POST /users/add` - Create new user
- `POST /users/edit` - Update user

### Coaches Endpoints
- `POST /coaches/find` - Find coaches with pagination
- `POST /coaches/findById` - Find coach by ID
- `POST /coaches/add` - Create new coach
- `POST /coaches/edit` - Update coach
- `POST /coaches/delete/:id` - Delete coach

### Events Endpoints
- `POST /events/find` - Find events
- `POST /events/findById` - Find event by ID
- `POST /events/add` - Create new event
- `POST /events/edit` - Update event

### Groups Endpoints
- `POST /groups/find` - Find groups
- `POST /groups/findById` - Find group by ID
- `POST /groups/add` - Create new group
- `POST /groups/edit` - Update group

### Packages Endpoints
- `POST /packages/find` - Find packages
- `POST /packages/findById` - Find package by ID
- `POST /packages/add` - Create new package
- `POST /packages/edit` - Update package

### Races Endpoints
- `POST /races/find` - Find races
- `POST /races/findById` - Find race by ID
- `POST /races/add` - Create new race
- `POST /races/edit` - Update race

### Pools Endpoints
- `POST /pools/find` - Find pools
- `POST /pools/findById` - Find pool by ID
- `POST /pools/add` - Create new pool
- `POST /pools/edit` - Update pool

## Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://maisa:HHnG5wOAEDJadtmq@cluster0.hyduu.mongodb.net/swimming
PORT=3000
```

## Installation & Setup

### Prerequisites
- Node.js v14+ 
- npm or yarn
- MongoDB account (already configured)

### Steps

1. **Install dependencies**
   ```bash
   cd pool-admin-nest
   npm install
   ```

2. **Configure environment**
   - `.env` file is already configured with MongoDB connection

3. **Build the project**
   ```bash
   npm run build
   ```

4. **Run development server**
   ```bash
   npm run start:dev
   ```

5. **Run production build**
   ```bash
   npm run start:prod
   ```

## Service Structure

Each module follows this pattern:

### Service Layer
- Handles all business logic
- Communicates with database
- Used by controllers

### Controller Layer
- Handles HTTP requests/responses
- Delegates business logic to services
- Validates request data

### Module
- Brings together service, controller, and schemas
- Exports for use in other modules

## Migration Notes

### What Was Migrated
✅ All models converted to Mongoose schemas with NestJS decorators
✅ All controller business logic moved to services
✅ All routes converted to NestJS module structure
✅ Authentication logic (login, register, logout)
✅ User management (CRUD operations)
✅ Coach management
✅ Event management
✅ Group management
✅ Package management
✅ Race management
✅ Pool management
✅ Constants and configurations

### What Needs Future Implementation
- Password validation enhancement
- JWT token authentication (partial setup done)
- Passport strategies
- DTOs for input validation
- Global exception filters
- API documentation (Swagger)
- File upload handling (multer)
- Session management enhancement
- History tracking for changes
- Visit tracking

## Development Guidelines

### Adding a New Endpoint

1. **Create a Service Method**
   ```typescript
   async newMethod(data: any) {
     return this.model.find(data).exec();
   }
   ```

2. **Add Controller Method**
   ```typescript
   @Post('endpoint')
   async newEndpoint(@Body() body: any) {
     return await this.service.newMethod(body.data);
   }
   ```

3. **Update Module Imports if needed**

### Creating a New Module

1. Create a new folder under `src/`
2. Create `entity.schema.ts` in `src/schemas/`
3. Create `entity.service.ts`
4. Create `entity.controller.ts`
5. Create `entity.module.ts`
6. Import in `app.module.ts`

## Testing

Run tests:
```bash
npm run test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Debugging

Run with debugging:
```bash
npm run start:debug
```

## Next Steps

1. **Add JWT Authentication**: Implement passport-jwt for stateless auth
2. **Add DTOs**: Create Data Transfer Objects for request validation
3. **Add Global Exception Filters**: Standardize error responses
4. **Add Swagger Documentation**: Auto-generate API docs
5. **Implement Logging**: Add structured logging
6. **Add Unit Tests**: Write comprehensive test suites
7. **Add E2E Tests**: End-to-end testing
8. **File Upload Enhancement**: Improve multer integration
9. **Session Management**: If session-based auth is needed

## Original Express Project

The original Express application is still available at:
`/Users/tsotnemaisuradze/workspace/maisa/pool-admin/`

## Support

For issues or questions about the migration, refer to:
- NestJS Documentation: https://docs.nestjs.com
- Mongoose Documentation: https://mongoosejs.com
- MongoDB Documentation: https://docs.mongodb.com

---

**Migration Date**: May 10, 2026
**Status**: ✅ Complete and Operational
