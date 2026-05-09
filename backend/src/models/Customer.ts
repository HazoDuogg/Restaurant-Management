import Person from './Person.js';
import Role from './Role.js';

export default class Customer extends Person {

    private _customerId: string;

    constructor(
        id: number,
        name: string,
        username: string,
        password: string,
        customerId: string,
        phone: string | null = null,
        email: string | null = null,
        role: Role | null = null
    ) {
        super(id, name, username, password, phone, email, role);
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

}
