import { PrismaClient } from "@prisma/client/extension";
import Invoice from "../models/Invoice.js";
import InvoiceDetail from "../models/InvoiceDetail.js";
import Order from "../models/Order.js";
import { InvoiceStatus, OrderStatus, TableStatus, MenuStatus } from "../models/enums.js";

const prisma = new PrismaClient();

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

}