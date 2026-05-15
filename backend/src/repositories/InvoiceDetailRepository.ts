import InvoiceDetail from '../models/InvoiceDetail.js'
import { MenuItem } from '../models/MenuItem.js'
import { MenuStatus } from '../models/enums.js'
import { prisma } from "../config/prisma.js"

export default class InvoiceDetailRepository {

    private mapToInvoiceDetail(d: any): InvoiceDetail {
        const menuItem = d.menu_item ? new MenuItem(
            d.menu_item.id,
            d.menu_item.name,
            Number(d.menu_item.price),
            d.menu_item.description,
            d.menu_item.status as MenuStatus,
            null
        ) : null

        return new InvoiceDetail(
            d.id,
            d.quantity ?? 0,
            Number(d.unit_price ?? 0),
            Number(d.total_price ?? 0),
            menuItem
        )
    }

    async findAll(): Promise<InvoiceDetail[]> {
        try {
            const details = await prisma.invoice_detail.findMany({
                include: { menu_item: true }
            })
            return details.map((d: any) => this.mapToInvoiceDetail(d))
        } catch (error) {
            throw new Error(`Không thể lấy danh sách chi tiết hóa đơn: ${error}`)
        }
    }

    async findById(id: number): Promise<InvoiceDetail | null> {
        try {
            const d = await prisma.invoice_detail.findUnique({
                where: { id },
                include: { menu_item: true }
            })
            if (!d) return null
            return this.mapToInvoiceDetail(d)
        } catch (error) {
            throw new Error(`Không tìm thấy chi tiết hóa đơn với ID ${id}: ${error}`)
        }
    }

    async findByInvoice(invoiceId: number): Promise<InvoiceDetail[]> {
        try {
            const details = await prisma.invoice_detail.findMany({
                where: { invoice_id: invoiceId },
                include: { menu_item: true }
            })
            return details.map((d: any) => this.mapToInvoiceDetail(d))
        } catch (error) {
            throw new Error(`Không thể lấy chi tiết hóa đơn ID ${invoiceId}: ${error}`)
        }
    }

    async create(detail: InvoiceDetail, invoiceId: number): Promise<void> {
        try {
            await prisma.invoice_detail.create({
                data: {
                    quantity: detail.quantity,
                    unit_price: detail.unitPrice,
                    total_price: detail.totalPrice,
                    invoice_id: invoiceId,
                    menu_item_id: detail.menuItem?.id ?? null
                }
            })
        } catch (error) {
            throw new Error(`Không thể tạo chi tiết hóa đơn: ${error}`)
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await prisma.invoice_detail.delete({
                where: { id }
            })
        } catch (error) {
            throw new Error(`Không thể xóa chi tiết hóa đơn với ID ${id}: ${error}`)
        }
    }

    async deleteByInvoice(invoiceId: number): Promise<void> {
        try {
            await prisma.invoice_detail.deleteMany({
                where: { invoice_id: invoiceId }
            })
        } catch (error) {
            throw new Error(`Không thể xóa chi tiết của hóa đơn ID ${invoiceId}: ${error}`)
        }
    }

}