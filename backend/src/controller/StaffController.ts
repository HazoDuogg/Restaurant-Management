import type { Request, Response } from "express";
import { StaffService } from "../services/StaffService.js";

const staffService = new StaffService();

export class StaffController {

    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const staffList = await staffService.getAll();
            res.status(200).json({ success: true, data: staffList });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const staff = await staffService.getById(Number(req.params.id));
            res.status(200).json({ success: true, data: staff });
        } catch (error) {
            res.status(404).json({ success: false, message: `${error}` });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { name, email, password, phone, position, startDate } = req.body;
            if (!name || !email || !password || !position) {
                res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ thông tin nhân viên" });
                return;
            }
            await staffService.create(
                name,
                email,
                password,
                phone ?? null,
                position,
                startDate ? new Date(startDate) : null
            );
            res.status(201).json({ success: true, message: "Tạo nhân viên thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const { name, phone, position, startDate } = req.body;
            if (!name || !position) {
                res.status(400).json({ success: false, message: "Tên và chức vụ không được để trống" });
                return;
            }
            await staffService.update(
                id,
                name,
                phone ?? null,
                position,
                startDate ? new Date(startDate) : null
            );
            res.status(200).json({ success: true, message: "Cập nhật nhân viên thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            await staffService.delete(Number(req.params.id));
            res.status(200).json({ success: true, message: "Xóa nhân viên thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

}
