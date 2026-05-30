import Customer from "../models/Customer.js";
import Admin from "../models/Admin.js";
import Staff from "../models/Staff.js";
import Role from "../models/Role.js";
import { prisma } from '../config/prisma.js'
import type { AccountStatus } from "../models/enums.js";
import { StaffStatus } from "../models/enums.js";

export default class AccountRepository {

    async findAll(): Promise<(Customer | Admin | Staff)[]> {
        try {
            const accounts = await prisma.account.findMany({
                include: { role: true, admin: true, staff: true, customer: true }
            });
            return accounts.map((a: any) => {
                const role = a.role ? new Role(a.role.id, a.role.name, null) : null;
                if (a.admin) {
                    return new Admin(a.id, a.name, a.password, a.phone, a.email, a.status, role);
                } else if (a.staff) {
                    return new Staff(
                        a.id, a.name, a.password,
                        a.staff.staff_code ?? '', a.staff.position ?? '', a.staff.start_date,
                        a.phone, a.email, a.status as AccountStatus,
                        (a.staff.status_work ?? 'ACTIVE') as StaffStatus,
                        role
                    );
                } else {
                    return new Customer(
                        a.id, a.name, a.password,
                        a.customer?.customer_code ?? '', a.phone, a.email, a.status, role
                    );
                }
            });
        } catch (error) {
            throw new Error(`Không thể lấy danh sách tài khoản: ${error}`);
        }
    }

    async findById(id: number): Promise<Customer | Admin | Staff | null> {
        try {
            const a = await prisma.account.findUnique({
                where: { id },
                include: { role: true, admin: true, staff: true, customer: true }
            });
            if (!a) return null;
            const role = a.role ? new Role(a.role.id, a.role.name, null) : null;
            if (a.admin) {
                return new Admin(a.id, a.name, a.password, a.phone, a.email, a.status as AccountStatus, role);
            } else if (a.staff) {
                return new Staff(
                    a.id, a.name, a.password,
                    a.staff.staff_code ?? '', a.staff.position ?? '', a.staff.start_date,
                    a.phone, a.email, a.status as AccountStatus,
                    (a.staff.status_work ?? 'ACTIVE') as StaffStatus,
                    role
                );
            } else {
                return new Customer(
                    a.id, a.name, a.password,
                    a.customer?.customer_code ?? '', a.phone, a.email, a.status as AccountStatus, role
                );
            }
        } catch (error) {
            throw new Error(`Không tìm thấy tài khoản với ID ${id}: ${error}`);
        }
    }

    async findByPhoneNumber(phoneNum: string): Promise<Customer | Admin | Staff | null> {
        try {
            const a = await prisma.account.findFirst({
                where: { phone: phoneNum },
                include: { role: true, admin: true, staff: true, customer: true }
            })
            if (!a) return null;
            const role = a.role ? new Role(a.role.id, a.role.name, null) : null;
            if (a.admin) {
                return new Admin(a.id, a.name, a.password, a.phone, a.email, a.status as AccountStatus, role);
            } else if (a.staff) {
                return new Staff(
                    a.id, a.name, a.password,
                    a.staff.staff_code ?? '', a.staff.position ?? '', a.staff.start_date,
                    a.phone, a.email, a.status as AccountStatus,
                    (a.staff.status_work ?? 'ACTIVE') as StaffStatus,
                    role
                );
            } else {
                return new Customer(
                    a.id, a.name, a.password,
                    a.customer?.customer_code ?? '', a.phone, a.email, a.status as AccountStatus, role
                );
            }
        } catch (error) {
            throw new Error(`Không tìm thấy tài khoản với số điện thoại "${phoneNum}": ${error}`);
        }
    }

    async findByEmail(email: string): Promise<Customer | Admin | Staff | null> {
        try {
            const a = await prisma.account.findFirst({
                where: { email },
                include: { role: true, admin: true, staff: true, customer: true }
            });
            if (!a) return null;
            const role = a.role ? new Role(a.role.id, a.role.name, null) : null;
            if (a.admin) {
                return new Admin(a.id, a.name, a.password, a.phone, a.email, a.status as AccountStatus, role);
            } else if (a.staff) {
                return new Staff(
                    a.id, a.name, a.password,
                    a.staff.staff_code ?? '', a.staff.position ?? '', a.staff.start_date,
                    a.phone, a.email, a.status as AccountStatus,
                    (a.staff.status_work ?? 'ACTIVE') as StaffStatus,
                    role
                );
            } else {
                return new Customer(
                    a.id, a.name, a.password,
                    a.customer?.customer_code ?? '', a.phone, a.email, a.status as AccountStatus, role
                );
            }
        } catch (error) {
            throw new Error(`Không tìm thấy tài khoản với email "${email}": ${error}`);
        }
    }

    async createAccount(account: Admin | Customer | Staff): Promise<number> {
        try {
            const created = await prisma.account.create({
                data: {
                    password: account.password,
                    name: account.name,
                    phone: account.phone,
                    email: account.email ?? "",
                    role_id: account.role?.id ?? null,
                    status: 'ACTIVE'
                }
            });
            return created.id;
        } catch (error) {
            throw new Error(`Không thể tạo tài khoản: ${error}`);
        }
    }

    async updateAccount(id: number, account: Admin | Customer | Staff): Promise<void> {
        try {
            await prisma.account.update({
                where: { id },
                data: { name: account.name, phone: account.phone, email: account.email ?? "" }
            });
        } catch (error) {
            throw new Error(`Không thể cập nhật tài khoản với ID ${id}: ${error}`);
        }
    }

    async deleteAccount(id: number): Promise<void> {
        try {
            await prisma.account.delete({ where: { id } });
        } catch (error) {
            throw new Error(`Không thể xóa tài khoản với ID ${id}. Tài khoản có thể đang được sử dụng: ${error}`);
        }
    }

    async updateStatus(id: number, status: string): Promise<void> {
        try {
            await prisma.account.update({ where: { id }, data: { status } });
        } catch (error) {
            throw new Error(`Không thể cập nhật trạng thái tài khoản với ID ${id}: ${error}`);
        }
    }

    async updatePassword(id: number, newPassword: string): Promise<void> {
        try {
            await prisma.account.update({ where: { id }, data: { password: newPassword } });
        } catch (error) {
            throw new Error(`Không thể đổi mật khẩu tài khoản với ID ${id}: ${error}`);
        }
    }

}
