import Accout from './Account.js';
import type { AccountStatus } from './enums.js';
import Role from './Role.js';

export default class Admin extends Accout {

    constructor(
        id: number,
        name: string,
        password: string,
        phone: string | null = null,
        email: string | null = null,
        accountStatus: AccountStatus,
        role: Role | null = null
    ) {
        super(id, name, password, phone, email, accountStatus, role);
    }

    public createStaffAccount(name: string, position: string, startDate: Date): void { }

    public manageMenu(): void { }

    public viewReport(fromDate: Date, toDate: Date): void { }

}
