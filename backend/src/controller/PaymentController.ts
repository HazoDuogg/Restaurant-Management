import type { Request, Response } from "express";
import { PaymentService } from "../services/PaymentService.js";
import { PaymentMethod } from "../models/enums.js";

const paymentService = new PaymentService();

export class PaymentController {

    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const payments = await paymentService.getAll();
            res.status(200).json({ success: true, data: payments });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const payment = await paymentService.getById(Number(req.params.id));
            res.status(200).json({ success: true, data: payment });
        } catch (error) {
            res.status(404).json({ success: false, message: `${error}` });
        }
    }

    async getByInvoice(req: Request, res: Response): Promise<void> {
        try {
            const payment = await paymentService.getByInvoice(Number(req.params.invoiceId));
            res.status(200).json({ success: true, data: payment });
        } catch (error) {
            res.status(404).json({ success: false, message: `${error}` });
        }
    }

    async processPayment(req: Request, res: Response): Promise<void> {
        try {
            const { invoiceId, paymentMethod } = req.body;
            if (!invoiceId || !paymentMethod) {
                res.status(400).json({ success: false, message: "Mã hóa đơn và phương thức thanh toán không được để trống" });
                return;
            }
            if (!Object.values(PaymentMethod).includes(paymentMethod)) {
                res.status(400).json({ success: false, message: "Phương thức thanh toán không hợp lệ" });
                return;
            }
            await paymentService.processPayment(Number(invoiceId), paymentMethod as PaymentMethod);
            res.status(201).json({ success: true, message: "Thanh toán thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

}
