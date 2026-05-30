import Accout from './Account.js';
import Role from './Role.js';

export default class Admin extends Accout {

    constructor(
        id: number,
        name: string,
        username: string,
        password: string,
        phone: string | null = null,
        email: string | null = null,
        role: Role | null = null
    ) {
        super(id, name, username, password, phone, email, role);
    }

    public createStaffAccount(name: string, position: string, startDate: Date): void { }

    public manageMenu(): void { }

    public viewReport(fromDate: Date, toDate: Date): void { }

}
