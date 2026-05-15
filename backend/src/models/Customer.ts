import Account from './Account.js';
import Role from './Role.js';

export default class Customer extends Account {

    private _customerId: string;

    constructor(
        id: number,
        name: string,
        password: string,
        customerId: string,
        phone: string | null = null,
        email: string = '',
        role: Role | null = null
    ) {
        super(id, name, password, phone, email, role);
        this._customerId = customerId;
    }

    public get customerId(): string {
        return this._customerId;
    }

    public set customerId(value: string) {
        this._customerId = value;
    }

}
