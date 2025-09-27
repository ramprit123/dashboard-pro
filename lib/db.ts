import { PrismaClient } from '@prisma/client/scripts/default-index.js';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

const globalForPrisma = global as unknown as { prisma: typeof prisma };

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
