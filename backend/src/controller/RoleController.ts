import type { Request, Response } from "express";
import { RoleService } from "../services/RoleService.js";

const roleService = new RoleService();

export class RoleController {

    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const roles = await roleService.getAll();
            res.status(200).json({ success: true, data: roles });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const role = await roleService.getById(Number(req.params.id));
            res.status(200).json({ success: true, data: role });
        } catch (error) {
            res.status(404).json({ success: false, message: `${error}` });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.body;
            if (!name) {
                res.status(400).json({ success: false, message: "Tên vai trò không được để trống" });
                return;
            }
            await roleService.create(name);
            res.status(201).json({ success: true, message: "Tạo vai trò thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.body;
            if (!name) {
                res.status(400).json({ success: false, message: "Tên vai trò không được để trống" });
                return;
            }
            await roleService.update(Number(req.params.id), name);
            res.status(200).json({ success: true, message: "Cập nhật vai trò thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            await roleService.delete(Number(req.params.id));
            res.status(200).json({ success: true, message: "Xóa vai trò thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

}
