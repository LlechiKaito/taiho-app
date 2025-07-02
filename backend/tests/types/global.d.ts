import { PrismaClient } from '@prisma/client';

declare global {
  var testPrisma: PrismaClient;
} 