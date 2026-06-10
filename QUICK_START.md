# Pool Admin - NestJS Quick Start

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev
```

The application will be available at `http://localhost:3000`

## Environment Setup

The `.env` file is already configured with MongoDB connection details. No additional setup required.

## API Examples

### Register User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "userName": "john_doe",
      "password": "password123",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    }
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "userName": "john_doe",
      "password": "password123"
    }
  }'
```

### Find Users
```bash
curl -X POST http://localhost:3000/users/find \
  -H "Content-Type: application/json" \
  -d '{
    "data": {},
    "paging": {
      "page": 1,
      "limit": 10
    }
  }'
```

### Create Coach
```bash
curl -X POST http://localhost:3000/coaches/add \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "Coach Name",
      "email": "coach@example.com",
      "phone": "123456789"
    }
  }'
```

## Project Scripts

- `npm run start:dev` - Start in development mode with hot reload
- `npm run start:debug` - Start with debugging enabled
- `npm run start:prod` - Build and start production
- `npm run build` - Build the project
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:cov` - Run tests with coverage

## Project Structure

```
src/
├── auth/          # Authentication (login, register)
├── users/         # User management
├── coaches/       # Coach management
├── events/        # Event management
├── groups/        # Group management
├── packages/      # Package management
├── races/         # Race management
├── pools/         # Pool management
├── schemas/       # Database schemas
├── config/        # Configuration
└── database/      # Database setup
```

## Main Differences from Original Express App

| Aspect | Express | NestJS |
|--------|---------|--------|
| Architecture | Linear routing | Modular |
| Structure | Controllers with business logic | Services + Controllers |
| Database | Direct model usage | Injected services |
| Decorators | No | Yes (@Post, @Body, etc.) |
| Type Safety | No (JavaScript) | Yes (TypeScript) |
| Validation | Manual | Built-in support |
| Testing | Manual setup | Built-in Jest |

## Migration Status

✅ **Complete** - All features migrated from Express to NestJS
- All routes converted
- All models converted to schemas
- All business logic migrated to services
- MongoDB connection configured
- Authentication implemented
- All CRUD operations available

## Next Steps

1. Start development server: `npm run start:dev`
2. Test endpoints with provided curl examples
3. Enhance with JWT authentication (optional)
4. Add input validation (DTOs)
5. Write tests
6. Deploy to production

---

**New NestJS Project Location**: `/Users/tsotnemaisuradze/workspace/maisa/pool-admin-nest/`
**Original Express Project**: `/Users/tsotnemaisuradze/workspace/maisa/pool-admin/`
