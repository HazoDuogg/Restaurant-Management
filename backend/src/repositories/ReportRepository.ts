import Report from '../models/Report.js'
import { prisma } from "../config/prisma.js"

export default class ReportRepository {

    private mapToReport(r: any): Report {
        return new Report(
            r.id,
            r.from_date,
            r.to_date,
            r.total_revenue ? Number(r.total_revenue) : null,
            r.created_at
        )
    }

    async findAll(): Promise<Report[]> {
        try {
            const reports = await prisma.report.findMany()
            return reports.map((r: any) => this.mapToReport(r))
        } catch (error) {
            throw new Error(`Không thể lấy danh sách báo cáo: ${error}`)
        }
    }

    async findById(id: number): Promise<Report | null> {
        try {
            const r = await prisma.report.findUnique({
                where: { id }
            })
            if (!r) return null
            return this.mapToReport(r)
        } catch (error) {
            throw new Error(`Không tìm thấy báo cáo với ID ${id}: ${error}`)
        }
    }

    async findByDateRange(fromDate: Date, toDate: Date): Promise<Report[]> {
        try {
            const reports = await prisma.report.findMany({
                where: {
                    from_date: { gte: fromDate },
                    to_date: { lte: toDate }
                }
            })
            return reports.map((r: any) => this.mapToReport(r))
        } catch (error) {
            throw new Error(`Không thể lấy báo cáo theo khoảng thời gian: ${error}`)
        }
    }

    async create(report: Report): Promise<void> {
        try {
            await prisma.report.create({
                data: {
                    from_date: report.fromDate,
                    to_date: report.toDate,
                    total_revenue: report.totalRevenue,
                    created_at: report.createdAt ?? new Date()
                }
            })
        } catch (error) {
            throw new Error(`Không thể tạo báo cáo: ${error}`)
        }
    }

    async update(id: number, report: Report): Promise<void> {
        try {
            await prisma.report.update({
                where: { id },
                data: {
                    from_date: report.fromDate,
                    to_date: report.toDate,
                    total_revenue: report.totalRevenue
                }
            })
        } catch (error) {
            throw new Error(`Không thể cập nhật báo cáo với ID ${id}: ${error}`)
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await prisma.report.delete({
                where: { id }
            })
        } catch (error) {
            throw new Error(`Không thể xóa báo cáo với ID ${id}: ${error}`)
        }
    }

}