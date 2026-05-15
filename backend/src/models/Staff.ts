import Account from './Account.js';
import Role from './Role.js';

export default class Staff extends Account {
<<<<<<< HEAD
    protected staffId: string;
    protected position: string;
    protected startDate: Date;
=======

    private _staffId: string;
    private _position: string;
    private _startDate: Date | null;
>>>>>>> main

    constructor(
        id: number,
        name: string,
<<<<<<< HEAD
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
=======
        username: string,
        password: string,
        staffId: string,
        position: string,
        startDate: Date | null = null,
        phone: string | null = null,
        email: string | null = null,
        role: Role | null = null
    ) {
        super(id, name, username, password, phone, email, role);
        this._staffId = staffId;
        this._position = position;
        this._startDate = startDate;
    }

    public get staffId(): string {
        return this._staffId;
    }

    public set staffId(value: string) {
        this._staffId = value;
    }

    public get position(): string {
        return this._position;
    }

    public set position(value: string) {
        this._position = value;
    }

    public get startDate(): Date | null {
        return this._startDate;
    }

    public set startDate(value: Date | null) {
        this._startDate = value;
    }

}
>>>>>>> main
