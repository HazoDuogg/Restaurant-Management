import bcrypt from "bcryptjs";
import CustomerRepository from "../repositories/CustomerRepository.js";
import { issueAccessToken } from "../utils/auth.js";
import Customer from "../models/Customer.js";
import AccountRepository from "../repositories/AccountRepository.js";
import { AccountStatus } from "../models/enums.js";

export class AuthService {

    private accountRepo = new AccountRepository();
    private customerRepo = new CustomerRepository();

    async login(identifier: string, password: string): Promise<{ accessToken: string, user: { id: number, role: string, name: string } }> {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let account;
        if (emailRegex.test(identifier)) {
            account = await this.accountRepo.findByEmail(identifier);
        } else {
            account = await this.accountRepo.findByPhoneNumber(identifier);
        }
        if (!account) {
            throw new Error('Tài khoản không tồn tại');
        }
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            throw new Error('Mật khẩu không đúng. Vui lòng nhập lại!!');
        }
        const role = account.role?.roleName ?? 'CUSTOMER';
        const accessToken = issueAccessToken(account.id, role);
        return {
            accessToken,
            user: { id: account.id, role, name: account.name }
        }
    }

    async register(name: string, password: string, phone: string | null, email: string): Promise<void> {
        const existing = await this.accountRepo.findByEmail(email);
        if (existing) {
            throw new Error('Email đã được sử dụng');
        }
        const hashPass = await bcrypt.hash(password, 10);
        const customer = new Customer(0, name, hashPass, `CUS${Date.now()}`, phone, email, AccountStatus.ACTIVE);
        const accountId = await this.accountRepo.createAccount(customer);
        customer.id = accountId;
        await this.customerRepo.createCustomer(customer);

    }

    async changePassword(id: number, oldPassword: string, newPassword: string): Promise<void> {
        const account = await this.accountRepo.findById(id);
        if (!account) {
            throw new Error('Tài khoản không tồn tại');
        }
        const isMatch = await bcrypt.compare(oldPassword, account.password);
        if (!isMatch) {
            throw new Error('Mật khẩu cũ không đúng')
        }
        const hashPass = await bcrypt.hash(newPassword, 10);
        await this.accountRepo.updatePassword(id, hashPass);
    }

}