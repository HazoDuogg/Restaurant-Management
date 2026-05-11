import Role from '../models/Role.js';

export default class Account {
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

    public getId() {
        return this.id;
    }
    public setId(id: number) {
        this.id = id;
    }

    public getName() {
        return this.name;
    }
    public setName(name: string) {
        this.name = name;
    }

    public getPhone() {
        return this.phone;
    }
    public setPhone(phone: string) {
        this.phone = phone;
    }

    public getEmail() {
        return this.email;
    }
    public setEmail(email: string) {
        this.email = email;
    }

    public getUsername() {
        return this.username;
    }
    public setUsername(username: string) {
        this.username = username;
    }

    public getPassword() {
        return this.password;
    }
    public setPassword(password: string) {
        this.password = password;
    }

    public getRole() {
        return this.role;
    }
    public setRole(role: Role) {
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
