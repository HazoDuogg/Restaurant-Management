import type { Request, Response } from "express";
import { OrderService } from "../services/OrderService.js";
import { OrderStatus } from "../models/enums.js";

const orderService = new OrderService();

export class OrderController {

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const orders = await orderService.getAll();
            res.status(200).json({ success: true, data: orders });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            const order = await orderService.getById(id);
            res.status(200).json({ success: true, data: order });
        } catch (error) {
            res.status(404).json({ success: false, message: `${error}` });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { staffId, tableId, customerId } = req.body;
            if (!staffId || !tableId) {
                res.status(400).json({ success: false, message: "Vui lòng truyền đủ staffId và tableId" });
                return;
            }
            await orderService.create(staffId, tableId, customerId ?? null);
            res.status(201).json({ success: true, message: "Tạo đơn hàng thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async confirm(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            await orderService.confirm(id);
            res.status(200).json({ success: true, message: "Đã xác nhận đơn hàng" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async complete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            await orderService.complete(id);
            res.status(200).json({ success: true, message: "Đơn hàng đã hoàn thành" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async cancel(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id as string);
            await orderService.cancel(id);
            res.status(200).json({ success: true, message: "Đã hủy đơn hàng" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }
}
