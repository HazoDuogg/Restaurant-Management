import type { Request, Response } from "express";
import { MenuService } from "../services/MenuService.js";

const menuService = new MenuService();

export class MenuController {

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const menus = await menuService.getAll();
            res.status(200).json({ success: true, data: menus });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            const menu = await menuService.getById(id);
            res.status(200).json({ success: true, data: menu });
        } catch (error) {
            res.status(404).json({ success: false, message: `${error}` });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { name, price, categoryId, description } = req.body;
            if (!name || !price || !categoryId) {
                res.status(400).json({ success: false, message: "Tên món, giá và danh mục không được để trống" });
                return;
            }
            await menuService.create(name, price, categoryId, description ?? null);
            res.status(201).json({ success: true, message: "Tạo món ăn thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            const { name, price, categoryId, description } = req.body;

            if (!name || !price || !categoryId) {
                res.status(400).json({ success: false, message: "Tên món, giá và danh mục không được để trống" });
                return;
            }

            await menuService.update(id, name, price, categoryId, description ?? null);
            res.status(200).json({ success: true, message: "Cập nhật món ăn thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

}