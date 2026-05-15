import Account from './Account.js';
import Role from './Role.js';

export default class Admin extends Account {

    constructor(
        id: number,
        name: string,
        password: string,
        phone: string | null = null,
        email: string = '',
        role: Role | null = null
    ) {
        super(id, name, password, phone, email, role);
    }

    public createStaffAccount(): Account {
        console.log("Tài khoản nhân viên đã được tạo bởi Admin.");
        return new Account(0, "New Staff", "", "", "", this.role);
    }

    public manageMenu(): void {
        console.log("Admin đang quản lý menu.");
    }

    public viewReport(): void {
        console.log("Admin đang xem báo cáo.");
    }

}
