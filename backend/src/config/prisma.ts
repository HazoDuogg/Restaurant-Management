import { PrismaClient } from '../../generated/prisma/client.js'
import dotenv from 'dotenv'
dotenv.config();

export const prisma = new PrismaClient({
    accelerateUrl: process.env.DATABASE_URL!
})