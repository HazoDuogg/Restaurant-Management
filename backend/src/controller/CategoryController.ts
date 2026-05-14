import type { Request, Response } from "express";
import { CategoryService } from "../services/CategoryService.js";

const categoryService = new CategoryService();

export class CategoryController {

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const categories = await categoryService.getAll();
            res.status(200).json({ success: true, data: categories });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            const category = await categoryService.getById(id);
            res.status(200).json({ success: true, data: category });
        } catch (error) {
            res.status(404).json({ success: false, message: `${error}` });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { name, description } = req.body;
            if (!name) {
                res.status(400).json({ success: false, message: "Tên danh mục không được để trống" });
                return;
            }
            await categoryService.create(name, description ?? null);
            res.status(201).json({ success: true, message: "Tạo danh mục thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            const { name, description } = req.body;
            if (!name) {
                res.status(400).json({ success: false, message: "Tên danh mục không được để trống" });
                return;
            }
            await categoryService.update(id, name, description ?? null);
            res.status(200).json({ success: true, message: "Cập nhật danh mục thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            await categoryService.delete(id);
            res.status(200).json({ success: true, message: "Xóa danh mục thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

}
