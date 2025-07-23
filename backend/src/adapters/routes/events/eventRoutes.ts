import { Router } from 'express';
import { EventController } from '@/adapters/controllers/events/EventController';
import { DynamoDBEventRepository } from '@/infrastructure/repositories/events/DynamoDBEventRepository';
import { authenticateToken } from '@/adapters/middleware/authMiddleware';
import { requireAdmin } from '@/adapters/middleware/authMiddleware';

const router = Router();
const eventRepository = new DynamoDBEventRepository();
const eventController = new EventController(eventRepository);

router.get('/api/events', (req, res) => eventController.getAllEvents(req, res));
router.get('/api/events/:id', (req, res) => eventController.getEventById(req, res));
router.post('/api/events', authenticateToken, requireAdmin, (req, res) => eventController.createEvent(req, res));
router.put('/api/events/:id', authenticateToken, requireAdmin, (req, res) => eventController.updateEvent(req, res));
router.delete('/api/events/:id', authenticateToken, requireAdmin, (req, res) => eventController.deleteEvent(req, res));

export default router; 