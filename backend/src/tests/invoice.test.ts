import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockInvoiceRepo = vi.hoisted(() => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    findByOrder: vi.fn(),
    create: vi.fn(),
    updateStatus: vi.fn(),
}));

const mockInvoiceDetailRepo = vi.hoisted(() => ({
    create: vi.fn(),
    findByInvoice: vi.fn(),
}));

const mockOrderRepo = vi.hoisted(() => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    findByTable: vi.fn(),
    findByStatus: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn(),
}));

vi.mock('../repositories/InvoiceRepository.js', () => ({
    default: vi.fn(function () { return mockInvoiceRepo; }),
}));
vi.mock('../repositories/InvoiceDetailRepository.js', () => ({
    default: vi.fn(function () { return mockInvoiceDetailRepo; }),
}));
vi.mock('../repositories/OrderRepository.js', () => ({
    default: vi.fn(function () { return mockOrderRepo; }),
}));

import { InvoiceService } from '../services/InvoiceService.js';
import Order from '../models/Order.js';
import Invoice from '../models/Invoice.js';
import { MenuItem } from '../models/MenuItem.js';
import { InvoiceStatus, MenuStatus, OrderStatus } from '../models/enums.js';

beforeEach(() => {
    vi.clearAllMocks();
});

const makeCompletedOrder = () => {
    const order = new Order(1, new Date(), OrderStatus.COMPLETED, 0);
    order.addItem(new MenuItem(1, 'Phở bò', 80000, null, MenuStatus.AVAILABLE), 2);
    return order;
};

// TC-025: TR25
describe('TC-025: generateFromOrder với order đã COMPLETED', () => {
    it('trả về invoiceId = 1', async () => {
        const order = makeCompletedOrder();
        const createdInvoice = new Invoice(1, 'INV-001', new Date(), 160000, 0, 0, 160000, InvoiceStatus.PENDING, order);

        mockOrderRepo.findById.mockResolvedValue(order);
        mockInvoiceRepo.findByOrder
            .mockResolvedValueOnce(null)
            .mockResolvedValueOnce(createdInvoice);
        mockInvoiceRepo.create.mockResolvedValue(undefined);
        mockInvoiceDetailRepo.create.mockResolvedValue(undefined);

        const invoiceId = await new InvoiceService().generateFromOrder(1, 0, 0);

        expect(invoiceId).toBe(1);
        expect(mockInvoiceRepo.create).toHaveBeenCalledOnce();
    });
});

// TC-026: TR26
describe('TC-026: generateFromOrder với order chưa COMPLETED', () => {
    it('ném lỗi "Chỉ tạo hóa đơn cho order đã hoàn thành"', async () => {
        const pendingOrder = new Order(1, new Date(), OrderStatus.PENDING, 0);
        mockOrderRepo.findById.mockResolvedValue(pendingOrder);

        await expect(new InvoiceService().generateFromOrder(1)).rejects.toThrow(
            'Chỉ tạo hóa đơn cho order đã hoàn thành'
        );
    });
});

// TC-027: TR27
describe('TC-027: generateFromOrder khi hóa đơn đã tồn tại cho order', () => {
    it('ném lỗi "Hóa đơn cho order này đã tồn tại"', async () => {
        const order = makeCompletedOrder();
        const existingInvoice = new Invoice(1, 'INV-OLD', new Date(), 160000, 0, 0, 160000, InvoiceStatus.PENDING, order);

        mockOrderRepo.findById.mockResolvedValue(order);
        mockInvoiceRepo.findByOrder.mockResolvedValue(existingInvoice);

        await expect(new InvoiceService().generateFromOrder(1)).rejects.toThrow(
            'Hóa đơn cho order này đã tồn tại'
        );
    });
});

// TC-028: TR28
describe('TC-028: markAsPaid hóa đơn đã ở trạng thái PAID', () => {
    it('ném lỗi "Hóa đơn đã được thanh toán"', async () => {
        const paidInvoice = new Invoice(1, 'INV-001', new Date(), 160000, 0, 0, 160000, InvoiceStatus.PAID);
        mockInvoiceRepo.findById.mockResolvedValue(paidInvoice);

        await expect(new InvoiceService().markAsPaid(1)).rejects.toThrow('Hóa đơn đã được thanh toán');
    });
});

// TC-029: TR29
describe('TC-029: cancel hóa đơn đã ở trạng thái PAID', () => {
    it('ném lỗi "Không thể hủy hóa đơn đã thanh toán"', async () => {
        const paidInvoice = new Invoice(1, 'INV-001', new Date(), 160000, 0, 0, 160000, InvoiceStatus.PAID);
        mockInvoiceRepo.findById.mockResolvedValue(paidInvoice);

        await expect(new InvoiceService().cancel(1)).rejects.toThrow(
            'Không thể hủy hóa đơn đã thanh toán'
        );
    });
});
