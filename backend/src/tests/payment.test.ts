import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPaymentRepo = vi.hoisted(() => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    findByInvoice: vi.fn(),
    create: vi.fn(),
}));

const mockInvoiceRepo = vi.hoisted(() => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    findByOrder: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
}));

vi.mock('../repositories/PaymentRepository.js', () => ({
    default: vi.fn(function () { return mockPaymentRepo; }),
}));
vi.mock('../repositories/InvoiceRepository.js', () => ({
    default: vi.fn(function () { return mockInvoiceRepo; }),
}));

import { PaymentService } from '../services/PaymentService.js';
import Invoice from '../models/Invoice.js';
import { InvoiceStatus, PaymentMethod } from '../models/enums.js';

beforeEach(() => {
    vi.clearAllMocks();
});

// TC-030: TR30
describe('TC-030: processPayment hóa đơn PENDING hợp lệ', () => {
    it('không ném lỗi, gọi paymentRepo.create và cập nhật invoice thành PAID', async () => {
        const pendingInvoice = new Invoice(1, 'INV-001', new Date(), 200000, 0, 0, 200000, InvoiceStatus.PENDING);
        mockInvoiceRepo.findById.mockResolvedValue(pendingInvoice);
        mockPaymentRepo.findByInvoice.mockResolvedValue(null);
        mockPaymentRepo.create.mockResolvedValue(undefined);
        mockInvoiceRepo.updateStatus.mockResolvedValue(undefined);

        await expect(new PaymentService().processPayment(1, PaymentMethod.CASH)).resolves.not.toThrow();
        expect(mockPaymentRepo.create).toHaveBeenCalledOnce();
        expect(mockInvoiceRepo.updateStatus).toHaveBeenCalledWith(1, InvoiceStatus.PAID);
    });
});

// TC-031: TR31
describe('TC-031: processPayment hóa đơn đã ở trạng thái PAID', () => {
    it('ném lỗi "Hóa đơn này đã được thanh toán"', async () => {
        const paidInvoice = new Invoice(1, 'INV-001', new Date(), 200000, 0, 0, 200000, InvoiceStatus.PAID);
        mockInvoiceRepo.findById.mockResolvedValue(paidInvoice);

        await expect(new PaymentService().processPayment(1, PaymentMethod.CASH)).rejects.toThrow(
            'Hóa đơn này đã được thanh toán'
        );
    });
});

// TC-032: TR32
describe('TC-032: processPayment hóa đơn đã ở trạng thái CANCELLED', () => {
    it('ném lỗi "Hóa đơn đã bị hủy"', async () => {
        const cancelledInvoice = new Invoice(1, 'INV-001', new Date(), 200000, 0, 0, 200000, InvoiceStatus.CANCELLED);
        mockInvoiceRepo.findById.mockResolvedValue(cancelledInvoice);

        await expect(new PaymentService().processPayment(1, PaymentMethod.CASH)).rejects.toThrow(
            'Hóa đơn đã bị hủy'
        );
    });
});

// TC-033: TR33
describe('TC-033: processPayment khi hóa đơn đã có giao dịch thanh toán', () => {
    it('ném lỗi "Hóa đơn này đã có giao dịch thanh toán"', async () => {
        const pendingInvoice = new Invoice(1, 'INV-001', new Date(), 200000, 0, 0, 200000, InvoiceStatus.PENDING);
        mockInvoiceRepo.findById.mockResolvedValue(pendingInvoice);
        mockPaymentRepo.findByInvoice.mockResolvedValue({ id: 1, amount: 200000 });

        await expect(new PaymentService().processPayment(1, PaymentMethod.CASH)).rejects.toThrow(
            'Hóa đơn này đã có giao dịch thanh toán'
        );
    });
});
