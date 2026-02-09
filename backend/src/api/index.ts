/**
 * API Routes
 * Central router for all API endpoints
 */

import { Router } from 'express';

const router = Router();

// Placeholder routes - to be implemented
router.get('/status', (req, res) => {
  res.json({
    message: 'AVIATOR Backend API',
    version: '1.0.0',
    endpoints: [
      'POST /api/auth/login',
      'GET /api/tasks',
      'POST /api/tasks/process',
      'GET /api/config',
      'PUT /api/config',
      'GET /api/logs',
    ],
  });
});

export default router;
