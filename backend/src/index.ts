import cookieParser from 'cookie-parser';
import { corsConfig } from './config/index.js';
import cors from 'cors';
import authRouter from './routes/auth.js'
import categoryRouter from './routes/category.js'
import tableRouter from './routes/tables.js'
import reservationRouter from './routes/reservations.js'
import menuItemRouter from './routes/menu-items.js'
import orderRouter from './routes/orders.js'
import invoiceRouter from './routes/invoices.js'
import paymentRouter from './routes/payments.js'
import staffRouter from './routes/staff.js'
import reportRouter from './routes/reports.js'
import customerRouter from './routes/customers.js'
import roleRouter from './routes/roles.js'
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
app.use('/tables', tableRouter);
app.use('/reservations', reservationRouter);
app.use('/menu-items', menuItemRouter);
app.use('/orders', orderRouter);
app.use('/invoices', invoiceRouter);
app.use('/payments', paymentRouter);
app.use('/staff', staffRouter);
app.use('/reports', reportRouter);
app.use('/customers', customerRouter);
app.use('/roles', roleRouter);

logger.info('✅ Registered routes:');
logger.info('  POST /auth/register');

export default app