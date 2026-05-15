import Report from "../models/Report.js";
import ReportRepository from "../repositories/ReportRepository.js";
import { prisma } from "../config/prisma.js";

export class ReportService {

    private reportRepo = new ReportRepository();

    async getAll(): Promise<Report[]> {
        return await this.reportRepo.findAll();
    }

    async getById(id: number): Promise<Report> {
        const report = await this.reportRepo.findById(id);
        if (!report) throw new Error(`Báo cáo với ID ${id} không tồn tại`);
        return report;
    }

    async generate(fromDate: Date, toDate: Date): Promise<Report> {
        if (fromDate > toDate) throw new Error('Ngày bắt đầu phải trước ngày kết thúc');

        const result = await prisma.invoice.aggregate({
            _sum: { final_amount: true },
            where: {
                status: 'PAID',
                created_time: { gte: fromDate, lte: toDate }
            }
        });

        const totalRevenue = Number(result._sum.final_amount ?? 0);
        const report = new Report(0, fromDate, toDate, totalRevenue, new Date());
        await this.reportRepo.create(report);

        const reports = await this.reportRepo.findByDateRange(fromDate, toDate);
        return reports[reports.length - 1];
    }

    async getByDateRange(fromDate: Date, toDate: Date): Promise<Report[]> {
        if (fromDate > toDate) throw new Error('Ngày bắt đầu phải trước ngày kết thúc');
        return await this.reportRepo.findByDateRange(fromDate, toDate);
    }

}
