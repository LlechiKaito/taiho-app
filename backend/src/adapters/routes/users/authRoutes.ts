import { Router } from 'express';
import { AuthController } from '@/adapters/controllers/users/AuthController';
import { DynamoDBUserRepository } from '@/infrastructure/repositories/users/DynamoDBUserRepository';

const router = Router();
const userRepository = new DynamoDBUserRepository();
const authController = new AuthController(userRepository);

router.post('/api/auth/login', (req, res) => authController.login(req, res));
router.post('/api/auth/register', (req, res) => authController.register(req, res));
router.post('/api/auth/verify', (req, res) => authController.verifyToken(req, res));

export default router; 