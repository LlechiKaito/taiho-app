import { Router } from 'express';
import { UserController } from '@/adapters/controllers/users/UserController';
import { DynamoDBUserRepository } from '@/infrastructure/repositories/users/DynamoDBUserRepository';

const router = Router();
const userRepository = new DynamoDBUserRepository();
const userController = new UserController(userRepository);

router.get('/api/users', (req, res) => userController.getAllUsers(req, res));
router.get('/api/users/:id', (req, res) => userController.getUserById(req, res));

export default router; 