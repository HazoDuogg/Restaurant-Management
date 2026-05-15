import Table from '../models/Table.js'
import { TableStatus } from '../models/enums.js'
import { prisma } from "../config/prisma.js"

export default class TableRepository {

    async findAll(): Promise<Table[]> {
        try {
            const tables = await prisma.restaurant_table.findMany()
            return tables.map((t: any) => new Table(
                t.id,
                t.table_number,
                t.capacity ?? 0,
                t.status as TableStatus
            ))
        } catch (error) {
            throw new Error(`Không thể lấy danh sách bàn: ${error}`)
        }
    }

    async findById(id: number): Promise<Table | null> {
        try {
            const t = await prisma.restaurant_table.findUnique({
                where: { id }
            })
            if (!t) return null
            return new Table(
                t.id,
                t.table_number,
                t.capacity ?? 0,
                t.status as TableStatus
            )
        } catch (error) {
            throw new Error(`Không tìm thấy bàn với ID ${id}: ${error}`)
        }
    }

    async findByStatus(status: TableStatus): Promise<Table[]> {
        try {
            const tables = await prisma.restaurant_table.findMany({
                where: { status }
            })
            return tables.map((t: any) => new Table(
                t.id,
                t.table_number,
                t.capacity ?? 0,
                t.status as TableStatus
            ))
        } catch (error) {
            throw new Error(`Không thể lấy danh sách bàn theo trạng thái "${status}": ${error}`)
        }
    }

    async findAvailable(): Promise<Table[]> {
        try {
            const tables = await prisma.restaurant_table.findMany({
                where: { status: TableStatus.AVAILABLE }
            })
            return tables.map((t: any) => new Table(
                t.id,
                t.table_number,
                t.capacity ?? 0,
                t.status as TableStatus
            ))
        } catch (error) {
            throw new Error(`Không thể lấy danh sách bàn trống: ${error}`)
        }
    }

    async create(table: Table): Promise<void> {
        try {
            await prisma.restaurant_table.create({
                data: {
                    table_number: table.tableNumber,
                    capacity: table.capacity,
                    status: table.status
                }
            })
        } catch (error) {
            throw new Error(`Không thể tạo bàn số ${table.tableNumber}: ${error}`)
        }
    }

    async update(id: number, table: Table): Promise<void> {
        try {
            await prisma.restaurant_table.update({
                where: { id },
                data: {
                    table_number: table.tableNumber,
                    capacity: table.capacity,
                    status: table.status
                }
            })
        } catch (error) {
            throw new Error(`Không thể cập nhật bàn với ID ${id}: ${error}`)
        }
    }

    async updateStatus(id: number, status: TableStatus): Promise<void> {
        try {
            await prisma.restaurant_table.update({
                where: { id },
                data: { status }
            })
        } catch (error) {
            throw new Error(`Không thể cập nhật trạng thái bàn với ID ${id}: ${error}`)
        }
    }

    async delete(id: number): Promise<void> {
        try {
            await prisma.restaurant_table.delete({
                where: { id }
            })
        } catch (error) {
            throw new Error(`Không thể xóa bàn với ID ${id}. Bàn có thể đang được sử dụng: ${error}`)
        }
    }

}