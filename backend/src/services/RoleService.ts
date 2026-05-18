import RoleRepository from "../repositories/RoleRepository.js";
import Role from "../models/Role.js";

export class RoleService {

    private roleRepo = new RoleRepository();

    async getAll(): Promise<Role[]> {
        return await this.roleRepo.findAll();
    }

    async getById(id: number): Promise<Role> {
        const role = await this.roleRepo.findById(id);
        if (!role) throw new Error(`Vai trò với ID ${id} không tồn tại`);
        return role;
    }

    async create(name: string): Promise<void> {
        const existing = await this.roleRepo.findByName(name);
        if (existing) throw new Error(`Vai trò "${name}" đã tồn tại`);
        await this.roleRepo.createRole(new Role(0, name, null));
    }

    async update(id: number, name: string): Promise<void> {
        const role = await this.roleRepo.findById(id);
        if (!role) throw new Error(`Vai trò với ID ${id} không tồn tại`);
        await this.roleRepo.updateRole(id, new Role(id, name, null));
    }

    async delete(id: number): Promise<void> {
        const role = await this.roleRepo.findById(id);
        if (!role) throw new Error(`Vai trò với ID ${id} không tồn tại`);
        await this.roleRepo.deleteRole(id);
    }

}
