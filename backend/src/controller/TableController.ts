import type { Request, Response } from "express";
import { TableService } from "../services/TableService.js";
import { TableStatus, TableType } from "../models/enums.js";

const tableService = new TableService();

export class TableController {

    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const tables = await tableService.getAll();
            res.status(200).json({ success: true, data: tables });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const table = await tableService.getById(Number(req.params.id));
            res.status(200).json({ success: true, data: table });
        } catch (error) {
            res.status(404).json({ success: false, message: `${error}` });
        }
    }

    async getAvailable(_req: Request, res: Response): Promise<void> {
        try {
            const tables = await tableService.getAvailable();
            res.status(200).json({ success: true, data: tables });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async getByStatus(req: Request, res: Response): Promise<void> {
        try {
            const { status } = req.params;
            if (!Object.values(TableStatus).includes(status as TableStatus)) {
                res.status(400).json({ success: false, message: "Trạng thái không hợp lệ" });
                return;
            }
            const tables = await tableService.getByStatus(status as TableStatus);
            res.status(200).json({ success: true, data: tables });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const { tableNumber, capacity, type } = req.body;
            if (!tableNumber || !capacity) {
                res.status(400).json({ success: false, message: "Số bàn và sức chứa không được để trống" });
                return;
            }
            const tableType = Object.values(TableType).includes(type) ? type as TableType : TableType.NORMAL;
            await tableService.create(Number(tableNumber), Number(capacity), tableType);
            res.status(201).json({ success: true, message: "Tạo bàn thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const { tableNumber, capacity } = req.body;
            if (!tableNumber || !capacity) {
                res.status(400).json({ success: false, message: "Số bàn và sức chứa không được để trống" });
                return;
            }
            await tableService.update(id, Number(tableNumber), Number(capacity));
            res.status(200).json({ success: true, message: "Cập nhật bàn thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async updateStatus(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const { status } = req.body;
            if (!status || !Object.values(TableStatus).includes(status)) {
                res.status(400).json({ success: false, message: "Trạng thái không hợp lệ" });
                return;
            }
            await tableService.updateStatus(id, status as TableStatus);
            res.status(200).json({ success: true, message: "Cập nhật trạng thái bàn thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            await tableService.delete(Number(req.params.id));
            res.status(200).json({ success: true, message: "Xóa bàn thành công" });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

}
