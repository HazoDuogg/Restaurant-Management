import bcrypt from "bcryptjs";
import Staff from "../models/Staff.js";
import Role from "../models/Role.js";
import AccountRepository from "../repositories/AccountRepository.js";
import StaffRepository from "../repositories/StaffRepository.js";
import RoleRepository from "../repositories/RoleRepository.js";

export class StaffService {

    private accountRepo = new AccountRepository();
    private staffRepo = new StaffRepository();
    private roleRepo = new RoleRepository();

    async getAll(): Promise<Staff[]> {
        return await this.staffRepo.findAll();
    }

    async getById(id: number): Promise<Staff> {
        const staff = await this.staffRepo.findById(id);
        if (!staff) throw new Error(`Nhân viên với ID ${id} không tồn tại`);
        return staff;
    }

    async create(name: string, email: string, password: string, phone: string | null, position: string, startDate: Date | null): Promise<void> {
        if (!name || name.trim() === '') throw new Error('Tên nhân viên không được để trống');
        if (!email || email.trim() === '') throw new Error('Email không được để trống');
        if (!password || password.length < 6) throw new Error('Mật khẩu phải có ít nhất 6 ký tự');

        const existing = await this.accountRepo.findByEmail(email);
        if (existing) throw new Error('Email đã được sử dụng');

        const staffRole = await this.roleRepo.findByName('STAFF');
        const hashPass = await bcrypt.hash(password, 10);
        const staffCode = `STAFF-${Date.now()}`;

        const staff = new Staff(0, name.trim(), hashPass, staffCode, position, startDate, phone, email, staffRole);
        await this.accountRepo.createAccount(staff);

        const created = await this.accountRepo.findByEmail(email);
        if (!created) throw new Error('Không thể tạo tài khoản nhân viên');

        staff.id = created.id;
        await this.staffRepo.create(staff);
    }

    async update(id: number, name: string, phone: string | null, position: string, startDate: Date | null): Promise<void> {
        const existing = await this.staffRepo.findById(id);
        if (!existing) throw new Error(`Nhân viên với ID ${id} không tồn tại`);
        if (!name || name.trim() === '') throw new Error('Tên nhân viên không được để trống');

        existing.name = name.trim();
        existing.phone = phone;
        existing.position = position;
        existing.startDate = startDate;

        await this.accountRepo.updateAccount(id, existing);
        await this.staffRepo.update(id, existing);
    }

    async delete(id: number): Promise<void> {
        const existing = await this.staffRepo.findById(id);
        if (!existing) throw new Error(`Nhân viên với ID ${id} không tồn tại`);
        await this.staffRepo.delete(id);
        await this.accountRepo.deleteAccount(id);
    }

}
