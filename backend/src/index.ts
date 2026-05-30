import cookieParser from 'cookie-parser';
import { corsConfig } from './config/index.js';
import cors from 'cors';
import authRouter from './routes/auth.js'
import categoryRouter from './routes/category.js'
import express from 'express';
import morgan from 'morgan';
import { logger } from './utils/logger.js';

const app = express();

app.use(cors({
    origin: corsConfig.cors,
    credentials: true
}))

app.use(cookieParser())

app.use(express.json({ limit: '10mb' }))

app.use(morgan('dev'))

app.get('/serverStatus', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'sdetpro-test'
    })
});

app.use('/auth', authRouter);
app.use('/categories', categoryRouter);

logger.info('✅ Registered routes:');
logger.info('  POST /auth/register');

export default app