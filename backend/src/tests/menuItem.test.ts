import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockMenuItemRepo = vi.hoisted(() => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    findAvailable: vi.fn(),
    findByCategory: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
}));

const mockCategoryRepo = vi.hoisted(() => ({
    findById: vi.fn(),
    findAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
}));

vi.mock('../repositories/MenuItemRepository.js', () => ({
    default: vi.fn(function () { return mockMenuItemRepo; }),
}));
vi.mock('../repositories/CategoryRepository.js', () => ({
    default: vi.fn(function () { return mockCategoryRepo; }),
}));

import { MenuItemService } from '../services/MenuItemService.js';
import { MenuStatus } from '../models/enums.js';

beforeEach(() => {
    vi.clearAllMocks();
});

// TC-010: TR10
describe('TC-010: Tạo món ăn với thông tin hợp lệ', () => {
    it('gọi repo.create thành công, không ném lỗi', async () => {
        mockCategoryRepo.findById.mockResolvedValue({ id: 1, name: 'Món chính' });
        mockMenuItemRepo.create.mockResolvedValue(undefined);

        await expect(new MenuItemService().create('Phở bò', 80000, 'Phở truyền thống', 1)).resolves.not.toThrow();
        expect(mockMenuItemRepo.create).toHaveBeenCalledOnce();
    });
});

// TC-011: TR11
describe('TC-011: Tạo món ăn với tên rỗng', () => {
    it('ném lỗi "Tên món ăn không được để trống"', async () => {
        await expect(new MenuItemService().create('', 80000, null, null)).rejects.toThrow(
            'Tên món ăn không được để trống'
        );
    });
});

// TC-012: TR12
describe('TC-012: Tạo món ăn với giá = 0', () => {
    it('ném lỗi "Giá món ăn phải lớn hơn 0"', async () => {
        await expect(new MenuItemService().create('Phở bò', 0, null, null)).rejects.toThrow(
            'Giá món ăn phải lớn hơn 0'
        );
    });
});

// TC-013: TR13
describe('TC-013: Cập nhật món ăn không tồn tại trong DB', () => {
    it('ném lỗi "Món ăn với ID 999 không tồn tại"', async () => {
        mockMenuItemRepo.findById.mockResolvedValue(null);

        await expect(
            new MenuItemService().update(999, 'Phở', 50000, null, MenuStatus.AVAILABLE, null)
        ).rejects.toThrow('Món ăn với ID 999 không tồn tại');
    });
});

// TC-014: TR14
describe('TC-014: Xóa món ăn không tồn tại trong DB', () => {
    it('ném lỗi "Món ăn với ID 999 không tồn tại"', async () => {
        mockMenuItemRepo.findById.mockResolvedValue(null);

        await expect(new MenuItemService().delete(999)).rejects.toThrow(
            'Món ăn với ID 999 không tồn tại'
        );
    });
});
