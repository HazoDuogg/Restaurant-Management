import { Account } from './Account.js';
import { Role } from './Role.js';

export class Staff extends Account {
    protected staffId: string;
    protected position: string;
    protected startDate: Date;

    constructor(
        id: number,
        name: string,
        phone: string,
        email: string,
        username: string,
        password: string,
        role: Role,
        staffId: string,
        position: string,
        startDate: Date
    ) {
        super(id, name, phone, email, username, password, role);
        this.staffId = staffId;
        this.position = position;
        this.startDate = startDate;
    }
}