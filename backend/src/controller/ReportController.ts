import type { Request, Response } from "express";
import { ReportService } from "../services/ReportService.js";

const reportService = new ReportService();

export class ReportController {

    async getAll(_req: Request, res: Response): Promise<void> {
        try {
            const reports = await reportService.getAll();
            res.status(200).json({ success: true, data: reports });
        } catch (error) {
            res.status(500).json({ success: false, message: `${error}` });
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const report = await reportService.getById(Number(req.params.id));
            res.status(200).json({ success: true, data: report });
        } catch (error) {
            res.status(404).json({ success: false, message: `${error}` });
        }
    }

    async generate(req: Request, res: Response): Promise<void> {
        try {
            const { fromDate, toDate } = req.body;
            if (!fromDate || !toDate) {
                res.status(400).json({ success: false, message: "Vui lòng nhập ngày bắt đầu và ngày kết thúc" });
                return;
            }
            const report = await reportService.generate(new Date(fromDate), new Date(toDate));
            res.status(201).json({ success: true, message: "Tạo báo cáo thành công", data: report });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async getByDateRange(req: Request, res: Response): Promise<void> {
        try {
            const { fromDate, toDate } = req.query;
            if (!fromDate || !toDate) {
                res.status(400).json({ success: false, message: "Vui lòng nhập ngày bắt đầu và ngày kết thúc" });
                return;
            }
            const reports = await reportService.getByDateRange(new Date(fromDate as string), new Date(toDate as string));
            res.status(200).json({ success: true, data: reports });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

    async getStats(req: Request, res: Response): Promise<void> {
        try {
            const { fromDate, toDate } = req.query;
            if (!fromDate || !toDate) {
                res.status(400).json({ success: false, message: "Vui lòng nhập ngày bắt đầu và ngày kết thúc" });
                return;
            }
            const stats = await reportService.getStats(new Date(fromDate as string), new Date(toDate as string));
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            res.status(400).json({ success: false, message: `${error}` });
        }
    }

}
