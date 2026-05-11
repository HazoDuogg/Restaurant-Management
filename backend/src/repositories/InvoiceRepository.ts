import Invoice from "../models/Invoice.js";
import InvoiceDetail from "../models/InvoiceDetail.js";
import Order from "../models/Order.js";
import { InvoiceStatus, OrderStatus, TableStatus, MenuStatus } from "../models/enums.js";
import { prisma } from "../config/prisma.js"

export default class InvoiceRepository {

    private mapToInvoice(value: any): Invoice {
        const invoice = new Invoice(
            value.id,
            value.invoice_code ?? '',
            value.created_time ?? new Date(),
            Number(value.total_amount ?? 0),
            Number(value.tax ?? 0),
            Number(value.discount ?? 0),
            Number(value.final_amount ?? 0),
            value.status as InvoiceStatus,
            null
        );

        if (value.order) {
            const order = new Order(
                value.order.id,
                value.order.order_time,
                value.order.status as OrderStatus,
                Number(value.order.total_amount ?? 0),
                null, null,
                value.order.table ? {
                    id: value.order.table.id,
                    tableNumber: value.order.table.table_number,
                    capacity: value.order.table.capacity ?? 0,
                    status: value.order.table.status as TableStatus
                } as any : null
            );
            invoice.order = order;
        }
        if (value.invoice_detail) {
            value.invoice_detail.forEach((d: any) => {
                const menuItem = d.menu_item ? {
                    id: d.menu_item.id,
                    name: d.menu_item.name,
                    price: Number(d.menu_item.price),
                    description: d.menu_item.description,
                    status: d.menu_item.status as MenuStatus,
                    category: null
                } as any : null;
                const details = new InvoiceDetail(
                    d.id,
                    d.quantity ?? 0,
                    Number(d.unit_price ?? 0),
                    Number(d.total_price ?? 0),
                    menuItem
                );
                invoice.details.push(details);
            })
        }
        return invoice;
    }

    async findAll(): Promise<Invoice[]> {
        try {
            const invoices = await prisma.invoice.findMany({
                include: {
                    order: { include: { table: true } },
                    invoice_details: { include: { menu_item: true } }
                }
            })
            return invoices.map((i: any) => this.mapToInvoice(i))
        } catch (error) {
            throw new Error(`Không thể lấy danh sách hóa đơn: ${error}`)
        }
    }

    async findById(id: number): Promise<Invoice | null> {
        try {
            const i = await prisma.invoice.findUnique({
                where: { id },
                include: {
                    order: { include: { table: true } },
                    invoice_details: { include: { menu_item: true } }
                }
            })
            if (!i) return null
            return this.mapToInvoice(i)
        } catch (error) {
            throw new Error(`Không tìm thấy hóa đơn với ID ${id}: ${error}`)
        }
    }

    async findByInvoiceCode(invoiceCode: string): Promise<Invoice | null> {
        try {
            const i = await prisma.invoice.findUnique({
                where: { invoice_code: invoiceCode },
                include: {
                    order: { include: { table: true } },
                    invoice_details: { include: { menu_item: true } }
                }
            })
            if (!i) return null
            return this.mapToInvoice(i)
        } catch (error) {
            throw new Error(`Không tìm thấy hóa đơn với mã ${invoiceCode}: ${error}`)
        }
    }

    async findByStatus(status: InvoiceStatus): Promise<Invoice[]> {
        try {
            const invoices = await prisma.invoice.findMany({
                where: { status },
                include: {
                    order: { include: { table: true } },
                    invoice_details: { include: { menu_item: true } }
                }
            })
            return invoices.map((i: any) => this.mapToInvoice(i))
        } catch (error) {
            throw new Error(`Không thể lấy danh sách hóa đơn theo trạng thái "${status}": ${error}`)
        }
    }

    async findByOrder(orderId: number): Promise<Invoice | null> {
        try {
            const i = await prisma.invoice.findUnique({
                where: { order_id: orderId },
                include: {
                    order: { include: { table: true } },
                    invoice_details: { include: { menu_item: true } }
                }
            })
            if (!i) return null
            return this.mapToInvoice(i)
        } catch (error) {
            throw new Error(`Không tìm thấy hóa đơn của order ID ${orderId}: ${error}`)
        }
    }

    async create(invoice: Invoice): Promise<void> {
        try {
            await prisma.invoice.create({
                data: {
                    invoice_code: invoice.invoiceCode,
                    created_time: invoice.createdTime,
                    total_amount: invoice.totalAmount,
                    tax: invoice.tax,
                    discount: invoice.discount,
                    final_amount: invoice.finalAmount,
                    status: invoice.status,
                    order_id: invoice.order?.id ?? null
                }
            })
        } catch (error) {
            throw new Error(`Không thể tạo hóa đơn: ${error}`)
        }
    }

    async update(id: number, invoice: Invoice): Promise<void> {
        try {
            await prisma.invoice.update({
                where: { id },
                data: {
                    total_amount: invoice.totalAmount,
                    tax: invoice.tax,
                    discount: invoice.discount,
                    final_amount: invoice.finalAmount,
                    status: invoice.status
                }
            })
        } catch (error) {
            throw new Error(`Không thể cập nhật hóa đơn với ID ${id}: ${error}`)
        }
    }

    async updateStatus(id: number, status: InvoiceStatus): Promise<void> {
        try {
            await prisma.invoice.update({
                where: { id },
                data: { status }
            })
        } catch (error) {
            throw new Error(`Không thể cập nhật trạng thái hóa đơn với ID ${id}: ${error}`)
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await prisma.invoice.delete({
                where: { id }
            })
        } catch (error) {
            throw new Error(`Không thể xóa hóa đơn với ID ${id}: ${error}`)
        }
    }

}