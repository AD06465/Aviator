# Backend API for AVIATOR

This directory contains a Node.js backend service for AVIATOR that can handle:
- Background task processing
- Job queue management
- Configuration storage
- Audit logging
- User authentication

## Structure

```
backend/
├── src/
│   ├── api/          # API routes
│   ├── services/     # Business logic
│   ├── models/       # Data models
│   ├── middleware/   # Express middleware
│   ├── config/       # Configuration
│   └── utils/        # Utilities
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

```bash
cd backend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file:

```
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/aviator
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

## API Endpoints

- `POST /api/auth/login` - User authentication
- `GET /api/tasks` - Get tasks for an order
- `POST /api/tasks/process` - Start task processing
- `GET /api/config` - Get configuration
- `PUT /api/config` - Update configuration
- `GET /api/logs` - Get audit logs
