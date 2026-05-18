import Invoice from "../models/Invoice.js";
import { InvoiceStatus, OrderStatus } from "../models/enums.js";
import InvoiceRepository from "../repositories/InvoiceRepository.js";
import InvoiceDetailRepository from "../repositories/InvoiceDetailRepository.js";
import OrderRepository from "../repositories/OrderRepository.js";

export class InvoiceService {

    private invoiceRepo = new InvoiceRepository();
    private invoiceDetailRepo = new InvoiceDetailRepository();
    private orderRepo = new OrderRepository();

    async getAll(): Promise<Invoice[]> {
        return await this.invoiceRepo.findAll();
    }

    async getById(id: number): Promise<Invoice> {
        const invoice = await this.invoiceRepo.findById(id);
        if (!invoice) throw new Error(`Hóa đơn với ID ${id} không tồn tại`);
        return invoice;
    }

    async getByOrder(orderId: number): Promise<Invoice> {
        const invoice = await this.invoiceRepo.findByOrder(orderId);
        if (!invoice) throw new Error(`Chưa có hóa đơn cho order ID ${orderId}`);
        return invoice;
    }

    async generateFromOrder(orderId: number, taxRate: number = 0, discount: number = 0): Promise<number> {
        const order = await this.orderRepo.findById(orderId);
        if (!order) throw new Error(`Order với ID ${orderId} không tồn tại`);
        if (order.status !== OrderStatus.COMPLETED) throw new Error('Chỉ tạo hóa đơn cho order đã hoàn thành');

        const existing = await this.invoiceRepo.findByOrder(orderId);
        if (existing) throw new Error('Hóa đơn cho order này đã tồn tại');

        const totalAmount = order.calculateTotal();
        const tax = totalAmount * taxRate;
        const finalAmount = totalAmount + tax - discount;
        const invoiceCode = `INV-${Date.now()}`;

        const invoice = new Invoice(0, invoiceCode, new Date(), totalAmount, tax, discount, finalAmount, InvoiceStatus.PENDING, order);
        await this.invoiceRepo.create(invoice);

        const created = await this.invoiceRepo.findByOrder(orderId);
        if (!created) throw new Error('Không thể tạo hóa đơn');

        for (const item of order.items) {
            await this.invoiceDetailRepo.create(
                { quantity: item.quantity, unitPrice: item.unitPrice, totalPrice: item.calculateTotal(), menuItem: item.menuItem } as any,
                created.id
            );
        }

        return created.id;
    }

    async markAsPaid(id: number): Promise<void> {
        const invoice = await this.invoiceRepo.findById(id);
        if (!invoice) throw new Error(`Hóa đơn với ID ${id} không tồn tại`);
        if (invoice.status === InvoiceStatus.PAID) throw new Error('Hóa đơn đã được thanh toán');
        await this.invoiceRepo.updateStatus(id, InvoiceStatus.PAID);
    }

    async cancel(id: number): Promise<void> {
        const invoice = await this.invoiceRepo.findById(id);
        if (!invoice) throw new Error(`Hóa đơn với ID ${id} không tồn tại`);
        if (invoice.status === InvoiceStatus.PAID) throw new Error('Không thể hủy hóa đơn đã thanh toán');
        await this.invoiceRepo.updateStatus(id, InvoiceStatus.CANCELLED);
    }

}
