import { Role } from '../models/Role.js';

export class Account {
    protected id: number;
    protected name: string;
    protected phone: string;
    protected email: string;
    protected username: string;
    protected password: string;
    protected role: Role | null;

    constructor(id: number, name: string, phone: string, email: string, username: string, password: string, role: Role) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public login(): boolean {
        console.log(`Account ${this.username} Đăng nhập.`);
        return true;
    }

    public logout(): void {
        console.log(`Account ${this.username} Đăng xuất.`);
    }

    public changePassword(): void {
        console.log("Thay đổi mật khẩu.");
    }

    public updateProfile(): void {
        console.log("cập nhật hồ sơ.");
    }
}
