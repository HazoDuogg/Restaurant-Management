import { Account } from './Account.js';
import { Role } from './Role.js';


export type Reservation = any;
export type Order = any;

export class Customer extends Account {
    private customerId: string;

    constructor(
        id: number,
        name: string,
        phone: string,
        email: string,
        username: string,
        password: string,
        role: Role,
        customerId: string
    ) {
        super(id, name, phone, email, username, password, role);
        this.customerId = customerId;
    }

    public registerAccount(): Account {
        console.log("Khách hàng đã đăng ký một tài khoản mới.");
        return this;
    }

    public makeReservation(): Reservation {
        console.log("Khách hàng đã đặt bàn.");
        return {};
    }

    public placeOrder(): Order {
        console.log("Khách hàng đã đặt món.");
        return {};
    }
}