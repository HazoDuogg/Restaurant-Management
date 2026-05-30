import dotenv from 'dotenv';
dotenv.config();
import { createServer } from 'http';
import app from './index.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT || 3000;
const server = createServer(app);

server.listen(PORT, () => {
    logger.info(`🚀 Server listening on port ${PORT}`);
    logger.info(`📍 Health check: http://localhost:${PORT}/serverStatus`);
})