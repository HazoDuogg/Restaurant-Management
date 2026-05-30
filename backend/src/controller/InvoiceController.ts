import type { Request, Response } from "express";
import { InvoiceService } from "../services/InvoiceService.js";
import InvoiceDetailRepository from "../repositories/InvoiceDetailRepository.js";

const invoiceService = new InvoiceService();
const invoiceDetailRepo = new InvoiceDetailRepository();

export class InvoiceController {

    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const invoices = await invoiceService.getAll();
            res.status(200).json({ success: true, data: invoices });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const invoice = await invoiceService.getById(Number(req.params.id));
            res.status(200).json({ success: true, data: invoice });
        } catch (error) {
            res.status(404).json({ success: false, message: `${error}` });
        }
    }

    async getByOrder(req: Request, res: Response): Promise<void> {
        try {
            const invoice = await invoiceService.getByOrder(Number(req.params.orderId));
            res.status(200).json({ success: true, data: invoice });
        } catch (error) {
            res.status(404).json({ success: false, message: `${error}` });
        }
    }

    async generateFromOrder(req: Request, res: Response): Promise<void> {
        try {
            const { orderId, taxRate, discount } = req.body;
            if (!orderId) {
                res.status(400).json({ success: false, message: "Mã đơn hàng không được để trống" });
                return;
            }
            const invoiceId = await invoiceService.generateFromOrder(
                Number(orderId),
                taxRate ? Number(taxRate) : 0,
                discount ? Number(discount) : 0
            );
            res.status(201).json({ success: true, data: { invoiceId }, message: "Tạo hóa đơn thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async markAsPaid(req: Request, res: Response): Promise<void> {
        try {
            await invoiceService.markAsPaid(Number(req.params.id));
            res.status(200).json({ success: true, message: "Đánh dấu hóa đơn đã thanh toán thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async cancel(req: Request, res: Response): Promise<void> {
        try {
            await invoiceService.cancel(Number(req.params.id));
            res.status(200).json({ success: true, message: "Hủy hóa đơn thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async getDetailsByInvoice(req: Request, res: Response): Promise<void> {
        try {
            const details = await invoiceDetailRepo.findByInvoice(Number(req.params.id));
            res.status(200).json({ success: true, data: details });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

}
