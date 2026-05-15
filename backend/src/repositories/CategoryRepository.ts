import Category from "../models/Category.js";
import { MenuItem } from "../models/MenuItem.js";
import { MenuStatus } from "../models/enums.js";
import { prisma } from "../config/prisma.js"

export default class CategoryRepository {

    async findAll(): Promise<Category[]> {
        try {
            const categories = await prisma.category.findMany({
                include: { menu_items: true }
            })
            return categories.map((c: any) => {
                const category = new Category(
                    c.id, c.name, c.description, c.created_at, c.updated_at
                )
                c.menu_items.forEach((m: any) => {
                    category.addMenuItem(new MenuItem(
                        m.id, m.name, Number(m.price), m.description,
                        m.status as MenuStatus, null
                    ))
                })
                return category
            })
        } catch (error) {
            throw new Error(`Không thể lấy danh sách danh mục: ${error}`)
        }
    }

    async findById(id: number): Promise<Category | null> {
        try {
            const c = await prisma.category.findUnique({
                where: { id },
                include: { menu_items: true }
            })
            if (!c) return null
            const category = new Category(
                c.id, c.name, c.description, c.created_at, c.updated_at
            )
            c.menu_items.forEach((m: any) => {
                category.addMenuItem(new MenuItem(
                    m.id, m.name, Number(m.price), m.description,
                    m.status as MenuStatus, null
                ))
            })
            return category
        } catch (error) {
            throw new Error(`Không tìm thấy danh mục với ID ${id}: ${error}`)
        }
    }

    async create(category: Category): Promise<void> {
        try {
            await prisma.category.create({
                data: {
                    name: category.name,
                    description: category.description
                }
            })
        } catch (error) {
            throw new Error(`Không thể tạo danh mục "${category.name}": ${error}`)
        }
    }

    async update(id: number, category: Category): Promise<void> {
        try {
            await prisma.category.update({
                where: { id },
                data: {
                    name: category.name,
                    description: category.description
                }
            })
        } catch (error) {
            throw new Error(`Không thể cập nhật danh mục với ID ${id}: ${error}`)
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await prisma.category.delete({
                where: { id }
            })
        } catch (error) {
            throw new Error(`Không thể xóa danh mục với ID ${id}. Danh mục có thể đang có món ăn: ${error}`)
        }
    }

}