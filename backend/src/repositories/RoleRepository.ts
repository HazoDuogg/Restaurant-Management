import { PrismaClient } from "@prisma/client/extension";
import Role from "../models/Role.js";

const prisma = new PrismaClient();

export default class RoleRepository {

    async findAll(): Promise<Role[]> {
        try {
            const roles = await prisma.role.findMany();
            return roles.map((r: { id: number, name: string }) => new Role(
                r.id,
                r.name,
                null
            ));
        } catch (error) {
            throw new Error(`Không thể lấy danh sách vai trò: ${error}`);
        }
    }

    async findById(id: number): Promise<Role | null> {
        try {
            const role = await prisma.role.findUnique({
                where: { id }
            });
            if (!role) return null;
            return new Role(role.id, role.name, null);
        } catch (error) {
            throw new Error(`Không tìm thấy vai trò với ID ${id}: ${error}`);
        }
    }

    async findByName(name: string): Promise<Role | null> {
        try {
            const role = await prisma.role.findUnique({
                where: { name }
            });
            if (!role) return null;
            return new Role(role.id, role.name, null);
        } catch (error) {
            throw new Error(`Không tìm thấy vai trò với tên "${name}": ${error}`);
        }
    }

    async createRole(role: Role): Promise<void> {
        try {
            await prisma.role.create({
                data: {
                    name: role.roleName
                }
            })
        } catch (error) {
            throw new Error(`Không thể tạo vai trò "${role.roleName}": ${error}`);
        }
    }

    async updateRole(id: number, role: Role): Promise<void> {
        try {
            await prisma.role.update({
                where: { id },
                data: {
                    name: role.roleName
                }
            })
        } catch (error) {
            throw new Error(`Không thể cập nhật vai trò với ID ${id}: ${error}`);
        }
    }

    async deleteRole(id: number): Promise<void> {
        try {
            await prisma.role.delete({
                where: { id }
            })
        } catch (error) {
            throw new Error(`Không thể xóa vai trò với ID ${id}. Vai trò có thể đang được sử dụng: ${error}`);
        }
    }

}