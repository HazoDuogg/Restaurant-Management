export const logger = {
    info: (...args: string[]) => {
        console.log('[INFO]', ...args);
    },
    error: (...args: string[]) => {
        console.error('[ERROR]', ...args);
    },
    warn: (...args: string[]) => {
        console.warn('[WARN]', ...args);
    }
}