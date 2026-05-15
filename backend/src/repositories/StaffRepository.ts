import { prisma } from "../config/prisma.js"
import Staff from "../models/Staff.js"
import Role from "../models/Role.js"

export default class StaffRepository {

    async findAll(): Promise<Staff[]> {
        try {
            const staff = await prisma.staff.findMany({
                include: { account: { include: { role: true } } }
            });
            return staff.map((s: any) => {
                const role = s.account.role ? new Role(s.account.role.id, s.account.role.name, null) : null;
                return new Staff(
                    s.account_id, s.account.name,
                    s.account.password, s.staff_code ?? '', s.position ?? '',
                    s.start_date, s.account.phone, s.account.email, role
                );
            });
        } catch (error) {
            throw new Error(`Không thể lấy danh sách nhân viên: ${error}`);
        }
    }

    async findById(accountId: number): Promise<Staff | null> {
        try {
            const s = await prisma.staff.findUnique({
                where: { account_id: accountId },
                include: {
                    account: { include: { role: true } }
                }
            })
            if (!s) return null
            const role = s.account.role
                ? new Role(s.account.role.id, s.account.role.name, null)
                : null
            return new Staff(
                s.account_id,
                s.account.name,
                s.account.password,
                s.staff_code ?? '',
                s.position ?? '',
                s.start_date,
                s.account.phone,
                s.account.email,
                role
            )
        } catch (error) {
            throw new Error(`Không tìm thấy nhân viên với ID ${accountId}: ${error}`)
        }
    }

    async create(staff: Staff): Promise<void> {
        try {
            await prisma.staff.create({
                data: {
                    account_id: staff.id,
                    staff_code: staff.staffId,
                    position: staff.position,
                    start_date: staff.startDate
                }
            })
        } catch (error) {
            throw new Error(`Không thể tạo nhân viên: ${error}`)
        }
    }

    async update(accountId: number, staff: Staff): Promise<void> {
        try {
            await prisma.staff.update({
                where: { account_id: accountId },
                data: {
                    position: staff.position,
                    start_date: staff.startDate
                }
            })
        } catch (error) {
            throw new Error(`Không thể cập nhật nhân viên với ID ${accountId}: ${error}`)
        }
    }

    async delete(accountId: number): Promise<void> {
        try {
            await prisma.staff.delete({
                where: { account_id: accountId }
            })
        } catch (error) {
            throw new Error(`Không thể xóa nhân viên với ID ${accountId}. Nhân viên đang có đơn hàng: ${error}`)
        }
    }

}