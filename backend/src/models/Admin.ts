import Account from './Account.js';
import Role from './Role.js';

export class Admin extends Account {

    constructor(id: number, name: string, phone: string, email: string, username: string, password: string, role: Role
    ) {
        super(id, name, phone, email, username, password, role);
    }

    public createStaffAccount(): Account {
        console.log("Tài khoản nhân viên đã được tạo bởi Admin.");
        return new Account(0, "New Staff", "", "", "", "", this.role!);
    }

    public manageMenu(): void {
        console.log("Admin đang quản lý menu.");
    }

    public viewReport(): Report {
        console.log("Admin đang xem báo cáo.");
        return {};
    }

}