import Order from '../models/Order.js'
import Customer from '../models/Customer.js'
import Staff from '../models/Staff.js'
import Table from '../models/Table.js'
import { MenuItem } from '../models/MenuItem.js'
import { OrderStatus, TableStatus, MenuStatus, TableType, AccountStatus, StaffStatus } from '../models/enums.js'
import { prisma } from "../config/prisma.js"

export default class OrderRepository {

    private mapToOrder(o: any): Order {
        const customer = o.customer?.account ? new Customer(
            o.customer.account_id, o.customer.account.name,
            o.customer.account.password,
            o.customer.customer_code ?? '',
            o.customer.account.phone, o.customer.account.email,
            o.customer.account.status as AccountStatus
        ) : null

        const staff = o.staff?.account ? new Staff(
            o.staff.account_id, o.staff.account.name,
            o.staff.account.password,
            o.staff.staff_code ?? '', o.staff.position ?? '',
            o.staff.start_date,
            o.staff.account.phone, o.staff.account.email,
            o.staff.account.status as AccountStatus,
            o.staff.status_work as StaffStatus
        ) : null

        const table = o.table ? new Table(
            o.table.id, o.table.table_number,
            o.table.capacity ?? 0,
            o.table.table_type as TableType,
            o.table.status as TableStatus
        ) : null

        const order = new Order(
            o.id, o.order_time, o.status as OrderStatus,
            Number(o.total_amount ?? 0), customer, staff, table
        )

        if (o.order_items) {
            o.order_items.forEach((item: any) => {
                const menuItem = item.menu_item ? new MenuItem(
                    item.menu_item.id, item.menu_item.name,
                    Number(item.menu_item.price),
                    item.menu_item.description,
                    item.menu_item.status as MenuStatus, null
                ) : null
                if (menuItem) {
                    order.addItem(menuItem, item.quantity)
                }
            })
        }
        return order
    }

    async findAll(): Promise<Order[]> {
        try {
            const orders = await prisma.orders.findMany({
                include: {
                    customer: { include: { account: true } },
                    staff: { include: { account: true } },
                    table: true,
                    order_items: { include: { menu_item: true } }
                }
            })
            return orders.map((o: any) => this.mapToOrder(o))
        } catch (error) {
            throw new Error(`Không thể lấy danh sách order: ${error}`)
        }
    }

    async findById(id: number): Promise<Order | null> {
        try {
            const o = await prisma.orders.findUnique({
                where: { id },
                include: {
                    customer: { include: { account: true } },
                    staff: { include: { account: true } },
                    table: true,
                    order_items: { include: { menu_item: true } }
                }
            })
            if (!o) return null
            return this.mapToOrder(o)
        } catch (error) {
            throw new Error(`Không tìm thấy order với ID ${id}: ${error}`)
        }
    }

    async findByStatus(status: OrderStatus): Promise<Order[]> {
        try {
            const orders = await prisma.orders.findMany({
                where: { status },
                include: {
                    customer: { include: { account: true } },
                    staff: { include: { account: true } },
                    table: true,
                    order_items: { include: { menu_item: true } }
                }
            })
            return orders.map((o: any) => this.mapToOrder(o))
        } catch (error) {
            throw new Error(`Không thể lấy danh sách order theo trạng thái "${status}": ${error}`)
        }
    }

    async findByTable(tableId: number): Promise<Order[]> {
        try {
            const orders = await prisma.orders.findMany({
                where: { table_id: tableId },
                include: {
                    customer: { include: { account: true } },
                    staff: { include: { account: true } },
                    table: true,
                    order_items: { include: { menu_item: true } }
                }
            })
            return orders.map((o: any) => this.mapToOrder(o))
        } catch (error) {
            throw new Error(`Không thể lấy danh sách order theo bàn ID ${tableId}: ${error}`)
        }
    }

    async create(order: Order): Promise<number> {
        try {
            const created = await prisma.orders.create({
                data: {
                    order_time: order.orderTime,
                    status: order.status,
                    total_amount: order.totalAmount,
                    customer_id: order.customer?.id ?? null,
                    staff_id: order.staff?.id ?? null,
                    table_id: order.table?.id ?? null
                }
            })
            return created.id
        } catch (error) {
            throw new Error(`Không thể tạo order: ${error}`)
        }
    }

    async update(id: number, order: Order): Promise<void> {
        try {
            await prisma.orders.update({
                where: { id },
                data: {
                    status: order.status,
                    total_amount: order.totalAmount
                }
            })
        } catch (error) {
            throw new Error(`Không thể cập nhật order với ID ${id}: ${error}`)
        }
    }

    async updateStatus(id: number, status: OrderStatus): Promise<void> {
        try {
            await prisma.orders.update({
                where: { id },
                data: { status }
            })
        } catch (error) {
            throw new Error(`Không thể cập nhật trạng thái order với ID ${id}: ${error}`)
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await prisma.orders.delete({
                where: { id }
            })
        } catch (error) {
            throw new Error(`Không thể xóa order với ID ${id}: ${error}`)
        }
    }

}