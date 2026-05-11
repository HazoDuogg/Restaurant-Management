import Account from './Account.js';
import Role from './Role.js';

export default class Staff extends Account {
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

    public getStaffId() {
        return this.staffId;
    }
    public setStaffId(staffId: string) {
        this.staffId = staffId;
    }

    public getPosition() {
        return this.position;
    }
    public setPosition(position: string) {
        this.position = position;
    }

    public getStartDate() {
        return this.startDate;
    }
    public setStartDate(startDate: Date) {
        this.startDate = startDate;
    }

}