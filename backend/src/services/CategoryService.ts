import Category from "../models/Category.js";
import CategoryRepository from "../repositories/CategoryRepository.js";

export class CategoryService {

    private categoryRepo = new CategoryRepository();

    async getAll(): Promise<Category[]> {
        return await this.categoryRepo.findAll();
    }

    async getById(id: number): Promise<Category> {
        const category = await this.categoryRepo.findById(id);
        if (!category) {
            throw new Error(`Danh mục với ID ${id} không tồn tại`);
        }
        return category;
    }

    async create(name: string, description: string | null): Promise<void> {
        if (!name || name.trim() === '') {
            throw new Error('Tên danh mục không được để trống');
        }
        const category = new Category(0, name.trim(), description ?? null);
        await this.categoryRepo.create(category);
    }

    async update(id: number, name: string, description: string | null): Promise<void> {
        const existing = await this.categoryRepo.findById(id);
        if (!existing) {
            throw new Error(`Danh mục với ID ${id} không tồn tại`);
        }
        if (!name || name.trim() === '') {
            throw new Error('Tên danh mục không được để trống');
        }
        const category = new Category(id, name.trim(), description ?? null);
        await this.categoryRepo.update(id, category);
    }

    async delete(id: number): Promise<void> {
        const existing = await this.categoryRepo.findById(id);
        if (!existing) {
            throw new Error(`Danh mục với ID ${id} không tồn tại`);
        }
        if (existing.menuItems.length > 0) {
            throw new Error(`Không thể xóa danh mục đang có ${existing.menuItems.length} món ăn`);
        }
        await this.categoryRepo.delete(id);
    }

}
