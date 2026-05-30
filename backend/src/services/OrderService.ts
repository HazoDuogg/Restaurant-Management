import Order from "../models/Order.js";
import { OrderStatus, TableStatus } from "../models/enums.js";
import OrderRepository from "../repositories/OrderRepository.js";
import OrderItemRepository from "../repositories/OrderItemRepository.js";
import MenuItemRepository from "../repositories/MenuItemRepository.js";
import TableRepository from "../repositories/TableRepository.js";

export class OrderService {

    private orderRepo = new OrderRepository();
    private orderItemRepo = new OrderItemRepository();
    private menuItemRepo = new MenuItemRepository();
    private tableRepo = new TableRepository();

    async getAll(): Promise<Order[]> {
        return await this.orderRepo.findAll();
    }

    async getById(id: number): Promise<Order> {
        const order = await this.orderRepo.findById(id);
        if (!order) throw new Error(`Order với ID ${id} không tồn tại`);
        return order;
    }

    async getByTable(tableId: number): Promise<Order[]> {
        return await this.orderRepo.findByTable(tableId);
    }

    async getByStatus(status: OrderStatus): Promise<Order[]> {
        return await this.orderRepo.findByStatus(status);
    }

    async create(staffId: number, tableId: number, customerId: number | null): Promise<void> {
        const table = await this.tableRepo.findById(tableId);
        if (!table) throw new Error(`Bàn với ID ${tableId} không tồn tại`);

        const order = new Order(0, new Date(), OrderStatus.PENDING, 0, null, null, table);
        order.staff = { id: staffId } as any;
        if (customerId) order.customer = { id: customerId } as any;

        await this.orderRepo.create(order);
        await this.tableRepo.updateStatus(tableId, TableStatus.OCCUPIED);
    }

    async addItem(orderId: number, menuItemId: number, quantity: number): Promise<void> {
        if (quantity <= 0) throw new Error('Số lượng phải lớn hơn 0');

        const order = await this.orderRepo.findById(orderId);
        if (!order) throw new Error(`Order với ID ${orderId} không tồn tại`);
        if (order.status !== OrderStatus.PENDING) throw new Error('Chỉ có thể thêm món cho order đang chờ');

        const menuItem = await this.menuItemRepo.findById(menuItemId);
        if (!menuItem) throw new Error(`Món ăn với ID ${menuItemId} không tồn tại`);

        order.addItem(menuItem, quantity);
        await this.orderRepo.update(orderId, order);

        const lastItem = order.items[order.items.length - 1];
        await this.orderItemRepo.create(lastItem, orderId);
    }

    async removeItem(orderItemId: number): Promise<void> {
        const item = await this.orderItemRepo.findById(orderItemId);
        if (!item) throw new Error(`Order item với ID ${orderItemId} không tồn tại`);
        await this.orderItemRepo.delete(orderItemId);
    }

    async confirm(id: number): Promise<void> {
        const order = await this.orderRepo.findById(id);
        if (!order) throw new Error(`Order với ID ${id} không tồn tại`);
        if (order.status !== OrderStatus.PENDING) throw new Error('Chỉ có thể xác nhận order đang chờ');
        if (order.items.length === 0) throw new Error('Order chưa có món ăn nào');
        await this.orderRepo.updateStatus(id, OrderStatus.CONFIRMED);
    }

    async complete(id: number): Promise<void> {
        const order = await this.orderRepo.findById(id);
        if (!order) throw new Error(`Order với ID ${id} không tồn tại`);
        if (order.status !== OrderStatus.CONFIRMED) throw new Error('Chỉ có thể hoàn thành order đã xác nhận');
        await this.orderRepo.updateStatus(id, OrderStatus.COMPLETED);
        if (order.table) {
            await this.tableRepo.updateStatus(order.table.id, TableStatus.AVAILABLE);
        }
    }

    async cancel(id: number): Promise<void> {
        const order = await this.orderRepo.findById(id);
        if (!order) throw new Error(`Order với ID ${id} không tồn tại`);
        if (order.status === OrderStatus.COMPLETED) throw new Error('Không thể hủy order đã hoàn thành');
        await this.orderRepo.updateStatus(id, OrderStatus.CANCELLED);
        if (order.table) {
            await this.tableRepo.updateStatus(order.table.id, TableStatus.AVAILABLE);
        }
    }

}
