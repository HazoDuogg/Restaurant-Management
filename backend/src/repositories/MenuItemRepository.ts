import { PrismaClient } from '@prisma/client/extension'
import { MenuItem } from '../models/MenuItem.js'
import Category from '../models/Category.js'
import { MenuStatus } from '../models/enums.js'

const prisma = new PrismaClient()

export default class MenuItemRepository {

    async findAll(): Promise<MenuItem[]> {
        try {
            const items = await prisma.menu_item.findMany({
                include: { category: true }
            })
            return items.map((m: any) => new MenuItem(
                m.id, m.name, Number(m.price), m.description,
                m.status as MenuStatus,
                m.category ? new Category(
                    m.category.id, m.category.name,
                    m.category.description, m.category.created_at, m.category.updated_at
                ) : null
            ))
        } catch (error) {
            throw new Error(`Không thể lấy danh sách món ăn: ${error}`)
        }
    }

    async findById(id: number): Promise<MenuItem | null> {
        try {
            const m = await prisma.menu_item.findUnique({
                where: { id },
                include: { category: true }
            })
            if (!m) return null
            return new MenuItem(
                m.id, m.name, Number(m.price), m.description,
                m.status as MenuStatus,
                m.category ? new Category(
                    m.category.id, m.category.name,
                    m.category.description, m.category.created_at, m.category.updated_at
                ) : null
            )
        } catch (error) {
            throw new Error(`Không tìm thấy món ăn với ID ${id}: ${error}`)
        }
    }

    async findByCategory(categoryId: number): Promise<MenuItem[]> {
        try {
            const items = await prisma.menu_item.findMany({
                where: { category_id: categoryId },
                include: { category: true }
            })
            return items.map((m: any) => new MenuItem(
                m.id, m.name, Number(m.price), m.description,
                m.status as MenuStatus, null
            ))
        } catch (error) {
            throw new Error(`Không thể lấy món ăn theo danh mục ID ${categoryId}: ${error}`)
        }
    }

    async findAvailable(): Promise<MenuItem[]> {
        try {
            const items = await prisma.menu_item.findMany({
                where: { status: MenuStatus.AVAILABLE },
                include: { category: true }
            })
            return items.map((m: any) => new MenuItem(
                m.id, m.name, Number(m.price), m.description,
                m.status as MenuStatus, null
            ))
        } catch (error) {
            throw new Error(`Không thể lấy danh sách món ăn có sẵn: ${error}`)
        }
    }

    async create(item: MenuItem): Promise<void> {
        try {
            await prisma.menu_item.create({
                data: {
                    name: item.name,
                    price: item.price,
                    description: item.description,
                    status: item.status,
                    category_id: item.category?.id ?? null
                }
            })
        } catch (error) {
            throw new Error(`Không thể tạo món ăn "${item.name}": ${error}`)
        }
    }

    async update(id: number, item: MenuItem): Promise<void> {
        try {
            await prisma.menu_item.update({
                where: { id },
                data: {
                    name: item.name,
                    price: item.price,
                    description: item.description,
                    status: item.status,
                    category_id: item.category?.id ?? null
                }
            })
        } catch (error) {
            throw new Error(`Không thể cập nhật món ăn với ID ${id}: ${error}`)
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await prisma.menu_item.delete({
                where: { id }
            })
        } catch (error) {
            throw new Error(`Không thể xóa món ăn với ID ${id}: ${error}`)
        }
    }

}