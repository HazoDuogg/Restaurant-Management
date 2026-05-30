import dotenv from 'dotenv'
dotenv.config();

export const jwtConfig = {
    accessTokenTtlSec: Number(process.env.JWT_EXPIRES_ACCESSTOKEN),
    refreshTokenTtlSec: Number(process.env.JWT_EXPIRES_REFRESHTOKEN),
    secret: process.env.JWT_SECRET,
};

export const modeConfig = {
    mode: process.env.NODE_ENV
};

export const corsConfig = {
    cors: process.env.CORS_ORIGIN
};