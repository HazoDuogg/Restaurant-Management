import Accout from './Account.js';
import type { AccountStatus } from './enums.js';
import Role from './Role.js';

export default class Customer extends Accout {

    private _customerId: string;

    constructor(
        id: number,
        name: string,
        password: string,
        customerId: string,
        phone: string | null = null,
        email: string | null = null,
        accountStatus: AccountStatus,
        role: Role | null = null
    ) {
        super(id, name, password, phone, email, accountStatus, role);
        this._customerId = customerId;
    }

    public get customerId(): string {
        return this._customerId;
    }

    public set customerId(value: string) {
        this._customerId = value;
    }

    public registerAccount(): void { }

    public makeReservation(reservationTime: Date, numberOfPeople: number): void { }

    public placeOrder(tableId: number): void { }

    public override toJSON() {
        return {
            ...super.toJSON(),
            customerId: this._customerId,
        };
    }

}
