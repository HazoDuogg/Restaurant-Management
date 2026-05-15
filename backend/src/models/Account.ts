import Role from '../models/Role.js';

export default class Account {
    private _id: number;
    private _name: string;
    private _password: string;
    private _phone: string | null;
    private _email: string;
    private _role: Role | null;

    constructor(
        id: number,
        name: string,
        password: string,
        phone: string | null = null,
        email: string = '',
        role: Role | null = null
    ) {
        this._id = id;
        this._name = name;
        this._password = password;
        this._phone = phone;
        this._email = email;
        this._role = role;
    }

    public get id(): number { return this._id; }
    public set id(value: number) { this._id = value; }

    public get name(): string { return this._name; }
    public set name(value: string) { this._name = value; }

    public get password(): string { return this._password; }
    public set password(value: string) { this._password = value; }

    public get phone(): string | null { return this._phone; }
    public set phone(value: string | null) { this._phone = value; }

    public get email(): string { return this._email; }
    public set email(value: string) { this._email = value; }

    public get role(): Role | null { return this._role; }
    public set role(value: Role | null) { this._role = value; }

    public login(): boolean {
        console.log(`Account ${this._name} Đăng nhập.`);
        return true;
    }

    public logout(): void {
        console.log(`Account ${this._name} Đăng xuất.`);
    }

    public changePassword(): void {
        console.log("Thay đổi mật khẩu.");
    }

    public updateProfile(): void {
        console.log("cập nhật hồ sơ.");
    }
}
