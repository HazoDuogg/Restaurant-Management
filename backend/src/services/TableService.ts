import Table from "../models/Table.js";
import { TableStatus, TableType } from "../models/enums.js";
import TableRepository from "../repositories/TableRepository.js";

export class TableService {

    private tableRepo = new TableRepository();

    async getAll(): Promise<Table[]> {
        return await this.tableRepo.findAll();
    }

    async getById(id: number): Promise<Table> {
        const table = await this.tableRepo.findById(id);
        if (!table) throw new Error(`Bàn với ID ${id} không tồn tại`);
        return table;
    }

    async getAvailable(): Promise<Table[]> {
        return await this.tableRepo.findAvailable();
    }

    async getByStatus(status: TableStatus): Promise<Table[]> {
        return await this.tableRepo.findByStatus(status);
    }

    async create(tableNumber: number, capacity: number, type: TableType = TableType.NORMAL): Promise<void> {
        if (tableNumber <= 0) throw new Error('Số bàn phải lớn hơn 0');
        if (capacity <= 0) throw new Error('Sức chứa phải lớn hơn 0');

        const table = new Table(0, tableNumber, capacity, type, TableStatus.AVAILABLE);
        await this.tableRepo.create(table);
    }

    async update(id: number, tableNumber: number, capacity: number): Promise<void> {
        const existing = await this.tableRepo.findById(id);
        if (!existing) throw new Error(`Bàn với ID ${id} không tồn tại`);
        if (tableNumber <= 0) throw new Error('Số bàn phải lớn hơn 0');
        if (capacity <= 0) throw new Error('Sức chứa phải lớn hơn 0');

        const table = new Table(id, tableNumber, capacity, existing.type, existing.status);
        await this.tableRepo.update(id, table);
    }

    async updateStatus(id: number, status: TableStatus): Promise<void> {
        const existing = await this.tableRepo.findById(id);
        if (!existing) throw new Error(`Bàn với ID ${id} không tồn tại`);
        await this.tableRepo.updateStatus(id, status);
    }

    async delete(id: number): Promise<void> {
        const existing = await this.tableRepo.findById(id);
        if (!existing) throw new Error(`Bàn với ID ${id} không tồn tại`);
        if (existing.status === TableStatus.OCCUPIED) throw new Error('Không thể xóa bàn đang có khách');
        await this.tableRepo.delete(id);
    }

}
