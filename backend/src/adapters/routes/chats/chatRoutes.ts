import { Router } from 'express';
import { ChatController } from '@/adapters/controllers/chats/ChatController';
import { DynamoDBChatRepository } from '@/infrastructure/repositories/chats/DynamoDBChatRepository';

const router = Router();
const chatRepository = new DynamoDBChatRepository();
const chatController = new ChatController(chatRepository);

router.get('/api/chats', (req, res) => chatController.getAllChats(req, res));

export default router; 