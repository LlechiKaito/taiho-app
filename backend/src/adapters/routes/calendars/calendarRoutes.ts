import { Router } from 'express';
import { CalendarController } from '@/adapters/controllers/calendars/CalendarController';
import { DynamoDBCalendarRepository } from '@/infrastructure/repositories/calendars/DynamoDBCalendarRepository';
import { authenticateToken, requireAdmin } from '@/adapters/middleware/authMiddleware';

const router = Router();
const calendarRepository = new DynamoDBCalendarRepository();
const calendarController = new CalendarController(calendarRepository);

router.get('/api/calendars', (req, res) => calendarController.getAllCalendars(req, res));
router.get('/api/calendars/:id', (req, res) => calendarController.getCalendarById(req, res));

// 管理者のみアクセス可能なルート
router.post('/api/calendars', authenticateToken, requireAdmin, (req, res) => calendarController.createCalendar(req, res));
router.put('/api/calendars/:id', authenticateToken, requireAdmin, (req, res) => calendarController.updateCalendar(req, res));

export default router; 