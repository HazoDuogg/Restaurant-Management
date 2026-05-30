import type { Request, Response } from "express";
import { OrderService } from "../services/OrderService.js";
import { OrderStatus } from "../models/enums.js";
import OrderItemRepository from "../repositories/OrderItemRepository.js";

const orderService = new OrderService();
const orderItemRepo = new OrderItemRepository();

export class OrderController {

    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const orders = await orderService.getAll();
            res.status(200).json({ success: true, data: orders });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const order = await orderService.getById(Number(req.params.id));
            res.status(200).json({ success: true, data: order });
        } catch (error) {
            res.status(404).json({ success: false, message: `${error}` });
        }
    }

    async getByTable(req: Request, res: Response): Promise<void> {
        try {
            const orders = await orderService.getByTable(Number(req.params.tableId));
            res.status(200).json({ success: true, data: orders });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async getByStatus(req: Request, res: Response): Promise<void> {
        try {
            const { status } = req.params;
            if (!Object.values(OrderStatus).includes(status as OrderStatus)) {
                res.status(400).json({ success: false, message: "Trạng thái không hợp lệ" });
                return;
            }
            const orders = await orderService.getByStatus(status as OrderStatus);
            res.status(200).json({ success: true, data: orders });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { staffId, tableId, customerId } = req.body;
            if (!staffId || !tableId) {
                res.status(400).json({ success: false, message: "Nhân viên và bàn không được để trống" });
                return;
            }
            const orderId = await orderService.create(Number(staffId), Number(tableId), customerId ? Number(customerId) : null);
            res.status(201).json({ success: true, data: { orderId }, message: "Tạo đơn hàng thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async addItem(req: Request, res: Response): Promise<void> {
        try {
            const orderId = Number(req.params.id);
            const { menuItemId, quantity } = req.body;
            if (!menuItemId || !quantity) {
                res.status(400).json({ success: false, message: "Món ăn và số lượng không được để trống" });
                return;
            }
            await orderService.addItem(orderId, Number(menuItemId), Number(quantity));
            res.status(200).json({ success: true, message: "Thêm món vào đơn hàng thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async removeItem(req: Request, res: Response): Promise<void> {
        try {
            await orderService.removeItem(Number(req.params.itemId));
            res.status(200).json({ success: true, message: "Xóa món khỏi đơn hàng thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async confirm(req: Request, res: Response): Promise<void> {
        try {
            await orderService.confirm(Number(req.params.id));
            res.status(200).json({ success: true, message: "Xác nhận đơn hàng thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async complete(req: Request, res: Response): Promise<void> {
        try {
            await orderService.complete(Number(req.params.id));
            res.status(200).json({ success: true, message: "Hoàn thành đơn hàng thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async cancel(req: Request, res: Response): Promise<void> {
        try {
            await orderService.cancel(Number(req.params.id));
            res.status(200).json({ success: true, message: "Hủy đơn hàng thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async getItemsByOrder(req: Request, res: Response): Promise<void> {
        try {
            const items = await orderItemRepo.findByOrder(Number(req.params.id));
            res.status(200).json({ success: true, data: items });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

}
