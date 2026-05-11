import bcrypt from "bcryptjs";
import AccountRepository from "../repositories/AccountRepository .js";
import CustomerRepository from "../repositories/CustomerRepository.js";
import { issueAccessToken } from "../utils/auth.js";
import Customer from "../models/Customer.js";

export class AuthService {

    private accountRepo = new AccountRepository();
    private customerRepo = new CustomerRepository();

    async login(username: string, password: string): Promise<{ token: string, role: string }> {
        try {
            const account = await this.accountRepo.findByUsername(username);
            if (!account) {
                throw new Error('Tài khoản không tồn tại');
            }
            const isMatch = await bcrypt.compare(password, account.password);
            if (!isMatch) {
                throw new Error('Mật khẩu không đúng. Vui lòng nhập lại!!');
            }
            const role = account.role?.roleName ?? 'CUSTOMER';
            const token = issueAccessToken(account.id, role);
            return {
                token,
                role
            }
        } catch (error) {
            throw new Error(`Đăng nhập thất bại: ${error}`)
        }
    }

    async register(name: string, username: string, password: string, phone: string | null, email: string | null): Promise<void> {
        try {
            const accout = await this.accountRepo.findByUsername(username);
            if (accout) {
                throw new Error('Tài khoản đã tồn tại');
            }
            const hashPass = await bcrypt.hash(password, 10);
            const customer = new Customer(0, name, username, hashPass, `CUS${Date.now()}`, phone, email, null);
            await this.accountRepo.createAccount(customer);
            await this.customerRepo.createCustomer(customer);
        } catch (error) {
            throw new Error(`Đăng ký thất bại: ${error}`);
        }
    }

    async changePassword(id: number, oldPassword: string, newPassword: string): Promise<void> {
        try {
            const account = await this.accountRepo.findById(id);
            if (!account) {
                throw new Error('Tài khoản không tồn tại');
            }
            const isMatch = bcrypt.compare(oldPassword, account.password);
            if (!isMatch) {
                throw new Error('Mật khẩu cũ không đúng')
            }
            const hashPass = await bcrypt.hash(newPassword, 10);
            await this.accountRepo.updatePassword(id, hashPass);
        } catch (error) {
            throw new Error(`Đổi mật khẩu thất bại: ${error}`);
        }
    }

}