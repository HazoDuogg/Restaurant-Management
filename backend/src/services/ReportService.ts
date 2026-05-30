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

    async getStats(fromDate: Date, toDate: Date) {
        if (fromDate > toDate) throw new Error('Ngày bắt đầu phải trước ngày kết thúc');

        const toDateEnd = new Date(toDate);
        toDateEnd.setHours(23, 59, 59, 999);

        // Kỳ trước (cùng độ dài)
        const duration = toDateEnd.getTime() - fromDate.getTime();
        const prevFromDate = new Date(fromDate.getTime() - duration - 1);
        const prevToDate = new Date(fromDate.getTime() - 1);

        // Lấy hóa đơn đã thanh toán kèm chi tiết
        const invoices = await prisma.invoice.findMany({
            where: { status: 'PAID', created_time: { gte: fromDate, lte: toDateEnd } },
            include: {
                order: true,
                invoice_details: {
                    include: { menu_item: { include: { category: true } } }
                }
            }
        });

        // Lấy hóa đơn kỳ trước để so sánh
        const prevInvoices = await prisma.invoice.findMany({
            where: { status: 'PAID', created_time: { gte: prevFromDate, lte: prevToDate } },
            include: { order: true }
        });

        // --- KPIs ---
        const totalRevenue = invoices.reduce((s, inv) => s + Number(inv.final_amount), 0);
        const totalOrders = invoices.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const customerIds = new Set(invoices.map(inv => inv.order?.customer_id).filter(Boolean));
        const totalCustomers = customerIds.size;

        const prevTotalRevenue = prevInvoices.reduce((s, inv) => s + Number(inv.final_amount), 0);
        const prevTotalOrders = prevInvoices.length;
        const prevAvgOrderValue = prevTotalOrders > 0 ? prevTotalRevenue / prevTotalOrders : 0;
        const prevCustomerIds = new Set(prevInvoices.map(inv => inv.order?.customer_id).filter(Boolean));
        const prevTotalCustomers = prevCustomerIds.size;

        const calcPct = (curr: number, prev: number) =>
            prev === 0 ? null : Math.round(((curr - prev) / prev) * 1000) / 10;

        // --- Doanh thu theo ngày ---
        const dayMap: Record<number, number> = {};
        const cursor = new Date(fromDate);
        while (cursor <= toDateEnd) {
            dayMap[cursor.getDate()] = 0;
            cursor.setDate(cursor.getDate() + 1);
        }
        for (const inv of invoices) {
            if (!inv.created_time) continue;
            const day = new Date(inv.created_time).getDate();
            if (day in dayMap) dayMap[day] += Number(inv.final_amount);
        }
        const revenueByDay = Object.entries(dayMap).map(([day, revenue]) => ({
            day: Number(day), revenue
        }));

        // --- Doanh thu theo danh mục ---
        const catMap: Record<string, number> = {};
        for (const inv of invoices) {
            for (const detail of inv.invoice_details) {
                const cat = detail.menu_item?.category?.name ?? 'Khác';
                catMap[cat] = (catMap[cat] ?? 0) + Number(detail.total_price ?? 0);
            }
        }
        const totalCatRevenue = Object.values(catMap).reduce((s, v) => s + v, 0) || 1;
        const categoryColors = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];
        const revenueByCategory = Object.entries(catMap)
            .sort((a, b) => b[1] - a[1])
            .map(([name, revenue], i) => ({
                name, revenue,
                pct: Math.round((revenue / totalCatRevenue) * 100),
                color: categoryColors[i % categoryColors.length]
            }));

        // --- Top 5 món ---
        const dishMap: Record<number, { name: string; price: number; categoryName: string; quantity: number; revenue: number }> = {};
        for (const inv of invoices) {
            for (const detail of inv.invoice_details) {
                if (!detail.menu_item_id) continue;
                const id = detail.menu_item_id;
                if (!dishMap[id]) {
                    dishMap[id] = {
                        name: detail.menu_item?.name ?? 'Không rõ',
                        price: Number(detail.menu_item?.price ?? 0),
                        categoryName: detail.menu_item?.category?.name ?? 'Khác',
                        quantity: 0, revenue: 0
                    };
                }
                dishMap[id].quantity += detail.quantity ?? 0;
                dishMap[id].revenue += Number(detail.total_price ?? 0);
            }
        }
        const topDishes = Object.values(dishMap)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
            .map((dish, i) => ({
                rank: i + 1, ...dish,
                pct: totalRevenue > 0 ? Math.round((dish.revenue / totalRevenue) * 1000) / 10 : 0
            }));

        // --- Doanh thu theo ca (giờ Việt Nam = UTC+7) ---
        let morningRevenue = 0, afternoonRevenue = 0, eveningRevenue = 0;
        for (const inv of invoices) {
            if (!inv.created_time) continue;
            const hour = (new Date(inv.created_time).getUTCHours() + 7) % 24;
            const amt = Number(inv.final_amount);
            if (hour >= 10 && hour < 14) morningRevenue += amt;
            else if (hour >= 14 && hour < 17) afternoonRevenue += amt;
            else eveningRevenue += amt;
        }
        const shiftTotal = morningRevenue + afternoonRevenue + eveningRevenue || 1;

        // --- So sánh 3 tháng gần nhất ---
        const endMonth = new Date(toDateEnd.getFullYear(), toDateEnd.getMonth(), 1);
        const monthlyComparison = await Promise.all(
            [0, 1, 2].map(async (offset) => {
                const mStart = new Date(endMonth.getFullYear(), endMonth.getMonth() - offset, 1);
                const mEnd = new Date(endMonth.getFullYear(), endMonth.getMonth() - offset + 1, 0, 23, 59, 59, 999);
                const pmStart = new Date(mStart.getFullYear(), mStart.getMonth() - 1, 1);
                const pmEnd = new Date(mStart.getFullYear(), mStart.getMonth(), 0, 23, 59, 59, 999);
                const [curr, prev] = await Promise.all([
                    prisma.invoice.aggregate({
                        _sum: { final_amount: true }, _count: true,
                        where: { status: 'PAID', created_time: { gte: mStart, lte: mEnd } }
                    }),
                    prisma.invoice.aggregate({
                        _sum: { final_amount: true },
                        where: { status: 'PAID', created_time: { gte: pmStart, lte: pmEnd } }
                    })
                ]);
                const rev = Number(curr._sum.final_amount ?? 0);
                const prevRev = Number(prev._sum.final_amount ?? 0);
                const growth = calcPct(rev, prevRev);
                return {
                    month: `Tháng ${mStart.getMonth() + 1}/${mStart.getFullYear()}`,
                    revenue: rev, orders: curr._count,
                    growth, up: growth !== null ? growth >= 0 : true,
                    highlight: offset === 0
                };
            })
        );

        return {
            kpis: {
                totalRevenue, prevTotalRevenue, revenuePct: calcPct(totalRevenue, prevTotalRevenue),
                totalOrders, prevTotalOrders, ordersPct: calcPct(totalOrders, prevTotalOrders),
                avgOrderValue, prevAvgOrderValue, avgPct: calcPct(avgOrderValue, prevAvgOrderValue),
                totalCustomers, prevTotalCustomers, customersPct: calcPct(totalCustomers, prevTotalCustomers)
            },
            revenueByDay,
            revenueByCategory,
            topDishes,
            revenueByShift: {
                morning: { revenue: morningRevenue, pct: Math.round(morningRevenue / shiftTotal * 100) },
                afternoon: { revenue: afternoonRevenue, pct: Math.round(afternoonRevenue / shiftTotal * 100) },
                evening: { revenue: eveningRevenue, pct: Math.round(eveningRevenue / shiftTotal * 100) }
            },
            monthlyComparison
        };
    }

}
