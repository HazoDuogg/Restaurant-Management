import Payment from '../models/Payment.js'
import { PaymentMethod, PaymentStatus } from '../models/enums.js'
import { prisma } from "../config/prisma.js"

export default class PaymentRepository {

    private mapToPayment(p: any): Payment {
        return new Payment(
            p.id,
            Number(p.amount),
            p.payment_method as PaymentMethod,
            p.status as PaymentStatus,
            p.payment_time,
            null
        )
    }

    async findAll(): Promise<Payment[]> {
        try {
            const payments = await prisma.payment.findMany()
            return payments.map((p: any) => this.mapToPayment(p))
        } catch (error) {
            throw new Error(`Không thể lấy danh sách thanh toán: ${error}`)
        }
    }

    async findById(id: number): Promise<Payment | null> {
        try {
            const p = await prisma.payment.findUnique({
                where: { id }
            })
            if (!p) return null
            return this.mapToPayment(p)
        } catch (error) {
            throw new Error(`Không tìm thấy thanh toán với ID ${id}: ${error}`)
        }
    }

    async findByInvoice(invoiceId: number): Promise<Payment | null> {
        try {
            const p = await prisma.payment.findUnique({
                where: { invoice_id: invoiceId }
            })
            if (!p) return null
            return this.mapToPayment(p)
        } catch (error) {
            throw new Error(`Không tìm thấy thanh toán của hóa đơn ID ${invoiceId}: ${error}`)
        }
    }

    async findByStatus(status: PaymentStatus): Promise<Payment[]> {
        try {
            const payments = await prisma.payment.findMany({
                where: { status }
            })
            return payments.map((p: any) => this.mapToPayment(p))
        } catch (error) {
            throw new Error(`Không thể lấy danh sách thanh toán theo trạng thái "${status}": ${error}`)
        }
    }

    async create(payment: Payment, invoiceId: number): Promise<void> {
        try {
            await prisma.payment.create({
                data: {
                    amount: payment.amount,
                    payment_method: payment.paymentMethod,
                    status: payment.status,
                    payment_time: payment.paymentTime,
                    invoice_id: invoiceId
                }
            })
        } catch (error) {
            throw new Error(`Không thể tạo thanh toán: ${error}`)
        }
    }

    async updateStatus(id: number, status: PaymentStatus): Promise<void> {
        try {
            await prisma.payment.update({
                where: { id },
                data: { status }
            })
        } catch (error) {
            throw new Error(`Không thể cập nhật trạng thái thanh toán với ID ${id}: ${error}`)
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await prisma.payment.delete({
                where: { id }
            })
        } catch (error) {
            throw new Error(`Không thể xóa thanh toán với ID ${id}: ${error}`)
        }
    }

}