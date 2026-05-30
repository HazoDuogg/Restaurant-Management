import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockOrderRepo = vi.hoisted(() => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    findByTable: vi.fn(),
    findByStatus: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn(),
}));

const mockOrderItemRepo = vi.hoisted(() => ({
    findById: vi.fn(),
    create: vi.fn(),
    delete: vi.fn(),
}));

const mockMenuItemRepo = vi.hoisted(() => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    findAvailable: vi.fn(),
    findByCategory: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
}));

const mockTableRepo = vi.hoisted(() => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    findAvailable: vi.fn(),
    findByStatus: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    updateStatus: vi.fn(),
    delete: vi.fn(),
}));

vi.mock('../repositories/OrderRepository.js', () => ({
    default: vi.fn(function () { return mockOrderRepo; }),
}));
vi.mock('../repositories/OrderItemRepository.js', () => ({
    default: vi.fn(function () { return mockOrderItemRepo; }),
}));
vi.mock('../repositories/MenuItemRepository.js', () => ({
    default: vi.fn(function () { return mockMenuItemRepo; }),
}));
vi.mock('../repositories/TableRepository.js', () => ({
    default: vi.fn(function () { return mockTableRepo; }),
}));

import { OrderService } from '../services/OrderService.js';
import Order from '../models/Order.js';
import { OrderStatus } from '../models/enums.js';

beforeEach(() => {
    vi.clearAllMocks();
});

// TC-020: TR20
describe('TC-020: addItem khi order không ở trạng thái PENDING', () => {
    it('ném lỗi "Chỉ có thể thêm món cho order đang chờ"', async () => {
        const confirmedOrder = new Order(1, new Date(), OrderStatus.CONFIRMED, 0);
        mockOrderRepo.findById.mockResolvedValue(confirmedOrder);

        await expect(new OrderService().addItem(1, 1, 2)).rejects.toThrow(
            'Chỉ có thể thêm món cho order đang chờ'
        );
    });
});

// TC-021: TR21
describe('TC-021: confirm khi order đã ở trạng thái CONFIRMED', () => {
    it('ném lỗi "Chỉ có thể xác nhận order đang chờ"', async () => {
        const confirmedOrder = new Order(1, new Date(), OrderStatus.CONFIRMED, 0);
        mockOrderRepo.findById.mockResolvedValue(confirmedOrder);

        await expect(new OrderService().confirm(1)).rejects.toThrow(
            'Chỉ có thể xác nhận order đang chờ'
        );
    });
});

// TC-022: TR22
describe('TC-022: confirm khi order PENDING nhưng chưa có món ăn nào', () => {
    it('ném lỗi "Order chưa có món ăn nào"', async () => {
        const emptyOrder = new Order(1, new Date(), OrderStatus.PENDING, 0);
        mockOrderRepo.findById.mockResolvedValue(emptyOrder);

        await expect(new OrderService().confirm(1)).rejects.toThrow('Order chưa có món ăn nào');
    });
});

// TC-023: TR23
describe('TC-023: complete khi order không ở trạng thái CONFIRMED', () => {
    it('ném lỗi "Chỉ có thể hoàn thành order đã xác nhận"', async () => {
        const pendingOrder = new Order(1, new Date(), OrderStatus.PENDING, 0);
        mockOrderRepo.findById.mockResolvedValue(pendingOrder);

        await expect(new OrderService().complete(1)).rejects.toThrow(
            'Chỉ có thể hoàn thành order đã xác nhận'
        );
    });
});

// TC-024: TR24
describe('TC-024: cancel khi order đã ở trạng thái COMPLETED', () => {
    it('ném lỗi "Không thể hủy order đã hoàn thành"', async () => {
        const completedOrder = new Order(1, new Date(), OrderStatus.COMPLETED, 0);
        mockOrderRepo.findById.mockResolvedValue(completedOrder);

        await expect(new OrderService().cancel(1)).rejects.toThrow(
            'Không thể hủy order đã hoàn thành'
        );
    });
});
