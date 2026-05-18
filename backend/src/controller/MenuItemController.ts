import type { Request, Response } from "express";
import { MenuItemService } from "../services/MenuItemService.js";
import { MenuStatus } from "../models/enums.js";

const menuItemSer = new MenuItemService();

export default class MenuItemController {

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const menuItems = await menuItemSer.getAll();
            res.status(200).json({ success: true, data: menuItems });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const menuItem = await menuItemSer.getById(Number(req.params.id));
            res.status(200).json({ success: true, data: menuItem });
        } catch (error) {
            res.status(404).json({ success: false, message: `${error}` });
        }
    }

    async getByCategory(req: Request, res: Response): Promise<void> {
        try {
            const menuItems = await menuItemSer.getByCategory(Number(req.params.id));
            res.status(200).json({ success: true, data: menuItems });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async getAvailable(_req: Request, res: Response): Promise<void> {
        try {
            const menuItems = await menuItemSer.getAvailable();
            res.status(200).json({ success: true, data: menuItems });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { name, price, description, categoryId } = req.body;
            if (!name || !price) {
                res.status(400).json({ success: false, message: "Tên và giá món ăn không được để trống" });
                return;
            }
            await menuItemSer.create(name, Number(price), description ?? null, categoryId ? Number(categoryId) : null);
            res.status(201).json({ success: true, message: "Tạo món ăn thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const { name, price, description, status, categoryId } = req.body;
            if (!name || !price) {
                res.status(400).json({ success: false, message: "Tên và giá món ăn không được để trống" });
                return;
            }
            await menuItemSer.update(id, name, Number(price), description ?? null, status ?? MenuStatus.AVAILABLE, categoryId ? Number(categoryId) : null);
            res.status(200).json({ success: true, message: "Cập nhật món ăn thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async updateStatus(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const { status } = req.body;
            if (!status || !Object.values(MenuStatus).includes(status)) {
                res.status(400).json({ success: false, message: "Trạng thái không hợp lệ" });
                return;
            }
            await menuItemSer.updateStatus(id, status as MenuStatus);
            res.status(200).json({ success: true, message: "Cập nhật trạng thái món ăn thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            await menuItemSer.delete(Number(req.params.id));
            res.status(200).json({ success: true, message: "Xóa món ăn thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

}
