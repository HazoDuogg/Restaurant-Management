import { describe, it, expect, vi, beforeEach } from 'vitest';
import Order from '../models/Order.js';
import { MenuItem } from '../models/MenuItem.js';
import { OrderService } from '../services/OrderService.js';
import { OrderStatus, MenuStatus } from '../models/enums.js';

const makeOrder = () => new Order(1, new Date(), OrderStatus.PENDING, 0);

const makeMenuItem = (id: number, price: number) =>
    new MenuItem(id, 'Món test', price, null, MenuStatus.AVAILABLE);

// TC-006: addItem thêm mới khi món chưa có trong order
describe('TC-006: addItem - thêm mới OrderItem khi món chưa có trong order', () => {
    it('items.length === 1, quantity === 2, unitPrice === 50000', () => {
        const order = makeOrder();
        const menuItem = makeMenuItem(1, 50000);

        order.addItem(menuItem, 2);

        expect(order.items.length).toBe(1);
        expect(order.items[0].quantity).toBe(2);
        expect(order.items[0].unitPrice).toBe(50000);
    });
});

// TC-007: addItem cộng dồn số lượng khi món đã tồn tại
describe('TC-007: addItem - cộng dồn số lượng khi món đã tồn tại trong order', () => {
    it('items.length === 1, quantity === 5 (2 + 3)', () => {
        const order = makeOrder();
        const menuItem = makeMenuItem(1, 50000);

        order.addItem(menuItem, 2);
        order.addItem(menuItem, 3);

        expect(order.items.length).toBe(1);
        expect(order.items[0].quantity).toBe(5);
    });
});

// TC-008: totalAmount tính lại chính xác sau addItem
describe('TC-008: addItem - tổng tiền tính lại chính xác', () => {
    it('totalAmount === 240000 (80000 × 3)', () => {
        const order = makeOrder();
        const menuItem = makeMenuItem(1, 80000);

        order.addItem(menuItem, 3);

        expect(order.totalAmount).toBe(240000);
    });
});

// TC-009: OrderService.addItem ném lỗi khi quantity <= 0
describe('TC-009: OrderService.addItem - báo lỗi khi số lượng = 0', () => {
    it('ném lỗi "Số lượng phải lớn hơn 0"', async () => {
        const service = new OrderService();
        await expect(service.addItem(1, 1, 0)).rejects.toThrow('Số lượng phải lớn hơn 0');
    });
});
