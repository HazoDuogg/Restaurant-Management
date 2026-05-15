import type { Request, Response } from "express";
import { StaffService } from "../services/StaffService.js";

export class StaffController {

    private staffService = new StaffService();

    // GET /api/staff
    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const staffList = await this.staffService.getAll();
            res.status(200).json({
                success: true,
                data: staffList
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Lỗi server"
            });
        }
    };

    // GET /api/staff/:id
    getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: "ID không hợp lệ" });
                return;
            }

            const staff = await this.staffService.getById(id);
            res.status(200).json({
                success: true,
                data: staff
            });
        } catch (error: any) {
            const status = error.message.includes("không tồn tại") ? 404 : 500;
            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    };

    // POST /api/staff
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, email, password, phone, position, startDate } = req.body;

            await this.staffService.create(
                name,
                email,
                password,
                phone ?? null,
                position,
                startDate ? new Date(startDate) : null
            );

            res.status(201).json({
                success: true,
                message: "Tạo nhân viên thành công"
            });
        } catch (error: any) {
            const status = error.message.includes("đã được sử dụng") ? 409 : 400;
            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    };

    // PUT /api/staff/:id
    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: "ID không hợp lệ" });
                return;
            }

            const { name, phone, position, startDate } = req.body;

            await this.staffService.update(
                id,
                name,
                phone ?? null,
                position,
                startDate ? new Date(startDate) : null
            );

            res.status(200).json({
                success: true,
                message: "Cập nhật nhân viên thành công"
            });
        } catch (error: any) {
            const status = error.message.includes("không tồn tại") ? 404 : 400;
            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    };

    // DELETE /api/staff/:id
    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id as string);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: "ID không hợp lệ" });
                return;
            }

            await this.staffService.delete(id);
            res.status(200).json({
                success: true,
                message: "Xóa nhân viên thành công"
            });
        } catch (error: any) {
            const status = error.message.includes("không tồn tại") ? 404 : 500;
            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    };
}