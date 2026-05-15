import type { Request, Response } from "express";
import { OrderService } from "../services/OrderService.js";

const orderService = new OrderService();

export class OrderItemController {

    async addItem(req: Request, res: Response): Promise<void> {
        try {
            const orderId = parseInt(req.params.orderId as string);
            const { menuItemId, quantity } = req.body;

            if (!orderId || !menuItemId || !quantity) {
                res.status(400).json({ success: false, message: "Vui lòng cung cấp đủ ID món ăn và số lượng" });
                return;
            }

            await orderService.addItem(orderId, menuItemId, quantity);
            res.status(201).json({ success: true, message: "Thêm món vào đơn hàng thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async removeItem(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            await orderService.removeItem(id);
            res.status(200).json({ success: true, message: "Đã xóa món khỏi đơn hàng" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }
}