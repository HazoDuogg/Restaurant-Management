import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/auth.js'

export function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json(
                {
                    success: false,
                    message: 'Chưa đăng nhập'
                }
            )
        }
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Token không hợp lệ' });
    }
}

export function authorize(...roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user?.role ?? "")) {
            res.status(403).json(
                {
                    success: false,
                    message: 'Không có quyền truy cập'
                }
            )
            return
        }
        next();
    }
}