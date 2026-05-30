import jwt from 'jsonwebtoken'
import { jwtConfig } from '../config/index.js'

export function issueAccessToken(id: number, role: string): string {
    return jwt.sign(
        {
            id,
            role
        },
        jwtConfig.secret!,
        {
            expiresIn: jwtConfig.accessTokenTtlSec
        }
    );
}

export function issueRefreshToken(id: number): string {
    return jwt.sign(
        {
            id
        },
        jwtConfig.secret!,
        {
            expiresIn: jwtConfig.refreshTokenTtlSec
        }
    );
}

export function verifyToken(token: string): { id: number, role: string } {
    return jwt.verify(token, jwtConfig.secret!) as { id: number, role: string }
}