import { PrismaClient } from '@prisma/client/extension'
import { OrderItem } from '../models/OrderItem.js'
import { MenuItem } from '../models/MenuItem.js'
import { MenuStatus } from '../models/enums.js'

const prisma = new PrismaClient()

export default class OrderItemRepository {

    private mapToOrderItem(item: any): OrderItem {
        const menuItem = item.menu_item ? new MenuItem(
            item.menu_item.id,
            item.menu_item.name,
            Number(item.menu_item.price),
            item.menu_item.description,
            item.menu_item.status as MenuStatus,
            null
        ) : null

        return new OrderItem(
            item.id,
            item.quantity,
            Number(item.unit_price ?? 0),
            Number(item.total_price ?? 0),
            menuItem
        )
    }

    async findAll(): Promise<OrderItem[]> {
        try {
            const items = await prisma.order_item.findMany({
                include: { menu_item: true }
            })
            return items.map((item: any) => this.mapToOrderItem(item))
        } catch (error) {
            throw new Error(`Không thể lấy danh sách order item: ${error}`)
        }
    }

    async findById(id: number): Promise<OrderItem | null> {
        try {
            const item = await prisma.order_item.findUnique({
                where: { id },
                include: { menu_item: true }
            })
            if (!item) return null
            return this.mapToOrderItem(item)
        } catch (error) {
            throw new Error(`Không tìm thấy order item với ID ${id}: ${error}`)
        }
    }

    async findByOrder(orderId: number): Promise<OrderItem[]> {
        try {
            const items = await prisma.order_item.findMany({
                where: { order_id: orderId },
                include: { menu_item: true }
            })
            return items.map((item: any) => this.mapToOrderItem(item))
        } catch (error) {
            throw new Error(`Không thể lấy danh sách món của order ID ${orderId}: ${error}`)
        }
    }

    async create(item: OrderItem, orderId: number): Promise<void> {
        try {
            await prisma.order_item.create({
                data: {
                    quantity: item.quantity,
                    unit_price: item.unitPrice,
                    total_price: item.totalPrice,
                    order_id: orderId,
                    menu_item_id: item.menuItem?.id ?? null
                }
            })
        } catch (error) {
            throw new Error(`Không thể thêm món vào order: ${error}`)
        }
    }

    async update(id: number, item: OrderItem): Promise<void> {
        try {
            await prisma.order_item.update({
                where: { id },
                data: {
                    quantity: item.quantity,
                    unit_price: item.unitPrice,
                    total_price: item.totalPrice
                }
            })
        } catch (error) {
            throw new Error(`Không thể cập nhật order item với ID ${id}: ${error}`)
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await prisma.order_item.delete({
                where: { id }
            })
        } catch (error) {
            throw new Error(`Không thể xóa order item với ID ${id}: ${error}`)
        }
    }

    async deleteByOrder(orderId: number): Promise<void> {
        try {
            await prisma.order_item.deleteMany({
                where: { order_id: orderId }
            })
        } catch (error) {
            throw new Error(`Không thể xóa tất cả món của order ID ${orderId}: ${error}`)
        }
    }

}