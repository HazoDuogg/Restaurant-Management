import { Request, Response } from "express";
import { TableService } from "../services/TableService.js";
import { TableStatus } from "../models/enums.js";

export class TableController {

    private tableService = new TableService();

    // GET /api/tables
    getAll = async (req: Request, res: Response): Promise<void> => {
        try {
            const tables = await this.tableService.getAll();
            res.status(200).json({
                success: true,
                data: tables
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Lỗi server"
            });
        }
    };

    // GET /api/tables/available
    getAvailable = async (req: Request, res: Response): Promise<void> => {
        try {
            const tables = await this.tableService.getAvailable();
            res.status(200).json({
                success: true,
                data: tables
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Lỗi server"
            });
        }
    };

    // GET /api/tables/status/:status
    getByStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const status = req.params.status as TableStatus;

            if (!Object.values(TableStatus).includes(status)) {
                res.status(400).json({
                    success: false,
                    message: `Trạng thái không hợp lệ. Các giá trị hợp lệ: ${Object.values(TableStatus).join(", ")}`
                });
                return;
            }

            const tables = await this.tableService.getByStatus(status);
            res.status(200).json({
                success: true,
                data: tables
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message || "Lỗi server"
            });
        }
    };

    // GET /api/tables/:id
    getById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: "ID không hợp lệ" });
                return;
            }

            const table = await this.tableService.getById(id);
            res.status(200).json({
                success: true,
                data: table
            });
        } catch (error: any) {
            const status = error.message.includes("không tồn tại") ? 404 : 500;
            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    };

    // POST /api/tables
    create = async (req: Request, res: Response): Promise<void> => {
        try {
            const { tableNumber, capacity } = req.body;

            if (tableNumber === undefined || capacity === undefined) {
                res.status(400).json({
                    success: false,
                    message: "Thiếu thông tin: tableNumber và capacity là bắt buộc"
                });
                return;
            }

            await this.tableService.create(Number(tableNumber), Number(capacity));
            res.status(201).json({
                success: true,
                message: "Tạo bàn thành công"
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    };

    // PUT /api/tables/:id
    update = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: "ID không hợp lệ" });
                return;
            }

            const { tableNumber, capacity } = req.body;

            if (tableNumber === undefined || capacity === undefined) {
                res.status(400).json({
                    success: false,
                    message: "Thiếu thông tin: tableNumber và capacity là bắt buộc"
                });
                return;
            }

            await this.tableService.update(id, Number(tableNumber), Number(capacity));
            res.status(200).json({
                success: true,
                message: "Cập nhật bàn thành công"
            });
        } catch (error: any) {
            const status = error.message.includes("không tồn tại") ? 404 : 400;
            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    };

    // PATCH /api/tables/:id/status
    updateStatus = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: "ID không hợp lệ" });
                return;
            }

            const { status } = req.body;

            if (!status || !Object.values(TableStatus).includes(status)) {
                res.status(400).json({
                    success: false,
                    message: `Trạng thái không hợp lệ. Các giá trị hợp lệ: ${Object.values(TableStatus).join(", ")}`
                });
                return;
            }

            await this.tableService.updateStatus(id, status as TableStatus);
            res.status(200).json({
                success: true,
                message: "Cập nhật trạng thái bàn thành công"
            });
        } catch (error: any) {
            const status = error.message.includes("không tồn tại") ? 404 : 400;
            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    };

    // DELETE /api/tables/:id
    delete = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                res.status(400).json({ success: false, message: "ID không hợp lệ" });
                return;
            }

            await this.tableService.delete(id);
            res.status(200).json({
                success: true,
                message: "Xóa bàn thành công"
            });
        } catch (error: any) {
            const status = error.message.includes("không tồn tại") ? 404
                : error.message.includes("đang có khách") ? 409
                    : 500;
            res.status(status).json({
                success: false,
                message: error.message
            });
        }
    };
}