import type { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";

const authService = new AuthService();

export default class AuthController {

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({
                    success: false,
                    message: "Vui lòng nhập email và mật khẩu"
                });
                return;
            }
            const result = await authService.login(email, password);
            res.status(200).json({
                success: true,
                message: "Đăng nhập thành công!!",
                data: result
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: `${error}`
            })
        }
    }

    async register(req: Request, res: Response): Promise<void> {
        try {
            const { name, password, phone, email } = req.body;
            if (!name || !email || !password) {
                res.status(400).json({
                    success: false,
                    message: 'Vui lòng nhập đầy đủ thông tin'
                });
                return;
            }
            await authService.register(name, password, phone ?? null, email);
            res.status(201).json({
                success: true,
                message: 'Đăng ký thành công'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: `${error}`
            });
        }
    }

    async changePassword(req: Request, res: Response): Promise<void> {
        try {
            const { oldPassword, newPassword } = req.body;
            const id = req.user?.id;
            if (!id) {
                res.status(401).json({
                    success: false,
                    message: 'Chưa đăng nhập'
                });
                return;
            }
            if (!oldPassword || !newPassword) {
                res.status(400).json({
                    success: false,
                    message: 'Vui lòng nhập đầy đủ thông tin'
                });
                return;
            }
            await authService.changePassword(id, oldPassword, newPassword);
            res.status(200).json({
                success: true,
                message: 'Đổi mật khẩu thành công'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: `${error}`
            });
        }
    }

    async logout(req: Request, res: Response): Promise<void> {
        try {
            res.clearCookie('token');
            res.status(200).json({
                success: true,
                message: 'Đăng xuất thành công'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: `${error}`
            });
        }
    }

}