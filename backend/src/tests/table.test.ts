import { describe, it, expect, vi, beforeEach } from 'vitest';

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

vi.mock('../repositories/TableRepository.js', () => ({
    default: vi.fn(function () { return mockTableRepo; }),
}));

import { TableService } from '../services/TableService.js';
import Table from '../models/Table.js';
import { TableStatus, TableType } from '../models/enums.js';

beforeEach(() => {
    vi.clearAllMocks();
});

// TC-015: TR15
describe('TC-015: Tạo bàn với thông tin hợp lệ', () => {
    it('gọi repo.create thành công, không ném lỗi', async () => {
        mockTableRepo.create.mockResolvedValue(undefined);

        await expect(new TableService().create(5, 4)).resolves.not.toThrow();
        expect(mockTableRepo.create).toHaveBeenCalledOnce();
    });
});

// TC-016: TR16
describe('TC-016: Tạo bàn với số bàn = 0', () => {
    it('ném lỗi "Số bàn phải lớn hơn 0"', async () => {
        await expect(new TableService().create(0, 4)).rejects.toThrow('Số bàn phải lớn hơn 0');
    });
});

// TC-017: TR17
describe('TC-017: Tạo bàn với sức chứa = 0', () => {
    it('ném lỗi "Sức chứa phải lớn hơn 0"', async () => {
        await expect(new TableService().create(5, 0)).rejects.toThrow('Sức chứa phải lớn hơn 0');
    });
});

// TC-018: TR18
describe('TC-018: Xóa bàn đang có khách (trạng thái OCCUPIED)', () => {
    it('ném lỗi "Không thể xóa bàn đang có khách"', async () => {
        const occupiedTable = new Table(1, 5, 4, TableType.NORMAL, TableStatus.OCCUPIED);
        mockTableRepo.findById.mockResolvedValue(occupiedTable);

        await expect(new TableService().delete(1)).rejects.toThrow('Không thể xóa bàn đang có khách');
    });
});

// TC-019: TR19
describe('TC-019: Xóa bàn không tồn tại trong DB', () => {
    it('ném lỗi "Bàn với ID 999 không tồn tại"', async () => {
        mockTableRepo.findById.mockResolvedValue(null);

        await expect(new TableService().delete(999)).rejects.toThrow('Bàn với ID 999 không tồn tại');
    });
});
