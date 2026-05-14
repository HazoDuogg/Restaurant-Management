import Payment from "../models/Payment.js";
import { InvoiceStatus, PaymentMethod, PaymentStatus } from "../models/enums.js";
import PaymentRepository from "../repositories/PaymentRepository.js";
import InvoiceRepository from "../repositories/InvoiceRepository.js";

export class PaymentService {

    private paymentRepo = new PaymentRepository();
    private invoiceRepo = new InvoiceRepository();

    async getAll(): Promise<Payment[]> {
        return await this.paymentRepo.findAll();
    }

    async getById(id: number): Promise<Payment> {
        const payment = await this.paymentRepo.findById(id);
        if (!payment) throw new Error(`Thanh toán với ID ${id} không tồn tại`);
        return payment;
    }

    async getByInvoice(invoiceId: number): Promise<Payment> {
        const payment = await this.paymentRepo.findByInvoice(invoiceId);
        if (!payment) throw new Error(`Chưa có thanh toán cho hóa đơn ID ${invoiceId}`);
        return payment;
    }

    async processPayment(invoiceId: number, paymentMethod: PaymentMethod): Promise<void> {
        const invoice = await this.invoiceRepo.findById(invoiceId);
        if (!invoice) throw new Error(`Hóa đơn với ID ${invoiceId} không tồn tại`);
        if (invoice.status === InvoiceStatus.PAID) throw new Error('Hóa đơn này đã được thanh toán');
        if (invoice.status === InvoiceStatus.CANCELLED) throw new Error('Hóa đơn đã bị hủy');

        const existing = await this.paymentRepo.findByInvoice(invoiceId);
        if (existing) throw new Error('Hóa đơn này đã có giao dịch thanh toán');

        const payment = new Payment(0, invoice.finalAmount, paymentMethod, PaymentStatus.COMPLETED, new Date(), null);
        await this.paymentRepo.create(payment, invoiceId);
        await this.invoiceRepo.updateStatus(invoiceId, InvoiceStatus.PAID);
    }

}
