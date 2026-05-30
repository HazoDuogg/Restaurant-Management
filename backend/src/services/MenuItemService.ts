import { MenuItem } from "../models/MenuItem.js";
import { MenuStatus } from "../models/enums.js";
import MenuItemRepository from "../repositories/MenuItemRepository.js";
import CategoryRepository from "../repositories/CategoryRepository.js";

export class MenuItemService {

    private menuItemRepo = new MenuItemRepository();
    private categoryRepo = new CategoryRepository();

    async getAll(): Promise<MenuItem[]> {
        return await this.menuItemRepo.findAll();
    }

    async getById(id: number): Promise<MenuItem> {
        const item = await this.menuItemRepo.findById(id);
        if (!item) throw new Error(`Món ăn với ID ${id} không tồn tại`);
        return item;
    }

    async getByCategory(categoryId: number): Promise<MenuItem[]> {
        return await this.menuItemRepo.findByCategory(categoryId);
    }

    async getAvailable(): Promise<MenuItem[]> {
        return await this.menuItemRepo.findAvailable();
    }

    async create(name: string, price: number, description: string | null, categoryId: number | null): Promise<void> {
        if (!name || name.trim() === '') throw new Error('Tên món ăn không được để trống');
        if (price <= 0) throw new Error('Giá món ăn phải lớn hơn 0');

        const category = categoryId ? await this.categoryRepo.findById(categoryId) : null;
        if (categoryId && !category) throw new Error(`Danh mục với ID ${categoryId} không tồn tại`);

        const item = new MenuItem(0, name.trim(), price, description ?? null, MenuStatus.AVAILABLE, category);
        await this.menuItemRepo.create(item);
    }

    async update(id: number, name: string, price: number, description: string | null, status: MenuStatus, categoryId: number | null): Promise<void> {
        const existing = await this.menuItemRepo.findById(id);
        if (!existing) throw new Error(`Món ăn với ID ${id} không tồn tại`);
        if (!name || name.trim() === '') throw new Error('Tên món ăn không được để trống');
        if (price <= 0) throw new Error('Giá món ăn phải lớn hơn 0');

        const category = categoryId ? await this.categoryRepo.findById(categoryId) : null;
        if (categoryId && !category) throw new Error(`Danh mục với ID ${categoryId} không tồn tại`);

        const item = new MenuItem(id, name.trim(), price, description ?? null, status, category);
        await this.menuItemRepo.update(id, item);
    }

    async updateStatus(id: number, status: MenuStatus): Promise<void> {
        const existing = await this.menuItemRepo.findById(id);
        if (!existing) throw new Error(`Món ăn với ID ${id} không tồn tại`);
        existing.status = status;
        await this.menuItemRepo.update(id, existing);
    }

    async delete(id: number): Promise<void> {
        const existing = await this.menuItemRepo.findById(id);
        if (!existing) throw new Error(`Món ăn với ID ${id} không tồn tại`);
        await this.menuItemRepo.delete(id);
    }

}
