import type { Request, Response } from "express";
import { CustomerService } from "../services/CustomerService.js";

const customerService = new CustomerService();

export class CustomerController {

    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const customers = await customerService.getAll();
            res.status(200).json({ success: true, data: customers });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const customer = await customerService.getById(Number(req.params.id));
            res.status(200).json({ success: true, data: customer });
        } catch (error) {
            res.status(404).json({ success: false, message: `${error}` });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            await customerService.delete(Number(req.params.id));
            res.status(200).json({ success: true, message: "Xóa khách hàng thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

}
