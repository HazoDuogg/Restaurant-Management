import type { AccountStatus } from './enums.js';
import Role from './Role.js';

export default abstract class Accout {

    protected _id: number;
    protected _name: string;
    protected _phone: string | null;
    protected _email: string | null;
    protected _password: string;
    protected _accountStatus: AccountStatus;
    protected _role: Role | null;

    constructor(
        id: number,
        name: string,
        password: string,
        phone: string | null = null,
        email: string | null = null,
        accountStatus: AccountStatus,
        role: Role | null = null
    ) {
        this._id = id;
        this._name = name;
        this._password = password;
        this._phone = phone;
        this._email = email;
        this._accountStatus = accountStatus;
        this._role = role;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }

    public get phone(): string | null {
        return this._phone;
    }

    public set phone(value: string | null) {
        this._phone = value;
    }

    public get email(): string | null {
        return this._email;
    }

    public set email(value: string | null) {
        this._email = value;
    }

    public get password(): string {
        return this._password;
    }

    public set password(value: string) {
        this._password = value;
    }

    public get accountStatus(): AccountStatus {
        return this._accountStatus;
    }

    public set accountStatus(value: AccountStatus) {
        this._accountStatus = value;
    }

    public get role(): Role | null {
        return this._role;
    }

    public set role(value: Role | null) {
        this._role = value;
    }

    public login(): boolean {
        return !!(this._email && this._password);
    }

    public logout(): void { }

    public changePassword(newPassword: string): void {
        this._password = newPassword;
    }

    public updateProfile(name: string, phone: string, email: string): void {
        this._name = name;
        this._phone = phone;
        this._email = email;
    }

    public toJSON() {
        return {
            id: this._id,
            name: this._name,
            phone: this._phone,
            email: this._email,
            status: this._accountStatus,
            role: this._role,
        };
    }

}